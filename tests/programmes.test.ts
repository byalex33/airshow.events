import { test } from "node:test";
import assert from "node:assert/strict";
import { validateProgrammes, programmeReview } from "../scripts/programmes";

test("programme extraction preserves editions, variants and cancellations and rejects unsupported data", () => {
  const plane = { name: "Spitfire", variant: "Mk XI", operator: "Aircraft Restoration Company", displayDates: ["2026-10-03"], status: "confirmed", displayType: "flying", evidence: "Spitfire XI confirmed" };
  const event = { eventName: "Duxford Flying Finale", eventStart: "2026-10-03", eventEnd: "2026-10-03", announcement: "announced", aircraft: [plane] };
  const old = { ...event, eventStart: "2025-10-04", eventEnd: "2025-10-04", aircraft: [{ ...plane, displayDates: ["2025-10-04"], status: "cancelled", evidence: "Spitfire cancelled" }] };
  const text = "2026 Spitfire XI confirmed. 2025 Spitfire cancelled.";
  const parsed = validateProgrammes({ programmes: [event, old] }, text);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1].aircraft[0].status, "cancelled");
  assert.equal(parsed[0].aircraft[0].variant, "Mk XI");
  assert.equal(programmeReview(parsed, "https://example.com")[0].requiresReview, true);
  assert.throws(() => validateProgrammes({ programmes: [{ ...event, aircraft: [{ ...plane, displayDates: ["2025-10-04"] }] }] }, text));
  assert.throws(() => validateProgrammes({ programmes: [event] }, "No aircraft mentioned"));
  assert.throws(() => validateProgrammes({ programmes: [{ ...event, announcement: "not-announced" }] }, text));
  assert.throws(() => validateProgrammes(undefined, text));
  assert.deepEqual(validateProgrammes({ programmes: [] }, "Event dates only"), []);
});

test("evidence matching treats curly and straight quotes and dash variants alike", () => {
  const plane = { name: "Mustang", variant: "P-51D", operator: null, displayDates: [], status: "confirmed", displayType: "flying", evidence: `P-51D Mustang 'Jersey Jerk' - US Fighters` };
  const programmes = { programmes: [{ eventName: "Flying Finale", eventStart: "2024-10-05", eventEnd: "2024-10-05", announcement: "announced", aircraft: [plane] }] };
  assert.equal(validateProgrammes(programmes, "The P‑51D Mustang ‘Jersey Jerk’ – US Fighters flew.")[0].aircraft.length, 1);
  assert.throws(() => validateProgrammes(programmes, "The P-51D Mustang flew."), /unsupported aircraft record/);
});
