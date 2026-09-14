import assert from "node:assert/strict";
import { test } from "node:test";
import { extractEvents } from "../scripts/check-jsonld";
import { sourceUrls } from "../scripts/check-britishairshows";

test("site discovery keeps internal pages, deduplicates and rejects external URLs and assets", () => {
  assert.deepEqual(sourceUrls([
    { url: "https://britishairshows.com/duxford#aircraft" },
    { url: "https://www.britishairshows.com/duxford?utm_source=test" },
    { url: "https://other.example/event" },
    { url: "https://britishairshows.com/photo.jpg" },
    { url: "javascript:alert(1)" },
  ]), ["https://britishairshows.com/duxford"]);
});

test("extract factual event fields from JSON-LD objects, arrays and graphs", () => {
  const event = { "@type": "Event", name: "Duxford Flying Finale", startDate: "2026-10-03", endDate: "2026-10-03", location: { name: "Duxford", address: "CB22 4QR" }, dateModified: "2026-09-14", description: "Not imported", image: "Not imported" };
  const script = (value: unknown) => `<script type='application/ld+json'>${JSON.stringify(value)}</script>`;
  const result = extractEvents(script(event));
  assert.equal(result[0].startDate, "2026-10-03");
  assert.equal(result[0].address, "CB22 4QR");
  assert.equal("description" in result[0], false);
  assert.deepEqual(extractEvents(script({ "@graph": [event] })), result);
  assert.deepEqual(extractEvents(script([event])), result);
  assert.throws(() => extractEvents(script({ ...event, startDate: "2026-02-30" })));
  assert.throws(() => extractEvents(script({ ...event, endDate: "2025-01-01" })));
  assert.throws(() => extractEvents("<script type='application/ld+json'>{bad}</script>"));
  assert.throws(() => extractEvents("<html>Access denied</html>"));
});
