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

Cloudflare Pages project `infralyte-www`, custom domain `www.infralyte.com`.

```bash
npx wrangler pages deploy dist --project-name infralyte-www
```

Then in Cloudflare DNS, point `www` and apex at the Pages project. Do not point the domain at Lovable.

Required public pages for outreach:

- `https://www.infralyte.com/unsubscribe/`
- Offer URLs under `/offers/`
- `https://www.infralyte.com/scan/`
