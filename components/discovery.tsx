import Link from "next/link";
import { airshowCollections, seasonLabel } from "@/lib/discovery";
import styles from "./discovery.module.css";

export function DiscoveryLinks() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="browse-airshows-heading">
      <h2 id="browse-airshows-heading">UK airshow dates for {seasonLabel}</h2>
      <p>Choose a season or region to compare dates, venues and entry information. Each listing links to its official date source. Our coverage is growing and includes past editions.</p>
      <nav className={styles.links} aria-label="Browse airshows by year, region and entry">
        {airshowCollections().map((collection) => <Link key={collection.slug} href={`/calendar/${collection.slug}/`}>{collection.title}</Link>)}
      </nav>
      <h3>Looking for a particular aircraft?</h3>
      <p>Follow the <Link href="/aircraft/red-arrows/">Red Arrows</Link>, <Link href="/aircraft/spitfire/">Spitfire</Link> or <Link href="/aircraft/typhoon/">RAF Typhoon</Link> through the programme records collected here. These are partial records, and past entries describe planned participation.</p>
      <p>Before booking, check the event year, the organiser's latest programme and which days your ticket covers. See <Link href="/about/">our sources and photo credits</Link> or <Link href="/contact/">send a correction or missing event</Link>.</p>
    </section>
  );
}
