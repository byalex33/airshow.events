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
