import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { events, appearances, type Airshow } from "../lib/content";
import { checkJsonLd } from "./check-jsonld";
import { checkBritishAirshows } from "./check-britishairshows";
import { programmeReview, validateProgrammes } from "./programmes";
import { extractProgrammes, fetchSource } from "../lib/page-collector";

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
      const { text: markdown } = await fetchSource(url);
      if (markdown.trim().length < 100) throw new Error("No usable page content returned");
      const checkedAt = new Date().toISOString();
      const programmes = programmeReview(validateProgrammes(await extractProgrammes(markdown, url), markdown), url);
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
