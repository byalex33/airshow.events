import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { aircraft, appearances, events } from "@/lib/content";
import { DataNotice, EventCard, ExportButton, Icon, Status } from "@/components/site";
export function generateStaticParams() {
  return aircraft.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plane = aircraft.find((a) => a.slug === slug);
  if (!plane) notFound();
  return pageMetadata(
    plane.name,
    `Explore ${plane.name}, ${plane.category.toLowerCase()} operated by ${plane.operator}. Browse sourced UK programme records.`,
    `/aircraft/${plane.slug}/`,
    plane.image,
    plane.imageAlt,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plane = aircraft.find((a) => a.slug === slug);
  if (!plane) notFound();
  const bookings = appearances
    .filter((a) => a.aircraft === slug)
    .sort((a, b) =>
      events
        .find((e) => e.slug === a.event)!
        .start.localeCompare(events.find((e) => e.slug === b.event)!.start),
    );
  return (
    <main id="main">
      <section className="detail-hero">
        <img src={plane.image} alt={plane.imageAlt} fetchPriority="high" />
        <div className="container detail-hero-content">
          <Link href="/aircraft/" className="breadcrumb">
            ← Aircraft & display teams
          </Link>
          <span className="event-tag tag-airfield">
            <Icon name="plane" />
            {plane.category} ·{" "}
            {plane.kind === "team" ? "DISPLAY TEAM" : "AIRCRAFT"}
          </span>
          <h1>{plane.name}</h1>
          <p style={{ color: "#d6e1e6" }}>{plane.operator}</p>
        </div>
      </section>
      <div className="container page-main">
        <DataNotice />
        <div className="aircraft-intro">
          <p>{plane.description}</p>
          <ExportButton
            source={events.filter((e) =>
              bookings.some((b) => b.event === e.slug),
            )}
            label="Export appearances"
          />
        </div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">FOLLOW THEIR SEASON</span>
            <h2>Where to see them.</h2>
            <p>
              {bookings.length} sourced programme records, including past dates. Coverage is partial; historical records describe scheduled participation.
            </p>
          </div>
        </div>
        <div className="card-grid">
          {bookings.map((a) => (
            <div key={a.event}>
              <div style={{ marginBottom: 10, fontSize: 11, color: "#67747c" }}>
                Programme status: <Status status={a.status} />
              </div>
              <EventCard event={events.find((e) => e.slug === a.event)!} />
              <p>{a.details}</p>
              <p><a href={a.sourceUrl} target="_blank" rel="noreferrer">Official programme ↗</a> · Checked {a.checkedAt}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
