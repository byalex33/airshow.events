"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/beui/text-reveal";
import {
  Countdown,
  DataNotice,
  EventCard,
  Icon,
  Status,
} from "@/components/site";
import {
  aircraft,
  appearances,
  dateLabel,
  events,
  upcoming,
} from "@/lib/content";
export default function Home() {
  const [shows, setShows] = useState(() => upcoming());
  useEffect(() => setShows(upcoming()), []);
  const next = shows[0];
  return (
    <main id="main">
      <section className="flight-intro container">
        <div className="flight-copy">
          <span className="eyebrow hero-kicker">
            UK AIRSHOWS / 2026 & 2027
          </span>
          <h1>
            <TextReveal text="A good day" stagger={0.06} />
            <TextReveal
              text="to look up."
              delay={0.12}
              stagger={0.06}
              className="hero-reveal-line"
            />
          </h1>
          <p>
            Find your next airshow. Follow the aircraft worth travelling for.
          </p>
          <form className="hero-search" action="/calendar/">
            <Icon name="search" />
            <label className="sr-only" htmlFor="hero-search">
              Search airshows, places or aircraft
            </label>
            <input
              id="hero-search"
              name="q"
              placeholder="Airshow, location or aircraft…"
            />
            <Button type="submit">
              Explore <Icon name="arrow" />
            </Button>
          </form>
          <div className="hero-suggestions">
            <Link href="/calendar/?category=Warbirds">Warbirds</Link>
            <Link href="/calendar/?admission=Free">Free entry</Link>
            <Link href="/aircraft/red-arrows/">Red Arrows</Link>
          </div>
        </div>
        <figure className="flight-frame">
          <img
            src="/images/red-arrows.jpg"
            alt="Red Arrows banking together, leaving long white smoke trails"
            fetchPriority="high"
          />
          <figcaption>
            <span>01 / IN FORMATION</span>
            <span>RAF Red Arrows · William Warby</span>
          </figcaption>
        </figure>
      </section>
      <div className="container">
        <DataNotice />
        {next && (
          <section className="next-show">
            <div className="next-label">
              <span className="eyebrow">UP NEXT</span>
              <Countdown event={next} />
            </div>
            <div className="next-info">
              <h2>{next.name}</h2>
              <p>
                <Icon name="calendar" />
                {dateLabel(next)}
                <span>·</span>
                <Icon name="pin" />
                {next.location}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/airshows/${next.slug}/`}>
                View airshow <Icon name="arrow" />
              </Link>
            </Button>
          </section>
        )}
        <section className="section upcoming-section">
          <div className="section-heading">
            <div>
              <TextReveal
                as="h2"
                text="Upcoming airshows"
                whileInView
                stagger={0.045}
              />
            </div>
            <Link className="text-link" href="/calendar/">
              View full calendar <Icon name="arrow" />
            </Link>
          </div>
          <div className="card-grid">
            {shows.slice(0, 3).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      </div>
      <section className="dispatch-section">
        <div className="container dispatch-grid">
          <div className="dispatch-intro">
            <span className="eyebrow">THE FLIGHTLINE</span>
            <h2>Aircraft programme updates</h2>
            <p>Recently checked organiser programmes, including past events. These are partial records.</p>
            <Link className="text-link" href="/aircraft/">
              Explore aircraft & teams <Icon name="arrow" />
            </Link>
          </div>
          <div className="announcements">
            {appearances
              .filter((a) => a.status === "confirmed")
              .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt))
              .slice(0, 3)
              .map((a) => {
                const plane = aircraft.find((p) => p.slug === a.aircraft)!;
                const event = events.find((e) => e.slug === a.event)!;
                return (
                  <article className="announcement" key={a.event + a.aircraft}>
                    <Link href={`/aircraft/${plane.slug}/`}>
                      <img
                        src={plane.image}
                        alt={plane.imageAlt}
                        loading="lazy"
                      />
                    </Link>
                    <div>
                      <div className="announcement-meta">
                        <Status status="confirmed" />
                        <span>
                          Checked {new Date(
                            a.checkedAt + "T12:00:00Z",
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            timeZone: "UTC",
                          })}
                        </span>
                      </div>
                      <Link href={`/aircraft/${plane.slug}/`}>
                        <h3>{plane.name}</h3>
                      </Link>
                      <Link
                        className="announcement-event"
                        href={`/airshows/${event.slug}/`}
                      >
                        {event.name}
                        <Icon name="arrow" />
                      </Link>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
