import { getCatalog } from "@/lib/catalog";
import { CatalogProvider } from "@/components/catalog-provider";
import Home from "@/components/home";
import { pageMetadata, siteDescription } from "@/lib/metadata";
export const metadata = pageMetadata("UK airshows & aircraft", siteDescription, "/");
export default async function Page() {
  const catalog = await getCatalog();
  return <CatalogProvider catalog={catalog}><Home /></CatalogProvider>;
}
