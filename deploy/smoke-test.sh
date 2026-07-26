#!/usr/bin/env bash
# Run from GitHub Actions after deploy (public URL checks).
set -euo pipefail

BASE="${DEPLOY_BASE_URL:-https://www.book-store.com.pl}"
BASE="${BASE%/}"

echo "==> GET $BASE/"
curl -sfS -o /dev/null "$BASE/"
echo " OK"

echo "==> GET $BASE/about"
curl -sfS -o /dev/null "$BASE/about"
echo " OK"

echo "All smoke checks passed for $BASE"
