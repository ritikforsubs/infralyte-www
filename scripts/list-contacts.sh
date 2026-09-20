#!/usr/bin/env bash
# Print inbound contact-form submissions held in the INBOX KV namespace.
# Use this when the Resend notification is not configured, or to re-read an enquiry.
set -euo pipefail
cd "$(dirname "$0")/.."

npx wrangler kv key list --binding INBOX --prefix "contact:" --remote --preview false | python3 -c '
import json, sys

payload = sys.stdin.read()
start = payload.find("[")
data = json.loads(payload[start:] if start >= 0 else payload)
keys = sorted(item.get("name", "") for item in data if item.get("name", "").startswith("contact:"))
if not keys:
    print("No contact submissions stored.")
for key in keys:
    print(key)
'

echo
echo "Read one with:"
echo "  npx wrangler kv key get --binding INBOX --remote --preview false '<key>'"
