import type { Metadata } from "next";
import { siteDescription, siteUrl } from "@/lib/metadata";
import { Footer, Header } from "@/components/site";
import { ExperienceProvider, MobileDock } from "@/components/experience";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Airshow Events",
  title: {
    default: "Airshow Events | UK airshows & aircraft",
    template: "%s | Airshow Events",
  },
  description: siteDescription,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <ExperienceProvider>
          <Header />
          {children}
          <Footer />
          <MobileDock />
        </ExperienceProvider>
      </body>
    </html>
  );
}
