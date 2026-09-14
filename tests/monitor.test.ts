import assert from "node:assert/strict";
import { test } from "node:test";
import { isDue } from "../scripts/check-airshows";

test("weekly checks become daily in the final week and stop after the event", () => {
  const now = new Date("2026-09-14T12:00:00Z");
  const distant = { start: "2026-10-04", end: "2026-10-04" };
  const near = { start: "2026-09-20", end: "2026-09-21" };
  assert.equal(isDue(distant, undefined, now), true);
  assert.equal(isDue(distant, "2026-09-08T12:00:00Z", now), false);
  assert.equal(isDue(distant, "2026-09-07T12:00:00Z", now), true);
  assert.equal(isDue(near, "2026-09-13T12:00:00Z", now), true);
  assert.equal(isDue(near, "2026-09-14T08:00:00Z", now), false);
  assert.equal(isDue({ start: "2026-09-12", end: "2026-09-13" }, undefined, now), false);
  assert.equal(isDue({ start: "2026-09-12", end: "2026-09-14" }, undefined, now), true);
});
