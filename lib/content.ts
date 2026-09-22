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
  imageSource?: string;
  imageCredit?: string;
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
  travelSourceUrl?: string;
  postcode: string;
  officialUrl: string;
  ticketUrl?: string;
  sourceUrl: string;
  checkedAt: string;
}
export interface Appearance {
  event: string;
  aircraft: string;
  status: "confirmed" | "provisional";
  checkedAt: string;
  sourceUrl: string;
  details: string;
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
    operator: "Various operators, including the RAF Battle of Britain Memorial Flight",
    kind: "aircraft",
  },
  {
    slug: "typhoon",
    name: "RAF Typhoon",
    category: "Fast jets",
    image: "/images/typhoon.jpg",
    imageAlt: "RAF Typhoon in flight",
    description:
      "A modern fast-jet display built around power and agility. Explore the RAF display programme records collected here.",
    operator: "Royal Air Force",
    kind: "aircraft",
  },
];
export const events: Airshow[] = [
  {
    "slug": "shuttleworth-season-premiere-2026",
    "name": "Shuttleworth Season Premiere Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-05-10",
    "end": "2026-05-10",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-season-premiere.webp",
    "imageAlt": "Blackburn monoplane being prepared at Old Warden",
    "imageSource": "https://www.shuttleworth.org/events/season-premiere-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Season Premiere at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-wings-and-wheels-2026",
    "name": "Shuttleworth Wings & Wheels Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-05-30",
    "end": "2026-05-30",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-wings-and-wheels.webp",
    "imageAlt": "Classic cars at Shuttleworth Wings & Wheels",
    "imageSource": "https://www.shuttleworth.org/events/wings-wheels-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Wings & Wheels at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-festival-of-flight-2026",
    "name": "Shuttleworth Festival of Flight Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-06-27",
    "end": "2026-06-28",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-festival-of-flight.webp",
    "imageAlt": "Flying display at Shuttleworth Festival of Flight",
    "imageSource": "https://www.shuttleworth.org/events/festival-of-flight-air-show-2027",
    "imageCredit": "The Shuttleworth Trust",
    "description": "Festival of Flight at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-summer-2026",
    "name": "Shuttleworth Summer Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-07-25",
    "end": "2026-07-25",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-summer.webp",
    "imageAlt": "Mustang in flight at Old Warden",
    "imageSource": "https://www.shuttleworth.org/events/summer-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Summer at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-flying-proms-2026",
    "name": "Shuttleworth Flying Proms Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-08-15",
    "end": "2026-08-15",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-flying-proms.webp",
    "imageAlt": "Crowd and concert stage at Shuttleworth Flying Proms",
    "imageSource": "https://www.shuttleworth.org/events/flying-proms-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Flying Proms at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-military-2026",
    "name": "Shuttleworth Military Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-08-29",
    "end": "2026-08-29",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/shuttleworth-military.webp",
    "imageAlt": "Sopwith Triplane at Shuttleworth Military Air Show",
    "imageSource": "https://www.shuttleworth.org/events/military-air-show-2026",
    "imageCredit": "The Shuttleworth Trust / Phil Chaplin",
    "description": "Military at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-season-finale",
    "name": "Shuttleworth Race Day Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2026-10-04",
    "end": "2026-10-04",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-season-finale.webp",
    "imageAlt": "Airfield sprint at Shuttleworth Race Day",
    "imageSource": "https://www.shuttleworth.org/events/race-day-air-show-2026",
    "imageCredit": "The Shuttleworth Trust / Oliver Lloyd",
    "description": "Race Day at Old Warden, part of Shuttleworth’s 2026 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/events/race-day-air-show-2026",
    "ticketUrl": "https://www.shuttleworth.org/events/race-day-air-show-2026",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-season-premiere-2027",
    "name": "Shuttleworth Season Premiere Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-05-09",
    "end": "2027-05-09",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-season-premiere.webp",
    "imageAlt": "Blackburn monoplane being prepared at Old Warden",
    "imageSource": "https://www.shuttleworth.org/events/season-premiere-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Season Premiere at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-military-2027",
    "name": "Shuttleworth Military Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-05-29",
    "end": "2027-05-29",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-military.webp",
    "imageAlt": "Sopwith Triplane at Shuttleworth Military Air Show",
    "imageSource": "https://www.shuttleworth.org/events/military-air-show-2026",
    "imageCredit": "The Shuttleworth Trust / Phil Chaplin",
    "description": "Military at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-festival-of-flight-2027",
    "name": "Shuttleworth Festival of Flight Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-06-26",
    "end": "2027-06-27",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-festival-of-flight.webp",
    "imageAlt": "Flying display at Shuttleworth Festival of Flight",
    "imageSource": "https://www.shuttleworth.org/events/festival-of-flight-air-show-2027",
    "imageCredit": "The Shuttleworth Trust",
    "description": "Festival of Flight at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-summer-2027",
    "name": "Shuttleworth Summer Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-07-24",
    "end": "2027-07-24",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-summer.webp",
    "imageAlt": "Mustang in flight at Old Warden",
    "imageSource": "https://www.shuttleworth.org/events/summer-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Summer at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-wings-and-wheels-2027",
    "name": "Shuttleworth Wings & Wheels Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-08-14",
    "end": "2027-08-14",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-wings-and-wheels.webp",
    "imageAlt": "Classic cars at Shuttleworth Wings & Wheels",
    "imageSource": "https://www.shuttleworth.org/events/wings-wheels-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Wings & Wheels at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-flying-proms-2027",
    "name": "Shuttleworth Flying Proms Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-08-28",
    "end": "2027-08-28",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-flying-proms.webp",
    "imageAlt": "Crowd and concert stage at Shuttleworth Flying Proms",
    "imageSource": "https://www.shuttleworth.org/events/flying-proms-air-show-2027",
    "imageCredit": "The Shuttleworth Trust / Mach 3 Studio",
    "description": "Flying Proms at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "shuttleworth-season-finale-2027",
    "name": "Shuttleworth Season Finale Air Show",
    "subtitle": "Old Warden, Bedfordshire",
    "start": "2027-09-25",
    "end": "2027-09-25",
    "location": "Old Warden, Bedfordshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      -0.32
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/shuttleworth-season-finale.webp",
    "imageAlt": "Airfield sprint at Shuttleworth Race Day",
    "imageSource": "https://www.shuttleworth.org/events/race-day-air-show-2026",
    "imageCredit": "The Shuttleworth Trust / Oliver Lloyd",
    "description": "Season Finale at Old Warden, part of Shuttleworth’s 2027 flying season.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "SG18 9DT",
    "officialUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "ticketUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "sourceUrl": "https://www.shuttleworth.org/about/about-shuttleworth/news/2027-air-show-season-now-on-sale",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "duxford-summer-2026",
    "name": "Duxford Summer Air Show",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2026-07-04",
    "end": "2026-07-05",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/duxford-summer.webp",
    "imageAlt": "Official Duxford Summer Air Show photograph",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-summer-air-show",
    "imageCredit": "Imperial War Museums",
    "description": "A two-day air show at IWM Duxford, as announced in the museum’s 2026 programme.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/sites/default/files/files/2025-12/Press%20release%20-%20IWM%202026%20Programme%20Launch.pdf",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "duxford-battle-of-britain",
    "name": "Duxford Battle of Britain Air Show",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2026-09-12",
    "end": "2026-09-13",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/duxford-battle-of-britain.webp",
    "imageAlt": "Official Duxford Battle of Britain Air Show photograph",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-battle-of-britain-airshow",
    "imageCredit": "Imperial War Museums",
    "description": "A two-day air show at IWM Duxford, as announced in the museum’s 2026 programme.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/sites/default/files/files/2025-12/Press%20release%20-%20IWM%202026%20Programme%20Launch.pdf",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "southport-airshow",
    "name": "Southport Air Show",
    "subtitle": "Southport, Merseyside",
    "start": "2026-08-29",
    "end": "2026-08-30",
    "location": "Southport, Merseyside",
    "region": "North West",
    "coordinates": [
      53.65,
      -3.01
    ],
    "venue": "Seafront",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/southport-airshow.webp",
    "imageAlt": "Official Southport Air Show photograph",
    "imageSource": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "imageCredit": "Visit Southport",
    "description": "The August bank holiday air show on Southport seafront. Published aircraft programme records are listed below.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "sourceUrl": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "raf-cosford-2026",
    "name": "RAF Cosford Air Show",
    "subtitle": "Cosford, Shropshire",
    "start": "2026-06-14",
    "end": "2026-06-14",
    "location": "Cosford, Shropshire",
    "region": "Midlands",
    "coordinates": [
      52.64,
      -2.3
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/events/raf-cosford.webp",
    "imageAlt": "Official RAF Cosford Air Show photograph",
    "imageSource": "https://www.cosfordairshow.co.uk/",
    "imageCredit": "RAF Cosford Air Show",
    "description": "The Royal Air Force’s air show at RAF Cosford.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "WV7 3EX",
    "officialUrl": "https://www.cosfordairshow.co.uk/",
    "sourceUrl": "https://www.cosfordairshow.co.uk/",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "international-ayr-show-2026",
    "name": "International Ayr Show – Festival of Flight",
    "subtitle": "Ayr, South Ayrshire",
    "start": "2026-09-04",
    "end": "2026-09-05",
    "location": "Ayr, South Ayrshire",
    "region": "Scotland",
    "coordinates": [
      55.46,
      -4.64
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "completed",
    "image": "/images/events/international-ayr-show.webp",
    "imageAlt": "Official International Ayr Show promotional photograph",
    "imageSource": "https://destinationsouthayrshire.co.uk/ayrshow/",
    "imageCredit": "Destination South Ayrshire",
    "description": "A free coastal air show at Ayr’s Low Green, with Friday evening and Saturday flying.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://destinationsouthayrshire.co.uk/ayrshow/",
    "sourceUrl": "https://www.south-ayrshire.gov.uk/council-news/International-Ayr-Show-Festival-of-Flight-2026-full-flying-display-schedule-announced",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "international-ayr-show-2027",
    "name": "International Ayr Show – Festival of Flight",
    "subtitle": "Ayr, South Ayrshire",
    "start": "2027-09-03",
    "end": "2027-09-04",
    "location": "Ayr, South Ayrshire",
    "region": "Scotland",
    "coordinates": [
      55.46,
      -4.64
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "confirmed",
    "image": "/images/events/international-ayr-show.webp",
    "imageAlt": "Official International Ayr Show promotional photograph",
    "imageSource": "https://destinationsouthayrshire.co.uk/ayrshow/",
    "imageCredit": "Destination South Ayrshire",
    "description": "A free coastal air show at Ayr’s Low Green, with Friday evening and Saturday flying.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://destinationsouthayrshire.co.uk/ayrshow/",
    "sourceUrl": "https://www.south-ayrshire.gov.uk/council-news/Save-the-date-The-International-Ayr-Show-Festival-of-Flight-returns-in-2027",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "royal-international-air-tattoo-2027",
    "name": "Royal International Air Tattoo",
    "subtitle": "RAF Fairford, Gloucestershire",
    "start": "2027-07-16",
    "end": "2027-07-18",
    "location": "RAF Fairford, Gloucestershire",
    "region": "South West",
    "coordinates": [
      51.68,
      -1.79
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/royal-international-air-tattoo.webp",
    "imageAlt": "Static aircraft at the Royal International Air Tattoo",
    "imageSource": "https://www.airtattoo.com/",
    "imageCredit": "Royal International Air Tattoo",
    "description": "The Air Tattoo’s published 2027 weekend at RAF Fairford. Aircraft participation will be added when verified.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://www.airtattoo.com/",
    "ticketUrl": "https://www.airtattoo.com/",
    "sourceUrl": "https://www.airtattoo.com/the-airshow/aircraft-and-pilots/future-dates/",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "midlands-air-festival-2027",
    "name": "Midlands Air Festival",
    "subtitle": "Alcester, Warwickshire",
    "start": "2027-06-04",
    "end": "2027-06-06",
    "location": "Alcester, Warwickshire",
    "region": "Midlands",
    "coordinates": [
      52.19,
      -1.9
    ],
    "venue": "Estate",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/midlands-air-festival.webp",
    "imageAlt": "Official Midlands Air Festival photograph",
    "imageSource": "https://www.midlandsairfestival.com/",
    "imageCredit": "Midlands Air Festival",
    "description": "Aviation and ballooning at Ragley Hall, with Nightfire on Friday.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "B49 5NJ",
    "officialUrl": "https://www.midlandsairfestival.com/",
    "ticketUrl": "https://www.midlandsairfestival.com/",
    "sourceUrl": "https://www.midlandsairfestival.com/",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "english-riviera-airshow-2027",
    "name": "English Riviera Airshow",
    "subtitle": "Paignton, Devon",
    "start": "2027-06-04",
    "end": "2027-06-06",
    "location": "Paignton, Devon",
    "region": "South West",
    "coordinates": [
      50.43,
      -3.56
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "confirmed",
    "image": "/images/events/english-riviera-airshow.webp",
    "imageAlt": "Official English Riviera Airshow photograph",
    "imageSource": "https://englishrivieraairshow.co.uk/",
    "imageCredit": "English Riviera Airshow",
    "description": "A free festival beside Tor Bay. These dates cover the full event; the flying timetable is still to be recorded.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://englishrivieraairshow.co.uk/",
    "sourceUrl": "https://englishrivieraairshow.co.uk/about/",
    "checkedAt": "2026-09-14"
  },
  {
    "slug": "duxford-summer-2027",
    "name": "Duxford Summer Air Show",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2027-06-19",
    "end": "2027-06-20",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/duxford-summer.webp",
    "imageAlt": "Representative photograph from a previous Duxford air show",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-summer-air-show",
    "imageCredit": "Imperial War Museums",
    "description": "A two-day air show in IWM Duxford's announced 2027 season. Ticket sales and aircraft details were still to be announced when this date was checked.",
    "travel": "Check IWM's event-specific arrival information before travelling. The museum is near Cambridge; parking and shuttle arrangements differ between flying events.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/airshows",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "duxford-flying-evening-2027",
    "name": "Duxford Flying Evening",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2027-08-14",
    "end": "2027-08-14",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/duxford-summer.webp",
    "imageAlt": "Representative photograph from a previous Duxford air show",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-summer-air-show",
    "imageCredit": "Imperial War Museums",
    "description": "An evening flying event in IWM Duxford's 2027 season. Check IWM for ticket releases, opening times and the flying programme.",
    "travel": "Check IWM's event-specific arrival information before travelling. The museum is near Cambridge; parking and shuttle arrangements differ between flying events.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/airshows",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "duxford-battle-of-britain-2027",
    "name": "Duxford Battle of Britain Air Show",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2027-09-11",
    "end": "2027-09-12",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/duxford-battle-of-britain.webp",
    "imageAlt": "Representative photograph from a previous Duxford air show",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-battle-of-britain-airshow",
    "imageCredit": "Imperial War Museums",
    "description": "IWM has announced this September weekend for its 2027 Battle of Britain Air Show. Aircraft participation has not yet been recorded here.",
    "travel": "Check IWM's event-specific arrival information before travelling. The museum is near Cambridge; parking and shuttle arrangements differ between flying events.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/airshows",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "duxford-flying-finale-2027",
    "name": "Duxford Flying Finale",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2027-10-02",
    "end": "2027-10-02",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/duxford-summer.webp",
    "imageAlt": "Representative photograph from a previous Duxford air show",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-summer-air-show",
    "imageCredit": "Imperial War Museums",
    "description": "The closing flying event announced for IWM Duxford's 2027 season. The 2026 programme is a separate edition and does not confirm this year's aircraft.",
    "travel": "Check IWM's event-specific arrival information before travelling. The museum is near Cambridge; parking and shuttle arrangements differ between flying events.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows",
    "sourceUrl": "https://www.iwm.org.uk/airshows",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "duxford-flying-finale-2026",
    "name": "Duxford Flying Finale",
    "subtitle": "Duxford, Cambridgeshire",
    "start": "2026-10-03",
    "end": "2026-10-03",
    "location": "Duxford, Cambridgeshire",
    "region": "East of England",
    "coordinates": [
      52.09,
      0.13
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "confirmed",
    "image": "/images/events/duxford-summer.webp",
    "imageAlt": "Representative photograph from a previous Duxford air show",
    "imageSource": "https://www.iwm.org.uk/airshows/duxford-summer-air-show",
    "imageCredit": "Imperial War Museums",
    "description": "IWM Duxford's final flying event of 2026. Advance booking is required; tickets are not sold on the day. The organiser lists the Red Arrows and RAF Typhoon, with further programme updates expected.",
    "travel": "IWM states that there are no free shuttle buses from Cambridge station or Trumpington park and ride for this event. On-site parking does not need a separate booking. Use the museum's travel information to plan your route.",
    "postcode": "CB22 4QR",
    "officialUrl": "https://www.iwm.org.uk/airshows/duxford-flying-finale",
    "sourceUrl": "https://www.iwm.org.uk/airshows/duxford-flying-finale",
    "checkedAt": "2026-09-22",
    "ticketUrl": "https://tickets.iwm.org.uk/event-tickets/70207",
    "travelSourceUrl": "https://www.iwm.org.uk/airshows/duxford-flying-finale"
  },
  {
    "slug": "clacton-airshow-2026",
    "name": "Clacton Airshow",
    "subtitle": "Clacton-on-Sea, Essex",
    "start": "2026-08-27",
    "end": "2026-08-28",
    "location": "Clacton-on-Sea, Essex",
    "region": "East of England",
    "coordinates": [
      51.787,
      1.149
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "completed",
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative Red Arrows photograph, not confirmation of this event's aircraft",
    "description": "Tendring District Council's free seafront airshow in Clacton-on-Sea. These are the council's published 2026 dates; aircraft participation must be checked against the programme for this edition.",
    "travel": "Use the official Clacton Airshow visitor information for viewing areas, parking and transport. Do not assume that previous editions' road closures or timetables will apply.",
    "postcode": "",
    "officialUrl": "https://clactonairshow.com/",
    "sourceUrl": "https://www.tendringdc.gov.uk/news/clacton-airshow-dates-revealed-for-2026",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "clacton-airshow-2027",
    "name": "Clacton Airshow",
    "subtitle": "Clacton-on-Sea, Essex",
    "start": "2027-08-26",
    "end": "2027-08-27",
    "location": "Clacton-on-Sea, Essex",
    "region": "East of England",
    "coordinates": [
      51.787,
      1.149
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "confirmed",
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative Red Arrows photograph, not confirmation of this event's aircraft",
    "description": "Tendring District Council's free seafront airshow in Clacton-on-Sea. These are the council's published 2027 dates; aircraft participation must be checked against the programme for this edition.",
    "travel": "Use the official Clacton Airshow visitor information for viewing areas, parking and transport. Do not assume that previous editions' road closures or timetables will apply.",
    "postcode": "",
    "officialUrl": "https://clactonairshow.com/",
    "sourceUrl": "https://www.tendringdc.gov.uk/news/clacton-airshow-dates-revealed-for-2027",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "old-buckenham-airshow-2026",
    "name": "Old Buckenham Airshow",
    "subtitle": "Old Buckenham, Norfolk",
    "start": "2026-07-25",
    "end": "2026-07-26",
    "location": "Old Buckenham Airfield, Norfolk",
    "region": "East of England",
    "coordinates": [
      52.497,
      1.052
    ],
    "venue": "Airfield",
    "admission": "Ticketed",
    "status": "completed",
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative Spitfire MH434 photograph, not a photograph of the 2026 event",
    "description": "A two-day airfield show in Norfolk. The 2026 programme included several Spitfire variants, with different combinations on Saturday and Sunday. This page preserves the published edition rather than confirming that every planned display flew.",
    "travel": "The organiser advises following yellow airshow signs from the A11 rather than satellite navigation through Attleborough. The airfield is on Abbey Road, Old Buckenham. Historic traffic arrangements may change for later editions.",
    "travelSourceUrl": "https://www.oldbuckenhamairshow.com/",
    "postcode": "NR17 1PU",
    "officialUrl": "https://www.oldbuckenhamairshow.com/",
    "sourceUrl": "https://www.oldbuckenhamairshow.com/",
    "checkedAt": "2026-09-22"
  },
  {
    "slug": "wales-airshow-2026",
    "name": "Wales Airshow",
    "subtitle": "Swansea Bay, Wales",
    "start": "2026-07-25",
    "end": "2026-07-26",
    "location": "Swansea Bay, Swansea",
    "region": "Wales",
    "coordinates": [
      51.611,
      -3.96
    ],
    "venue": "Seafront",
    "admission": "Free",
    "status": "completed",
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative Red Arrows photograph, not confirmation of this event's aircraft",
    "description": "Swansea Council's free two-day airshow over Swansea Bay. General admission did not require a ticket. This is the 2026 edition; a future date should be checked separately with the organiser.",
    "travel": "The published display area ran along Swansea Prom between the Cenotaph and Civic Centre. The organiser provided event parking and park-and-ride information and advised following airshow signs. Check new arrangements before visiting a later edition.",
    "travelSourceUrl": "https://www.walesnationalairshow.com/information/travel/",
    "postcode": "SA1 4PQ",
    "officialUrl": "https://www.walesnationalairshow.com/",
    "sourceUrl": "https://www.walesnationalairshow.com/information/faqs/",
    "checkedAt": "2026-09-22"
  }
];
export const appearances: Appearance[] = [
  {
    "event": "shuttleworth-season-finale",
    "aircraft": "spitfire",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.shuttleworth.org/events/race-day-air-show-2026",
    "details": "Programme lists Spitfire XI from Aircraft Restoration Company and Shuttleworth’s Spitfire Vc on 4 October."
  },
  {
    "event": "southport-airshow",
    "aircraft": "red-arrows",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "details": "Scheduled for both 29 and 30 August."
  },
  {
    "event": "southport-airshow",
    "aircraft": "typhoon",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "details": "Scheduled for Sunday 30 August only."
  },
  {
    "event": "southport-airshow",
    "aircraft": "spitfire",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.visitsouthport.com/whats-on/top-events/southport-airshow/",
    "details": "BBMF Spitfire scheduled for both 29 and 30 August."
  },
  {
    "event": "international-ayr-show-2026",
    "aircraft": "red-arrows",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.south-ayrshire.gov.uk/council-news/International-Ayr-Show-Festival-of-Flight-2026-full-flying-display-schedule-announced",
    "details": "Scheduled for both 4 and 5 September in the council’s published programme."
  },
  {
    "event": "international-ayr-show-2026",
    "aircraft": "typhoon",
    "status": "confirmed",
    "checkedAt": "2026-09-14",
    "sourceUrl": "https://www.south-ayrshire.gov.uk/council-news/International-Ayr-Show-Festival-of-Flight-2026-full-flying-display-schedule-announced",
    "details": "Scheduled for both 4 and 5 September in the council’s published programme."
  },
  {
    "event": "duxford-flying-finale-2026",
    "aircraft": "red-arrows",
    "status": "confirmed",
    "checkedAt": "2026-09-22",
    "sourceUrl": "https://www.iwm.org.uk/airshows/duxford-flying-finale",
    "details": "IWM lists the Red Arrows for 3 October 2026. The flying list was dated 14 September when checked; flying remains subject to weather and serviceability."
  },
  {
    "event": "duxford-flying-finale-2026",
    "aircraft": "typhoon",
    "status": "confirmed",
    "checkedAt": "2026-09-22",
    "sourceUrl": "https://www.iwm.org.uk/airshows/duxford-flying-finale",
    "details": "IWM lists the RAF Typhoon Display Team for 3 October 2026. The flying list was dated 14 September when checked; flying remains subject to weather and serviceability."
  },
  {
    "event": "old-buckenham-airshow-2026",
    "aircraft": "spitfire",
    "status": "confirmed",
    "checkedAt": "2026-09-22",
    "sourceUrl": "https://www.oldbuckenhamairshow.com/post/the-definitive-list-2026",
    "details": "Published programme: MH434, RW232 and MK912 on both days; a BBMF Spitfire and EE602 on Saturday; TA805 on Sunday. This records the planned programme, not proof of flight."
  }
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
export function filterEvents(filters: Filters, source = events, today = todayUK()) {
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
        (!filters.status || eventStatus(e, today) === filters.status) &&
        (!filters.category ||
          appearances.some(
            (a) =>
              a.event === e.slug &&
              aircraft.find((p) => p.slug === a.aircraft)?.category ===
                filters.category,
          )),
    )
    .sort((a, b) => {
      const aPast = eventStatus(a, today) === "completed" || a.end < today;
      const bPast = eventStatus(b, today) === "completed" || b.end < today;
      return Number(aPast) - Number(bPast) ||
        (aPast ? b.end.localeCompare(a.end) : a.start.localeCompare(b.start)) ||
        a.name.localeCompare(b.name);
    });
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
    "PRODID:-//Airshow Events//UK Airshows//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const event of source.filter(
    (e) => !["cancelled", "completed"].includes(eventStatus(e, todayUK(now))),
  )) {
    const exclusiveEnd = new Date(event.end + "T12:00:00Z");
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.slug}@airshow.events`,
      `DTSTAMP:${now
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${event.start.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${exclusiveEnd.toISOString().slice(0, 10).replaceAll("-", "")}`,
      `SUMMARY:${escapeICS(event.name)}`,
      `LOCATION:${escapeICS(event.location)}`,
      `DESCRIPTION:${escapeICS("Dates checked " + event.checkedAt + ". Programmes may change. Source: " + event.sourceUrl)}`,
      `URL:https://airshow.events/airshows/${event.slug}/`,
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
