import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { events, appearances } from "../lib/content";
import { pageDue, runHostedMonitor } from "../lib/hosted-monitor";
import { fakeCollector, memoryStorage, pageText } from "./monitor-fixture";


test("JSON-LD dates are persisted even when the page text is unchanged", async () => {
  const url = "https://example.com/airshow";
  const html = '<script type="application/ld+json">{"@type":"Event","name":"Test airshow","startDate":"2026-09-22","location":{"name":"Airfield"}}</script>';
  const text = pageText("Airshow dates announced. Aircraft programme to follow.");
  const hash = createHash("sha256").update(text).digest("hex");
  const { storage, saved, keys } = memoryStorage({ mappedAt: new Date().toISOString(), urls: [url], pages: { [url]: { checkedAt: "2020-09-20T07:10:00Z", programmes: [], hash } } });
  const { collector, extracted } = fakeCollector({});
  collector.fetchSource = async () => ({ text, html });
  assert.equal((await runHostedMonitor(storage, collector)).status, "collected");
  assert.deepEqual(saved().pages[url].eventDates, [{ startDate: "2026-09-22", endDate: "2026-09-22" }]);
  assert.equal(saved().pages[url].hash, hash);
  assert.deepEqual(extracted, []);
  assert.equal(keys("monitor/reviews/").length, 0);
  assert.equal(pageDue({ ...saved().pages[url], checkedAt: "2026-09-20T07:10:00Z" }, new Date("2026-09-21T07:00:00Z")), true);
});

test("known official, source and appearance URLs use their associated event dates without stored dates", () => {
  const appearance = appearances[0];
  const event = events.find(event => event.slug === appearance.event)!;
  const now = new Date(`${event.start}T07:00:00Z`);
  const checkedAt = new Date(now.getTime() - 86400000).toISOString();
  const page = { checkedAt, programmes: [] };
  for (const url of [event.officialUrl, event.sourceUrl, appearance.sourceUrl]) {
    assert.equal(pageDue(page, now, url), true, url);
  }
  assert.equal(pageDue(page, now, "https://example.com/unrelated"), false);
  assert.equal(pageDue(page, now), false);
});

test("structured dates schedule ongoing events daily and distant or past events weekly", () => {
  const now = new Date("2026-09-21T07:00:00Z");
  const page = { checkedAt: "2026-09-20T07:10:00Z", programmes: [] };
  for (const [startDate, endDate, expected] of [
    ["2026-09-22", "2026-09-22", true],
    ["2026-09-19", "2026-09-21", true],
    ["2026-09-28", "2026-09-28", true],
    ["2026-09-29", "2026-09-29", false],
    ["2026-09-19", "2026-09-20", false],
  ] as const) {
    assert.equal(pageDue({ ...page, eventDates: [{ startDate, endDate }] }, now), expected);
  }
});

test("hosted collection includes a known source due daily despite empty legacy programmes", async t => {
  const event = events[0];
  const now = new Date(`${event.start}T07:00:00Z`);
  t.mock.timers.enable({ apis: ["Date"], now });
  const url = event.sourceUrl;
  const { storage } = memoryStorage({
    mappedAt: now.toISOString(), urls: [url],
    pages: { [url]: { checkedAt: new Date(now.getTime() - 86400000).toISOString(), programmes: [] } },
  });
  const { collector, fetched } = fakeCollector({ [url]: pageText(event.name) });
  assert.equal((await runHostedMonitor(storage, collector)).status, "collected");
  assert.deepEqual(fetched, [url]);
});
