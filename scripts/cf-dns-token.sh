#!/usr/bin/env bash
# Print the Cloudflare DNS-edit token for infralyte.in from the macOS Keychain.
#
# This file contains no secret. The token lives only in the Keychain, on the one
# machine that needs it. Never write it to a repo file, a dotfile that syncs, or
# the fleet .cursor mirror — this repository is public.
#
# Store or replace the token (run locally; -w with no value prompts, so the
# token never lands in shell history):
#
#   security add-generic-password -U -a "$USER" -s cloudflare-dns-infralyte -w
#
# Use it:
#
#   TOKEN=$(bash scripts/cf-dns-token.sh)
#
# Scope it to Zone → DNS → Edit on infralyte.in only. A token with DNS edit can
# repoint MX and take over mail for the domain, so treat it accordingly.
set -euo pipefail

if ! token=$(security find-generic-password -a "$USER" -s cloudflare-dns-infralyte -w 2>/dev/null); then
  echo "No Keychain item 'cloudflare-dns-infralyte' for user $USER." >&2
  echo "Add one with: security add-generic-password -U -a \"\$USER\" -s cloudflare-dns-infralyte -w" >&2
  exit 1
fi

printf '%s' "$token"
