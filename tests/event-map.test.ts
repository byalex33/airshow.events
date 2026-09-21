import test from "node:test";
import assert from "node:assert/strict";
import { emptyFilters, events, filterEvents } from "../lib/content";
import { groupEventsByCoordinates } from "../lib/event-map";

test("map venues expose every event once, retaining the filtered event order", () => {
  const filtered = filterEvents(emptyFilters, events, "2026-09-21");
  const groups = groupEventsByCoordinates(filtered);
  assert.equal(new Set(groups.map(group => group.coordinates.join(","))).size, groups.length);
  assert.deepEqual(groups.flatMap(group => group.events).map(event => event.slug).sort(), filtered.map(event => event.slug).sort());
  const oldWarden = groups.find(group => group.events.some(event => event.slug === "shuttleworth-season-finale"));
  assert.ok(oldWarden);
  assert.ok(oldWarden.events.some(event => event.end < "2026-09-21"));
  assert.ok(oldWarden.events.some(event => event.start > "2026-09-21"));
  assert.deepEqual(oldWarden.events, filtered.filter(event => event.coordinates.join(",") === oldWarden.coordinates.join(",")));
});

test("map groups contain only supplied events and keep distinct nearby coordinates separate", () => {
  const first = { ...events[0], coordinates: [52, -1] as [number, number] };
  const second = { ...events[1], coordinates: [52, -1.000001] as [number, number] };
  assert.deepEqual(groupEventsByCoordinates([first, second]).map(group => group.events), [[first], [second]]);
  assert.deepEqual(groupEventsByCoordinates([second]).map(group => group.events), [[second]]);
  assert.deepEqual(groupEventsByCoordinates([]), []);
});
