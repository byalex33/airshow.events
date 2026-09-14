import type { Metadata } from "next";
import { Footer, Header } from "@/components/site";
import { ExperienceProvider, MobileDock } from "@/components/experience";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Airshow Events | Find your next sky-high moment",
    template: "%s | Airshow Events",
  },
  description:
    "Discover UK airshows, follow aircraft and display teams, and build your own flying season. An original discovery app with clearly labelled demo data.",
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
