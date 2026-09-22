import { getCatalog } from "@/lib/catalog";
import { CatalogProvider } from "@/components/catalog-provider";
import Home from "@/components/home";
import { DiscoveryLinks } from "@/components/discovery";
import { StructuredData } from "@/components/structured-data";
import { websiteData } from "@/lib/structured-data";
import { seasonLabel } from "@/lib/discovery";
import { pageMetadata, siteDescription } from "@/lib/metadata";
export const metadata = pageMetadata(`UK airshows ${seasonLabel}: dates & aircraft`, siteDescription, "/");
export default async function Page() {
  const catalog = await getCatalog();
  return (
    <CatalogProvider catalog={catalog}>
      <Home><StructuredData data={websiteData} /><DiscoveryLinks /></Home>
    </CatalogProvider>
  );
}
