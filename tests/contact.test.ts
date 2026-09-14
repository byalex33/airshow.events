import assert from "node:assert/strict";
import { test } from "node:test";
import { sendContact } from "../app/contact/actions";

test("contact validates input, keeps delivery server-side and reports failures", async () => {
  const originalFetch = globalThis.fetch;
  const keys = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;
  const original = keys.map((key) => process.env[key]);
  const form = new FormData();
  form.set("name", "Visitor");
  form.set("email", "visitor@example.com");
  form.set("message", "Please add this airshow <details>.");
  let calls = 0;
  try {
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_FROM_EMAIL = "sender@example.com";
    process.env.CONTACT_TO_EMAIL = "hello@alex.codes";
    globalThis.fetch = async (url, options) => {
      calls++;
      assert.equal(url, "https://api.resend.com/emails");
      const body = JSON.parse(String(options?.body));
      assert.deepEqual(body.to, ["hello@alex.codes"]);
      assert.equal(body.from, "sender@example.com");
      assert.equal(body.reply_to, "visitor@example.com");
      assert.match(body.text, /<details>/);
      assert.equal(body.html, undefined);
      return Response.json({ id: "test-message" });
    };
    assert.equal((await sendContact(form)).ok, true);
    assert.equal(calls, 1);
    form.set("email", "bad\r\nBcc:other@example.com");
    assert.equal((await sendContact(form)).ok, false);
    form.set("email", "visitor@example.com");
    form.set("message", "x".repeat(5001));
    assert.equal((await sendContact(form)).ok, false);
    form.set("message", "Please add this airshow.");
    form.set("website", "spam");
    assert.equal((await sendContact(form)).ok, true);
    assert.equal(calls, 1);
    form.delete("website");
    process.env.RESEND_API_KEY = "";
    assert.equal((await sendContact(form)).ok, false);
    assert.equal(calls, 1);
    process.env.RESEND_API_KEY = "test-key";
    globalThis.fetch = async () => new Response(null, { status: 429 });
    assert.equal((await sendContact(form)).ok, false);
    globalThis.fetch = async () => { throw new Error("Offline"); };
    assert.equal((await sendContact(form)).ok, false);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (original[index] === undefined) delete process.env[key];
      else process.env[key] = original[index];
    });
  }
});
