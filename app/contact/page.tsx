import { ContactForm } from "./contact-form";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Contact us",
  "Suggest an airshow, report a correction or get in touch with Airshow Events. Include event dates, the location and an official link.",
  "/contact/",
);

export default function ContactPage() {
  return (
    <main id="main" className="container contact-page">
      <ContactForm />
    </main>
  );
}
