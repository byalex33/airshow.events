"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  aircraft,
  appearances,
  calendarFile,
  dateLabel,
  events,
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
        AIRSHOW<span className="brand-sub">EVENTS</span>
      </span>
    </Link>
  );
}
const SavedContext = createContext({
  ids: [] as string[],
  ready: false,
  toggle: (_id: string) => {},
});
export function SavedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("airshow-saved") || "[]");
      if (Array.isArray(stored))
        setIds(
          stored.filter(
            (s: unknown): s is string =>
              typeof s === "string" && events.some((e) => e.slug === s),
          ),
        );
    } catch {
      setError("Saved airshows are unavailable in this browser.");
    }
    setReady(true);
  }, []);
  function toggle(id: string) {
    if (!ready) return;
    const next = ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id];
    setIds(next);
    try {
      localStorage.setItem("airshow-saved", JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "Saved for this visit only. Your browser could not store this change.",
      );
    }
  }
  return (
    <SavedContext.Provider value={{ ids, ready, toggle }}>
      {children}
      {error && (
        <div className="toast" role="alert">
          {error}
          <button
            onClick={() => setError("")}
            aria-label="Dismiss storage message"
          >
            ×
          </button>
        </div>
      )}
    </SavedContext.Provider>
  );
}
export const useSaved = () => useContext(SavedContext);
export function Header() {
  const path = usePathname();
  const { ids } = useSaved();
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
              Airshow calendar
            </Link>
            <Link
              className={path.startsWith("/aircraft") ? "active" : ""}
              href="/aircraft/"
            >
              Aircraft & teams
            </Link>
          </nav>
          <Link
            className={`saved-nav ${path === "/saved/" ? "active" : ""}`}
            href="/saved/"
          >
            <Icon name="bookmark" />
            <span>My airshows</span>
            <small>{ids.length}</small>
          </Link>
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
        <Link href="/about/">About this demo & photo credits</Link>
      </div>
    </footer>
  );
}
export function DemoNotice() {
  return (
    <div className="demo-notice">
      <span className="demo-dot" /><span className="whitespace-nowrap">Demo season</span><span>·</span><span>Illustrative
      dates and aircraft. Check organisers before making plans.</span>
    </div>
  );
}
export function Status({ status }: { status: EventStatus }) {
  return (
    <span className={`status ${status}`}>
      <i />
      {status}
    </span>
  );
}
export function LiveStatus({ event }: { event: Airshow }) {
  const [status, setStatus] = useState(event.status);
  useEffect(() => {
    setStatus(eventStatus(event));
  }, [event]);
  return <Status status={status} />;
}
export function SaveButton({
  event,
  compact = false,
}: {
  event: Airshow;
  compact?: boolean;
}) {
  const { ids, toggle, ready } = useSaved();
  const saved = ids.includes(event.slug);
  return (
    <Button
      variant="outline"
      disabled={!ready}
      aria-label={`${saved ? "Unsave" : "Save"} ${event.name}`}
      aria-pressed={saved}
      onClick={() => toggle(event.slug)}
      className={`save-button ${compact ? "compact" : ""} ${saved ? "is-saved" : ""}`}
    >
      <Icon name="bookmark" />
      {!compact && (saved ? "Airshow saved" : "Save airshow")}
    </Button>
  );
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
        <SaveButton event={event} compact />
      </div>
      <div className="card-content">
        <div className="card-date">
          <Icon name="calendar" />
          {dateLabel(event)} <span>{event.start.slice(0, 4)}</span>
        </div>
        <h3>
          <Link href={`/airshows/${event.slug}/`}>{event.name}</Link>
        </h3>
        <p className="location">
          <Icon name="pin" />
          {event.location}
        </p>
        <div className="card-bottom">
          <span>
            {event.admission === "Free" ? "Free entry" : event.admission}
            <b>·</b>
            {event.venue}
          </span>
          <span>
            {count > 0 ? `${count} confirmed` : "Line-up to come"}
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
        <span className="eyebrow">{plane.category}</span>
        <h3>{plane.name}</h3>
        <p>
          {count} appearances in the demo calendar <Icon name="arrow" />
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
  const [message, setMessage] = useState("");
  function download() {
    const eligible = source.filter(
      (e) => !["cancelled", "completed"].includes(eventStatus(e)),
    );
    if (!eligible.length) {
      setMessage("No upcoming events to export.");
      return;
    }
    const url = URL.createObjectURL(
      new Blob([calendarFile(eligible)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "airshow-events-demo.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      `${eligible.length} demo ${eligible.length === 1 ? "event" : "events"} exported.`,
    );
  }
  return (
    <div className="export-control">
      <Button variant="outline" onClick={download}>
        <Icon name="calendar" />
        {label}
      </Button>
      <span role="status">{message}</span>
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
      {label}
    </span>
  );
}
