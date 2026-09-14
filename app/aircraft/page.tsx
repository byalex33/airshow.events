import { aircraft } from "@/lib/content";
import { AircraftCard, DemoNotice } from "@/components/site";
export const metadata = { title: "Aircraft & display teams" };
export default function Page() {
  return (
    <main id="main" className="container page-main">
      <DemoNotice />
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
  );
}
