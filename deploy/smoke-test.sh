#!/usr/bin/env bash
# Run from GitHub Actions after deploy (public URL checks).
set -euo pipefail

BASE="${DEPLOY_BASE_URL:-https://www.book-store.com.pl}"
BASE="${BASE%/}"

echo "==> GET $BASE/"
curl -sfS "$BASE/" | head -c 200 >/dev/null
echo " OK"

echo "==> GET $BASE/about"
curl -sfS "$BASE/about" | head -c 200 >/dev/null
echo " OK"

echo "All smoke checks passed for $BASE"
