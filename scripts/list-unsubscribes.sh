#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npx wrangler kv key list --binding INBOX --prefix "unsub:" --remote --preview false | python3 -c '
import json, sys
payload = sys.stdin.read()
start = payload.find("[")
data = json.loads(payload[start:] if start >= 0 else payload)
for item in data:
    name = item.get("name") or ""
    if name.startswith("unsub:"):
        print(name.split(":", 1)[1])
'
