import { runHostedMonitor, type Collector } from "../lib/hosted-monitor";

export type Storage = NonNullable<Parameters<typeof runHostedMonitor>[0]>;
export const pageText = (summary: string) => `${summary}\n${"Official airshow information page with visitor details and programme updates. ".repeat(3)}`;

/** In-memory blob storage seeded with a monitor state. */
export function memoryStorage(state: object) {
  const blobs = new Map<string, string>([["monitor/state.json", JSON.stringify(state)]]);
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
  return { blobs, storage, saved: () => JSON.parse(blobs.get("monitor/state.json")!), keys: (prefix: string) => [...blobs.keys()].filter(path => path.startsWith(prefix)) };
}

/** A collector that never touches the network. Pages map URLs to text, or to an Error to throw. */
export function fakeCollector(pages: Record<string, string | Error>, programmes: (text: string, url: string) => unknown = () => ({ programmes: [] }), extra: Partial<Collector> = {}) {
  const fetched: string[] = [];
  const extracted: string[] = [];
  const collector: Partial<Collector> = {
    fetchSource: async url => {
      fetched.push(url);
      const page = pages[url];
      if (page === undefined) throw new Error("Source HTTP 404");
      if (page instanceof Error) throw page;
      return { text: page, html: "" };
    },
    extractProgrammes: async (text, url) => { extracted.push(url); return programmes(text, url); },
    discover: async () => { throw new Error("Discovery not expected"); },
    photoLookup: async () => null,
    ...extra,
  };
  return { collector, fetched, extracted };
}
