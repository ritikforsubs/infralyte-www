# Infralyte public website

Clean, self-hosted marketing site for Infralyte. There is no Lovable code, theme, hosting, or `lovable.app` link in this repository.

## Positioning

Infralyte builds AI into existing products and operations — frontier models when they fit, private models when data cannot leave.

## Run locally

```bash
npm run build
npm run preview
```

Open `http://127.0.0.1:4177/`.

## Hosting

Live now: [https://ritikforsubs.github.io/infralyte-www/](https://ritikforsubs.github.io/infralyte-www/)

`www.infralyte.com` is already on Cloudflare but currently 403s. To put this site on the real domain, in Cloudflare DNS:

1. CNAME `www` → `ritikforsubs.github.io` (proxied is fine)
2. Apex ALIAS/ANAME/CNAME flatten → `ritikforsubs.github.io`
3. SSL/TLS mode **Full**
4. Put a `CNAME` file containing `www.infralyte.com` back in `public/` and republish `gh-pages`

Do not point the domain at Lovable.

Preferred later: Cloudflare Pages (`npx wrangler pages deploy dist --project-name infralyte-www`) so `/contact` and `/unsubscribe` functions run. GitHub Pages serves the static site only.

Required public pages for outreach:

- `https://www.infralyte.com/unsubscribe/`
- Offer URLs under `/offers/`
- `https://www.infralyte.com/scan/`
