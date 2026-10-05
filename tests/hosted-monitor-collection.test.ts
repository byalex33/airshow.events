import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { runHostedMonitor } from "../lib/hosted-monitor";
import { fakeCollector, memoryStorage, pageText } from "./monitor-fixture";

const urls = ["https://example.com/one", "https://example.com/two"];
const text = pageText("Programme to follow");
function fixture(requested = urls) {
  const state = {
    mappedAt: new Date().toISOString(), urls: requested, lastError: "Earlier failure",
    pages: Object.fromEntries(requested.map(url => [url, { checkedAt: "2020-01-01T00:00:00Z", programmes: [], hash: "previous" }])),
  };
  return { state, ...memoryStorage(state) };
}

test("reports partial collection and retains snapshots for pages that fail", async () => {
  const { state, storage, saved, keys } = fixture();
  const { collector } = fakeCollector({ [urls[0]]: text, [urls[1]]: text }, (_, url) => url === urls[1] ? null : { programmes: [] });
  const result = await runHostedMonitor(storage, collector);
  assert.equal(result.status, "partial");
  assert.ok("collection" in result);
  assert.deepEqual(result.collection?.succeeded, [urls[0]]);
  assert.equal(result.collection?.failed[0].url, urls[1]);
  assert.deepEqual(saved().lastCollection, result.collection);
  assert.deepEqual(saved().pages[urls[1]], { ...state.pages[urls[1]], sourceKind: "recurring" });
  assert.equal(saved().pages[urls[0]].hash, createHash("sha256").update(text).digest("hex"));
  assert.match(saved().lastError, /1 of 2/);
  assert.equal(keys("monitor/failures/").length, 1);
});

for (const failure of [new Error("Source HTTP 403"), pageText("").slice(0, 50)]) {
  test(`reports total failure for ${failure instanceof Error ? "blocked" : "empty"} sources`, async () => {
    const { state, storage, saved, keys } = fixture();
    const { collector, extracted } = fakeCollector({ [urls[0]]: failure, [urls[1]]: failure });
    assert.equal((await runHostedMonitor(storage, collector)).status, "failed");
    assert.deepEqual(saved().pages, Object.fromEntries(Object.entries(state.pages).map(([url, page]) => [url, { ...page, sourceKind: "recurring" }])));
    assert.deepEqual(saved().lastCollection.failed.map((f: { url: string }) => f.url).sort(), urls);
    assert.match(saved().lastError, /2 of 2/);
    assert.equal(keys("monitor/failures/").length, 2);
    assert.deepEqual(extracted, []);
  });
}

test("full success clears errors, counts each URL once and writes reviews for changed pages", async () => {
  const { storage, saved, keys } = fixture([urls[0], urls[0], urls[1]]);
  const { collector, fetched } = fakeCollector({ [urls[0]]: text, [urls[1]]: text });
  assert.equal((await runHostedMonitor(storage, collector)).status, "collected");
  assert.deepEqual(fetched.sort(), urls);
  assert.deepEqual(saved().lastCollection.succeeded.sort(), urls);
  assert.equal(saved().lastError, undefined);
  assert.equal(keys("monitor/reviews/").length, 2);
  assert.equal(keys("monitor/failures/").length, 0);
});

test("unchanged text keeps programmes without another model call", async () => {
  const programme = { eventName: "Show", eventStart: "2026-10-04", eventEnd: "2026-10-04", announcement: "unknown", aircraft: [] };
  const hash = createHash("sha256").update(text).digest("hex");
  const { storage, saved, keys } = memoryStorage({ mappedAt: new Date().toISOString(), urls: [urls[0]], pages: { [urls[0]]: { checkedAt: "2020-01-01T00:00:00Z", programmes: [programme], hash } } });
  const { collector, extracted } = fakeCollector({ [urls[0]]: text });
  assert.equal((await runHostedMonitor(storage, collector)).status, "collected");
  assert.deepEqual(extracted, []);
  assert.deepEqual(saved().pages[urls[0]].programmes, [programme]);
  assert.notEqual(saved().pages[urls[0]].checkedAt, "2020-01-01T00:00:00Z");
  assert.equal(keys("monitor/reviews/").length, 0);
});

test("misquoted evidence is retried once and rejected if the retry also misquotes", async () => {
  const plane = (evidence: string) => ({ name: "Spitfire", variant: null, operator: null, displayDates: [], status: "confirmed", displayType: "flying", evidence });
  const extraction = (evidence: string) => ({ programmes: [{ eventName: "Show", eventStart: "2026-10-04", eventEnd: "2026-10-04", announcement: "announced", aircraft: [plane(evidence)] }] });
  const source = pageText("Spitfire confirmed for Sunday.");
  let calls = 0;
  const retried = fixture([urls[0]]);
  const recovered = fakeCollector({ [urls[0]]: source }, () => extraction(++calls === 1 ? "Spitfire ... Sunday" : "Spitfire confirmed for Sunday"));
  assert.equal((await runHostedMonitor(retried.storage, recovered.collector)).status, "collected");
  assert.equal(recovered.extracted.length, 2);
  assert.equal(retried.saved().pages[urls[0]].programmes[0].aircraft[0].name, "Spitfire");
  const rejected = fixture([urls[0]]);
  const misquoted = fakeCollector({ [urls[0]]: source }, () => extraction("Spitfire ... Sunday"));
  assert.equal((await runHostedMonitor(rejected.storage, misquoted.collector)).status, "failed");
  assert.equal(misquoted.extracted.length, 2);
  assert.match(rejected.saved().lastCollection.failed[0].error, /unsupported aircraft record/);
});

test("a failed collection is retried while its error is kept until a successful run", async () => {
  const { storage, saved } = fixture([urls[0]]);
  assert.equal((await runHostedMonitor(storage, fakeCollector({ [urls[0]]: new Error("timeout") }).collector)).status, "failed");
  assert.match(saved().lastError, /1 of 1/);
  assert.equal((await runHostedMonitor(storage, fakeCollector({ [urls[0]]: text }).collector)).status, "collected");
  assert.equal(saved().lastError, undefined);
});
