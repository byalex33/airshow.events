"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/beui/tabs";
import {
  DemoNotice,
  EventCard,
  ExportButton,
  Icon,
  useSaved,
} from "@/components/site";
import { Button } from "@/components/ui/button";
import {
  aircraft,
  emptyFilters,
  events,
  filterEvents,
  type Filters,
} from "@/lib/content";
const EventMap = dynamic(() => import("@/components/event-map"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading the airshow map…</div>,
});
type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export default function Calendar({
  savedOnly = false,
}: {
  savedOnly?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [view, setView] = useState("cards");
  const { ids, ready } = useSaved();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters({
      ...emptyFilters,
      ...Object.fromEntries(
        Object.keys(emptyFilters).map((key) => [
          key,
          params.get(key === "query" ? "q" : key) || "",
        ]),
      ),
    });
    const display = params.get("view");
    if (display && ["cards", "list", "map"].includes(display)) setView(display);
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters))
      if (value) params.set(key === "query" ? "q" : key, value);
    if (view !== "cards") params.set("view", view);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${params.size ? "?" + params.toString() : ""}`,
    );
  }, [filters, view, loaded]);
  const source = useMemo(
    () => (savedOnly ? events.filter((e) => ids.includes(e.slug)) : events),
    [savedOnly, ids],
  );
  const results = useMemo(
    () => filterEvents(filters, source),
    [filters, source],
  );
  const active = Object.values(filters).filter(Boolean).length;
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "search_airshows",
      description:
        "Set the visible airshow search text, keeping the current filters, and return matching demo events.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", maxLength: 200 } },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        if (
          !input ||
          typeof input !== "object" ||
          !("query" in input) ||
          typeof input.query !== "string" ||
          input.query.length > 200 ||
          Object.keys(input).some((k) => k !== "query")
        )
          throw new Error(
            "Provide only a query string of up to 200 characters.",
          );
        const next = { ...filters, query: input.query };
        flushSync(() => setFilters(next));
        return filterEvents(next, source).map((e) => ({
          name: e.name,
          slug: e.slug,
          start: e.start,
        }));
      },
    };
    try {
      Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [filters, source]);
  function select(key: keyof Filters, label: string, options: string[]) {
    return (
      <label className="filter-field">
        <span>{label}</span>
        <select
          value={filters[key]}
          onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
        >
          <option value="">All {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <main id="main" className="container page-main">
      <DemoNotice />
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {savedOnly
              ? "YOUR PERSONAL FLIGHT PLAN"
              : "THE UK, FROM THE FLIGHTLINE"}
          </span>
          <h1>{savedOnly ? "My airshows." : "Find your next airshow."}</h1>
          <p>
            {savedOnly
              ? "Your favourites, saved on this device. A season worth making time for."
              : "From a seaside afternoon to a full weekend of flying. Find your kind of show."}
          </p>
        </div>
        <ExportButton source={results} />
      </div>
      <section
        className="calendar-tools"
        aria-label="Search and filter airshows"
      >
        <label className="calendar-search">
          <Icon name="search" />
          <span className="sr-only">Search airshows</span>
          <input
            aria-label="Search airshows"
            value={filters.query}
            placeholder="Search airshows, places or aircraft…"
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
          {filters.query && (
            <button
              onClick={() => setFilters({ ...filters, query: "" })}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>
        <div className="filter-grid">
          {select(
            "region",
            "Regions",
            [...new Set(events.map((e) => e.region))].sort(),
          )}
          <label className="filter-field">
            <span>Date</span>
            <input
              aria-label="Event month"
              type="month"
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
            />
          </label>
          {select("admission", "Admission", ["Free", "Ticketed"])}
          {select("venue", "Venues", ["Airfield", "Seafront", "Estate"])}
          {select("category", "Aircraft", [
            ...new Set(aircraft.map((a) => a.category)),
          ])}
          {select("status", "Status", [
            "confirmed",
            "provisional",
            "cancelled",
            "completed",
          ])}
        </div>
      </section>
      <Tabs value={view} onValueChange={setView} variant="segment">
        <div className="results-toolbar">
          <div aria-live="polite">
            <strong>{results.length}</strong>{" "}
            {results.length === 1 ? "airshow" : "airshows"}
            {active > 0 && (
              <button
                className="reset-filters"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters ({active})
              </button>
            )}
          </div>
          <TabsList className="view-tabs">
            {["cards", "list", "map"].map((v) => (
              <TabsTrigger key={v} value={v} className="view-trigger">
                <Icon name={v === "cards" ? "grid" : v} />
                <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={view}>
          {savedOnly && !ready ? (
            <div className="empty-state">Loading saved airshows…</div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <Icon name={savedOnly ? "bookmark" : "search"} />
              <h2>
                {savedOnly && !ids.length
                  ? "Your season starts here."
                  : "Nothing on this radar yet."}
              </h2>
              <p>
                {savedOnly && !ids.length
                  ? "Tap the bookmark on an airshow to keep it here."
                  : "Try another location or clear a filter to see more airshows."}
              </p>
              {active ? (
                <Button onClick={() => setFilters(emptyFilters)}>
                  Clear all filters
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/calendar/">
                    Explore airshows <Icon name="arrow" />
                  </Link>
                </Button>
              )}
            </div>
          ) : view === "map" ? (
            <EventMap events={results} />
          ) : (
            <div
              className={
                view === "list" ? "event-list" : "card-grid calendar-grid"
              }
            >
              {results.map((e) => (
                <EventCard event={e} list={view === "list"} key={e.slug} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <p className="calendar-footnote">
        Flying programmes can change. Saved airshows stay on this browser;
        exports include upcoming events only.
      </p>
    </main>
  );
}
