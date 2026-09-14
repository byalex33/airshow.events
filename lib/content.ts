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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/spitfire.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/typhoon.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/typhoon.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative aircraft photography",
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
    "image": "/images/red-arrows.jpg",
    "imageAlt": "Representative aircraft photography",
    "description": "A free festival beside Tor Bay. These dates cover the full event; the flying timetable is still to be recorded.",
    "travel": "Use the organiser’s visitor information for event entrances, parking and public transport. Map pins show the approximate venue, not an arrival gate.",
    "postcode": "",
    "officialUrl": "https://englishrivieraairshow.co.uk/",
    "sourceUrl": "https://englishrivieraairshow.co.uk/about/",
    "checkedAt": "2026-09-14"
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
