import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

// Relays Vercel Spend Management alerts (50%, 75% and 100% of the on-demand budget) to Discord.
// Vercel signs each alert with the secret shown when the webhook is saved.
export async function POST(request: Request) {
  const secret = process.env.SPEND_WEBHOOK_SECRET;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (!secret || !discord?.startsWith("https://discord.com/api/webhooks/")) return Response.json({ error: "Spend alerts are not configured" }, { status: 503 });
  const body = await request.text();
  const expected = Buffer.from(createHmac("sha1", secret).update(body).digest("hex"));
  const actual = Buffer.from(request.headers.get("x-vercel-signature") ?? "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return Response.json({ error: "Invalid signature" }, { status: 403 });
  let alert: { budgetAmount?: unknown; currentSpend?: unknown; thresholdPercent?: unknown };
  try { alert = JSON.parse(body); } catch { return Response.json({ error: "Invalid payload" }, { status: 400 }); }
  const { budgetAmount, currentSpend, thresholdPercent } = alert;
  if (![budgetAmount, currentSpend, thresholdPercent].every((value) => typeof value === "number" && Number.isFinite(value))) return Response.json({ error: "Invalid payload" }, { status: 400 });
  const usd = (amount: number) => `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const reached = (thresholdPercent as number) >= 100;
  const content = `${reached ? "🚨" : "⚠️"} Vercel usage is at ${thresholdPercent}% of the on-demand budget: ${usd(currentSpend as number)} of ${usd(budgetAmount as number)} this billing cycle.` +
    (reached ? " Production deployments pause if Pause Production Deployments is on." : "");
  const response = await fetch(discord, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, allowed_mentions: { parse: [] } }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error(`Discord webhook returned ${response.status}`);
    return Response.json({ error: "Discord delivery failed" }, { status: 502 });
  }
  return new Response(null, { status: 204 });
}
