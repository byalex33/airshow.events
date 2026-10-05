import { get, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { events, appearances } from "./content";
import { programmeReview, validateProgrammes, type Programme } from "../scripts/programmes";
import { sourceUrls } from "../scripts/check-britishairshows";
import { extractEvents } from "../scripts/check-jsonld";
import { fillTypePhotos, findTypePhoto, type TypePhotoLookups } from "./aircraft-photo-lookup";
import { extractProgrammes, fetchSource, sitemapUrls, type SourcePage } from "./page-collector";

const options = { access: "private" as const, addRandomSuffix: false, contentType: "application/json" };
type EventDates = { startDate: string; endDate: string };
type SourceKind = "edition" | "recurring";
type Page = { sourceKind?: SourceKind; checkedAt: string; programmes: Programme[]; eventDates?: EventDates[]; hash?: string };
type Collection = { completedAt: string; succeeded: string[]; failed: { url: string; error: string }[]; remaining: number };
type State = { mappedAt?: string; urls: string[]; pages: Record<string, Page>; batch?: unknown; lastError?: string; lastCollection?: Collection; photos?: TypePhotoLookups };
export type Collector = {
  fetchSource: (url: string) => Promise<SourcePage>;
  extractProgrammes: (text: string, sourceUrl: string) => Promise<unknown>;
  discover: () => Promise<{ url: string }[]>;
  photoLookup: typeof findTypePhoto;
  maxPages: number;
  budgetMs: number;
};
// The cron has 300 seconds: up to 180 for pages, 60 for photo lookups, the rest for storage.
const defaultCollector: Collector = {
  fetchSource, extractProgrammes, discover: () => sitemapUrls("https://britishairshows.com/sitemap.xml"),
  photoLookup: findTypePhoto, maxPages: 40, budgetMs: 180000,
};
// Only reviewed, edition-specific official URLs may stop polling. Reused landing
// pages and newly discovered URLs remain recurring, even when their dates are past.
const editionSources = new Set([
  "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
  "https://www.shuttleworth.org/events/race-day-air-show-2026",
  "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
  "https://www.iwm.org.uk/sites/default/files/files/2025-12/Press%20release%20-%20IWM%202026%20Programme%20Launch.pdf",
  "https://www.south-ayrshire.gov.uk/council-news/International-Ayr-Show-Festival-of-Flight-2026-full-flying-display-schedule-announced",
  "https://www.south-ayrshire.gov.uk/council-news/Save-the-date-The-International-Ayr-Show-Festival-of-Flight-returns-in-2027",
]);
function sourceKind(url?: string): SourceKind {
  return url && editionSources.has(url) ? "edition" : "recurring";
}
export function pageDue(page: Page | undefined, now = new Date(), sourceUrl?: string) {
  if (!page) return true;
  const today = now.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  const knownEvents = sourceUrl ? events.filter(event =>
    event.officialUrl === sourceUrl || event.sourceUrl === sourceUrl ||
    appearances.some(appearance => appearance.sourceUrl === sourceUrl && appearance.event === event.slug)
  ) : [];
  const dates = [
    ...page.programmes.map(p => ({ startDate: p.eventStart, endDate: p.eventEnd })),
    ...(page.eventDates ?? []),
    ...knownEvents.map(event => ({ startDate: event.start, endDate: event.end })),
  ];
  const kind = sourceUrl ? sourceKind(sourceUrl) : page.sourceKind;
  if (kind === "edition" && dates.length > 0 && dates.every(event => event.endDate < today)) return false;
  const near = dates.some(event => event.endDate >= today && Date.parse(event.startDate) - Date.parse(today) <= 7 * 86400000);
  // Compare UTC calendar days so webhook latency cannot postpone the next 07:00 UTC run.
  const checkedDay = Math.floor(Date.parse(page.checkedAt) / 86400000);
  const currentDay = Math.floor(now.getTime() / 86400000);
  return currentDay - checkedDay >= (near ? 1 : 7);
}
export async function runHostedMonitor(storage = { get, put }, overrides: Partial<Collector> = {}) {
  const { get, put } = storage;
  const collector = { ...defaultCollector, ...overrides };
  // ponytail: one global lease serializes cron runs; a queue is needed if parallel ingestion becomes necessary.
  const lease = await get("monitor/lease.json", { access: "private", useCache: false });
  if (lease && (await new Response(lease.stream).json()).until > Date.now()) return { status: "busy" };
  let acquired;
  try {
    acquired = await put("monitor/lease.json", JSON.stringify({ until: Date.now() + 300000 }), { ...options, allowOverwrite: Boolean(lease), ...(lease ? { ifMatch: lease.blob.etag } : {}) });
  } catch (error) {
    if (error instanceof Error && /precondition|already exists/i.test(error.message)) return { status: "busy" };
    throw error;
  }
  let state: State | undefined;
  try {
    const stored = await get("monitor/state.json", { access: "private", useCache: false });
    state = stored ? await new Response(stored.stream).json() : { urls: [], pages: {} };
    if (!state) throw new Error("Missing monitor state");
    for (const [url, page] of Object.entries(state.pages)) page.sourceKind = sourceKind(url);
    // Pending Firecrawl batches from the previous collector can no longer be harvested.
    delete state.batch;
    if (!state.mappedAt || Date.now() - Date.parse(state.mappedAt) >= 7 * 86400000) {
      const links = await collector.discover();
      if (!links.length || links.length >= 5000) throw new Error("Incomplete discovery; previous URLs preserved");
      state.urls = [...new Set([...state.urls, ...sourceUrls(links), ...events.flatMap(e => [e.officialUrl, e.sourceUrl]), ...appearances.map(a => a.sourceUrl)])];
      state.mappedAt = new Date().toISOString();
    }
    const pages = state.pages;
    const due = [...new Set(state.urls)].filter(url => pageDue(pages[url], new Date(), url));
    if (!due.length) return { status: "up-to-date" };
    const started = Date.now();
    const succeeded: string[] = [];
    const failed: { url: string; error: string }[] = [];
    async function collect(url: string) {
      try {
        const source = await collector.fetchSource(url);
        if (source.text.trim().length < 100) throw new Error("Unusable source content");
        let eventCandidates: ReturnType<typeof extractEvents>;
        try { eventCandidates = source.html ? extractEvents(source.html) : []; } catch { eventCandidates = []; }
        const eventDates = eventCandidates.map(({ startDate, endDate }) => ({ startDate, endDate }));
        const checkedAt = new Date().toISOString();
        const hash = createHash("sha256").update(source.text).digest("hex");
        const previous = pages[url];
        if (previous?.hash === hash) {
          // Unchanged text keeps its programmes without another model call.
          pages[url] = { ...previous, sourceKind: sourceKind(url), checkedAt, eventDates };
        } else {
          const extract = async () => validateProgrammes(await collector.extractProgrammes(source.text, url), source.text);
          // Model output varies; one misquoted excerpt on a long page earns a single retry, never a looser check.
          const programmes = await extract().catch((error: unknown) => {
            if (error instanceof Error && /unsupported aircraft record/.test(error.message)) return extract();
            throw error;
          });
          const id = createHash("sha256").update(url).digest("hex").slice(0, 20);
          await put(`monitor/reviews/${id}-${Date.now()}.json`, JSON.stringify({ sourceUrl: url, checkedAt, requiresReview: true, before: previous?.programmes ?? null, after: programmeReview(programmes, url), eventCandidates, markdown: source.text }), options);
          pages[url] = { sourceKind: sourceKind(url), checkedAt, programmes, eventDates, hash };
        }
        succeeded.push(url);
      } catch (error) {
        const failure = { url, error: error instanceof Error ? error.message : "Invalid extraction" };
        failed.push(failure);
        try { await put(`monitor/failures/${Date.now()}-${createHash("sha256").update(url).digest("hex").slice(0, 12)}.json`, JSON.stringify(failure), options); }
        catch { /* The failure is still recorded in lastCollection. */ }
      }
    }
    // Three pages at a time; pages left over when the budget runs out stay due for the next run.
    const queue = due.slice(0, collector.maxPages);
    await Promise.all(Array.from({ length: 3 }, async () => {
      while (queue.length && Date.now() - started < collector.budgetMs) await collect(queue.shift()!);
    }));
    const collection: Collection = { completedAt: new Date().toISOString(), succeeded, failed, remaining: due.length - succeeded.length - failed.length };
    state.lastCollection = collection;
    if (failed.length) {
      state.lastError = `${failed.length} of ${succeeded.length + failed.length} source pages failed collection; previous snapshots preserved`;
      return { status: succeeded.length ? "partial" : "failed", collection };
    }
    delete state.lastError;
    return { status: "collected", collection };
  } catch (error) {
    if (state) state.lastError = error instanceof Error ? error.message : "Monitor failed";
    throw error;
  } finally {
    // Photos never block collection; failed lookups are retried on a later run.
    if (state) try { await fillTypePhotos(state, collector.photoLookup); } catch { /* Keep the collected state. */ }
    try { if (state) await put("monitor/state.json", JSON.stringify(state), { ...options, allowOverwrite: true }); }
    finally { await put("monitor/lease.json", JSON.stringify({ until: 0 }), { ...options, allowOverwrite: true, ifMatch: acquired.etag }); }
  }
}
