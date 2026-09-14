"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Countdown,
  DemoNotice,
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
      <section className="hero">
        <img
          className="hero-photo"
          src="/images/red-arrows.jpg"
          alt="Red Arrows banking together, leaving long white smoke trails"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="radar" aria-hidden="true">
          <span />
          <i />
        </div>
        <div className="container hero-content">
          <span className="eyebrow hero-kicker">
            <span className="pulse-dot" /> YOUR NEXT GREAT DAY OUT, ABOVE.
          </span>
          <h1>
            Less scrolling.
            <br />
            More <em>looking up.</em>
          </h1>
          <p>
            Chase the roar. Follow your favourites.
            <br />
            Find your next unforgettable UK airshow.
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
              Explore airshows <Icon name="arrow" />
            </Button>
          </form>
          <div className="hero-suggestions">
            <span>ON YOUR RADAR</span>
            <Link href="/calendar/?category=Warbirds">Warbirds ↗</Link>
            <Link href="/calendar/?admission=Free">Free days out ↗</Link>
            <Link href="/aircraft/red-arrows/">Red Arrows ↗</Link>
          </div>
        </div>
        <div className="hero-caption">
          <span>THE ART OF FORMATION</span>RAF Red Arrows · William Warby
        </div>
        <div className="hero-bottom container">
          <span>
            FIELD NOTES / UK <i /> A DIFFERENT KIND OF WEEKEND
          </span>
          <span>DISCOVER THE SEASON ↓</span>
        </div>
      </section>
      <div className="container">
        <DemoNotice />
        {next && (
          <section className="next-show">
            <div className="next-label">
              <span className="eyebrow">NEXT ON THE HORIZON</span>
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
              <span className="eyebrow">MAKE A DAY OF IT</span>
              <h2>Your next sky-high moment.</h2>
              <p>The big weekends. The hidden gems. A reason to get outside.</p>
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
            <span className="eyebrow">FRESH FROM THE FLIGHTLINE</span>
            <h2>
              Look who’s
              <br />
              coming.
            </h2>
            <p>
              The latest additions to the demo flying programmes. Your
              favourites, one step closer.
            </p>
            <Link className="text-link" href="/aircraft/">
              Explore aircraft & teams <Icon name="arrow" />
            </Link>
            <div className="mini-radar" aria-hidden="true">
              <i />
              <b />
              <span />
            </div>
          </div>
          <div className="announcements">
            {appearances
              .filter((a) => a.status === "confirmed")
              .sort((a, b) => b.announced.localeCompare(a.announced))
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
                          {new Date(
                            a.announced + "T12:00:00Z",
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
