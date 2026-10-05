import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { aircraft, aircraftPhotoEntries, photoForName } from "../lib/content";
import { allowedLicense, contactSheet, plainText, suitable, type CommonsFile } from "../scripts/aircraft-photo";

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
