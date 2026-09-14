import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourceUrl = "https://britishairshows.com/duxford-flying-finale-airshow";
type Candidate = { name: string; startDate: string; endDate: string; location: string; address: string; dateModified: string | null };
const text = (value: unknown): string => typeof value === "string" ? value.trim() : "";
function date(value: unknown) {
  const valueText = text(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(valueText) && Number.isFinite(Date.parse(valueText)) && new Date(valueText).toISOString().slice(0, 10) === valueText ? valueText : "";
}

export function extractEvents(html: string): Candidate[] {
  const candidates: Candidate[] = [];
  function visit(value: unknown) {
    if (Array.isArray(value)) { value.forEach(visit); return; }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    const types = Array.isArray(record["@type"]) ? record["@type"] : [record["@type"]];
    if (types.some((type) => ["Event", "https://schema.org/Event", "http://schema.org/Event"].includes(String(type)))) {
      const name = text(record.name);
      const startDate = date(record.startDate);
      const endDate = date(record.endDate ?? record.startDate);
      const location = record.location as Record<string, unknown> | undefined;
      const address = location?.address;
      const addressText = typeof address === "object" && address ? ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"].map((key) => text((address as Record<string, unknown>)[key])).filter(Boolean).join(", ") : text(address);
      if (!name || !startDate || !endDate || endDate < startDate || !text(location?.name)) throw new Error("Invalid event JSON-LD; previous data preserved");
      candidates.push({ name, startDate, endDate, location: text(location?.name), address: addressText, dateModified: text(record.dateModified) || null });
    }
    if (record["@graph"]) visit(record["@graph"]);
  }
  // ponytail: script-block extraction for the allowlisted page; use an HTML parser if its markup outgrows this pattern.
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
    visit(JSON.parse(match[2]));
  }
  if (!candidates.length) throw new Error("No event JSON-LD found; previous data preserved");
  return candidates;
}

export async function checkJsonLd() {
  const directory = resolve(".airshow-monitor");
  await mkdir(directory, { recursive: true });
  const statePath = resolve(directory, "britishairshows-duxford.json");
  let previous: { checkedAt: string; candidates: Candidate[] } | undefined;
  try { previous = JSON.parse(await readFile(statePath, "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  const imminent = previous?.candidates.some((event) => event.endDate >= today && Date.parse(event.startDate) - Date.parse(today) <= 7 * 86400000);
  if (previous && Date.now() - Date.parse(previous.checkedAt) < (imminent ? 1 : 7) * 86400000) return { sourceUrl, status: "not-due" };
  const response = await fetch(sourceUrl, { headers: { "User-Agent": "AirshowEvents/1.0 (+https://airshow.events/contact/)" }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`British Airshows HTTP ${response.status}`);
  const candidates = extractEvents(await response.text());
  const checkedAt = new Date().toISOString();
  const status = !previous ? "baseline" : JSON.stringify(previous.candidates) === JSON.stringify(candidates) ? "unchanged" : "changed";
  if (status !== "unchanged") await writeFile(resolve(directory, `britishairshows-duxford-${Date.now()}.json`), JSON.stringify({ sourceUrl, checkedAt, status, requiresOfficialVerification: true, before: previous?.candidates ?? null, after: candidates }, null, 2));
  await writeFile(statePath, JSON.stringify({ sourceUrl, checkedAt, candidates }, null, 2));
  return { sourceUrl, status, candidates };
}
