"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AirshowSearch, useToast } from "@/components/experience";
import { ThemeToggle } from "@/components/beui/theme-toggle";
import { NumberTicker } from "@/components/beui/number-ticker";
import {
  aircraft,
  appearances,
  calendarFile,
  dateLabel,
  eventStatus,
  type Airshow,
  type EventStatus,
} from "@/lib/content";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={{
        maskImage: `url(/icons/${name}.svg)`,
        WebkitMaskImage: `url(/icons/${name}.svg)`,
      }}
    />
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Airshow Events home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path
            d="m16 3 3 10 10 7v3l-11-4v7l4 3v1l-6-2-6 2v-1l4-3v-7-0L3 23v-3l10-7z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span>
        Airshow<span className="brand-sub"> Events</span>
      </span>
    </Link>
  );
}
export function Header() {
  const path = usePathname();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="container nav-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <Link className={path === "/" ? "active" : ""} href="/">
              Discover
            </Link>
            <Link
              className={path.startsWith("/calendar") ? "active" : ""}
              href="/calendar/"
            >
              Calendar
            </Link>
            <Link
              className={path.startsWith("/aircraft") ? "active" : ""}
              href="/aircraft/"
            >
              Aircraft
            </Link>
          </nav>
          <div className="header-actions">
            <AirshowSearch />
            <ThemeToggle
              variant="circle-blur"
              start="top-right"
              className="theme-toggle"
              iconClassName="size-5"
            />
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <Brand />
        <p>For the moments that make you look up.</p>
        <Link href="/calendar/">
          Find your next airshow <Icon name="arrow" />
        </Link>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Airshow Events</span>
        <span>Independent. Made for the love of flight.</span>
        <Link href="/contact/">Contact us</Link>
        <Link href="/about/">Sources & photo credits</Link>
      </div>
    </footer>
  );
}
export function DataNotice() {
  return (
    <div className="demo-notice">
      <span className="demo-dot" />
      <span className="whitespace-nowrap">2026 & 2027</span>
      <span>·</span>
      <span>
        Organiser-sourced dates. Coverage is growing; programmes may change.
      </span>
    </div>
  );
}
export function Status({ status }: { status: EventStatus }) {
  return (
    <span className={`status ${status}`}>
      <Icon name={{ confirmed: "check", provisional: "circle-alert", cancelled: "x", completed: "calendar" }[status]} />
      {status}
    </span>
  );
}
export function LiveStatus({ event }: { event: Airshow }) {
  const [status, setStatus] = useState(() => eventStatus(event));
  useEffect(() => {
    setStatus(eventStatus(event));
  }, [event]);
  return <Status status={status} />;
}
export function EventCard({
  event,
  list = false,
}: {
  event: Airshow;
  list?: boolean;
}) {
  const count = appearances.filter(
    (a) => a.event === event.slug && a.status === "confirmed",
  ).length;
  return (
    <article className={`event-card ${list ? "event-list-item" : ""}`}>
      <div className="card-image">
        <Link
          href={`/airshows/${event.slug}/`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src={event.image} alt="" loading="lazy" />
        </Link>
        <LiveStatus event={event} />
      </div>
      <div className="card-content">
        <div className="event-date-label">
          <Icon name="calendar" />
          <time dateTime={event.start}>{dateLabel(event)}</time>
          <span className="event-date-year">{event.start.slice(0, 4) === event.end.slice(0, 4) ? event.start.slice(0, 4) : `${event.start.slice(0, 4)} / ${event.end.slice(0, 4)}`}</span>
        </div>
        <h3>
          <Link href={`/airshows/${event.slug}/`}>{event.name}</Link>
        </h3>
        <div className="event-tags">
          <span className="event-tag tag-location">
            <Icon name="pin" />
            {event.location}
          </span>
          <span className={`event-tag ${event.admission === "Free" ? "tag-free" : "tag-ticket"}`}>
            <Icon name={event.admission === "Free" ? "check" : "ticket"} />
            {event.admission === "Free" ? "Free entry" : event.admission}
          </span>
          <span className={`event-tag tag-${event.venue.toLowerCase()}`}>
            <Icon name={{ Airfield: "plane", Seafront: "waves", Estate: "house" }[event.venue]} />
            {event.venue}
          </span>
        </div>
        <div className="card-bottom">
          <span>
            {count > 0 ? `${count} programme records` : "No aircraft records yet"}
            <Icon name="arrow" />
          </span>
        </div>
      </div>
    </article>
  );
}
export function AircraftCard({ slug }: { slug: string }) {
  const plane = aircraft.find((a) => a.slug === slug)!;
  const count = appearances.filter((a) => a.aircraft === slug).length;
  return (
    <Link className="aircraft-card" href={`/aircraft/${plane.slug}/`}>
      <img src={plane.image} alt={plane.imageAlt} loading="lazy" />
      <div>
        <span className="event-tag tag-airfield"><Icon name="plane" />{plane.category}</span>
        <h3>{plane.name}</h3>
        <p>
          <span>
            <NumberTicker value={count} /> programme records
          </span>{" "}
          <Icon name="arrow" />
        </p>
      </div>
    </Link>
  );
}
export function ExportButton({
  source,
  label = "Export calendar",
}: {
  source: Airshow[];
  label?: string;
}) {
  const showToast = useToast();
  function download() {
    const eligible = source.filter(
      (e) => !["cancelled", "completed"].includes(eventStatus(e)),
    );
    if (!eligible.length) {
      showToast({
        title: "No upcoming events to export",
        description:
          "Choose a confirmed or provisional event that has not finished.",
        status: "info",
      });
      return;
    }
    const url = URL.createObjectURL(
      new Blob([calendarFile(eligible)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "airshow-events.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast({
      title: "Calendar exported",
      description: `${eligible.length} ${eligible.length === 1 ? "event" : "events"} ready to add to your calendar.`,
      status: "success",
    });
  }
  return (
    <div className="export-control">
      <Button variant="outline" onClick={download}>
        <Icon name="calendar" />
        {label}
      </Button>
    </div>
  );
}
export function Countdown({ event }: { event: Airshow }) {
  const [label, setLabel] = useState("Getting ready for take-off");
  useEffect(() => {
    const update = () => {
      const status = eventStatus(event);
      if (status === "cancelled" || status === "completed") {
        setLabel(`Event ${status}`);
        return;
      }
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Europe/London",
      });
      const days = Math.ceil(
        (Date.parse(event.start + "T00:00:00Z") -
          Date.parse(today + "T00:00:00Z")) /
          86400000,
      );
      setLabel(
        days > 0
          ? `${days} ${days === 1 ? "day" : "days"} to go`
          : "Happening now",
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [event]);
  return (
    <span className="countdown">
      <span className="pulse-dot" />
      {/^[0-9]+ /.test(label) ? (
        <span>
          <NumberTicker
            value={Number(label.split(" ")[0])}
            startOnView={false}
          />{" "}
          {label.split(" ").slice(1).join(" ")}
        </span>
      ) : (
        label
      )}
    </span>
  );
}
