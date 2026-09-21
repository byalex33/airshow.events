import assert from "node:assert/strict";
import { test } from "node:test";
import { runHostedMonitor } from "../lib/hosted-monitor";

type Storage = NonNullable<Parameters<typeof runHostedMonitor>[1]>;
const urls = ["https://example.com/one", "https://example.com/two"];
const valid = (url: string) => ({ metadata: { sourceURL: url }, markdown: "Programme to follow", json: { programmes: [] } });
function fixture(requested = urls) {
  const state = {
    mappedAt: new Date().toISOString(), urls: requested, lastError: "Earlier failure",
    pages: Object.fromEntries(requested.map(url => [url, { checkedAt: "2020-01-01T00:00:00Z", programmes: [], hash: "previous" }])),
    batch: { id: "completed-job", urls: requested, startedAt: new Date().toISOString() },
  };
  const blobs = new Map([["monitor/state.json", JSON.stringify(state)]]);
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
  return { state, blobs, storage, saved: () => JSON.parse(blobs.get("monitor/state.json")!) };
}

for (const harvestOnly of [true, false]) {
  test(`reports partial collection and retains invalid snapshots for ${harvestOnly ? "webhook" : "cron"}`, async t => {
    const { state, blobs, storage, saved } = fixture();
    t.mock.method(globalThis, "fetch", async () => Response.json({ status: "completed", data: [valid(urls[0]), { ...valid(urls[1]), json: null }] }));
    const result = await runHostedMonitor(harvestOnly, storage);
    assert.equal(result.status, "partial");
    assert.ok("collection" in result);
    assert.deepEqual(result.collection?.succeeded, [urls[0]]);
    assert.equal(result.collection?.failed[0].url, urls[1]);
    assert.deepEqual(saved().lastCollection, result.collection);
    assert.deepEqual(saved().pages[urls[1]], { ...state.pages[urls[1]], sourceKind: "recurring" });
    assert.notEqual(saved().pages[urls[0]].hash, "previous");
    assert.match(saved().lastError, /1 of 2/);
    assert.equal(saved().batch, undefined);
    assert.equal([...blobs.keys()].filter(path => path.startsWith("monitor/failures/")).length, 1);
  });
}

for (const missing of [false, true]) {
  test(`reports total failure for ${missing ? "missing" : "invalid"} documents`, async t => {
    const { state, blobs, storage, saved } = fixture();
    t.mock.method(globalThis, "fetch", async () => Response.json({ status: "completed", data: missing ? [] : urls.map(url => ({ ...valid(url), json: null })) }));
    const result = await runHostedMonitor(true, storage);
    assert.equal(result.status, "failed");
    assert.deepEqual(saved().pages, Object.fromEntries(Object.entries(state.pages).map(([url, page]) => [url, { ...page, sourceKind: "recurring" }])));
    assert.deepEqual(saved().lastCollection.succeeded, []);
    assert.deepEqual(saved().lastCollection.failed.map((failure: { url: string }) => failure.url), urls);
    assert.match(saved().lastError, /2 of 2/);
    assert.equal(saved().batch, undefined);
    const failures = [...blobs.entries()].filter(([path]) => path.startsWith("monitor/failures/"));
    assert.equal(failures.length, 2);
    if (missing) for (const [, body] of failures) assert.match(JSON.parse(body).error, /missing/);
  });
}

test("accounts for missing URLs across pagination and ignores unrelated documents", async t => {
  const { storage, saved } = fixture();
  t.mock.method(globalThis, "fetch", async (url: string) => Response.json(url.includes("?skip=")
    ? { data: [valid("https://example.com/unrequested"), null] }
    : { status: "completed", data: [valid(urls[0])], next: "https://api.firecrawl.dev/v2/batch/scrape/completed-job?skip=1" }));
  assert.equal((await runHostedMonitor(true, storage)).status, "partial");
  assert.deepEqual(Object.keys(saved().pages), urls);
  assert.deepEqual(saved().lastCollection.failed, [{ url: urls[1], error: "Requested URL missing from completed batch" }]);
});

test("full success clears errors and counts each URL once despite duplicate documents", async t => {
  const { storage, blobs, saved } = fixture([urls[0], urls[0], urls[1]]);
  t.mock.method(globalThis, "fetch", async () => Response.json({ status: "completed", data: [
    { ...valid(urls[0]), json: null }, valid(urls[0]), valid(urls[0]), valid(urls[1]), { ...valid(urls[1]), json: null },
  ] }));
  assert.equal((await runHostedMonitor(true, storage)).status, "collected");
  assert.deepEqual(saved().lastCollection.succeeded, urls);
  assert.deepEqual(saved().lastCollection.failed, []);
  assert.equal(saved().lastError, undefined);
  assert.equal([...blobs.keys()].filter(path => path.startsWith("monitor/reviews/")).length, 2);
  assert.equal([...blobs.keys()].some(path => path.startsWith("monitor/failures/")), false);
});

test("submitting a retry preserves the collection error until a successful harvest", async t => {
  const { storage, saved } = fixture();
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => Response.json(++calls === 1
    ? { status: "completed", data: [] }
    : { success: true, id: "retry-job" }));
  assert.equal((await runHostedMonitor(false, storage)).status, "failed");
  const error = saved().lastError;
  assert.equal((await runHostedMonitor(false, storage)).status, "submitted");
  assert.equal(saved().lastError, error);
  assert.equal(saved().batch.id, "retry-job");
});
