import assert from "node:assert/strict";
import { test } from "node:test";
import { pageDue } from "../lib/hosted-monitor";
import { GET } from "../app/api/cron/airshows/route";

test("hosted monitor rejects unauthenticated calls and schedules near events daily", async () => {
  assert.equal((await GET(new Request("https://example.com/api/cron/airshows/"))).status, 401);
  const now = new Date("2026-09-14T12:00:00Z");
  assert.equal(pageDue(undefined, now), true);
  assert.equal(pageDue({ checkedAt: "2026-09-13T12:00:00Z", programmes: [] }, now), false);
  assert.equal(pageDue({ checkedAt: "2026-09-07T12:00:00Z", programmes: [] }, now), true);
  assert.equal(pageDue({ checkedAt: "2026-09-13T12:00:00Z", programmes: [{ eventName: "Test", eventStart: "2026-09-20", eventEnd: "2026-09-20", announcement: "unknown", aircraft: [] }] }, now), true);
});


test("daily checks are due at 07:00 UTC after a delayed webhook the previous day", () => {
  const page = { checkedAt: "2026-09-20T07:10:00Z", programmes: [{ eventName: "Test", eventStart: "2026-09-22", eventEnd: "2026-09-22", announcement: "unknown" as const, aircraft: [] }] };
  assert.equal(pageDue(page, new Date("2026-09-20T18:00:00Z")), false);
  assert.equal(pageDue(page, new Date("2026-09-21T07:00:00Z")), true);
  assert.equal(page.checkedAt, "2026-09-20T07:10:00Z");
});

test("weekly checks return on the seventh UTC calendar day despite webhook latency", () => {
  const page = { checkedAt: "2026-09-14T07:10:00Z", programmes: [] };
  assert.equal(pageDue(page, new Date("2026-09-14T23:59:59Z")), false);
  assert.equal(pageDue(page, new Date("2026-09-20T07:00:00Z")), false);
  assert.equal(pageDue(page, new Date("2026-09-21T07:00:00Z")), true);
  assert.equal(pageDue({ ...page, checkedAt: "2026-09-21T07:10:00Z" }, new Date("2026-09-21T12:00:00Z")), false);
});

test("daily and weekly checks keep UTC cadence across both London DST transitions", () => {
  for (const [previous, current, eventDate, previousWeek] of [
    ["2026-03-28", "2026-03-29", "2026-03-30", "2026-03-22"],
    ["2026-10-24", "2026-10-25", "2026-10-26", "2026-10-18"],
  ]) {
    const now = new Date(`${current}T07:00:00Z`);
    assert.equal(pageDue({ checkedAt: `${previous}T07:10:00Z`, programmes: [{ eventName: "Test", eventStart: eventDate, eventEnd: eventDate, announcement: "unknown", aircraft: [] }] }, now), true);
    assert.equal(pageDue({ checkedAt: `${previousWeek}T07:10:00Z`, programmes: [] }, now), true);
  }
});
