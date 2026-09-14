export type EventStatus =
  "confirmed" | "provisional" | "cancelled" | "completed";
export type AircraftCategory =
  "Warbirds" | "Fast jets" | "Display teams" | "Historic bombers";
export interface Aircraft {
  slug: string;
  name: string;
  category: AircraftCategory;
  image: string;
  imageAlt: string;
  description: string;
  operator: string;
  kind: "aircraft" | "team";
}
export interface Airshow {
  slug: string;
  name: string;
  subtitle: string;
  start: string;
  end: string;
  location: string;
  region: string;
  coordinates: [number, number];
  venue: "Airfield" | "Seafront" | "Estate";
  admission: "Free" | "Ticketed";
  status: EventStatus;
  image: string;
  imageAlt: string;
  description: string;
  travel: string;
  postcode: string;
  officialUrl: string;
  ticketUrl?: string;
}
export interface Appearance {
  event: string;
  aircraft: string;
  status: "confirmed" | "provisional";
  announced: string;
}
export const aircraft: Aircraft[] = [
  {
    slug: "red-arrows",
    name: "RAF Red Arrows",
    category: "Display teams",
    image: "/images/red-arrows.jpg",
    imageAlt: "Red Arrows flying in formation with white smoke",
    description:
      "Precision, colour and extraordinary teamwork. Follow the RAF aerobatic team through the season, from coastal displays to airfield weekends.",
    operator: "Royal Air Force",
    kind: "team",
  },
  {
    slug: "spitfire",
    name: "Supermarine Spitfire",
    category: "Warbirds",
    image: "/images/spitfire.jpg",
    imageAlt: "Spitfire MH434 in flight",
    description:
      "An unmistakable silhouette and the sound of a Merlin engine. Discover where to see this much-loved British warbird in the air.",
    operator: "Independent historic aircraft operators",
    kind: "aircraft",
  },
  {
    slug: "typhoon",
    name: "RAF Typhoon",
    category: "Fast jets",
    image: "/images/typhoon.jpg",
    imageAlt: "RAF Typhoon in flight",
    description:
      "A modern fast-jet display built around power and agility. Find the demonstration appearances in our example season.",
    operator: "Royal Air Force",
    kind: "aircraft",
  },
];
export const events: Airshow[] = [
  {
    slug: "duxford-battle-of-britain",
    name: "Duxford Battle of Britain Air Show",
    subtitle: "History takes flight.",
    start: "2026-09-19",
    end: "2026-09-20",
    location: "Duxford, Cambridgeshire",
    region: "East of England",
    coordinates: [52.09, 0.13],
    venue: "Airfield",
    admission: "Ticketed",
    status: "confirmed",
    image: "/images/spitfire.jpg",
    imageAlt: "Historic Spitfire flying against a blue sky",
    description:
      "A weekend for the sound of Merlin engines, historic aircraft and the stories behind them. Explore a working airfield before finding your spot for an afternoon of flying.",
    travel:
      "Plan your route to Duxford via junction 10 of the M11. Check the organiser for parking reservations, accessible arrival information and any shuttle services before travelling.",
    postcode: "CB22 4QR",
    officialUrl: "https://www.iwm.org.uk/visits/iwm-duxford",
    ticketUrl: "https://www.iwm.org.uk/visits/iwm-duxford",
  },
  {
    slug: "southport-airshow",
    name: "Southport Air Show",
    subtitle: "Big skies. Seaside atmosphere.",
    start: "2026-09-26",
    end: "2026-09-27",
    location: "Southport, Merseyside",
    region: "North West",
    coordinates: [53.65, -3.01],
    venue: "Seafront",
    admission: "Ticketed",
    status: "confirmed",
    image: "/images/red-arrows.jpg",
    imageAlt: "Red Arrows formation trailing smoke",
    description:
      "Make a weekend of the coast, with flying displays above the shoreline and plenty of room to look up. This illustrative listing brings the aircraft and practical details into one place.",
    travel:
      "Southport station is a walk from the seafront. Check local rail services, road closures and the organiser’s parking advice before setting out.",
    postcode: "PR8 1RX",
    officialUrl: "https://www.visitsouthport.com/",
  },
  {
    slug: "shuttleworth-season-finale",
    name: "Shuttleworth Season Finale",
    subtitle: "One last flight of the season.",
    start: "2026-10-04",
    end: "2026-10-04",
    location: "Old Warden, Bedfordshire",
    region: "East of England",
    coordinates: [52.09, -0.32],
    venue: "Airfield",
    admission: "Ticketed",
    status: "confirmed",
    image: "/images/spitfire.jpg",
    imageAlt: "A vintage Spitfire in flight",
    description:
      "Close the season with historic aviation in an intimate grass-airfield setting. A relaxed day for enthusiasts and first-time visitors alike.",
    travel:
      "Old Warden is reached via local roads from the A1. Allow extra time for arrival and consult the venue for accessible parking and public transport options.",
    postcode: "SG18 9EP",
    officialUrl: "https://www.shuttleworth.org/",
    ticketUrl: "https://www.shuttleworth.org/",
  },
  {
    slug: "autumn-jet-weekend",
    name: "Autumn Jet Weekend",
    subtitle: "Feel the afterburner.",
    start: "2026-10-17",
    end: "2026-10-18",
    location: "Fairford, Gloucestershire",
    region: "South West",
    coordinates: [51.68, -1.79],
    venue: "Airfield",
    admission: "Ticketed",
    status: "provisional",
    image: "/images/typhoon.jpg",
    imageAlt: "Typhoon displaying in the sky",
    description:
      "An invented demonstration event for modern military aviation. Dates and participation are provisional in this example.",
    travel:
      "Travel arrangements have not been announced. Do not book transport based on this example listing.",
    postcode: "GL7 4DL",
    officialUrl: "https://www.airtattoo.com/",
  },
  {
    slug: "coastal-flight-festival",
    name: "Coastal Flight Festival",
    subtitle: "A day beside the sea.",
    start: "2026-10-24",
    end: "2026-10-24",
    location: "Bournemouth, Dorset",
    region: "South West",
    coordinates: [50.72, -1.87],
    venue: "Seafront",
    admission: "Free",
    status: "provisional",
    image: "/images/red-arrows.jpg",
    imageAlt: "Aerobatic jets with sweeping smoke trails",
    description:
      "An invented free coastal display used to demonstrate the calendar. Enjoy the example itinerary and save it to test your shortlist.",
    travel:
      "Check local bus and rail services to Bournemouth. This is a demonstration listing, so no event travel arrangements are in place.",
    postcode: "BH2 5AA",
    officialUrl: "https://www.bournemouth.co.uk/",
  },
  {
    slug: "highland-wings",
    name: "Highland Wings",
    subtitle: "A northern perspective.",
    start: "2026-11-07",
    end: "2026-11-07",
    location: "Inverness, Highlands",
    region: "Scotland",
    coordinates: [57.54, -4.05],
    venue: "Estate",
    admission: "Free",
    status: "provisional",
    image: "/images/spitfire.jpg",
    imageAlt: "Spitfire against open sky",
    description:
      "An invented Highland aviation gathering, included to demonstrate regional discovery and map browsing.",
    travel:
      "Venue and travel details are awaiting confirmation in this example. No journeys should be booked.",
    postcode: "IV2 7JB",
    officialUrl: "https://www.visitscotland.com/",
  },
  {
    slug: "welsh-wings",
    name: "Welsh Wings Weekend",
    subtitle: "Back another season.",
    start: "2026-09-26",
    end: "2026-09-27",
    location: "Swansea, South Wales",
    region: "Wales",
    coordinates: [51.61, -3.96],
    venue: "Seafront",
    admission: "Free",
    status: "cancelled",
    image: "/images/typhoon.jpg",
    imageAlt: "RAF Typhoon flying display",
    description:
      "This invented event demonstrates how cancellation is displayed. It is excluded from upcoming recommendations and calendar exports.",
    travel: "This example event is cancelled. No event travel is available.",
    postcode: "SA1 3SN",
    officialUrl: "https://www.visitswanseabay.com/",
  },
  {
    slug: "summer-skies",
    name: "Summer Skies at the Estate",
    subtitle: "A season to remember.",
    start: "2026-08-22",
    end: "2026-08-23",
    location: "Alcester, Warwickshire",
    region: "Midlands",
    coordinates: [52.19, -1.9],
    venue: "Estate",
    admission: "Ticketed",
    status: "completed",
    image: "/images/red-arrows.jpg",
    imageAlt: "Red Arrows against the summer sky",
    description:
      "An invented past event showing how completed weekends stay in the archive with their aircraft line-up.",
    travel:
      "This event has finished. Travel information is retained for illustration only.",
    postcode: "B49 5NJ",
    officialUrl: "https://www.visitwarwickshire.com/",
  },
];
export const appearances: Appearance[] = [
  {
    event: "duxford-battle-of-britain",
    aircraft: "spitfire",
    status: "confirmed",
    announced: "2026-09-14",
  },
  {
    event: "southport-airshow",
    aircraft: "red-arrows",
    status: "confirmed",
    announced: "2026-09-13",
  },
  {
    event: "southport-airshow",
    aircraft: "typhoon",
    status: "confirmed",
    announced: "2026-09-12",
  },
  {
    event: "shuttleworth-season-finale",
    aircraft: "spitfire",
    status: "confirmed",
    announced: "2026-09-11",
  },
  {
    event: "autumn-jet-weekend",
    aircraft: "typhoon",
    status: "provisional",
    announced: "2026-09-10",
  },
  {
    event: "coastal-flight-festival",
    aircraft: "red-arrows",
    status: "provisional",
    announced: "2026-09-09",
  },
  {
    event: "highland-wings",
    aircraft: "spitfire",
    status: "provisional",
    announced: "2026-09-08",
  },
  {
    event: "welsh-wings",
    aircraft: "typhoon",
    status: "provisional",
    announced: "2026-08-01",
  },
  {
    event: "summer-skies",
    aircraft: "red-arrows",
    status: "confirmed",
    announced: "2026-08-01",
  },
];
export function dateLabel(event: Pick<Airshow, "start" | "end">) {
  const format = (s: string) =>
    new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "Europe/London",
    });
  return event.start === event.end
    ? format(event.start)
    : `${format(event.start)} – ${format(event.end)}`;
}
export function todayUK(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function eventStatus(event: Airshow, today = todayUK()): EventStatus {
  return event.status === "cancelled"
    ? "cancelled"
    : event.end < today
      ? "completed"
      : event.status;
}
export function upcoming(today = todayUK()) {
  return events
    .filter((e) => !["cancelled", "completed"].includes(eventStatus(e, today)))
    .sort((a, b) => a.start.localeCompare(b.start));
}
export type Filters = {
  query: string;
  region: string;
  month: string;
  admission: string;
  venue: string;
  category: string;
  status: string;
};
export const emptyFilters: Filters = {
  query: "",
  region: "",
  month: "",
  admission: "",
  venue: "",
  category: "",
  status: "",
};
export function filterEvents(filters: Filters, source = events) {
  return source
    .filter(
      (e) =>
        (!filters.query ||
          `${e.name} ${e.location} ${appearances
            .filter((a) => a.event === e.slug)
            .map((a) => aircraft.find((p) => p.slug === a.aircraft)?.name)
            .join(" ")}`
            .toLowerCase()
            .includes(filters.query.toLowerCase())) &&
        (!filters.region || e.region === filters.region) &&
        (!filters.month ||
          (e.start.slice(0, 7) <= filters.month &&
            e.end.slice(0, 7) >= filters.month)) &&
        (!filters.admission || e.admission === filters.admission) &&
        (!filters.venue || e.venue === filters.venue) &&
        (!filters.status || eventStatus(e) === filters.status) &&
        (!filters.category ||
          appearances.some(
            (a) =>
              a.event === e.slug &&
              aircraft.find((p) => p.slug === a.aircraft)?.category ===
                filters.category,
          )),
    )
    .sort((a, b) => a.start.localeCompare(b.start));
}
const escapeICS = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
export function calendarFile(source: Airshow[], now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Airshow Events//Demo Calendar//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const event of source.filter(
    (e) => !["cancelled", "completed"].includes(eventStatus(e, todayUK(now))),
  )) {
    const exclusiveEnd = new Date(event.end + "T12:00:00Z");
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.slug}@demo.airshow.events`,
      `DTSTAMP:${now
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${event.start.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${exclusiveEnd.toISOString().slice(0, 10).replaceAll("-", "")}`,
      `SUMMARY:${escapeICS("[DEMO] " + event.name)}`,
      `LOCATION:${escapeICS(event.location)}`,
      `DESCRIPTION:${escapeICS("Illustrative event only. Dates and aircraft are not verified. " + event.officialUrl)}`,
      `STATUS:${eventStatus(event, todayUK(now)) === "provisional" ? "TENTATIVE" : "CONFIRMED"}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return (
    lines
      .map((line) => {
        let result = "",
          size = 0;
        for (const char of line) {
          const bytes = new TextEncoder().encode(char).length;
          if (size + bytes > 75) {
            result += "\r\n ";
            size = 1;
          }
          result += char;
          size += bytes;
        }
        return result;
      })
      .join("\r\n") + "\r\n"
  );
}
