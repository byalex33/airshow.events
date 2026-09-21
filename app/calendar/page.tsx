import { Suspense } from "react";
import Calendar from "@/components/calendar";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Airshow calendar",
  "Find a day worth looking up for. Browse UK airshows by date, location, aircraft and free entry. Browse sourced 2026 and 2027 listings.",
  "/calendar/",
);
export default function Page() {
  return (
    <Suspense fallback={<main id="main" className="container page-main">Loading the airshow calendar…</main>}>
      <Calendar />
    </Suspense>
  );
}
