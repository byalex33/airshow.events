import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { events, appearances, type Airshow } from "../lib/content";
import { checkJsonLd } from "./check-jsonld";
import { checkBritishAirshows } from "./check-britishairshows";
import { programmeFormat, programmeReview, validateProgrammes } from "./programmes";

const directory = resolve(".airshow-monitor");
export function isDue(event: Pick<Airshow, "start" | "end">, checked: string | undefined, now = new Date()) {
  const today = now.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  if (event.end < today) return false;
  if (!checked) return true;
  const daysAway = (Date.parse(event.start) - Date.parse(today)) / 86400000;
  return now.getTime() - Date.parse(checked) >= (daysAway <= 7 ? 1 : 7) * 86400000;
}

async function main() {
  if (process.argv.includes("--jsonld-only")) { console.log(JSON.stringify(await checkJsonLd(), null, 2)); return; }
  process.loadEnvFile?.(".env.local");
  if (!process.env.FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is required");
  console.log(JSON.stringify(await checkBritishAirshows(), null, 2));
  if (process.exitCode) return;
  await mkdir(directory, { recursive: true });
  const urls = new Map<string, Airshow[]>();
  for (const event of events) {
    for (const url of new Set([event.sourceUrl, event.officialUrl, ...appearances.filter((a) => a.event === event.slug).map((a) => a.sourceUrl)])) {
      const normalized = new URL(url);
      normalized.hash = "";
      const key = normalized.href;
      urls.set(key, [...(urls.get(key) ?? []), event]);
    }
  }
  const report: object[] = [];
  const limit = process.argv.includes("--sample") ? 1 : Infinity;
  let attempted = 0;
  for (const [url, linkedEvents] of urls) {
    const id = createHash("sha256").update(url).digest("hex").slice(0, 20);
    const statePath = resolve(directory, `${id}.json`);
    let previous: { checkedAt: string; markdown: string; programmes?: ReturnType<typeof programmeReview> } | undefined;
    try { previous = JSON.parse(await readFile(statePath, "utf8")); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    if (previous?.programmes && !linkedEvents.some((event) => isDue(event, previous?.checkedAt))) continue;
    if (attempted++ >= limit) break;
    try {
      const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, formats: ["markdown", programmeFormat], onlyMainContent: true, maxAge: 0, timeout: 45000 }),
        signal: AbortSignal.timeout(60000),
      });
      if ([401, 402, 403, 429].includes(response.status)) {
        report.push({ url, status: "blocked", error: `Firecrawl HTTP ${response.status}; stopped remaining requests` });
        process.exitCode = 1;
        break;
      }
      if (!response.ok) throw new Error(`Firecrawl HTTP ${response.status}`);
      const result = await response.json();
      const markdown = result.data?.markdown;
      if (!result.success || typeof markdown !== "string" || markdown.trim().length < 100 || result.data?.metadata?.statusCode >= 400) {
        throw new Error("No usable page content returned");
      }
      const checkedAt = new Date().toISOString();
      const programmes = programmeReview(validateProgrammes(result.data.json, markdown), url);
      const changed = previous?.markdown !== markdown || JSON.stringify(previous?.programmes) !== JSON.stringify(programmes);
      if (changed) {
        // Keep each changed snapshot for review; source text is untrusted data.
        await writeFile(resolve(directory, `${id}-${Date.now()}.json`), JSON.stringify({ url, checkedAt, events: linkedEvents.map((e) => e.slug), before: previous ?? null, after: { markdown, programmes }, requiresReview: true }, null, 2));
      }
      await writeFile(statePath, JSON.stringify({ url, checkedAt, markdown, programmes }, null, 2));
      report.push({ url, status: previous ? changed ? "changed" : "unchanged" : "baseline", checkedAt });
    } catch (error) {
      report.push({ url, status: "failed", error: error instanceof Error ? error.message : "Unknown error" });
      process.exitCode = 1;
    }
  }
  const reportPath = resolve(directory, `run-${Date.now()}.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ reportPath, results: report }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
