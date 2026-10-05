import { generateText, jsonSchema, Output } from "ai";
import { extractText, getDocumentProxy } from "unpdf";
import { programmeFormat } from "../scripts/programmes";

// Fetches source pages directly and extracts programmes through AI Gateway. Replaces Firecrawl.
const headers = { "User-Agent": "airshow.events monitor (+https://airshow.events/contact/)" };
const maxBytes = 10_000_000;
// About 25k tokens; enough for long programme pages while bounding model cost.
const maxText = 100_000;
export const extractionModel = process.env.MONITOR_MODEL || "google/gemini-2.5-flash";

export type SourcePage = { text: string; html: string };

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", hellip: "…", times: "×", pound: "£", middot: "·", eacute: "é" };
function decode(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] !== "#") return entities[entity.toLowerCase()] ?? match;
    const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

/** Readable page text: block elements become lines, list items keep a marker, scripts and styles are dropped. */
export function htmlToText(html: string) {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|iframe|head)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<(br|hr)\b[^>]*>/gi, "\n")
    .replace(/<\/?(p|div|section|article|header|footer|main|aside|nav|h[1-6]|ul|ol|li|table|tr|blockquote|figure|figcaption|dl|dt|dd)\b[^>]*>/gi, "\n")
    .replace(/<\/t[dh]\s*>/gi, " | ")
    .replace(/<[^>]+>/g, " ");
  return decode(text).split("\n").map((line) => line.replace(/[ \t ]+/g, " ").trim()).filter(Boolean).join("\n").slice(0, maxText);
}

export async function fetchSource(url: string): Promise<SourcePage> {
  const response = await fetch(url, { headers, redirect: "follow", signal: AbortSignal.timeout(20000), cache: "no-store" });
  if (!response.ok) throw new Error(`Source HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (Number(response.headers.get("content-length")) > maxBytes) throw new Error("Source too large");
  const body = new Uint8Array(await response.arrayBuffer());
  if (body.byteLength > maxBytes) throw new Error("Source too large");
  if (/pdf/i.test(type) || /\.pdf$/i.test(new URL(response.url || url).pathname)) {
    const { text } = await extractText(await getDocumentProxy(body), { mergePages: true });
    return { text: text.replace(/[ \t]+/g, " ").trim().slice(0, maxText), html: "" };
  }
  if (!/html|xml|text\/plain/i.test(type)) throw new Error(`Unsupported source type ${type || "unknown"}`);
  const html = new TextDecoder().decode(body);
  return { text: htmlToText(html), html };
}

/** Page URLs listed in a sitemap, following one level of sitemap indexes. */
export async function sitemapUrls(url: string): Promise<{ url: string }[]> {
  const read = async (address: string) => {
    const response = await fetch(address, { headers, signal: AbortSignal.timeout(20000), cache: "no-store" });
    if (!response.ok) throw new Error(`Sitemap HTTP ${response.status}`);
    const xml = await response.text();
    return { index: /<sitemapindex\b/i.test(xml), locs: [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => decode(match[1])) };
  };
  const root = await read(url);
  const locs = root.index ? (await Promise.all(root.locs.slice(0, 20).map(async (child) => (await read(child)).locs))).flat() : root.locs;
  return locs.map((loc) => ({ url: loc }));
}

/** Programme records for one page. Callers must still validate evidence against the same text. */
export async function extractProgrammes(text: string, sourceUrl: string): Promise<unknown> {
  const { output } = await generateText({
    model: extractionModel,
    system: programmeFormat.prompt,
    prompt: `Source URL: ${sourceUrl}\n\n<page>\n${text}\n</page>`,
    output: Output.object({ schema: jsonSchema(programmeFormat.schema) }),
    abortSignal: AbortSignal.timeout(120000),
  });
  return output;
}
