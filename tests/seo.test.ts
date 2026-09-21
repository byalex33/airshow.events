import assert from "node:assert/strict";
import { test } from "node:test";
import { events } from "../lib/content";
import { airshowCollections, collectionsForEvent } from "../lib/discovery";
import { breadcrumbData, collectionData, eventData, eventTitle, serializeJsonLd } from "../lib/structured-data";
import sitemap from "../app/sitemap";
import { siteUrl } from "../lib/metadata";

test("structured events preserve sourced dates, location and cancellation without inventing offers", () => {
  for (const event of events) {
    const data = eventData(event);
    assert.equal(data.startDate, event.start);
    assert.equal(data.endDate, event.end);
    assert.equal(data.name, eventTitle(event));
    assert.equal(data.location.address.addressCountry, "GB");
    assert.equal(data.location.name, event.location);
    assert.equal(data.isAccessibleForFree, event.admission === "Free");
    assert(data.image.every((url) => url.startsWith(`${siteUrl}/`)));
    assert.equal("offers" in data, false);
    assert.equal("performer" in data, false);
    assert.equal("organizer" in data, false);
  }
  assert.equal(eventData({ ...events[0], status: "cancelled" }).eventStatus, "https://schema.org/EventCancelled");
  assert.equal("eventStatus" in eventData({ ...events[0], status: "provisional" }), false);
  assert.equal(eventData({ ...events[0], status: "completed" }).eventStatus, "https://schema.org/EventScheduled");
  assert.equal("postalCode" in eventData({ ...events[0], postcode: "" }).location.address, false);
});

test("JSON-LD cannot terminate its script element, while source text survives parsing", () => {
  const payload = { name: '</script><script>alert("injection")</script>', description: "< & >" };
  const result = serializeJsonLd(payload);
  assert.equal(result.includes("<"), false);
  assert.deepEqual(JSON.parse(result), payload);
});

test("collection pages contain matching records and every event has a season route", () => {
  const collections = airshowCollections();
  assert.equal(new Set(collections.map((item) => item.slug)).size, collections.length);
  for (const collection of collections) {
    assert(collection.events.length > 0);
    assert.equal(new Set(collection.events.map((item) => item.slug)).size, collection.events.length);
    if (/^\d{4}$/.test(collection.slug)) assert(collection.events.every((event) => event.start.startsWith(collection.slug)));
    if (collection.slug === "free") assert(collection.events.every((event) => event.admission === "Free"));
    const data = collectionData(collection.title, `/calendar/${collection.slug}/`, collection.events);
    assert.deepEqual(data.mainEntity.itemListElement.map((item) => item.url), collection.events.map((event) => `${siteUrl}/airshows/${event.slug}/`));
    assert.equal(data.mainEntity.numberOfItems, collection.events.length);
  }
  for (const event of events) assert(collectionsForEvent(event).some((collection) => collection.slug === event.start.slice(0, 4)));
});

test("sitemap lists canonical collections and local images without fictitious modification dates", () => {
  const entries = sitemap();
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  for (const collection of airshowCollections()) assert(entries.some((entry) => entry.url === `${siteUrl}/calendar/${collection.slug}/`));
  for (const entry of entries) {
    assert.equal(new URL(entry.url).search, "");
    assert(entry.url.endsWith("/"));
    assert.equal(entry.lastModified, undefined);
  }
  for (const event of events) assert.deepEqual(entries.find((entry) => entry.url === `${siteUrl}/airshows/${event.slug}/`)?.images, [`${siteUrl}${event.image}`]);
  const breadcrumbs = breadcrumbData([{ name: "Home", path: "/" }, { name: "Calendar", path: "/calendar/" }]);
  assert.deepEqual(breadcrumbs.itemListElement.map((item) => [item.position, item.item]), [[1, `${siteUrl}/`], [2, `${siteUrl}/calendar/`]]);
});
