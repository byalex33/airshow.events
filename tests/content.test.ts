import test from "node:test";
import assert from "node:assert/strict";
import { aircraft, appearances, calendarFile, emptyFilters, eventStatus, events, filterEvents, todayUK, upcoming } from "../lib/content";

test("calendar puts nearest upcoming events first and most recently finished events last", () => {
  const make = (slug: string, start: string, end = start) => ({ ...events[0], slug, start, end, status: "confirmed" as const });
  const source = [make("old", "2026-05-01"), make("later", "2027-05-01"), make("recent", "2026-09-12"), make("next", "2026-09-20"), make("ongoing", "2026-09-13", "2026-09-15")];
  assert.deepEqual(filterEvents(emptyFilters, source, "2026-09-14").map(e => e.slug), ["ongoing", "next", "later", "recent", "old"]);
  assert.deepEqual(filterEvents({ ...emptyFilters, status: "completed" }, source, "2026-09-14").map(e => e.slug), ["recent", "old"]);
  assert.equal(source[0].slug, "old");
});

test("sourced content, filters, status rollover and calendar exports", () => {
  assert.equal(new Set(events.map(e => e.slug)).size, events.length);
  for (const e of events) {
    assert.match(e.start, /^202[67]-\d{2}-\d{2}$/);
    assert.ok(e.end >= e.start);
    assert.equal(new URL(e.sourceUrl).protocol, "https:");
    assert.equal(new URL(e.officialUrl).protocol, "https:");
    assert.match(e.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.coordinates.every(Number.isFinite));
    assert.ok(!/demo|invented|illustrative/i.test(e.description));
  }
  assert.equal(new Set(appearances.map(a => a.event + a.aircraft)).size, appearances.length);
  for (const a of appearances) {
    assert.ok(events.some(e => e.slug === a.event));
    assert.ok(aircraft.some(p => p.slug === a.aircraft));
    assert.equal(new URL(a.sourceUrl).protocol, "https:");
    assert.ok(a.details.length > 0);
    assert.match(a.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.ok(filterEvents({ ...emptyFilters, query: "Spitfire" }).some(e => e.slug === "southport-airshow"));
  assert.deepEqual(filterEvents({ ...emptyFilters, region: "South West", admission: "Free", venue: "Seafront", month: "2027-06" }).map(e => e.slug), ["english-riviera-airshow-2027"]);
  assert.ok(filterEvents({ ...emptyFilters, category: "Fast jets" }).some(e => e.slug === "southport-airshow"));
  assert.equal(filterEvents({ ...emptyFilters, query: "not-a-real-airshow" }).length, 0);
  assert.equal(todayUK(new Date("2026-09-14T23:30:00Z")), "2026-09-15");
  const fixture = { ...events[0], slug: "test-event", name: "Test event", start: "2026-09-19", end: "2026-09-20", status: "provisional" as const };
  assert.equal(eventStatus(fixture, "2026-09-21"), "completed");
  assert.equal(eventStatus({ ...fixture, status: "cancelled" }, "2027-01-01"), "cancelled");
  assert.equal(upcoming("2026-09-14")[0].slug, "duxford-flying-finale-2026");
  assert.ok(upcoming("2027-01-01").some(e => e.start.startsWith("2027")));
  const now = new Date("2026-09-14T12:00:00Z");
  const ics = calendarFile([fixture, { ...fixture, name: "Cancelled", status: "cancelled" }, { ...fixture, name: "Past", end: "2026-09-13" }], now);
  assert.ok(ics.includes("DTEND;VALUE=DATE:20260921"));
  assert.ok(ics.includes("SUMMARY:Test event"));
  assert.ok(ics.includes("STATUS:TENTATIVE"));
  assert.ok(ics.includes("UID:test-event@airshow.events"));
  assert.ok(ics.includes("Dates checked"));
  assert.ok(!ics.includes("SUMMARY:Cancelled") && !ics.includes("SUMMARY:Past") && !ics.includes("DEMO"));
  const escaped = calendarFile([{ ...fixture, name: "Comma, semicolon; " + "✈".repeat(40) }], now);
  assert.ok(escaped.includes("Comma\\, semicolon\\;"));
  assert.ok(escaped.split("\r\n").every(line => Buffer.byteLength(line) <= 75));
});
