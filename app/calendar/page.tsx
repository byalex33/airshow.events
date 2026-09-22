import { getCatalog } from "@/lib/catalog";
import { CatalogProvider } from "@/components/catalog-provider";
import { Suspense } from "react";
import Calendar from "@/components/calendar";
import { DiscoveryLinks } from "@/components/discovery";
import { seasonLabel } from "@/lib/discovery";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  `UK airshow calendar ${seasonLabel}`,
  "Browse UK airshow dates by location, month, aircraft and free entry. Compare sourced listings on a map and find official event and ticket information.",
  "/calendar/",
);
export default async function Page() {
  const catalog = await getCatalog();
  return (
    <CatalogProvider catalog={catalog}>
      <main id="main">
        <Suspense fallback={<div className="container page-main">Loading the airshow calendar…</div>}>
          <Calendar />
        </Suspense>
        <DiscoveryLinks />
      </main>
    </CatalogProvider>
  );
}
