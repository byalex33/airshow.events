import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbData, eventData, eventTitle } from "@/lib/structured-data";
import { collectionsForEvent } from "@/lib/discovery";
import styles from "@/components/discovery.module.css";
import { pageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { aircraft, appearances, dateLabel, events } from "@/lib/content";
import {
  Countdown,
  DataNotice,
  ExportButton,
  Icon,
  LiveStatus,
  Status,
} from "@/components/site";
import { Button } from "@/components/ui/button";
export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();
  return pageMetadata(
    `${eventTitle(event)}: dates & tickets`,
    `${dateLabel(event)} ${event.start.slice(0, 4)} in ${event.location}. Organiser-sourced dates, travel information and recorded aircraft programmes.`,
    `/airshows/${event.slug}/`,
    event.image,
    event.imageAlt,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();
  const lineup = appearances.filter((a) => a.event === slug);
  return (
    <main id="main">
      <StructuredData data={eventData(event)} />
      <StructuredData data={breadcrumbData([{ name: "Home", path: "/" }, { name: "Airshow calendar", path: "/calendar/" }, { name: eventTitle(event), path: `/airshows/${event.slug}/` }])} />
      <section className="detail-hero">
        <img src={event.image} alt={event.imageAlt} fetchPriority="high" />
        <div className="container detail-hero-content">
          <Link className="breadcrumb" href="/calendar/">
            ← Airshow calendar
          </Link>
          <LiveStatus event={event} />
          <h1>{eventTitle(event)}</h1>
          <div className="detail-meta">
            <span>
              <Icon name="calendar" />
              {dateLabel(event)} {event.start.slice(0, 4)}
            </span>
            <span>
              <Icon name="pin" />
              {event.location}
            </span>
          </div>
        </div>
      </section>
      <div className="container">
        <DataNotice />
        <div className="detail-layout">
          <div className="detail-copy">
            <span className="eyebrow">{event.subtitle.toUpperCase()}</span>
            <h2>Dates and visitor information</h2>
            <p>{event.description}</p>
            <p><a href={event.sourceUrl} target="_blank" rel="noreferrer">Official date source ↗</a> · Checked {event.checkedAt}</p>
            <p>Photography is representative and does not confirm aircraft attendance.</p>
            <h2>Aircraft on the programme</h2>
            <p className="programme-note">
              {lineup.length ? "A partial record of the organiser’s published programme. For past events, this records planned participation, not proof that an aircraft flew." : "No aircraft confirmations recorded yet. See the organiser for the full programme."} Flying is subject to change.
            </p>
            {lineup.map((a) => {
              const plane = aircraft.find((p) => p.slug === a.aircraft)!;
              return (
                <article className="programme-card" key={a.aircraft}>
                  <Link className="programme-image" href={`/aircraft/${plane.slug}/`} aria-label={`View ${plane.name}`}>
                    <img src={plane.image} alt={plane.imageAlt} loading="lazy" />
                  </Link>
                  <div className="programme-content">
                    <div className="programme-title">
                      <h3>
                        <Link href={`/aircraft/${plane.slug}/`}>
                          {plane.name}
                        </Link>
                      </h3>
                      <Status status={a.status} />
                    </div>
                    <p>{a.details}</p>
                    <div className="programme-footer">
                      <a href={a.sourceUrl} target="_blank" rel="noreferrer">Programme source <Icon name="arrow" /></a>
                      <span><Icon name="calendar" />Checked <time dateTime={a.checkedAt}>{new Date(`${a.checkedAt}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time></span>
                    </div>
                  </div>
                </article>
              );
            })}
            <h2>Getting there</h2>
            <p>{event.travel}</p>
            {event.travelSourceUrl && <p><a href={event.travelSourceUrl} target="_blank" rel="noreferrer">Official travel information ↗</a></p>}
            <div className="travel-box">
              <span className="eyebrow">PLAN YOUR ARRIVAL</span>
              <p>
                {event.location}{event.postcode ? ` · ${event.postcode}` : ""}
              </p>
              <a
                className="text-link"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.postcode || event.location)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open directions <Icon name="arrow" />
              </a>
              <p>
                For accessible parking, step-free access and facilities, check
                the venue’s latest visitor information.
              </p>
            </div>
            <div className="weather-box">
              <span className="weather-symbol" aria-hidden="true">
                ☀
              </span>
              <div>
                <h3>Local weather</h3>
                <p>
                  Check a local
                  forecast close to the event and the organiser’s updates on the
                  day.
                </p>
                <a
                  href={`https://www.metoffice.gov.uk/weather/search?query=${encodeURIComponent(event.postcode || event.location)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check the Met Office forecast ↗
                </a>
              </div>
            </div>
          </div>
          <aside className="detail-sidebar">
            <Countdown event={event} />
            <span className="eyebrow">YOUR DAY AT A GLANCE</span>
            <dl>
              <dt>Dates</dt>
              <dd>{dateLabel(event)}</dd>
              <dt>Entry</dt>
              <dd>{event.admission}</dd>
              <dt>Setting</dt>
              <dd>{event.venue}</dd>
              <dt>Location</dt>
              <dd>{event.region}</dd>
            </dl>
            {(
              <Button asChild>
                <a
                  href={event.ticketUrl || event.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {event.ticketUrl
                    ? "Tickets & official information"
                    : "Visit the organiser"}
                  <Icon name="arrow" />
                </a>
              </Button>
            )}
            <ExportButton source={[event]} label="Add to calendar" />
            <p>
              Dates checked {event.checkedAt}. Ticket availability and programmes can change. Older organiser pages may now advertise the next season.
            </p>
          </aside>
        </div>
        <section className={styles.section}>
          <h2>More airshow dates</h2>
          <nav className={styles.links} aria-label="Related airshow collections">
            {collectionsForEvent(event).map((collection) => <Link key={collection.slug} href={`/calendar/${collection.slug}/`}>{collection.title}</Link>)}
            {events.filter((other) => other.name === event.name && other.slug !== event.slug).map((other) => <Link key={other.slug} href={`/airshows/${other.slug}/`}>{eventTitle(other)}</Link>)}
          </nav>
        </section>
      </div>
    </main>
  );
}
