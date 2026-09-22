import type { Airshow } from "./content";
import { siteUrl } from "./metadata";

export const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
export const eventTitle = (event: Airshow) => `${event.name} ${event.start.slice(0, 4)}`;

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbData(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function eventData(event: Airshow) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": absoluteUrl(`/airshows/${event.slug}/#event`),
    url: absoluteUrl(`/airshows/${event.slug}/`),
    name: eventTitle(event),
    description: event.description,
    image: [absoluteUrl(event.image)],
    startDate: event.start,
    endDate: event.end,
    // Schema.org has no provisional or completed EventStatusType.
    // Historical scheduled events retain their real dates; provisional status is omitted.
    ...(event.status === "provisional" ? {} : {
      eventStatus: `https://schema.org/${event.status === "cancelled" ? "EventCancelled" : "EventScheduled"}`,
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: event.admission === "Free",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
        addressRegion: event.region,
        addressCountry: "GB",
        ...(event.postcode ? { postalCode: event.postcode } : {}),
      },
      geo: { "@type": "GeoCoordinates", latitude: event.coordinates[0], longitude: event.coordinates[1] },
    },
    // Ticket price, availability and named performers require separate verified data.
  };
}

export function collectionData(title: string, path: string, shows: Airshow[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: shows.length,
      itemListElement: shows.map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: eventTitle(event),
        url: absoluteUrl(`/airshows/${event.slug}/`),
      })),
    },
  };
}

export const websiteData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: "Airshow Events", inLanguage: "en-GB", publisher: { "@id": `${siteUrl}/#organization` } },
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Airshow Events", url: `${siteUrl}/` },
  ],
};
