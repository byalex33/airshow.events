import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { aircraft, aircraftPhotoEntries, photoForName } from "../lib/content";
import { contactSheet, suitable } from "../scripts/aircraft-photo";
import { allowedLicense, fillTypePhotos, pickAircraftType, plainText, usableTypePhoto, type CommonsFile } from "../lib/aircraft-photo-lookup";

const file: CommonsFile = { title: "File:Example.jpg", width: 3000, height: 2000, thumbUrl: "https://upload.wikimedia.org/x.jpg", pageUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg", license: "CC BY-SA 4.0", licenseUrl: "", credit: "Example", restrictions: "" };

test("accepts only licences that allow reuse with attribution", () => {
  for (const name of ["CC0", "Public domain", "CC BY 2.0", "CC BY-SA 4.0", "OGL v1.0", "OGL v3"]) assert.ok(allowedLicense(name), name);
  for (const name of ["GFDL", "CC BY-NC 2.0", "CC BY-ND 4.0", "All rights reserved", ""]) assert.ok(!allowedLicense(name), name);
});

test("keeps large landscape photos without restrictions", () => {
  assert.ok(suitable(file));
  for (const change of [{ width: 1200, height: 800 }, { width: 2000, height: 3000 }, { restrictions: "trademarked" }, { license: "GFDL" }]) assert.ok(!suitable({ ...file, ...change }));
  assert.equal(plainText('<a href="/wiki/User:A">A &amp; B</a>\n<span>Studio</span>'), "A & B Studio");
});

test("contact sheet escapes Commons metadata", () => {
  const html = contactSheet("Spitfire", [{ ...file, credit: '<script>alert("x")</script>' }]);
  assert.ok(!html.includes("<script>"));
  assert.match(html, /add SLUG "File:Example.jpg"/);
});

test("every aircraft photo is bundled and credited", () => {
  for (const plane of aircraft) assert.ok(plane.image, plane.slug);
  for (const [slug, photo] of Object.entries(aircraftPhotoEntries)) {
    assert.ok(existsSync(`public${photo.image}`), slug);
    assert.ok(photo.imageCredit && photo.imageLicense, slug);
    assert.match(photo.imageSource, /^https:\/\//, slug);
    assert.match(photo.imageLicenseUrl, /^https?:\/\//, slug);
    if (photo.names) assert.ok(photo.imageAlt, slug);
  }
});

test("programme aircraft reuse a photo by type name", () => {
  assert.equal(photoForName("AVRO LANCASTER")?.image, "/images/aircraft/lancaster.webp");
  assert.equal(photoForName("Lancaster")?.imageAlt, "Lancaster PA474 in flight");
  assert.equal(photoForName("Avro Anson"), undefined);
});

const type = (id: string, label: string, extra: { names?: string[]; parents?: string[] } = {}) => ({ id, label, names: [label, ...(extra.names ?? [])], parents: extra.parents ?? [], image: `${label}.jpg` });

test("matches exactly one aircraft type by label, alias or trailing words", () => {
  assert.equal(pickAircraftType("Spitfire", [type("Q1", "Supermarine Spitfire"), type("Q2", "Spitfire PR IV", { parents: ["Q1"] })])?.id, "Q1");
  assert.equal(pickAircraftType("Mustang", [type("Q3", "North American P-51 Mustang")])?.id, "Q3");
  assert.equal(pickAircraftType("Hawk T1", [type("Q4", "Hawk T1"), type("Q5", "BAE Systems Hawk")])?.id, "Q4");
  assert.equal(pickAircraftType("Catalina", [type("Q6", "Consolidated PBY Catalina"), type("Q7", "PBY-5A Catalina", { parents: ["Q6"] })])?.id, "Q6");
  assert.equal(pickAircraftType("Typhoon", [type("Q8", "Eurofighter Typhoon"), type("Q9", "Hawker Typhoon")]), undefined);
  assert.equal(pickAircraftType("Hawk", [type("Q10", "Hawker Hurricane")]), undefined);
  assert.equal(pickAircraftType("", [type("Q11", "Avro Anson")]), undefined);
});

test("automatic photos need a usable licence, size, shape and credit", () => {
  assert.ok(usableTypePhoto({ ...file, width: 1024, height: 768 }));
  assert.ok(usableTypePhoto({ ...file, license: "Public domain", credit: "" }));
  for (const change of [{ width: 800, height: 600 }, { width: 1000, height: 1500 }, { credit: "" }, { license: "GFDL" }, { restrictions: "personality" }]) assert.ok(!usableTypePhoto({ ...file, ...change }));
});

test("monitor fills each programme type once, skips imported photos and retries misses after 30 days", async () => {
  const plane = (name: string) => ({ name, variant: null, operator: null, displayDates: [], status: "confirmed" as const, displayType: "flying" as const, evidence: name });
  const programme = (...names: string[]) => ({ eventName: "Show", eventStart: "2026-10-04", eventEnd: "2026-10-04", announcement: "announced" as const, aircraft: names.map(plane) });
  const state: Parameters<typeof fillTypePhotos>[0] = { pages: { a: { programmes: [programme("Avro Anson", "Lancaster", "Mystery")] }, b: { programmes: [programme("AVRO ANSON", "Offline")] } } };
  const looked: string[] = [];
  const lookup = async (name: string) => {
    looked.push(name);
    if (name === "Offline") throw new Error("timeout");
    return name === "Avro Anson" ? { ...aircraftPhotoEntries.spitfire, imageAlt: "Anson" } : null;
  };
  const now = new Date("2026-10-05T00:00:00Z");
  await fillTypePhotos(state, lookup, now);
  assert.deepEqual(looked, ["Avro Anson", "Mystery", "Offline"]);
  assert.equal(state.photos?.avroanson.photo?.imageAlt, "Anson");
  assert.equal(state.photos?.mystery.photo, null);
  assert.equal(state.photos?.offline, undefined);
  looked.length = 0;
  await fillTypePhotos(state, lookup, new Date("2026-10-20T00:00:00Z"));
  assert.deepEqual(looked, ["Offline"]);
  looked.length = 0;
  await fillTypePhotos(state, lookup, new Date("2026-11-05T00:00:00Z"));
  assert.deepEqual(looked, ["Mystery", "Offline"]);
  looked.length = 0;
  await fillTypePhotos({ pages: state.pages }, lookup, now, 1);
  assert.equal(looked.length, 1);
});
