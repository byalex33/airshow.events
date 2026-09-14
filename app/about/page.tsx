import { DemoNotice } from "@/components/site";
export const metadata = { title: "About this demo & credits" };
export default function Page() {
  return (
    <main id="main" className="container page-main">
      <DemoNotice />
      <div className="page-heading">
        <div>
          <span className="eyebrow">INDEPENDENT, BY DESIGN</span>
          <h1>For the love of flight.</h1>
          <p>
            Airshow Events is an original prototype for discovering UK flying
            displays.
          </p>
        </div>
      </div>
      <div className="credits">
        <h2>A demo season</h2>
        <p>
          All event dates, event statuses and aircraft appearances on this
          website are illustrative, including those associated with real venues
          and event names. Several listings are invented. They are not verified
          announcements, ticket offers or travel advice. Official links point to
          visitor information, not a guaranteed event booking.
        </p>
        <p>
          Saved airshows are stored only in your current browser. Calendar
          downloads are marked [DEMO]. Weather forecasts are not connected.
          Confirm all arrangements directly with the organiser before
          travelling.
        </p>
        <h2>Photography</h2>
        <ul>
          <li>
            Red Arrows:{" "}
            <a href="https://unsplash.com/photos/CAHsaJoG54w">
              William Warby on Unsplash
            </a>
            , used under the{" "}
            <a href="https://unsplash.com/license">Unsplash licence</a>.
          </li>
          <li>
            Spitfire MH434:{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Spitfire_-_Season_Premiere_Airshow_2018_(cropped).jpg">
              Airwolfhound, Wikimedia Commons
            </a>
            ,{" "}
            <a href="https://creativecommons.org/licenses/by-sa/2.0/">
              CC BY-SA 2.0
            </a>
            . Displayed with responsive crops and overlays.
          </li>
          <li>
            Eurofighter Typhoon ZK372:{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Eurofighter_Typhoon_FGR.4_ZK372_RAF_5D4_2423_(53921026945).jpg">
              Ronnie Macdonald, Wikimedia Commons
            </a>
            ,{" "}
            <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>
            . Displayed with responsive crops and overlays.
          </li>
        </ul>
        <h2>Made with open-source tools</h2>
        <p>
          Next.js, TypeScript and Tailwind CSS. Buttons from{" "}
          <a href="https://ui.shadcn.com/">shadcn/ui</a>, animated tabs adapted
          from <a href="https://beui.dev/">BeUI</a>, and outline icons from{" "}
          <a href="https://www.runeicons.com/">Runeicons</a>. Maps use Leaflet
          and OpenStreetMap contributors.
        </p>
        <p>
          <a href="/licenses/shadcn.txt">shadcn/ui licence</a> ·{" "}
          <a href="/licenses/beui.txt">BeUI licence</a> ·{" "}
          <a href="/licenses/runeicons.txt">Runeicons licence</a>
        </p>
        <p>
          This project is independent of the named organisers, the Royal Air
          Force and British Airshows. No British Airshows content or visual
          identity is used.
        </p>
      </div>
    </main>
  );
}
