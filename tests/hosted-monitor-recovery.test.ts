import assert from "node:assert/strict";
import { test } from "node:test";
import { runHostedMonitor } from "../lib/hosted-monitor";

type Storage = NonNullable<Parameters<typeof runHostedMonitor>[1]>;
const sourceUrl = "https://example.com/airshow";
function fixture() {
  const state = {
    mappedAt: new Date().toISOString(), urls: [sourceUrl],
    pages: { [sourceUrl]: { sourceKind: "recurring", checkedAt: "2020-01-01T00:00:00Z", programmes: [], hash: "previous-snapshot" } },
    batch: { id: "expired-job", urls: [sourceUrl], startedAt: "2020-01-01T00:00:00Z" },
  };
  const blobs = new Map<string, string>([["monitor/state.json", JSON.stringify(state)]]);
  const storage: Storage = {
    get: (async (path: string) => {
      const body = blobs.get(path);
      return body ? { stream: new Response(body).body, blob: { etag: "test-etag" } } : null;
    }) as Storage["get"],
    put: async (path, body) => {
      assert.equal(typeof body, "string");
      blobs.set(path, body as string);
      return { etag: "test-etag", url: path, downloadUrl: path, pathname: path, contentType: "application/json", contentDisposition: "inline" };
    },
  };
  return { state, blobs, storage, saved: () => JSON.parse(blobs.get("monitor/state.json")!) };
}

for (const status of [404, 410]) {
  test(`archives HTTP ${status} batches and a later cron resubmits without losing snapshots`, async t => {
    const { state, blobs, storage, saved } = fixture();
    const requests: string[] = [];
    t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
      requests.push(url);
      if (url.endsWith("/expired-job")) return new Response(null, { status });
      assert.ok(url.endsWith("/batch/scrape"));
      assert.deepEqual(JSON.parse(init.body as string).urls, [sourceUrl]);
      return Response.json({ success: true, id: "replacement-job" });
    });
    await assert.rejects(runHostedMonitor(false, storage), new RegExp(`Firecrawl HTTP ${status}`));
    assert.equal(saved().batch, undefined);
    assert.deepEqual(saved().pages, state.pages);
    const failure = [...blobs.entries()].find(([path]) => path.startsWith("monitor/failures/"));
    assert.ok(failure);
    assert.deepEqual(JSON.parse(failure[1]).batch, state.batch);
    assert.equal(JSON.parse(failure[1]).status, status);
    assert.deepEqual(await runHostedMonitor(false, storage), { status: "submitted", pages: 1 });
    assert.equal(saved().batch.id, "replacement-job");
    assert.deepEqual(saved().pages, state.pages);
    assert.equal(requests.length, 2);
  });
}

for (const status of [401, 403, 429, 500, 503]) {
  test(`retains the pending batch after HTTP ${status}`, async t => {
    const { state, blobs, storage, saved } = fixture();
    t.mock.method(globalThis, "fetch", async () => new Response(null, { status }));
    await assert.rejects(runHostedMonitor(false, storage), new RegExp(`Firecrawl HTTP ${status}`));
    assert.deepEqual(saved().batch, state.batch);
    assert.deepEqual(saved().pages, state.pages);
    assert.equal([...blobs.keys()].some(path => path.startsWith("monitor/failures/")), false);
  });
}

test("retains a missing batch if its archive cannot be saved", async t => {
  const { state, storage, saved } = fixture();
  const put = storage.put;
  storage.put = (async (...args: Parameters<Storage["put"]>) => {
    if (args[0].startsWith("monitor/failures/")) throw new Error("Archive unavailable");
    return put(...args);
  }) as Storage["put"];
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
  await assert.rejects(runHostedMonitor(false, storage), /Archive unavailable/);
  assert.deepEqual(saved().batch, state.batch);
  assert.deepEqual(saved().pages, state.pages);
});

test("retains the pending batch after a network failure", async t => {
  const { state, storage, saved } = fixture();
  t.mock.method(globalThis, "fetch", async () => { throw new TypeError("fetch failed"); });
  await assert.rejects(runHostedMonitor(false, storage), /fetch failed/);
  assert.deepEqual(saved().batch, state.batch);
  assert.deepEqual(saved().pages, state.pages);
});

test("recovers when results expire during pagination", async t => {
  const { state, storage, saved } = fixture();
  t.mock.method(globalThis, "fetch", async (url: string) => {
    if (url.includes("?skip=")) return new Response(null, { status: 410 });
    return Response.json({ success: true, status: "completed", data: [], next: "https://api.firecrawl.dev/v2/batch/scrape/expired-job?skip=1" });
  });
  await assert.rejects(runHostedMonitor(false, storage), /Firecrawl HTTP 410/);
  assert.equal(saved().batch, undefined);
  assert.deepEqual(saved().pages, state.pages);
});
