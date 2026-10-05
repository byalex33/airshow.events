import Link from "next/link";
import { notFound } from "next/navigation";
import { dateLabel, eventStatus, todayUK } from "@/lib/content";
import { airshowCollections } from "@/lib/discovery";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbData, collectionData, eventTitle } from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { DiscoveryLinks } from "@/components/discovery";
import styles from "@/components/discovery.module.css";

export const revalidate = 3600;
export const dynamicParams = false;
type Props = { params: Promise<{ collection: string }> };
export function generateStaticParams() {
  return airshowCollections().map(({ slug }) => ({ collection: slug }));
}
async function getCollection(params: Props["params"]) {
  const { collection } = await params;
  const match = airshowCollections().find(({ slug }) => slug === collection);
  if (!match) notFound();
  return match;
}
export async function generateMetadata({ params }: Props) {
  const collection = await getCollection(params);
  return pageMetadata(`${collection.title}: dates & entry`, collection.description, `/calendar/${collection.slug}/`);
}
export default async function Page({ params }: Props) {
  const collection = await getCollection(params);
  const path = `/calendar/${collection.slug}/`;
  const today = todayUK();
  const active = collection.events.filter((event) => event.end >= today && event.status !== "completed" && event.status !== "cancelled");
  const archived = collection.events.filter((event) => !active.includes(event));
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Airshow calendar", path: "/calendar/" }, { name: collection.title, path }];
  return (
    <main id="main">
      <StructuredData data={breadcrumbData(breadcrumbs)} />
      <StructuredData data={collectionData(collection.title, path, [...active, ...archived])} />
      <div className="container page-main">
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => index === breadcrumbs.length - 1 ? <span key={item.path} aria-current="page">{item.name}</span> : <Link key={item.path} href={item.path}>{item.name}</Link>)}
        </nav>
        <div className="page-heading"><div><span className="eyebrow">PLAN YOUR AIRSHOW VISIT</span><h1>{collection.title}</h1><p>{collection.description}</p></div></div>
        <p>{collection.events.length} sourced listings. Coverage is partial. Event dates and aircraft programmes can change.</p>
        <section className={styles.section}>
          <h2>Before you travel</h2><p>{collection.advice}</p>
          <p>Use the <Link href="/calendar/">interactive airshow calendar</Link> to filter by aircraft, venue and month, or browse the dated listings below.</p>
        </section>
        {[{ title: "Upcoming dates", shows: active }, { title: "Past and cancelled editions", shows: archived }].map(({ title, shows }) => (
          <section key={title} className={styles.section}>
            <h2>{title}</h2>
            {shows.length === 0 ? <p>No {title.toLowerCase()} recorded in this collection. We only add dates backed by an official source.</p> : (
              <ul className={styles.list}>{shows.map((event) => <li key={event.slug} className={styles.item}>
                <h3><Link href={`/airshows/${event.slug}/`}>{eventTitle(event)}</Link></h3>
                <p className={styles.meta}><time dateTime={event.start}>{dateLabel(event)} {event.start.slice(0, 4)}</time> · {event.location} · {event.admission} entry · {eventStatus(event, today)}</p>
                <p>{event.description}</p>
                <p><Link href={`/airshows/${event.slug}/`}>Event details and aircraft programme</Link> · <a href={event.sourceUrl}>Official date source</a> · Source checked <time dateTime={event.checkedAt}>{event.checkedAt}</time></p>
              </li>)}</ul>
            )}
          </section>
        ))}
      </div>
      <DiscoveryLinks />
    </main>
  );
}
