import assert from "node:assert/strict";
import { test } from "node:test";
import { pageDue, runHostedMonitor } from "../lib/hosted-monitor";

const historical = "https://www.south-ayrshire.gov.uk/council-news/International-Ayr-Show-Festival-of-Flight-2026-full-flying-display-schedule-announced";
const shared = "https://www.shuttleworth.org/about/about-shuttleworth/news/2026-air-shows-announced";
const page = { checkedAt: "2026-09-14T07:00:00Z", programmes: [], eventDates: [{ startDate: "2026-09-12", endDate: "2026-09-13" }] };
const now = new Date("2026-09-21T07:00:00Z");

test("completed edition-specific official sources stop after their initial extraction", () => {
  assert.equal(pageDue(undefined, now, historical), true);
  assert.equal(pageDue(page, now, historical), false);
  // Legacy snapshots can use the known edition's dates without extracted programmes.
  assert.equal(pageDue({ ...page, eventDates: undefined }, now, historical), false);
  assert.equal(pageDue({ ...page, sourceKind: "edition", eventDates: [] }, now), true);
});

test("recurring discovery, reused landing pages and unclassified year URLs remain due", () => {
  for (const url of ["https://britishairshows.com/duxford-flying-finale", "https://www.iwm.org.uk/airshows", "https://unknown.example/2026-airshow"]) {
    assert.equal(pageDue(page, now, url), true, url);
  }
});

test("an edition source stays active while any known or extracted associated event is upcoming", () => {
  assert.equal(pageDue(page, now, shared), true);
  assert.equal(pageDue({ ...page, checkedAt: "2026-10-03T07:10:00Z" }, new Date("2026-10-04T07:00:00Z"), shared), true);
  assert.equal(pageDue(page, new Date("2026-10-05T07:00:00Z"), shared), false);
  assert.equal(pageDue({ ...page, eventDates: [...page.eventDates, { startDate: "2026-09-22", endDate: "2026-09-22" }] }, now, historical), true);
});

test("hosted scheduling persists source classifications and omits retired editions", async t => {
  t.mock.timers.enable({ apis: ["Date"], now });
  const recurring = "https://britishairshows.com/duxford-flying-finale";
  const fresh = "https://www.shuttleworth.org/events/race-day-air-show-2026";
  const blobs = new Map([["monitor/state.json", JSON.stringify({ mappedAt: now.toISOString(), urls: [historical, recurring, shared, fresh], pages: { [historical]: page, [recurring]: page, [shared]: page } })]]);
  type Storage = NonNullable<Parameters<typeof runHostedMonitor>[1]>;
  const storage: Storage = {
    get: (async (path: string) => {
      const body = blobs.get(path);
      return body ? { stream: new Response(body).body, blob: { etag: "test-etag" } } : null;
    }) as Storage["get"],
    put: async (path, body) => {
      blobs.set(path, body as string);
      return { etag: "test-etag", url: path, downloadUrl: path, pathname: path, contentType: "application/json", contentDisposition: "inline" };
    },
  };
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    assert.ok(url.endsWith("/batch/scrape"));
    assert.deepEqual(JSON.parse(init.body as string).urls, [recurring, shared, fresh]);
    return Response.json({ success: true, id: "active-sources" });
  });
  assert.deepEqual(await runHostedMonitor(false, storage), { status: "submitted", pages: 3 });
  const saved = JSON.parse(blobs.get("monitor/state.json")!);
  assert.equal(saved.pages[historical].sourceKind, "edition");
  assert.equal(saved.pages[shared].sourceKind, "edition");
  assert.equal(saved.pages[recurring].sourceKind, "recurring");
  assert.deepEqual(saved.pages[historical].eventDates, page.eventDates);
  assert.equal(saved.pages[historical].checkedAt, page.checkedAt);
});
