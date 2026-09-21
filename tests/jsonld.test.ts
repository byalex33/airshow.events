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

const datedEvent = (startDate: unknown, endDate?: unknown) => ({
  "@type": "Event", name: "Airshow", startDate, ...(endDate === undefined ? {} : { endDate }), location: { name: "Airfield" },
});
const jsonLd = (value: unknown) => `<script type="application/ld+json">${JSON.stringify(value)}</script>`;

test("Event dates retain the source calendar day for dates, local times and UTC offsets", () => {
  for (const input of [
    "2026-09-22", "2026-09-22T10:00", "2026-09-22T10:00:00",
    "2026-09-22T10:00:00.123Z", "2026-09-22T00:30:00+14:00",
    "2026-09-22T23:30:00-12:00", "2026-09-22T10:00:00+0100",
  ]) {
    const [event] = extractEvents(jsonLd(datedEvent(input)));
    assert.equal(event.startDate, "2026-09-22", input);
    assert.equal(event.endDate, "2026-09-22", input);
  }
  const [event] = extractEvents(jsonLd(datedEvent("2026-12-31T23:00:00-12:00", "2027-01-01T01:00:00+14:00")));
  assert.equal(event.startDate, "2026-12-31");
  assert.equal(event.endDate, "2027-01-01");
});

test("Event dates validate leap years without normalizing impossible days or times", () => {
  for (const input of ["2024-02-29", "2000-02-29T12:00:00Z", "0096-02-29T00:00:00+01:00"]) {
    assert.equal(extractEvents(jsonLd(datedEvent(input)))[0].startDate, input.slice(0, 10));
  }
  for (const input of [
    "2026-02-29", "1900-02-29T12:00:00Z", "2026-04-31T10:00:00+01:00",
    "2026-00-01", "2026-13-01", "2026-01-00", "2026-09-22T25:00:00Z",
    "2026-09-22T12:60:00Z", "2026-09-22T12:00:60Z", "2026-09-22T12:00:00+24:00",
    "2026-09-22T12:00:00+01:60", "2026-09-22T12:00:00junk", "2026-09-22T", null,
  ]) {
    assert.throws(() => extractEvents(jsonLd(datedEvent(input))), /Invalid event JSON-LD/, String(input));
    assert.throws(() => extractEvents(jsonLd(datedEvent("2026-01-01", input ?? ""))), /Invalid event JSON-LD/, String(input));
  }
});

test("mixed JSON-LD pages keep valid events across malformed events and scripts", () => {
  const valid = datedEvent("2026-09-22T10:00:00+01:00");
  const invalid = datedEvent("2026-02-30");
  const expected = extractEvents(jsonLd(valid));
  for (const page of [
    jsonLd([invalid, valid, { ...valid, name: "" }]),
    jsonLd({ "@graph": [invalid, valid] }),
    jsonLd(invalid) + jsonLd(valid),
    jsonLd(valid) + jsonLd(invalid),
    `<script type="application/ld+json">{broken}</script>${jsonLd(valid)}`,
    jsonLd(valid) + `<script type="application/ld+json">{broken}</script>`,
  ]) assert.deepEqual(extractEvents(page), expected);
});
