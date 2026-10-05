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

test("discovered aircraft use an imported photo for their type and a placeholder otherwise", () => {
  const catalog = publishedCatalog(state({ ...programme, aircraft: [plane, { ...plane, name: "Avro Lancaster", variant: "B I", operator: "RAF", evidence: "Avro Anson confirmed" }] }));
  const lancaster = catalog.aircraft.find(a => a.name === "Avro Lancaster · B I")!;
  assert.equal(lancaster.image, "/images/aircraft/lancaster.webp");
  assert.equal(lancaster.imageCredit, "Cpl Phil Major ABIPP");
  assert.equal(catalog.aircraft.find(a => a.name === "Avro Anson · Mk I")!.image, "/images/aircraft-placeholder.svg");
});

test("serves only valid Commons photos from monitor state", () => {
  const photo = { image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Anson.jpg/1600px-Anson.jpg", imageSource: "https://commons.wikimedia.org/wiki/File:Anson.jpg", imageCredit: "Example", imageLicense: "CC BY 4.0", imageLicenseUrl: "https://creativecommons.org/licenses/by/4.0", imageAlt: "Avro Anson, representative photograph" };
  const image = (stored: unknown) => publishedCatalog({ ...state(), photos: { avroanson: { checkedAt: "2026-10-01T00:00:00Z", photo: stored } } }).aircraft.find(a => a.name === "Avro Anson · Mk I")!.image;
  assert.equal(image(photo), photo.image);
  for (const bad of [{ ...photo, image: "https://example.com/anson.jpg" }, { ...photo, imageLicense: "GFDL" }, { ...photo, imageCredit: "" }, null]) assert.equal(image(bad), "/images/aircraft-placeholder.svg");
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
  const photo = { image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Avro.anson.arp.jpg", imageSource: "https://commons.wikimedia.org/wiki/File:Avro.anson.arp.jpg", imageCredit: "Wikimedia Commons", imageLicense: "Public domain", imageLicenseUrl: "https://commons.wikimedia.org/wiki/File:Avro.anson.arp.jpg", imageAlt: "Avro Anson, representative photograph" };
  const looked: string[] = [];
  const lookup = async (name: string) => { looked.push(name); return photo; };
  await runHostedMonitor(true, storage, lookup);
  const catalog = await readCatalog(storage);
  assert.equal(catalog.aircraft.find(a => a.name.includes("Anson"))?.image, photo.image);
  const saved = JSON.parse(blobs.get("monitor/state.json")!);
  saved.batch = { id: "job2", urls: [url], startedAt: "2026-09-22T01:00:00Z" };
  blobs.set("monitor/state.json", JSON.stringify(saved)); valid = false;
  await runHostedMonitor(true, storage, lookup);
  assert.deepEqual(await readCatalog(storage), catalog);
  assert.deepEqual(looked, ["Avro Anson"]);
});

test("storage failures keep bundled pages usable", async () => {
  assert.deepEqual(await readCatalog({ get: async () => { throw new Error("offline"); } }), seedCatalog);
});
