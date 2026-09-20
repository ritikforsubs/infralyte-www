export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const payload = Object.fromEntries(form.entries());
  if (env.CONTACT_WEBHOOK) {
    await fetch(env.CONTACT_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "contact", ...payload }),
    });
  }
  const accept = request.headers.get("accept") || "";
  if (accept.includes("application/json")) {
    return Response.json({ ok: true });
  }
  return Response.redirect(new URL("/contact/?sent=1", request.url), 303);
}
