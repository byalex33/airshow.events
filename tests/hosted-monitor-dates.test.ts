import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { events, appearances } from "../lib/content";
import { pageDue, runHostedMonitor } from "../lib/hosted-monitor";

type Storage = NonNullable<Parameters<typeof runHostedMonitor>[1]>;

test("JSON-LD-only collection persists scheduling dates even when its content hash is unchanged", async t => {
  const url = "https://example.com/airshow";
  const rawHtml = '<script type="application/ld+json">{"@type":"Event","name":"Test airshow","startDate":"2026-09-22","location":{"name":"Airfield"}}</script>';
  const markdown = "Airshow dates announced. Aircraft programme to follow.";
  const hash = createHash("sha256").update(JSON.stringify([[], markdown, undefined, rawHtml])).digest("hex");
  const state = {
    urls: [url],
    pages: { [url]: { checkedAt: "2026-09-20T07:10:00Z", programmes: [], hash } },
    batch: { id: "completed-job", urls: [url], startedAt: "2026-09-21T07:00:00Z" },
  };
  const blobs = new Map([["monitor/state.json", JSON.stringify(state)]]);
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
  t.mock.method(globalThis, "fetch", async () => Response.json({ success: true, status: "completed", data: [{ metadata: { sourceURL: url }, markdown, rawHtml, json: { programmes: [] } }] }));
  assert.equal((await runHostedMonitor(true, storage)).status, "collected");
  const saved = JSON.parse(blobs.get("monitor/state.json")!);
  assert.deepEqual(saved.pages[url].eventDates, [{ startDate: "2026-09-22", endDate: "2026-09-22" }]);
  assert.equal(saved.pages[url].hash, hash);
  assert.equal([...blobs.keys()].some(path => path.startsWith("monitor/reviews/")), false);
  assert.equal(pageDue({ ...saved.pages[url], checkedAt: "2026-09-20T07:10:00Z" }, new Date("2026-09-21T07:00:00Z")), true);
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

test("hosted submission includes a known source due daily despite empty legacy programmes", async t => {
  const event = events[0];
  const now = new Date(`${event.start}T07:00:00Z`);
  t.mock.timers.enable({ apis: ["Date"], now });
  const url = event.sourceUrl;
  const blobs = new Map([["monitor/state.json", JSON.stringify({
    mappedAt: now.toISOString(), urls: [url],
    pages: { [url]: { checkedAt: new Date(now.getTime() - 86400000).toISOString(), programmes: [] } },
  })]]);
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
  t.mock.method(globalThis, "fetch", async (requestUrl: string, init: RequestInit) => {
    assert.ok(requestUrl.endsWith("/batch/scrape"));
    assert.deepEqual(JSON.parse(init.body as string).urls, [url]);
    return Response.json({ success: true, id: "daily-job" });
  });
  assert.deepEqual(await runHostedMonitor(false, storage), { status: "submitted", pages: 1 });
  assert.equal(JSON.parse(blobs.get("monitor/state.json")!).batch.id, "daily-job");
});
