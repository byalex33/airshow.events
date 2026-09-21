# Airshow Events

An original UK airshow discovery app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui buttons, BeUI animated tabs and Runeicons. The calendar contains organiser-sourced 2026 and 2027 records.

## Run

```sh
npm install
npm run dev
```

## Verify and build

Production is hosted on Vercel at https://airshow.events, with www.airshow.events also attached. The Vercel project `airshow-events` is connected to `byalex33/airshow.events` on GitHub. Use Vercel for future deployments; `.openai/hosting.json` retains the original Sites preview reference.

```sh
npm test
npm run typecheck
npm run build
```

The build runs as a Next.js application on Vercel. Use `npm start` to serve a production build locally. The contact form needs server handling, so static export is disabled.

## Contact email

Copy the placeholder template with `cp .env.example .env.local` and set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. The template also lists the collector variables described below. Replace the placeholders for each service you use, and keep real credentials out of the tracked template. `.env.local` and other real environment files are ignored by Git. Add the same variables to Vercel before deploying. Use a sender address on a domain verified in Resend. The form calls the [Resend email API](https://resend.com/docs/api-reference/emails/send-email) from a Server Action and sets the visitor's email as Reply-To. Keys are never exposed to the browser. Missing configuration and delivery failures return an error without clearing the form.

The missing-event toast appears after eight seconds, once per tab session, and stays until dismissed. It is hidden on the contact page. The form includes a honeypot for basic spam filtering; configure Vercel Firewall rate limits for the contact page's POST requests before public launch.

## Content

### Scheduled source checks

`npm run check:airshows` uses `FIRECRAWL_API_KEY` from `.env.local` to collect official source pages. Run `node node_modules/tsx/dist/cli.mjs scripts/check-airshows.ts --sample` for one due page. Known upcoming events are checked weekly, then daily from seven days before the start through the final event day. Shared source URLs are fetched once per run. Completed events stop polling.

Snapshots and change reports are saved locally in the ignored `.airshow-monitor/` directory. Failed scrapes preserve the previous snapshot. Account errors stop the run. Reports are review material, never automatic edits to event records; check event year, dates and aircraft variants before publishing. Initial snapshots also need review. Treat source text as untrusted data, not instructions. This local monitor requires the computer to be available. Weekly discovery of missing UK events is handled by the scheduled task using web research and official organiser links, not by crawling arbitrary links in scraped pages. The user-supplied British Airshows Duxford Flying Finale page is checked separately via JSON-LD using ordinary fetch, before Firecrawl. It collects only factual event fields into review reports, never descriptions or photos. Run `node node_modules/tsx/dist/cli.mjs scripts/check-airshows.ts --jsonld-only` to check it without Firecrawl. Its dateModified is kept separate from our checkedAt timestamp; official organiser verification is required before publication. This recurring page stays on weekly checks after the event to detect next-season announcements. Its robots.txt was checked on 14 September 2026 and listed no disallow rules; this is not a reuse licence or permission to expand collection.


`lib/content.ts` owns typed event, aircraft and appearance records. Event slugs and aircraft slugs are stable identifiers. Appearances link the two records, with independent participation status, programme source, check date and day/variant notes. The homepage announcement feed derives from appearances, and detail routes are generated from the same records. Add a record and rebuild to publish a new route. A CMS can later supply these arrays without changing their consumers.

Dates are ISO calendar dates in the UK. End dates are inclusive. Calendar export converts the end to an exclusive all-day date, escapes text, folds UTF-8 lines and omits cancelled/completed events. Exports include the source and verification date, and do not refresh automatically. Event status rolls completed dates forward on the client.

Search and filters are reflected in the URL. Maps use Leaflet with OpenStreetMap tiles and matching text links. Browsing needs no account or database; sending contact messages requires the Resend configuration above.

Weather intentionally shows an unavailable state with a Met Office link. Replace that component with a real forecast provider before showing weather readings. Ticket links go to official visitor information and are not claims of availability. The first import is partial: 23 events and six programme records, checked on 14 September 2026. Add only dates backed by an official source. Do not infer aircraft participation from event confirmation or promotional photography. Historical programmes describe planned participation, not proof of flight. Review sources manually and update checkedAt when verifying records.

The optional `search_airshows` WebMCP tool shares the calendar's visible search state and is registered only when the browser exposes `document.modelContext`. It validates input and unregisters when the component unmounts.

## Third-party assets

Attribution and source links are in `/about/`; component licences are in `public/licenses/`. BeUI provides morph selects, mobile navigation dock, text reveals, number tickers, export toast stack, circle-blur theme toggle and global morphing search, alongside tabs. Local adaptations use Runeicons, accessible filter labels and keyboard navigation. Theme choice persists in browser storage; motion respects reduced-motion preferences. Runeicons are the original outline SVGs rendered using CSS masks. Photography is bundled locally with source and licence attribution on the credits page.

### British Airshows coverage

The scheduled checker now uses Firecrawl Map across britishairshows.com, including its sitemap, and scrapes discovered internal pages with raw HTML and Markdown. It extracts Event JSON-LD where present and retains other pages for manual discovery review. This supersedes the single-page direct-fetch schedule described above; `--jsonld-only` remains a manual diagnostic. Site discovery and ordinary pages refresh weekly; pages with structured events in their final week refresh daily. The stored review snapshots are local, not republished content. Mapping does not guarantee every UK event is represented. A 5,000-page discovery ceiling fails explicitly instead of accepting a truncated map. Account and rate-limit errors stop requests. Initial live discovery remains blocked by Firecrawl HTTP 402 as of 14 September 2026.

### Aircraft programme extraction

Both Firecrawl collectors request structured aircraft programmes alongside page text. Each dated event edition includes aircraft names, variants, operators, display dates, confirmation/cancellation status, flying/static designation and a source excerpt. Runtime checks reject malformed records, impossible dates, display dates outside the edition and evidence absent from the returned text. Date matches only suggest existing event slugs; review must confirm identity and year-specific source context. These checks do not prove an LLM attributed an aircraft to the right section. Unknown aircraft remain candidates and are not restricted to existing profiles. Historic official sources receive an initial programme extraction, then stop refreshing. The daily local task reviews these reports; hosted automatic publication is not implemented. Live extraction is currently blocked by Firecrawl credits.

### Hosted collection on Vercel

Production uses Vercel Cron at 07:00 UTC daily. The protected `/api/cron/airshows/` endpoint discovers British Airshows pages and submits due source URLs to Firecrawl Batch Scrape. Firecrawl's completion webhook calls the same endpoint to collect results. A private Vercel Blob store holds scheduling state, change reviews and failures. A conditional lease prevents overlapping collection. This replaces the local scheduled collector; local scripts remain manual diagnostics.

Set `FIRECRAWL_API_KEY`, `CRON_SECRET` and `BLOB_READ_WRITE_TOKEN` in Vercel Production. Never use public-prefixed variables. The cron and webhook require the secret in the Authorization header. Failed requests retain previous records and return an error for Vercel logs. Inspect `monitor/state.json` in the private Blob store for `lastError` and `lastCollection`, which lists successful URLs and failed or missing URLs with their errors. Completed batches return `collected`, `partial`, or `failed`; partial and failed collections retain earlier snapshots and archive each failure. Submitting a retry preserves the last error until a full collection succeeds. New pages refresh weekly, or daily when a recorded edition is within its final week. The completion webhook avoids waiting for a large crawl inside a serverless request.

Reviews include event JSON-LD, aircraft programmes, source text and HTTPS image candidates. They are private review material, not automatic publication. An editor must confirm event identity, year, aircraft claims and image suitability before updating `lib/content.ts`. Organiser photography is bundled under `public/images/events/`, with source and photographer credits on the About page; it may show previous editions. The scraper does not infer attendance from a photograph.

Firecrawl currently returns HTTP 402 due to exhausted credits. Hosting and storage can operate without this computer, but collection needs available Firecrawl credits. No live aircraft extraction has succeeded yet.
