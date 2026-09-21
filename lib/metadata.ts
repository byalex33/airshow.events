import type { Metadata } from "next";

export const siteUrl = "https://airshow.events";
export const siteDescription =
  "Explore selected UK airshows and published aircraft line-ups, with links to official sources. Our growing calendar has partial coverage. Check organisers for updates.";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/share.png",
  imageAlt = "Airshow Events. A good day to look up. Red Arrows in formation.",
): Metadata {
  const socialTitle = `${title} | Airshow Events`;
  const images = [{ url: image, alt: imageAlt }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: "Airshow Events",
      url: path,
      title: socialTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images },
  };
}
