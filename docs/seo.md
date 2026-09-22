# Search visibility

The site now has dedicated season, region and free-entry pages under `/calendar/`. These render their listings and links on the server, with self-canonical URLs. The interactive calendar keeps its canonical URL at `/calendar/`, including when filters are selected. Collection routes are generated only for defined collections with actual records. Unknown collections return 404.

Each event edition has a year-specific title and heading, Event structured data, breadcrumbs and links back to relevant collections. Schema uses the event's real inclusive dates and admission information. It does not infer ticket prices, availability, organisers or performers. Provisional records omit the schema status because there is no provisional EventStatusType. Cancelled records keep their dates and use EventCancelled. Past scheduled editions keep their original dates. Images are representative; the page explains that they do not establish aircraft attendance.

Collection pages revalidate hourly so elapsed events move to the archive. Source check dates are displayed as source check dates. They are not used as sitemap modification dates, and builds do not manufacture a fresh lastmod. The sitemap includes collection URLs and listing images. Homepage WebSite and Organization data identifies the publisher; event pages never claim that Airshow Events organises a show.

## What to do next

1. Verify the domain in Google Search Console and Bing Webmaster Tools, then submit `https://airshow.events/sitemap.xml`. Ownership verification needs the owner's account or DNS access. Check representative event and collection URLs using URL Inspection and Google's Rich Results Test after deployment.
2. Establish a baseline for clicks, impressions, click-through rate and average position. Track season searches, named events, free airshows, regional searches and aircraft names separately. Compare equivalent periods; search traffic is seasonal.
3. Expand organiser-verified coverage. There are 32 event editions after the 22 September coverage review, and several share a venue. Missing shows and thin visitor information are larger gaps than another metadata tag. Add sourced transport details, accessibility links, ticket conditions and year-specific programmes as organisers publish them. Keep historical editions and cancellation notices accurate.
4. Review hosted collection failures and credit availability before describing updates as automatic or current. Collected reports require editorial verification before publication.
5. Seek relevant links through relationships with organisers, aviation museums and local visitor organisations. Outreach needs a separate instruction; no messages were sent as part of this implementation.
6. Measure Core Web Vitals with real field data when available. Prioritise problems observed on production rather than adding scripts or claiming a score from a local build.

British Airshows publishes a broader calendar, show previews and frequent programme news. Metadata changes cannot substitute for that coverage, original reporting, links or time in the index. No ranking position is promised.

## References

- [British Airshows calendar](https://britishairshows.com/british-uk-airshows-2026-calendar-dates)
- [Google event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search Console](https://search.google.com/search-console/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

No competitor copy, photographs or unverified event facts were imported for this work.
