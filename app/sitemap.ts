import { getCatalog } from "@/lib/catalog";
import { sitemapEntries } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  return sitemapEntries((await getCatalog()).aircraft);
}
