import test from "node:test";
import assert from "node:assert/strict";
import {
  aircraft,
  appearances,
  calendarFile,
  emptyFilters,
  eventStatus,
  events,
  filterEvents,
  todayUK,
  upcoming,
} from "../lib/content";
test("content relationships, search filters, status rollover and calendar exports", () => {
  assert.equal(new Set(events.map((e) => e.slug)).size, events.length);
  for (const a of appearances) {
    assert.ok(events.some((e) => e.slug === a.event));
    assert.ok(aircraft.some((p) => p.slug === a.aircraft));
  }
  assert.ok(
    filterEvents({ ...emptyFilters, query: "Spitfire" }).some(
      (e) => e.slug === "duxford-battle-of-britain",
    ),
  );
  assert.deepEqual(
    filterEvents({
      ...emptyFilters,
      region: "South West",
      admission: "Free",
      venue: "Seafront",
      category: "Display teams",
      month: "2026-10",
    }).map((e) => e.slug),
    ["coastal-flight-festival"],
  );
  assert.equal(
    filterEvents({ ...emptyFilters, query: "not-a-real-airshow" }).length,
    0,
  );
  assert.equal(todayUK(new Date("2026-09-14T23:30:00Z")), "2026-09-15");
  assert.equal(eventStatus(events[0], "2026-09-21"), "completed");
  assert.equal(eventStatus(events[6], "2027-01-01"), "cancelled");
  assert.equal(upcoming("2026-09-14")[0].slug, "duxford-battle-of-britain");
  assert.equal(upcoming("2027-01-01").length, 0);
  const ics = calendarFile(events, new Date("2026-09-14T12:00:00Z"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20260921"));
  assert.ok(ics.includes("SUMMARY:[DEMO] Duxford"));
  assert.ok(ics.includes("STATUS:TENTATIVE"));
  assert.ok(!ics.includes("Welsh Wings") && !ics.includes("Summer Skies"));
  assert.ok(ics.split("\r\n").every((line) => Buffer.byteLength(line) <= 75));
  const escaped = calendarFile(
    [{ ...events[0], name: "Comma, semicolon; " + "✈".repeat(40) }],
    new Date("2026-09-14T12:00:00Z"),
  );
  assert.ok(escaped.includes("Comma\\, semicolon\\;"));
  assert.ok(
    escaped.split("\r\n").every((line) => Buffer.byteLength(line) <= 75),
  );
});
