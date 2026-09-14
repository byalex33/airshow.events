import type { MetadataRoute } from "next";
import { aircraft, events } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/", "/calendar/", "/aircraft/", "/about/", "/contact/",
    ...events.map((event) => `/airshows/${event.slug}/`),
    ...aircraft.map((plane) => `/aircraft/${plane.slug}/`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
