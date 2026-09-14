import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { extractEvents } from "./check-jsonld";
import { programmeFormat, programmeReview, validateProgrammes } from "./programmes";

const directory = resolve(".airshow-monitor");
async function readState(path: string) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
}
async function firecrawl(endpoint: string, body: object) {
  const response = await fetch(`https://api.firecrawl.dev/v2/${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body), signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Firecrawl HTTP ${response.status}`);
  const result = await response.json();
  if (!result.success) throw new Error("Firecrawl returned an unsuccessful result");
  return result;
}
export function sourceUrls(links: { url: string }[]) {
  return [...new Set(links.flatMap(({ url }) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" || !["britishairshows.com", "www.britishairshows.com"].includes(parsed.hostname) || /\.(jpg|png|gif|webp|pdf|svg|xml)$/i.test(parsed.pathname)) return [];
      parsed.hash = ""; parsed.search = "";
      parsed.hostname = "britishairshows.com";
      return [parsed.href];
    } catch { return []; }
  }))].sort();
}
export async function checkBritishAirshows() {
  await mkdir(directory, { recursive: true });
  const mapPath = resolve(directory, "britishairshows-map.json");
  let map = await readState(mapPath);
  if (!map || Date.now() - Date.parse(map.checkedAt) >= 7 * 86400000) {
    const result = await firecrawl("map", { url: "https://britishairshows.com", sitemap: "include", includeSubdomains: false, ignoreQueryParameters: true, limit: 5000 });
    if (!Array.isArray(result.links) || !result.links.length || result.links.length >= 5000) throw new Error("Site discovery incomplete; previous map preserved");
    map = { checkedAt: new Date().toISOString(), urls: sourceUrls(result.links) };
    await writeFile(mapPath, JSON.stringify(map, null, 2));
  }
  const reports = [];
  for (const url of map.urls as string[]) {
    const id = `britishairshows-${createHash("sha256").update(url).digest("hex").slice(0, 20)}`;
    const statePath = resolve(directory, `${id}.json`);
    const previous = await readState(statePath);
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
    const dates = [...(previous?.candidates ?? []), ...(previous?.programmes ?? []).map((p: { eventStart: string; eventEnd: string }) => ({ startDate: p.eventStart, endDate: p.eventEnd }))];
    const near = dates.some((event: { startDate: string; endDate: string }) => event.endDate >= today && Date.parse(event.startDate) - Date.parse(today) <= 7 * 86400000);
    if (previous?.programmes && Date.now() - Date.parse(previous.checkedAt) < (near ? 1 : 7) * 86400000) continue;
    try {
      const { data } = await firecrawl("scrape", { url, formats: ["rawHtml", "markdown", programmeFormat], onlyMainContent: false, maxAge: 0, timeout: 45000 });
      if (typeof data?.rawHtml !== "string" || !data.markdown || data.metadata?.statusCode >= 400) throw new Error("Unusable source response");
      let candidates;
      try { candidates = extractEvents(data.rawHtml); }
      catch { candidates = null; } // Pages without usable Event JSON-LD remain in the manual review queue.
      const programmes = programmeReview(validateProgrammes(data.json, data.markdown), url);
      const snapshot = { url, checkedAt: new Date().toISOString(), candidates, programmes, markdown: data.markdown };
      const changed = !previous || JSON.stringify(previous.programmes) !== JSON.stringify(programmes) || JSON.stringify(previous.candidates) !== JSON.stringify(candidates) || previous.markdown !== snapshot.markdown;
      if (changed) await writeFile(resolve(directory, `${id}-${Date.now()}.json`), JSON.stringify({ sourceUrl: url, requiresOfficialVerification: true, before: previous ?? null, after: snapshot }, null, 2));
      await writeFile(statePath, JSON.stringify(snapshot, null, 2));
      reports.push({ url, status: changed ? "review" : "unchanged", structuredEvents: candidates?.length ?? 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown failure";
      reports.push({ url, status: "failed", error: message });
      process.exitCode = 1;
      if (/HTTP (401|402|403|429)/.test(message)) break;
    }
    if (process.argv.includes("--sample")) break;
  }
  await writeFile(resolve(directory, `britishairshows-run-${Date.now()}.json`), JSON.stringify(reports, null, 2));
  return { discoveredPages: map.urls.length, results: reports };
}
