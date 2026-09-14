"use server";

export async function sendContact(form: FormData) {
  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  if (read("website")) return { ok: true, message: "Thanks, your message has been sent." };
  const name = read("name");
  const email = read("email");
  const message = read("message");
  if (!name || name.length > 100 || email.length > 254 ||
      !/^[^\s@<>(),;:\\"]+@[^\s@<>(),;:\\"]+\.[^\s@<>(),;:\\"]+$/.test(email) ||
      message.length < 10 || message.length > 5000) {
    return { ok: false, message: "Enter your name, a valid email and a message between 10 and 5,000 characters." };
  }
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    return { ok: false, message: "The contact form is temporarily unavailable. Please try again later." };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: "Airshow Events contact form",
        text: `From: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Email delivery failed");
    return { ok: true, message: "Thanks, your message has been sent." };
  } catch {
    return { ok: false, message: "We couldn't send your message. Please try again in a moment." };
  }
}
