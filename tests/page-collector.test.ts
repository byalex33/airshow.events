import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchSource, htmlToText, sitemapUrls } from "../lib/page-collector";

test("page text keeps headings, list items and table cells and drops scripts", () => {
  const html = `<html><head><title>x</title><style>.a{}</style></head><body><script>alert("x")</script><!-- hidden -->
    <h2>Flying&nbsp;display</h2><ul><li>Spitfire &amp; Hurricane</li><li>Red&#8217;s <b>Hawk</b></li></ul>
    <table><tr><td>Sat</td><td>Lancaster</td></tr></table><p>Line one<br>Line two</p></body></html>`;
  assert.equal(htmlToText(html), "Flying display\n- Spitfire & Hurricane\n- Red’s Hawk\nSat | Lancaster |\nLine one\nLine two");
});

test("sources must be reachable HTML or PDF", async t => {
  let response = new Response("<p>Programme</p>", { headers: { "content-type": "text/html; charset=utf-8" } });
  t.mock.method(globalThis, "fetch", async () => response);
  assert.deepEqual(await fetchSource("https://example.com/"), { text: "Programme", html: "<p>Programme</p>" });
  response = new Response(null, { status: 403 });
  await assert.rejects(fetchSource("https://example.com/"), /Source HTTP 403/);
  response = new Response("binary", { headers: { "content-type": "image/png" } });
  await assert.rejects(fetchSource("https://example.com/"), /Unsupported source type/);
});

test("sitemaps list page URLs and follow sitemap indexes", async t => {
  const bodies: Record<string, string> = {
    "https://example.com/sitemap.xml": "<sitemapindex><sitemap><loc>https://example.com/pages.xml</loc></sitemap></sitemapindex>",
    "https://example.com/pages.xml": "<urlset><url><loc> https://example.com/a?x=1&amp;y=2 </loc></url><url><loc>https://example.com/b</loc></url></urlset>",
  };
  t.mock.method(globalThis, "fetch", async (url: string) => bodies[url] ? new Response(bodies[url]) : new Response(null, { status: 404 }));
  assert.deepEqual(await sitemapUrls("https://example.com/sitemap.xml"), [{ url: "https://example.com/a?x=1&y=2" }, { url: "https://example.com/b" }]);
  await assert.rejects(sitemapUrls("https://example.com/missing.xml"), /Sitemap HTTP 404/);
});
