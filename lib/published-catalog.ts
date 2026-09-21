import { createHash } from "node:crypto";
import { aircraft as seedAircraft, appearances as seedAppearances, events, type Aircraft, type Appearance } from "./content";
import { parseProgrammes, type Programme } from "../scripts/programmes";

export type Catalog = { aircraft: Aircraft[]; appearances: Appearance[] };
export const seedCatalog: Catalog = { aircraft: seedAircraft, appearances: seedAppearances };
const nameKey = (name: string) => name.normalize("NFKD").replace(/\b20\d{2}\b/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
const aliases: Record<string, string> = { redarrows: "red-arrows", rafredarrows: "red-arrows", spitfire: "spitfire", supermarinespitfire: "spitfire", typhoon: "typhoon", raftyphoon: "typhoon", eurofightertyphoon: "typhoon" };

/** Read only validated monitor snapshots. Discovery pages never establish event identity. */
export function publishedCatalog(state: unknown): Catalog {
  if (!state || typeof state !== "object" || !("pages" in state) || !state.pages || typeof state.pages !== "object") return seedCatalog;
  const chosen = new Map<string, { programme: Programme; sourceUrl: string; checkedAt: string }>();
  for (const [sourceUrl, raw] of Object.entries(state.pages)) {
    if (!raw || typeof raw !== "object" || typeof raw.checkedAt !== "string" || !Number.isFinite(Date.parse(raw.checkedAt))) continue;
    let programmes: Programme[];
    try { programmes = parseProgrammes({ programmes: raw.programmes }); } catch { continue; }
    for (const programme of programmes) {
      const matches = events.filter(event =>
        event.start === programme.eventStart && event.end === programme.eventEnd &&
        nameKey(event.name) === nameKey(programme.eventName) &&
        [event.officialUrl, event.sourceUrl, ...seedAppearances.filter(a => a.event === event.slug).map(a => a.sourceUrl)].includes(sourceUrl),
      );
      if (matches.length !== 1 || (!programme.aircraft.length && programme.announcement !== "not-announced")) continue;
      const event = matches[0];
      const previous = chosen.get(event.slug);
      const seedCheckedAt = seedAppearances.filter(a => a.event === event.slug).map(a => a.checkedAt).sort().at(-1);
      if (seedCheckedAt && Date.parse(raw.checkedAt) < Date.parse(seedCheckedAt)) continue;
      if (!previous || Date.parse(raw.checkedAt) > Date.parse(previous.checkedAt)) chosen.set(event.slug, { programme, sourceUrl, checkedAt: raw.checkedAt });
    }
  }
  const aircraft = new Map(seedAircraft.map(plane => [plane.slug, plane]));
  const appearances = seedAppearances.filter(a => !chosen.has(a.event));
  for (const [event, { programme, sourceUrl, checkedAt }] of chosen) {
    const records = new Map<string, Appearance>();
    for (const plane of programme.aircraft) {
      const candidate = seedAircraft.find(p => p.slug === aliases[nameKey(plane.name)] || nameKey(p.name) === nameKey(plane.name));
      const operator = nameKey(plane.operator ?? "");
      const sameOperator = !operator || candidate?.operator.startsWith("Various operators") || nameKey(candidate?.operator ?? "") === operator || (operator === "raf" && candidate?.operator === "Royal Air Force");
      const known = !plane.variant && sameOperator ? candidate?.slug : undefined;
      const identity = [nameKey(plane.name), nameKey(plane.variant ?? ""), nameKey(plane.operator ?? "")].join("|");
      const slug = known ?? `aircraft-${createHash("sha256").update(identity).digest("hex").slice(0, 16)}`;
      if (!aircraft.has(slug)) aircraft.set(slug, {
        slug, name: [plane.name, plane.variant].filter(Boolean).join(" · "), category: "Other aircraft", kind: "aircraft",
        image: "/images/aircraft-placeholder.svg", imageAlt: "Aircraft silhouette placeholder",
        description: "Listed in a published organiser programme. See the appearance records below for dates, participation status and sources.",
        operator: plane.operator || "Operator not published",
      });
      const details = [plane.variant, plane.operator, plane.displayType === "unknown" ? "Display type not published" : `${plane.displayType === "static" ? "Static" : "Flying"} display`, plane.displayDates.length ? `Display dates: ${plane.displayDates.join(", ")}` : "Display dates not published", plane.evidence].filter(Boolean).join(". ");
      const existing = records.get(slug);
      // Conflicting statements for one profile must not promote participation to confirmed.
      const status = existing && existing.status !== plane.status ? "unknown" : plane.status;
      records.set(slug, { event, aircraft: slug, status, checkedAt: checkedAt.slice(0, 10), sourceUrl, details: existing ? `${existing.details}\n${details}` : details });
    }
    appearances.push(...records.values());
  }
  return { aircraft: [...aircraft.values()], appearances };
}
