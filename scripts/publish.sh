#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/render.mjs
node scripts/check-links.mjs

echo
echo "Built and verified dist/. Preview: npm run preview"
echo "Deploy:"
echo "  npx wrangler pages deploy dist --project-name infralyte-www"
