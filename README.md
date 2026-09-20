# Infralyte public website

Clean, self-hosted marketing site for Infralyte. There is no Lovable code, theme, hosting, or `lovable.app` link in this repository.

## Positioning

Infralyte builds AI into existing products and operations — frontier models when they fit, private models when data cannot leave.

## Run locally

```bash
npm run build
npm run check
npm run preview
```

Open `http://127.0.0.1:4177/`. `npm run check` verifies every internal link,
asset, form target, and anchor in `dist/` and must pass before a deploy.

To exercise the contact and unsubscribe Functions locally:

```bash
npx wrangler pages dev dist --port 8788
```

## Inbound enquiries

`functions/contact.js` writes every submission to the `INBOX` KV namespace. If
`RESEND_API_KEY` is configured it also sends one notification to `MAIL_TO`
(default `hello@infralyte.in`), with the visitor's address as `reply_to` only —
this is never an outreach path. Set these as Pages project secrets:

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | send the notification |
| `MAIL_FROM` | verified Resend sender |
| `MAIL_TO` | internal recipient |
| `CONTACT_WEBHOOK` | optional extra forward |

Until the key is set, nothing is emailed. Read the queue with
`bash scripts/list-contacts.sh`.

## Known issue: outbound mail authentication

`infralyte.in` receives fine (Google Workspace MX is live), but sending is not
authenticated:

- SPF is `v=spf1 include:dc-aa8e722993._spfm.infralyte.in ~all` and that include
  host returns **NXDOMAIN**, so SPF evaluates to a PermError.
- No DKIM key is published on the common selectors.
- DMARC is `p=quarantine` with `rua` pointing at `onsecureserver.net`.

Replies from `hello@infralyte.in` can therefore be quarantined. Fix the DNS
before relying on email for enquiries or outreach.

## Hosting

Live now: [https://infralyte-www.pages.dev/](https://infralyte-www.pages.dev/)

Cloudflare Pages project: `infralyte-www` (account `ritikforsubs@gmail.com`). Contact and unsubscribe functions store submissions in KV (`INBOX`). Pull website opt-outs with `bash scripts/list-unsubscribes.sh`, then:

```bash
infralyte-intel ingest-unsubscribes --file unsubs.txt --reason website_unsubscribe
```

Public hostname is `www.infralyte.in`. The zone is in this Cloudflare account and stays **pending** until nameservers finish propagating (`bailey.ns.cloudflare.com` / `corey.ns.cloudflare.com`). After it is active:

1. CNAME `www` → `infralyte-www.pages.dev`
2. CNAME/ALIAS `@` → `infralyte-www.pages.dev`
3. SSL/TLS **Full (strict)**
4. Attach `www.infralyte.in` and `infralyte.in` on the Pages project

Do not point the domain at Lovable or Cloudways. Workspace mail remains `hello@infralyte.in`.

Required public pages for outreach:

- `https://www.infralyte.in/unsubscribe/`
- Offer URLs under `/offers/`
- `https://www.infralyte.in/scan/`
