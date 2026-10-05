import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { POST } from "../app/api/spend-alert/route";

const secret = "test-secret";
const discord = "https://discord.com/api/webhooks/123/abc";
const alert = (body: string, signature = createHmac("sha1", secret).update(body).digest("hex")) =>
  POST(new Request("https://airshow.events/api/spend-alert/", { method: "POST", headers: { "x-vercel-signature": signature }, body }));

test("relays signed spend alerts to Discord and rejects everything else", async t => {
  const original = [process.env.SPEND_WEBHOOK_SECRET, process.env.DISCORD_WEBHOOK_URL];
  const sent: { url: string; body: { content: string; allowed_mentions: unknown } }[] = [];
  let status = 204;
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    sent.push({ url, body: JSON.parse(String(init.body)) });
    return new Response(null, { status });
  });
  try {
    delete process.env.SPEND_WEBHOOK_SECRET;
    process.env.DISCORD_WEBHOOK_URL = discord;
    const payload = JSON.stringify({ budgetAmount: 20, currentSpend: 15, teamId: "team_x", thresholdPercent: 75 });
    assert.equal((await alert(payload)).status, 503);
    process.env.SPEND_WEBHOOK_SECRET = secret;
    process.env.DISCORD_WEBHOOK_URL = "https://example.com/hook";
    assert.equal((await alert(payload)).status, 503);
    process.env.DISCORD_WEBHOOK_URL = discord;

    assert.equal((await alert(payload, "0".repeat(40))).status, 403);
    assert.equal((await alert(payload, "short")).status, 403);
    assert.equal((await alert("not json")).status, 400);
    assert.equal((await alert(JSON.stringify({ budgetAmount: "20", currentSpend: 15, thresholdPercent: 75 }))).status, 400);
    assert.equal(sent.length, 0);

    assert.equal((await alert(payload)).status, 204);
    assert.equal(sent[0].url, discord);
    assert.equal(sent[0].body.content, "⚠️ Vercel usage is at 75% of the on-demand budget: $15 of $20 this billing cycle.");
    assert.deepEqual(sent[0].body.allowed_mentions, { parse: [] });

    assert.equal((await alert(JSON.stringify({ budgetAmount: 20, currentSpend: 20.5, teamId: "team_x", thresholdPercent: 100 }))).status, 204);
    assert.match(sent[1].body.content, /^🚨 .*100%.*\$20\.5 of \$20.*pause/);

    status = 404;
    assert.equal((await alert(payload)).status, 502);
  } finally {
    [process.env.SPEND_WEBHOOK_SECRET, process.env.DISCORD_WEBHOOK_URL] = original;
    if (original[0] === undefined) delete process.env.SPEND_WEBHOOK_SECRET;
    if (original[1] === undefined) delete process.env.DISCORD_WEBHOOK_URL;
  }
});
