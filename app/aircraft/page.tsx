import { CatalogProvider } from "@/components/catalog-provider";
import { getCatalog } from "@/lib/catalog";

import { AircraftCard, DataNotice } from "@/components/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Aircraft & display teams",
  "Explore aircraft and display teams from published UK airshow programmes, with participation status and organiser sources.",
  "/aircraft/",
);
export default async function Page() {
  const { aircraft, appearances } = await getCatalog();
  return (
    <CatalogProvider catalog={{ aircraft, appearances }}>
    <main id="main" className="container page-main">
      <DataNotice />
      <div className="page-heading">
        <div>
          <span className="eyebrow">FOLLOW THE SOUND</span>
          <h1>Icons of the sky.</h1>
          <p>
            From the first Merlin note to the last smoke trail. Find your
            favourites and see where they’re flying.
          </p>
        </div>
      </div>
      <div className="card-grid">
        {aircraft.map((a) => (
          <AircraftCard key={a.slug} slug={a.slug} />
        ))}
      </div>
    </main>
    </CatalogProvider>
  );
}
