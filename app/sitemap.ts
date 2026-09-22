import type { MetadataRoute } from "next";
import { aircraft, events } from "@/lib/content";
import { airshowCollections } from "@/lib/discovery";
import { absoluteUrl } from "@/lib/structured-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/", "/calendar/", "/aircraft/", "/about/", "/contact/"].map((path) => ({ url: absoluteUrl(path) })),
    ...airshowCollections().map(({ slug }) => ({ url: absoluteUrl(`/calendar/${slug}/`) })),
    ...events.map((event) => ({ url: absoluteUrl(`/airshows/${event.slug}/`), images: [absoluteUrl(event.image)] })),
    ...aircraft.map((plane) => ({ url: absoluteUrl(`/aircraft/${plane.slug}/`), images: [absoluteUrl(plane.image)] })),
  ];
}
