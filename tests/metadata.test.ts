import assert from "node:assert/strict";
import { test } from "node:test";
import { sitemapEntries } from "../lib/metadata";
import { aircraft, events } from "../lib/content";
import { pageMetadata, siteUrl } from "../lib/metadata";

test("every listing has its own canonical URL and matching social preview", () => {
  for (const [section, listings] of [["airshows", events], ["aircraft", aircraft]] as const) {
    for (const listing of listings) {
      const path = `/${section}/${listing.slug}/`;
      const metadata = pageMetadata(listing.name, listing.description, path, listing.image, listing.imageAlt);
      assert.equal(metadata.alternates?.canonical, path);
      assert.equal(metadata.openGraph?.url, path);
      assert.equal(metadata.openGraph?.title, `${listing.name} | Airshow Events`);
      assert.equal(metadata.twitter?.title, metadata.openGraph?.title);
      assert.deepEqual(metadata.twitter?.images, [{ url: listing.image, alt: listing.imageAlt }]);
      assert(sitemapEntries(aircraft).some((entry) => entry.url === `${siteUrl}${path}`));
    }
  }
  const homepage = pageMetadata("UK airshows & aircraft", "Demo season", "/");
  assert.deepEqual(homepage.openGraph?.images, homepage.twitter?.images);
  assert.equal((homepage.twitter as { card: string }).card, "summary_large_image");
  assert.equal(new Set(sitemapEntries(aircraft).map((entry) => entry.url)).size, sitemapEntries(aircraft).length);
});
