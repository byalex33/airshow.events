import Home from "@/components/home";
import { pageMetadata, siteDescription } from "@/lib/metadata";
export const metadata = pageMetadata("UK airshows & aircraft", siteDescription, "/");
export default function Page() {
  return <Home />;
}
