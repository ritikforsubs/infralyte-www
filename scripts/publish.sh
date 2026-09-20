#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/render.mjs
echo "Built dist/. Preview: npm run preview"
echo "GitHub Pages: push gh-pages after review."
echo "Cloudflare Pages (once wrangler is logged in):"
echo "  npx wrangler pages deploy dist --project-name infralyte-www"
echo "  npx wrangler pages domain add www.infralyte.com --project-name infralyte-www"
