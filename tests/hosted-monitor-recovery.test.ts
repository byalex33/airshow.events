import assert from "node:assert/strict";
import { test } from "node:test";
import { runHostedMonitor } from "../lib/hosted-monitor";
import { fakeCollector, memoryStorage, pageText } from "./monitor-fixture";

const sourceUrl = "https://example.com/airshow";
const previous = { sourceKind: "recurring", checkedAt: "2020-01-01T00:00:00Z", programmes: [], hash: "previous-snapshot" };

test("drops a pending Firecrawl batch from the previous collector and collects directly", async () => {
  const { storage, saved } = memoryStorage({ mappedAt: new Date().toISOString(), urls: [sourceUrl], pages: { [sourceUrl]: previous }, batch: { id: "expired-job", urls: [sourceUrl], startedAt: "2020-01-01T00:00:00Z" } });
  assert.equal((await runHostedMonitor(storage, fakeCollector({ [sourceUrl]: pageText("Programme") }).collector)).status, "collected");
  assert.equal(saved().batch, undefined);
});

test("weekly discovery adds sitemap pages and a failed discovery preserves known URLs", async () => {
  const { storage, saved } = memoryStorage({ urls: [sourceUrl], pages: { [sourceUrl]: { ...previous, checkedAt: new Date().toISOString() } } });
  await assert.rejects(runHostedMonitor(storage, fakeCollector({}, undefined, { discover: async () => [] }).collector), /Incomplete discovery/);
  assert.deepEqual(saved().urls, [sourceUrl]);
  assert.equal(saved().mappedAt, undefined);
  const links = [{ url: "https://www.britishairshows.com/duxford?ref=x" }, { url: "https://britishairshows.com/logo.png" }, { url: "https://example.org/other" }];
  await runHostedMonitor(storage, fakeCollector({}, undefined, { discover: async () => links }).collector);
  assert.ok(saved().urls.includes("https://britishairshows.com/duxford"));
  assert.ok(!saved().urls.some((url: string) => /logo|example\.org/.test(url)));
  assert.ok(saved().mappedAt);
});

test("pages beyond the per-run limit or time budget stay due for the next run", async () => {
  const urls = Array.from({ length: 5 }, (_, i) => `${sourceUrl}/${i}`);
  const { storage, saved } = memoryStorage({ mappedAt: new Date().toISOString(), urls, pages: {} });
  const pages = Object.fromEntries(urls.map(url => [url, pageText(url)]));
  const first = fakeCollector(pages, undefined, { maxPages: 2 });
  const result = await runHostedMonitor(storage, first.collector);
  assert.equal(first.fetched.length, 2);
  assert.ok("collection" in result && result.collection?.remaining === 3);
  const second = fakeCollector(pages, undefined, { budgetMs: 0 });
  await runHostedMonitor(storage, second.collector);
  assert.equal(second.fetched.length, 0);
  const third = fakeCollector(pages);
  await runHostedMonitor(storage, third.collector);
  assert.deepEqual(third.fetched.sort(), urls.filter(url => !first.fetched.includes(url)).sort());
  assert.equal(Object.keys(saved().pages).length, 5);
});

test("an unavailable failure archive does not abort collection", async () => {
  const { storage, saved } = memoryStorage({ mappedAt: new Date().toISOString(), urls: [sourceUrl], pages: { [sourceUrl]: previous } });
  const put = storage.put;
  storage.put = (async (...args: Parameters<typeof put>) => {
    if (args[0].startsWith("monitor/failures/")) throw new Error("Archive unavailable");
    return put(...args);
  }) as typeof put;
  assert.equal((await runHostedMonitor(storage, fakeCollector({ [sourceUrl]: new Error("fetch failed") }).collector)).status, "failed");
  assert.deepEqual(saved().pages[sourceUrl], previous);
});
