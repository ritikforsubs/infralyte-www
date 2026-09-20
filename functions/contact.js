/**
 * Inbound contact form.
 *
 * Every submission is stored in KV. If RESEND_API_KEY is configured we also send
 * one transactional notification to our own mailbox so a real enquiry is never
 * left sitting unread.
 *
 * This is deliberately not an outreach path: `to` is always the internal mailbox
 * from MAIL_TO, and the visitor's address is only ever used as reply-to.
 */

const INTERNAL_MAILBOX = "hello@infralyte.in";
const MAX_MESSAGE = 5000;

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function wantsJson(request) {
  return (request.headers.get("accept") || "").includes("application/json");
}

function fail(request, status, message) {
  if (wantsJson(request)) {
    return Response.json({ ok: false, error: message }, { status });
  }
  return new Response(message, { status, headers: { "content-type": "text/plain; charset=utf-8" } });
}

async function notify(env, entry) {
  if (!env.RESEND_API_KEY) return false;
  const to = env.MAIL_TO || INTERNAL_MAILBOX;
  const from = env.MAIL_FROM || `Infralyte site <${INTERNAL_MAILBOX}>`;
  const lines = [
    `Name:    ${entry.name}`,
    `Email:   ${entry.email}`,
    `About:   ${entry.purpose}`,
    `At:      ${entry.at}`,
    "",
    entry.message,
  ];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: entry.email,
      subject: `Infralyte enquiry — ${entry.purpose} — ${entry.name}`,
      text: lines.join("\n"),
    }),
  });
  if (!response.ok) {
    console.error("resend failed", response.status, await response.text());
    return false;
  }
  return true;
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return fail(request, 400, "Send this as a form post.");
  }

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const message = String(form.get("message") || "").trim();
  const purpose = String(form.get("purpose") || "other").trim();

  if (!name || !message) {
    return fail(request, 400, "Name and message are required.");
  }
  if (!looksLikeEmail(email)) {
    return fail(request, 400, "A valid email address is required.");
  }
  if (message.length > MAX_MESSAGE) {
    return fail(request, 413, "That message is too long. Please email us instead.");
  }

  const entry = {
    kind: "contact",
    name,
    email,
    purpose,
    message,
    at: new Date().toISOString(),
  };

  let stored = false;
  if (env.INBOX) {
    try {
      await env.INBOX.put(`contact:${entry.at}:${email}`, JSON.stringify(entry));
      stored = true;
    } catch (error) {
      console.error("kv put failed", error);
    }
  }

  let notified = false;
  try {
    notified = await notify(env, entry);
  } catch (error) {
    console.error("notify threw", error);
  }

  if (env.CONTACT_WEBHOOK) {
    try {
      await fetch(env.CONTACT_WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error("webhook failed", error);
    }
  }

  // Nothing captured it and nobody was told — say so rather than pretend.
  if (!stored && !notified) {
    return fail(request, 502, `We could not record that. Please email ${env.MAIL_TO || INTERNAL_MAILBOX}.`);
  }

  if (wantsJson(request)) {
    return Response.json({ ok: true });
  }
  return Response.redirect(new URL("/contact/?sent=1", request.url), 303);
}
