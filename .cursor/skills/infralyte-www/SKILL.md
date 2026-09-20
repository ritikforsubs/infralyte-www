---
name: infralyte-www
description: Build, preview, and deploy the self-hosted Infralyte marketing site. Never use Lovable.
---

# Infralyte website

```bash
cd ~/Desktop/infralyte-www
npm run build
npm run preview
```

Deploy with Cloudflare Pages, not Lovable:

```bash
npx wrangler pages deploy dist --project-name infralyte-www
```

Public URL target: `https://www.infralyte.com/`. Unsubscribe must stay at `/unsubscribe/`.
