import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import type { AircraftPhotoEntry } from "../lib/content";
import { allowedLicense, commonsFiles, type CommonsFile } from "../lib/aircraft-photo-lookup";

// Finds freely licensed aircraft photos on Wikimedia Commons and imports them with their credits.
const manifestPath = resolve("lib/aircraft-photos.json");
const width = 1600;

// Landscape, large enough for hero crops, and free of trademark or personality-rights restrictions.
export function suitable(file: CommonsFile) {
  const ratio = file.width / file.height;
  return allowedLicense(file.license) && !file.restrictions && file.width >= width && ratio >= 1.2 && ratio <= 2.4;
}

export async function search(terms: string) {
  const files = (await commonsFiles({ generator: "search", gsrnamespace: "6", gsrlimit: "50", gsrsearch: `${terms} filetype:bitmap` }, 480)).filter(suitable);
  return files.slice(0, 12);
}

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Search rank says nothing about photo quality, so pick from a contact sheet.
export function contactSheet(terms: string, files: CommonsFile[]) {
  const cards = files.map((file, index) => `<figure><a href="${escape(file.pageUrl)}"><img src="${escape(file.thumbUrl)}" alt=""></a><figcaption><b>${index + 1}.</b> ${escape(file.credit)} · ${escape(file.license)} · ${file.width}×${file.height}<code>npm run aircraft:photo -- add SLUG "${escape(file.title)}"</code></figcaption></figure>`).join("\n");
  return `<!doctype html><meta charset="utf-8"><title>${escape(terms)}</title><style>body{font:14px system-ui;margin:16px;background:#f6f6f6}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}figure{margin:0;background:#fff;padding:8px}img{width:100%;aspect-ratio:3/2;object-fit:cover}code{display:block;margin-top:6px;font-size:12px;word-break:break-all;user-select:all}</style><h1>${escape(terms)}</h1><main>${cards}</main>`;
}

export async function add(slug: string, title: string, options: { names?: string[]; alt?: string } = {}): Promise<AircraftPhotoEntry> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error("Use a lowercase aircraft slug, e.g. lancaster");
  const [file] = await commonsFiles({ titles: title.startsWith("File:") ? title : `File:${title}` });
  if (!file) throw new Error(`No Commons file named ${title}`);
  if (!allowedLicense(file.license)) throw new Error(`${file.license || "Unknown licence"} is not on the allowed licence list`);
  if (!file.credit) throw new Error("Commons records no author for this file; choose another");
  if (file.restrictions) console.warn(`Warning: Commons lists restrictions for this file: ${file.restrictions}`);
  const response = await fetch(file.thumbUrl, { headers: { "User-Agent": "airshow.events aircraft photos (https://airshow.events/contact/)" }, signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Image download returned ${response.status}`);
  const image = `/images/aircraft/${slug}.webp`;
  await mkdir(resolve("public/images/aircraft"), { recursive: true });
  await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(resolve(`public${image}`));
  const manifest: Record<string, AircraftPhotoEntry> = JSON.parse(await readFile(manifestPath, "utf8"));
  const previous = manifest[slug] ?? {};
  const photo: AircraftPhotoEntry = {
    image, imageSource: file.pageUrl, imageCredit: file.credit, imageLicense: file.license, imageLicenseUrl: file.licenseUrl || file.pageUrl,
    ...(options.alt ?? previous.imageAlt ? { imageAlt: options.alt ?? previous.imageAlt } : {}),
    ...(options.names?.length || previous.names ? { names: options.names?.length ? options.names : previous.names } : {}),
  };
  manifest[slug] = photo;
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
  return photo;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "search" && args.length) {
    const files = await search(args.join(" "));
    if (!files.length) console.log("No suitable photos. Try broader terms, e.g. the aircraft type without a serial.");
    files.forEach((file, index) => console.log(`${index + 1}. ${file.title}\n   ${file.width}×${file.height} · ${file.license} · ${file.credit}\n   ${file.pageUrl}\n`));
    if (files.length) {
      await mkdir(resolve(".aircraft-photos"), { recursive: true });
      await writeFile(resolve(".aircraft-photos/search.html"), contactSheet(args.join(" "), files));
      console.log("Preview: open .aircraft-photos/search.html");
    }
  } else if (command === "add" && args.length >= 2) {
    const flag = (name: string) => args.flatMap((arg, i) => arg === name && args[i + 1] ? [args[i + 1]] : []);
    const positional = args.filter((arg, i) => !arg.startsWith("--") && !args[i - 1]?.startsWith("--"));
    const names = flag("--name"), [alt] = flag("--alt");
    if (positional.length !== 2 || (names.length && !alt)) throw new Error("add needs a slug and a file name, and --alt whenever --name is used");
    const photo = await add(positional[0], positional[1], { names, alt });
    console.log(`Saved public${photo.image}\nCredit: ${photo.imageCredit}, ${photo.imageLicense}`);
    if (photo.names) console.log(`Programme aircraft named ${photo.names.join(" or ")} will use this photo.`);
  } else {
    console.log('Usage:\n  npm run aircraft:photo -- search <terms>\n  npm run aircraft:photo -- add <slug> "File:<Commons file name>" [--name "<programme name>" ... --alt "<alt text>"]');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
}
