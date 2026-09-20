function jsonOk() {
  return Response.json({ ok: true });
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return new Response("A valid email is required.", { status: 400 });
  }
  const payload = {
    email,
    reason: "website_unsubscribe",
    at: new Date().toISOString(),
  };
  if (env.INBOX) {
    await env.INBOX.put(`unsub:${email}`, JSON.stringify(payload));
  }
  if (env.SUPPRESS_WEBHOOK) {
    await fetch(env.SUPPRESS_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
  const accept = request.headers.get("accept") || "";
  if (accept.includes("application/json")) {
    return jsonOk();
  }
  return Response.redirect(new URL("/unsubscribe/?status=ok", request.url), 303);
}
