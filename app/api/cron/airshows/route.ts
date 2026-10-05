import { timingSafeEqual } from "node:crypto";
import { runHostedMonitor } from "@/lib/hosted-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return new Response("Unauthorized", { status: 401 });
  try { return Response.json(await runHostedMonitor()); }
  catch (error) {
    console.error(error instanceof Error ? error.message : "Monitor failed");
    return Response.json({ error: "Collection failed; previous data preserved. Check monitor logs." }, { status: 503 });
  }
}
