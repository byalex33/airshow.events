import { get, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { events, appearances } from "./content";
import { programmeFormat, programmeReview, validateProgrammes, type Programme } from "../scripts/programmes";
import { sourceUrls } from "../scripts/check-britishairshows";
import { extractEvents } from "../scripts/check-jsonld";

const options = { access: "private" as const, addRandomSuffix: false, contentType: "application/json" };
type EventDates = { startDate: string; endDate: string };
type SourceKind = "edition" | "recurring";
type Page = { sourceKind?: SourceKind; checkedAt: string; programmes: Programme[]; eventDates?: EventDates[]; hash?: string };
type Collection = { batchId: string; completedAt: string; succeeded: string[]; failed: { url: string; error: string }[] };
type State = { mappedAt?: string; urls: string[]; pages: Record<string, Page>; batch?: { id: string; urls: string[]; startedAt: string }; lastError?: string; lastCollection?: Collection };
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
class FirecrawlHttpError extends Error {
  constructor(readonly status: number) {
    super(`Firecrawl HTTP ${status}`);
  }
}
async function api(path: string, body?: object) {
  const response = await fetch(`https://api.firecrawl.dev/v2/${path}`, {
    method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(45000), cache: "no-store",
  });
  if (!response.ok) throw new FirecrawlHttpError(response.status);
  const result = await response.json();
  if (result.success === false) throw new Error("Firecrawl request unsuccessful");
  return result;
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
export async function runHostedMonitor(harvestOnly = false, storage = { get, put }) {
  const { get, put } = storage;
  // ponytail: one global lease serializes cron/webhook runs; a queue is needed if parallel ingestion becomes necessary.
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
    if (state.batch) {
      const pending = state.batch;
      const currentState = state;
      async function readBatch(path: string) {
        try {
          return await api(path);
        } catch (error) {
          // Missing or expired results cannot recover on a later poll. Archive before clearing.
          if (error instanceof FirecrawlHttpError && [404, 410].includes(error.status)) {
            await put(`monitor/failures/${Date.now()}.json`, JSON.stringify({ batch: pending, status: error.status, error: error.message }), options);
            currentState.urls = [...new Set([...currentState.urls, ...pending.urls])];
            delete currentState.batch;
          }
          throw error;
        }
      }
      const batch = await readBatch(`batch/scrape/${encodeURIComponent(pending.id)}`);
      if (batch.status === "scraping") return { status: "scraping" };
      if (batch.status !== "completed") {
        const failed = state.batch;
        await put(`monitor/failures/${Date.now()}.json`, JSON.stringify({ batch: failed, status: batch.status }), options);
        delete state.batch;
        throw new Error("Firecrawl batch failed; previous programmes preserved");
      }
      const requested = new Set(pending.urls);
      const succeeded = new Set<string>();
      const failures = new Map<string, string>();
      let page = batch;
      let pageCount = 0;
      do {
        for (const data of page.data ?? []) {
          const url = data?.metadata?.sourceURL;
          if (!requested.has(url) || succeeded.has(url)) continue;
          try {
            if (typeof data.markdown !== "string" || data.metadata?.statusCode >= 400) throw new Error("Unusable source content");
            const programmes = validateProgrammes(data.json, data.markdown);
            const checkedAt = new Date().toISOString();
            const id = createHash("sha256").update(url).digest("hex").slice(0, 20);
            const hash = createHash("sha256").update(JSON.stringify([programmes, data.markdown, data.images, data.rawHtml])).digest("hex");
            let eventCandidates: ReturnType<typeof extractEvents>;
            try { eventCandidates = extractEvents(data.rawHtml ?? ""); } catch { eventCandidates = []; }
            const eventDates = eventCandidates.map(({ startDate, endDate }) => ({ startDate, endDate }));
            if (state.pages[url]?.hash !== hash) {
              const imageCandidates = (Array.isArray(data.images) ? data.images : []).filter((value: unknown) => typeof value === "string" && /^https:\/\//.test(value)).slice(0, 100);
              await put(`monitor/reviews/${id}-${Date.now()}.json`, JSON.stringify({ sourceUrl: url, checkedAt, requiresReview: true, before: state.pages[url]?.programmes ?? null, after: programmeReview(programmes, url), eventCandidates, imageCandidates, markdown: data.markdown }), options);
            }
            state.pages[url] = { sourceKind: sourceKind(url), checkedAt, programmes, eventDates, hash };
            succeeded.add(url);
            failures.delete(url);
          } catch (error) {
            failures.set(url, error instanceof Error ? error.message : "Invalid extraction");
          }
        }
        if (!page.next) break;
        const next = new URL(page.next);
        if (next.origin !== "https://api.firecrawl.dev" || next.pathname !== `/v2/batch/scrape/${state.batch.id}` || ++pageCount > 50) throw new Error("Unexpected batch pagination");
        page = await readBatch(next.pathname.slice(4) + next.search);
      } while (true);
      for (const url of requested) {
        if (!succeeded.has(url) && !failures.has(url)) failures.set(url, "Requested URL missing from completed batch");
      }
      const collection: Collection = {
        batchId: pending.id, completedAt: new Date().toISOString(), succeeded: [...succeeded],
        failed: [...failures].map(([url, error]) => ({ url, error })),
      };
      for (const failure of collection.failed) {
        await put(`monitor/failures/${Date.now()}-${createHash("sha256").update(failure.url).digest("hex").slice(0, 12)}.json`, JSON.stringify({ batchId: pending.id, ...failure }), options);
      }
      await put(`monitor/batches/${pending.id}.json`, JSON.stringify({ ...pending, ...collection, total: batch.total, completed: batch.completed }), { ...options, allowOverwrite: true });
      state.lastCollection = collection;
      delete state.batch;
      if (collection.failed.length) {
        state.lastError = `${collection.failed.length} of ${requested.size} requested URLs failed collection; previous snapshots preserved`;
        return { status: succeeded.size ? "partial" : "failed", collection };
      }
      delete state.lastError;
      if (harvestOnly) return { status: "collected", collection };
    }
    if (harvestOnly) return { status: "collected" };
    if (!state.mappedAt || Date.now() - Date.parse(state.mappedAt) >= 7 * 86400000) {
      const mapped = await api("map", { url: "https://britishairshows.com", sitemap: "include", includeSubdomains: false, ignoreQueryParameters: true, limit: 5000 });
      if (!Array.isArray(mapped.links) || !mapped.links.length || mapped.links.length >= 5000) throw new Error("Incomplete discovery; previous URLs preserved");
      state.urls = [...new Set([...state.urls, ...sourceUrls(mapped.links), ...events.flatMap(e => [e.officialUrl, e.sourceUrl]), ...appearances.map(a => a.sourceUrl)])];
      state.mappedAt = new Date().toISOString();
    }
    const pages = state.pages;
    const due = state.urls.filter(url => pageDue(pages[url], new Date(), url));
    if (!due.length) return { status: "up-to-date" };
    const submitted = await api("batch/scrape", {
      urls: due, formats: ["markdown", "rawHtml", "images", programmeFormat], onlyMainContent: false, maxAge: 0, maxConcurrency: 3,
      webhook: { url: "https://airshow.events/api/cron/airshows/", headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }, events: ["completed"] },
    });
    if (typeof submitted.id !== "string") throw new Error("Missing batch identifier");
    state.batch = { id: submitted.id, urls: due, startedAt: new Date().toISOString() };
    return { status: "submitted", pages: due.length };
  } catch (error) {
    if (state) state.lastError = error instanceof Error ? error.message : "Monitor failed";
    throw error;
  } finally {
    try { if (state) await put("monitor/state.json", JSON.stringify(state), { ...options, allowOverwrite: true }); }
    finally { await put("monitor/lease.json", JSON.stringify({ until: 0 }), { ...options, allowOverwrite: true, ifMatch: acquired.etag }); }
  }
}

