import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <span className="eyebrow">OFF THE FLIGHT PLAN</span>
      <h1>This page hasn’t landed.</h1>
      <p>The airshow or aircraft you’re looking for could not be found.</p>
      <Link href="/calendar/">Return to the airshow calendar →</Link>
    </main>
  );
}
