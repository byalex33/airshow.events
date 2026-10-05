import { DataNotice } from "@/components/site";
import { pageMetadata } from "@/lib/metadata";
import { aircraft, aircraftPhotoEntries, events } from "@/lib/content";
export const metadata = pageMetadata(
  "Sources & credits",
  "An independent UK airshow guide. Read about official sources, coverage, photography credits and open-source tools.",
  "/about/",
);
export default function Page() {
  return (
    <main id="main" className="container page-main">
      <DataNotice />
      <div className="page-heading">
        <div>
          <span className="eyebrow">INDEPENDENT, BY DESIGN</span>
          <h1>For the love of flight.</h1>
          <p>
            Airshow Events is an independent guide for discovering UK flying
            displays.
          </p>
        </div>
      </div>
      <div className="credits">
        <h2>Dates with a source</h2>
        <p>Our calendar covers selected 2026 events, including past dates, and published 2027 dates. Each listing links to an official organiser, council or RAF source and records when it was checked. This is a growing calendar, not a complete UK schedule.</p>
        <p>Event confirmation is separate from aircraft participation. Aircraft records describe published programmes, not proof that a display took place. Empty line-ups mean we have not recorded confirmations. A Spitfire entry groups the aircraft type; operator and variant details appear with each programme record.</p>
        <p>Each event and aircraft record shows its own source check date. Updates are reviewed manually. Dates, ticket availability and flying can change. Calendar downloads are snapshots and will not update automatically. Check the organiser before travelling.</p>
        <p>Map pins show approximate venues, not entrance gates. Local weather links lead to the Met Office; we do not display a live forecast.</p>
        <h2>Photography</h2>
        <p>Event photographs come from the organisers’ linked pages and may show previous editions. Copyright remains with the credited photographers and organisations.</p>
        <ul>{Array.from(new Map(events.filter(event => event.imageSource).map(event => [event.image, event])).values()).map(event => <li key={event.image}><a href={event.imageSource}>{event.name.replace(/ 202[67]$/, "")}</a>: {event.imageCredit}.</li>)}</ul>
        <p>Aircraft images are representative, not evidence of an aircraft’s attendance, and may show a different airframe or operator from a programme. They are resized and displayed with crops and overlays.</p>
        <ul>{Object.entries(aircraftPhotoEntries).map(([slug, photo]) => <li key={slug}>{aircraft.find(plane => plane.slug === slug)?.imageAlt ?? photo.imageAlt}: <a href={photo.imageSource}>{photo.imageCredit}</a>, <a href={photo.imageLicenseUrl}>{photo.imageLicense}</a>.</li>)}</ul>
        <h2>Made with open-source tools</h2>
        <p>
          Next.js, TypeScript and Tailwind CSS. Buttons from{" "}
          <a href="https://ui.shadcn.com/">shadcn/ui</a>, motion components
          adapted from <a href="https://beui.dev/">BeUI</a>, and outline icons
          from <a href="https://www.runeicons.com/">Runeicons</a>. Maps use
          Leaflet and OpenStreetMap contributors.
        </p>
        <p>
          <a href="/licenses/shadcn.txt">shadcn/ui licence</a> ·{" "}
          <a href="/licenses/beui.txt">BeUI licence</a> ·{" "}
          <a href="/licenses/runeicons.txt">Runeicons licence</a>
        </p>
        <p>
          This project is independent of the named organisers, the Royal Air
          Force and British Airshows. No British Airshows content or visual
          identity is used.
        </p>
      </div>
    </main>
  );
}
