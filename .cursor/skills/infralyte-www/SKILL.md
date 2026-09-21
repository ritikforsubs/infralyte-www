---
name: infralyte-www
description: Build, verify, preview, and deploy the self-hosted Infralyte marketing site. Never use Lovable.
---

# Infralyte website

```bash
cd ~/Desktop/infralyte-www
npm run build      # render dist/
npm run check      # link/asset/form-target/anchor check — must pass before deploy
npm run preview    # http://127.0.0.1:4177/
```

Deploy with Cloudflare Pages, not Lovable:

```bash
npx wrangler pages deploy dist --project-name infralyte-www
```

Public URL target: `https://www.infralyte.in/`. Unsubscribe must stay at
`/unsubscribe/`. Workspace mail is `hello@infralyte.in` (never `.com`).

## Layout

- `scripts/render.mjs` — all pages, offer and industry data, shared layout.
- `src/styles.css` — the whole design system.
- `src/site.js` — mobile menu, scroll reveal, card spotlight, form posting.
- `functions/` — Pages Functions for `/contact` and `/unsubscribe`.
- `scripts/og-template.html` — source for `public/og.png` (regen command inside).

Form targets must stay root-absolute. `rebase()` in `render.mjs` deliberately
rewrites only `href` and `src`; relativising `action` turns `/contact` into
`/contact/contact` and the form silently stops posting.

## Secrets (Cloudflare Pages project settings)

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | send one notification per inbound enquiry |
| `MAIL_TO` | internal recipient, defaults to `hello@infralyte.in` |
| `MAIL_FROM` | verified Resend sender — use an address on `send.infralyte.in`, not the root domain |
| `CONTACT_WEBHOOK` | optional extra forward |

Without `RESEND_API_KEY` enquiries are stored only. Read them with
`bash scripts/list-contacts.sh`; opt-outs with `bash scripts/list-unsubscribes.sh`.

## Credentials

**This repository is public.** No token, key, or `.env` value goes in it, in
`.cursor/`, or in the fleet `~/Desktop/push.cursor` mirror — that mirror is
git-backed and would publish the secret.

Cloudflare Pages and KV work through the wrangler OAuth login (`wrangler whoami`),
which has no DNS scope. DNS edits need a separate token, scoped to
Zone → DNS → Edit on `infralyte.in` and kept in the macOS Keychain on the single
machine that needs it:

```bash
security add-generic-password -U -a "$USER" -s cloudflare-dns-infralyte -w
TOKEN=$(bash scripts/cf-dns-token.sh)
```

Do not copy that token to other lab machines. A DNS-edit token can repoint MX and
take over mail for the domain; one machine holding it limits the blast radius, and
rotating it is then a single action.
