# Airshow Events

An original UK airshow discovery app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui buttons, BeUI animated tabs and Runeicons. All schedules and appearances are demo data.

## Run

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm test
npm run typecheck
npm run build
```

The build exports a static site to `out/`. Serve that folder with a static host that supports directory index pages. `next start` is not used for the static export.

## Content

`lib/content.ts` owns typed event, aircraft and appearance records. Event slugs and aircraft slugs are stable identifiers. Appearances link the two records, with independent participation status and announcement date. The homepage announcement feed derives from appearances, and detail routes are generated from the same records. Add a record and rebuild to publish a new route. A CMS can later supply these arrays without changing their consumers.

Dates are ISO calendar dates in the UK. End dates are inclusive. Calendar export converts the end to an exclusive all-day date, escapes text, folds UTF-8 lines and omits cancelled/completed events. Every exported demo event carries a [DEMO] prefix. Event status rolls completed dates forward on the client.

Search and filters are reflected in the URL. Maps use Leaflet with OpenStreetMap tiles and matching text links. No account, database or API keys are required.

Weather intentionally shows an unavailable state with a Met Office link. Replace that component with a real forecast provider before showing weather readings. Ticket links go to official visitor information and are not claims of availability. Replace and verify the demo dates, sources and participation before a public launch.

The optional `search_airshows` WebMCP tool shares the calendar's visible search state and is registered only when the browser exposes `document.modelContext`. It validates input and unregisters when the component unmounts.

## Third-party assets

Attribution and source links are in `/about/`; component licences are in `public/licenses/`. BeUI provides morph selects, mobile navigation dock, text reveals, number tickers, export toast stack, circle-blur theme toggle and global morphing search, alongside tabs. Local adaptations use Runeicons, accessible filter labels and keyboard navigation. Theme choice persists in browser storage; motion respects reduced-motion preferences. Runeicons are the original outline SVGs rendered using CSS masks. Photography is bundled locally with source and licence attribution on the credits page.
