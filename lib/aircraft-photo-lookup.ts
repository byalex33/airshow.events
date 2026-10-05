import { photoForName, typeKey, type AircraftPhoto } from "./content";
import type { Programme } from "../scripts/programmes";

// Wikimedia Commons and Wikidata lookups shared by the photo script and the hosted monitor.
const headers = { "User-Agent": "airshow.events aircraft photos (https://airshow.events/contact/)" };
const day = 86400000;

export type CommonsFile = {
  title: string; width: number; height: number; thumbUrl: string; pageUrl: string;
  license: string; licenseUrl: string; credit: string; restrictions: string;
};
export type TypePhoto = AircraftPhoto & { imageAlt: string };
export type TypePhotoLookups = Record<string, { checkedAt: string; photo: TypePhoto | null }>;
type AircraftType = { id: string; label: string; names: string[]; parents: string[]; image?: string };

// Reusable on a commercial site with attribution alone. GFDL is excluded because it requires reproducing the licence text.
export function allowedLicense(name: string) {
  return /^(CC0|Public domain|CC BY(-SA)? [1-4]\.0|OGL v[1-3](\.0)?)\b/i.test(name.trim());
}

export function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

async function json(url: URL, params: Record<string, string>) {
  for (const [key, value] of Object.entries({ format: "json", formatversion: "2", ...params })) url.searchParams.set(key, value);
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`${url.host} returned ${response.status}`);
  return response.json();
}

export async function commonsFiles(params: Record<string, string>, thumbWidth = 1600): Promise<CommonsFile[]> {
  const data = await json(new URL("https://commons.wikimedia.org/w/api.php"), {
    action: "query", prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: String(thumbWidth),
    iiextmetadatafilter: "LicenseShortName|LicenseUrl|Artist|Credit|Restrictions", ...params,
  });
  const pages: any[] = data.query?.pages ?? [];
  return pages.filter((page) => page.imageinfo?.[0]).sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map((page) => {
    const info = page.imageinfo[0], meta = info.extmetadata ?? {};
    const text = (key: string) => plainText(String(meta[key]?.value ?? ""));
    return {
      title: page.title, width: info.width, height: info.height, thumbUrl: info.thumburl ?? info.url, pageUrl: info.descriptionurl,
      license: text("LicenseShortName"), licenseUrl: text("LicenseUrl"), credit: text("Artist") || text("Credit"), restrictions: text("Restrictions"),
    };
  });
}

const words = (text: string) => text.normalize("NFKD").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** Exactly one aircraft type named by its label, an alias, or the label's last words ("Spitfire" → "Supermarine Spitfire"). */
export function pickAircraftType(name: string, types: AircraftType[]) {
  const target = words(name);
  if (!target.length) return undefined;
  const matches = types.filter((type) => {
    const label = words(type.label);
    return type.names.some((alias) => typeKey(alias) === typeKey(name)) ||
      (label.length > target.length && target.every((word, i) => label[label.length - target.length + i] === word));
  });
  // Variants are subclasses of their family, so keep the family. Unrelated types (Eurofighter and Hawker Typhoon) stay ambiguous.
  const ids = new Set(matches.map((type) => type.id));
  const families = matches.filter((type) => !type.parents.some((parent) => ids.has(parent)));
  return families.length === 1 ? families[0] : undefined;
}

async function aircraftTypes(name: string): Promise<AircraftType[]> {
  const api = "https://www.wikidata.org/w/api.php";
  // Scraped names must not inject search keywords; aircraft family or aircraft model items only.
  const terms = name.replace(/[^\p{L}\p{N}\s.\-/']/gu, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  if (!terms) return [];
  const search = await json(new URL(api), { action: "query", list: "search", srlimit: "10", srsearch: `${terms} haswbstatement:P31=Q15056993|P31=Q15056995` });
  const ids: string[] = (search.query?.search ?? []).map((result: { title: string }) => result.title).filter((id: string) => /^Q\d+$/.test(id));
  if (!ids.length) return [];
  const entities = (await json(new URL(api), { action: "wbgetentities", props: "labels|aliases|claims", languages: "en", ids: ids.join("|") })).entities ?? {};
  const values = (entity: any, property: string) => (entity.claims?.[property] ?? []).map((claim: any) => claim.mainsnak?.datavalue?.value);
  return ids.filter((id) => entities[id]).map((id) => {
    const entity = entities[id], label = entity.labels?.en?.value ?? "";
    return {
      id, label, names: [label, ...(entity.aliases?.en ?? []).map((alias: { value: string }) => alias.value)].filter(Boolean),
      parents: values(entity, "P279").map((value: any) => value?.id).filter(Boolean),
      image: values(entity, "P18").find((value: unknown) => typeof value === "string"),
    };
  });
}

// Wikidata images are curated but can be small or portrait; public domain files may have no recorded author.
export function usableTypePhoto(file: CommonsFile) {
  const ratio = file.width / file.height;
  return allowedLicense(file.license) && !file.restrictions && file.width >= 1000 && ratio >= 1.2 && ratio <= 2.4 &&
    (Boolean(file.credit) || /^(CC0|Public domain)/i.test(file.license));
}

/** The Wikidata image for the aircraft type a programme names, or null when the type is unknown, ambiguous or unsuitable. */
export async function findTypePhoto(name: string): Promise<TypePhoto | null> {
  const type = pickAircraftType(name, await aircraftTypes(name));
  if (!type?.image) return null;
  const [file] = await commonsFiles({ titles: `File:${type.image}` });
  if (!file || !usableTypePhoto(file)) return null;
  return {
    image: file.thumbUrl, imageSource: file.pageUrl, imageCredit: file.credit || "Wikimedia Commons",
    imageLicense: file.license, imageLicenseUrl: file.licenseUrl || file.pageUrl, imageAlt: `${type.label}, representative photograph`,
  };
}

/** Monitor state is untrusted storage; only Commons-hosted photos are served. */
export function validTypePhoto(value: unknown): value is TypePhoto {
  if (!value || typeof value !== "object") return false;
  const photo = value as Record<string, unknown>;
  return ["image", "imageSource", "imageCredit", "imageLicense", "imageLicenseUrl", "imageAlt"].every((key) => typeof photo[key] === "string" && photo[key]) &&
    /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(String(photo.image)) && String(photo.imageSource).startsWith("https://commons.wikimedia.org/wiki/") &&
    /^https?:\/\//.test(String(photo.imageLicenseUrl)) && allowedLicense(String(photo.imageLicense));
}

/** Look up photos for programme aircraft without one. Misses are retried after 30 days; network errors on the next run. */
export async function fillTypePhotos(
  state: { pages: Record<string, { programmes: Programme[] }>; photos?: TypePhotoLookups },
  lookup = findTypePhoto, now = new Date(), limit = 10,
) {
  const photos = state.photos ??= {};
  const names = new Map<string, string>();
  for (const page of Object.values(state.pages)) for (const programme of page.programmes ?? []) for (const plane of programme.aircraft) {
    const key = typeKey(plane.name);
    if (key && !names.has(key)) names.set(key, plane.name);
  }
  const deadline = Date.now() + 60000;
  let lookups = 0;
  for (const [key, name] of names) {
    if (lookups >= limit || Date.now() > deadline) break;
    const previous = photos[key];
    if (photoForName(name) || previous?.photo || (previous && now.getTime() - Date.parse(previous.checkedAt) < 30 * day)) continue;
    lookups++;
    try { photos[key] = { checkedAt: now.toISOString(), photo: await lookup(name) }; } catch { /* Retry on the next run. */ }
  }
  return photos;
}
