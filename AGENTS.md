# Agent handoff — Infralyte public website

This repo is the company site. It is not the Lovable project `httpswwwinfralytecom`. Do not copy from that repo, do not deploy to Lovable, and do not link `*.lovable.app`.

Host on Cloudflare Pages (`infralyte-www`) with `www.infralyte.in`. Worker/research runtime stays on M5; this site is static plus Pages Functions for contact and unsubscribe. Workspace mail stays `hello@infralyte.in` (never `.com`).

Never auto-send outreach. Never name confidential consulting customers. Do not claim “20 AI transformations.”

## Build and verify

```bash
npm run build          # renders dist/
npm run check          # every internal link, asset, form target, and anchor must resolve
npm run preview        # http://127.0.0.1:4177/
```

`npm run check` is not optional. It is what caught form targets being rewritten
to `/contact/contact`, which had silently broken the contact form.

## Inbound enquiries

`functions/contact.js` stores every submission in the `INBOX` KV namespace and,
when `RESEND_API_KEY` is set, sends one notification to `MAIL_TO`
(default `hello@infralyte.in`). Without that key nothing is emailed — read the
queue with `bash scripts/list-contacts.sh`. The visitor address is only ever
`reply_to`; this is not an outreach path.

`public/og.png` is generated from `scripts/og-template.html`; the command is in
that file's comment. Regenerate it after a brand change.
