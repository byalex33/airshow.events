"use client";
import { useCatalog } from "@/components/catalog-provider";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { flushSync } from "react-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/beui/tabs";
import { DataNotice, EventCard, ExportButton, Icon } from "@/components/site";
import { Button } from "@/components/ui/button";
import {
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
} from "@/components/beui/select-morph";
import { NumberTicker } from "@/components/beui/number-ticker";
import { TextReveal } from "@/components/beui/text-reveal";
import {
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
export default function Calendar() {
  const params = useSearchParams();
  const filters = useMemo<Filters>(
    () => ({
      ...emptyFilters,
      ...Object.fromEntries(
        Object.keys(emptyFilters).map((key) => [
          key,
          params.get(key === "query" ? "q" : key) || "",
        ]),
      ),
    }),
    [params],
  );
  const display = params.get("view");
  const view = display && ["cards", "list", "map"].includes(display)
    ? display
    : "cards";

  // The URL is the source of truth for links, history and local edits.
  // Writing only from user actions avoids effects overwriting navigation.
  function replaceParams(next: URLSearchParams) {
    const query = next.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? "?" + query : ""}${window.location.hash}`,
    );
  }
  function setFilters(next: Filters) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      const param = key === "query" ? "q" : key;
      if (value) params.set(param, value);
      else params.delete(param);
    }
    replaceParams(params);
  }
  function setView(next: string) {
    const params = new URLSearchParams(window.location.search);
    if (next === "cards") params.delete("view");
    else params.set("view", next);
    replaceParams(params);
  }
  const catalog = useCatalog();
  const { aircraft } = catalog;
  const results = useMemo(() => filterEvents(filters, events, undefined, catalog), [filters, catalog]);
  const active = Object.values(filters).filter(Boolean).length;
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "search_airshows",
      description:
        "Set the visible airshow search text, keeping the current filters, and return matching events.",
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
        return filterEvents(next, events, undefined, catalog).map((e) => ({
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
  }, [filters, catalog]);
  function select(key: keyof Filters, label: string, options: string[]) {
    return (
      <div className="filter-field">
        <span>{label}</span>
        <MorphSelect
          label={label}
          value={filters[key]}
          onValueChange={(value) => setFilters({ ...filters, [key]: value })}
          className="airshow-select"
        >
          <MorphSelectTrigger>
            <MorphSelectValue placeholder={`All ${label.toLowerCase()}`} />
          </MorphSelectTrigger>
          <MorphSelectContent>
            <MorphSelectItem value="">{`All ${label.toLowerCase()}`}</MorphSelectItem>
            {options.map((o) => (
              <MorphSelectItem key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </MorphSelectItem>
            ))}
          </MorphSelectContent>
        </MorphSelect>
      </div>
    );
  }
  return (
    <div className="container page-main">
      <DataNotice />
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE UK, FROM THE FLIGHTLINE</span>
          <TextReveal as="h1" text="Find your next airshow." stagger={0.05} />
          <p>
            From a seaside afternoon to a full weekend of flying. Find your kind
            of show.
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
            <strong>
              <NumberTicker
                value={results.length}
                startOnView={false}
                duration={0.4}
              />
            </strong>{" "}
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
          {results.length === 0 ? (
            <div className="empty-state">
              <Icon name="search" />
              <h2>Nothing on this radar yet.</h2>
              <p>
                Try another location or clear a filter to see more airshows.
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
        Flying programmes can change. Calendar exports include upcoming events
        only.
      </p>
    </div>
  );
}
