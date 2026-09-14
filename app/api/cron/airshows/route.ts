import { timingSafeEqual } from "node:crypto";
import { runHostedMonitor } from "@/lib/hosted-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

async function handle(request: Request, harvestOnly: boolean) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return new Response("Unauthorized", { status: 401 });
  if (!process.env.FIRECRAWL_API_KEY) return Response.json({ error: "Missing Firecrawl configuration" }, { status: 503 });
  try { return Response.json(await runHostedMonitor(harvestOnly)); }
  catch (error) {
    console.error(error instanceof Error ? error.message : "Monitor failed");
    return Response.json({ error: "Collection failed; previous data preserved. Check monitor logs." }, { status: 503 });
  }
}
export const GET = (request: Request) => handle(request, false);
export const POST = (request: Request) => handle(request, true);
