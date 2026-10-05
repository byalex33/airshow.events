import assert from "node:assert/strict";
import { test } from "node:test";
import { publishedCatalog, seedCatalog } from "../lib/published-catalog";
import { readCatalog } from "../lib/catalog-storage";
import { events, emptyFilters, filterEvents } from "../lib/content";
import { sitemapEntries } from "../lib/metadata";
import { runHostedMonitor } from "../lib/hosted-monitor";

const event = events.find(e => e.slug === "shuttleworth-season-finale")!;
const plane = { name: "Avro Anson", variant: "Mk I", operator: "Shuttleworth", displayDates: [event.start], status: "confirmed", displayType: "flying", evidence: "Avro Anson confirmed" };
const programme = { eventName: event.name, eventStart: event.start, eventEnd: event.end, announcement: "announced", aircraft: [plane] };
const snapshot = (entry = programme, checkedAt = "2026-09-22T10:00:00Z") => ({ checkedAt, programmes: [entry] });
const state = (entry = programme, sourceUrl = event.officialUrl) => ({ pages: { [sourceUrl]: snapshot(entry) } });

test("publishes sourced aircraft across lineups, discovery, search and sitemap", () => {
  const catalog = publishedCatalog(state());
  const aircraft = catalog.aircraft.find(a => a.name === "Avro Anson · Mk I")!;
  assert.ok(aircraft);
  const record = catalog.appearances.find(a => a.aircraft === aircraft.slug)!;
  assert.equal(record.event, event.slug);
  assert.equal(record.sourceUrl, event.officialUrl);
  assert.match(record.details, /Flying display/);
  assert.equal(record.status, "confirmed");
  assert.equal(filterEvents({ ...emptyFilters, query: "Anson" }, events, "2026-09-22", catalog)[0].slug, event.slug);
  assert.ok(sitemapEntries(catalog.aircraft).some(e => e.url.endsWith(`/aircraft/${aircraft.slug}/`)));
});

test("rejects unknown sources, wrong event identity, wrong year and invalid snapshots", () => {
  for (const data of [state(programme, "https://britishairshows.com/example"), state({ ...programme, eventName: "Another show" }), state({ ...programme, eventStart: "2027-10-04", eventEnd: "2027-10-04" }), state({ ...programme, aircraft: [{ ...plane, displayDates: ["2027-01-01"] }] }), { pages: { [event.officialUrl]: snapshot(programme, "invalid") } }]) {
    assert.deepEqual(publishedCatalog(data), seedCatalog);
  }
});

test("latest valid snapshots replace earlier lineups and preserve cancellation and static display", () => {
  const catalog = publishedCatalog({ pages: {
    [event.officialUrl]: snapshot(programme, "2026-09-20T00:00:00Z"),
    [event.sourceUrl]: snapshot({ ...programme, aircraft: [{ ...plane, status: "cancelled", displayType: "static" }] }),
  } });
  const record = catalog.appearances.find(a => a.event === event.slug)!;
  assert.equal(record.status, "cancelled");
  assert.match(record.details, /Static display/);
  assert.equal(filterEvents({ ...emptyFilters, query: "Anson" }, events, "2026-09-22", catalog).length, 0);
});

test("empty unknown extraction keeps seed data; explicit not-announced removes stale lineup", () => {
  assert.deepEqual(publishedCatalog(state({ ...programme, announcement: "unknown", aircraft: [] })), seedCatalog);
  assert.equal(publishedCatalog(state({ ...programme, announcement: "not-announced", aircraft: [] })).appearances.filter(a => a.event === event.slug).length, 0);
});

test("variants have stable distinct profiles and unknown participation stays unknown", () => {
  const catalog = publishedCatalog(state({ ...programme, aircraft: [plane, { ...plane, variant: "C.19", status: "unknown" }] }));
  const rows = catalog.appearances.filter(a => a.event === event.slug);
  assert.equal(rows.length, 2);
  assert.notEqual(rows[0].aircraft, rows[1].aircraft);
  assert.equal(rows[1].status, "unknown");
  assert.equal(publishedCatalog(state()).appearances.find(a => a.event === event.slug)!.aircraft, rows[0].aircraft);
});

test("completed harvest reaches the reader without a rebuild; failed extraction preserves it", async t => {
  const url = event.officialUrl;
  const blobs = new Map([["monitor/state.json", JSON.stringify({ urls: [url], pages: {}, batch: { id: "job", urls: [url], startedAt: "2026-09-22T00:00:00Z" } })]]);
  type Storage = NonNullable<Parameters<typeof runHostedMonitor>[1]>;
  const storage: Storage = {
    get: (async (path: string) => {
      const body = blobs.get(path);
      return body ? { stream: new Response(body).body, blob: { etag: "fixture" } } : null;
    }) as Storage["get"],
    put: async (path, body) => { blobs.set(path, body as string); return { etag: "fixture", url: path, downloadUrl: path, pathname: path, contentType: "application/json", contentDisposition: "inline" }; },
  };
  let valid = true;
  t.mock.method(globalThis, "fetch", async () => Response.json({ status: "completed", data: [{ metadata: { sourceURL: url }, markdown: plane.evidence, json: valid ? { programmes: [programme] } : null }] }));
  await runHostedMonitor(true, storage);
  const catalog = await readCatalog(storage);
  assert.ok(catalog.aircraft.some(a => a.name.includes("Anson")));
  const saved = JSON.parse(blobs.get("monitor/state.json")!);
  saved.batch = { id: "job2", urls: [url], startedAt: "2026-09-22T01:00:00Z" };
  blobs.set("monitor/state.json", JSON.stringify(saved)); valid = false;
  await runHostedMonitor(true, storage);
  assert.deepEqual(await readCatalog(storage), catalog);
});

test("storage failures keep bundled pages usable", async () => {
  assert.deepEqual(await readCatalog({ get: async () => { throw new Error("offline"); } }), seedCatalog);
});
