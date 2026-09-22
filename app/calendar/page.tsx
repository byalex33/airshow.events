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
export default function Page() {
  return (
    <main id="main">
      <Suspense fallback={<div className="container page-main">Loading the airshow calendar…</div>}>
        <Calendar />
      </Suspense>
      <DiscoveryLinks />
    </main>
  );
}
