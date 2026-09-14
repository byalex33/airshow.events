import Link from "next/link";
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
  return {
    title: event?.name ?? "Airshow not found",
    description: event?.description,
  };
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
      <section className="detail-hero">
        <img src={event.image} alt={event.imageAlt} fetchPriority="high" />
        <div className="container detail-hero-content">
          <Link className="breadcrumb" href="/calendar/">
            ← Airshow calendar
          </Link>
          <LiveStatus event={event} />
          <h1>{event.name}</h1>
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
            <h2>A day with your eyes on the sky.</h2>
            <p>{event.description}</p>
            <p><a href={event.sourceUrl} target="_blank" rel="noreferrer">Official date source ↗</a> · Checked {event.checkedAt}</p>
            <p>Photography is representative and does not confirm aircraft attendance.</p>
            <h2>Aircraft on the programme</h2>
            <p>
              {lineup.length ? "A partial record of the organiser’s published programme. For past events, this records planned participation, not proof that an aircraft flew." : "No aircraft confirmations recorded yet. See the organiser for the full programme."} Flying is subject to change.
            </p>
            {lineup.map((a) => {
              const plane = aircraft.find((p) => p.slug === a.aircraft)!;
              return (
                <div className="lineup-row" key={a.aircraft}>
                  <Link href={`/aircraft/${plane.slug}/`}>
                    <img src={plane.image} alt={plane.imageAlt} />
                  </Link>
                  <div>
                    <h3>
                      <Link href={`/aircraft/${plane.slug}/`}>
                        {plane.name}
                      </Link>
                    </h3>
                    <p>{a.details}</p>
                    <a href={a.sourceUrl} target="_blank" rel="noreferrer">Programme source ↗</a>
                    <p>Checked {a.checkedAt}</p>
                  </div>
                  <Status status={a.status} />
                </div>
              );
            })}
            <h2>Getting there</h2>
            <p>{event.travel}</p>
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
      </div>
    </main>
  );
}
