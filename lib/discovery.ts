import { events, type Airshow } from "./content";

export interface AirshowCollection {
  slug: string;
  title: string;
  description: string;
  advice: string;
  events: Airshow[];
}

const byDate = (a: Airshow, b: Airshow) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name);
export const seasonYears = [...new Set(events.map((event) => event.start.slice(0, 4)))].sort();
export const seasonLabel = seasonYears.join(" & ");

const regions = [
  { slug: "east-of-england", region: "East of England", advice: "Compare the separate Old Warden and Duxford event editions before booking. A ticket or programme for one date does not apply to the rest of the season." },
  { slug: "south-west", region: "South West", advice: "This region includes airfield and coastal events. Check whether your chosen show needs an entry ticket and whether parking or a reserved viewing area costs extra." },
  { slug: "midlands", region: "Midlands", advice: "Airfield and estate events can have different arrival arrangements. Use the organiser's event-specific directions and check which days your ticket covers." },
  { slug: "north-west", region: "North West", advice: "For coastal displays, check the official viewing area and transport arrangements. The flying timetable and any beach or seafront access rules can change between editions." },
  { slug: "scotland", region: "Scotland", advice: "Check the dates carefully when planning an overnight trip. An evening display and the main daytime programme may take place on different days." },
];

export function airshowCollections(): AirshowCollection[] {
  return [
    ...seasonYears.map((year) => ({
      slug: year,
      title: `UK airshows ${year}`,
      description: `Browse sourced ${year} UK airshow dates, locations and entry information. Compare airfield and seaside events and follow links to official organisers.`,
      advice: "Dates cover the event as a whole. Individual aircraft may appear on only one day, and the flying timetable can change. Past editions remain available as a record; check the year before making travel plans.",
      events: events.filter((event) => event.start.startsWith(`${year}-`)).sort(byDate),
    })),
    {
      slug: "free",
      title: "Free UK airshows",
      description: "Find UK airshows with free general entry, including seaside flying displays. Compare dates, locations and official visitor information before travelling.",
      advice: "Free entry refers to general admission. Parking, public transport, grandstands and hospitality may cost extra. Check the organiser's visitor information for the viewing area and any booking requirements.",
      events: events.filter((event) => event.admission === "Free").sort(byDate),
    },
    ...regions.map(({ slug, region, advice }) => ({
      slug,
      title: `Airshows in ${region === "Scotland" ? "Scotland" : `the ${region}`}`,
      description: `Find airshows in ${region === "Scotland" ? "Scotland" : `the ${region}`}, with sourced dates, locations, entry information and links to official event programmes.`,
      advice,
      events: events.filter((event) => event.region === region).sort(byDate),
    })),
  ].filter((collection) => collection.events.length > 0);
}

export function collectionsForEvent(event: Airshow) {
  return airshowCollections().filter((collection) => collection.events.some((item) => item.slug === event.slug));
}
