#!/usr/bin/env bash
# Run from GitHub Actions after deploy (public URL checks).
set -euo pipefail

BASE="${DEPLOY_BASE_URL:-https://www.book-store.com.pl}"
BASE="${BASE%/}"

check() {
  local path="$1"
  echo "==> GET $BASE$path"
  curl -sfS -o /dev/null "$BASE$path"
  echo " OK"
}

check "/"
check "/about"
check "/blog"
check "/projects"
check "/robots.txt"
check "/sitemap.xml"

echo "All smoke checks passed for $BASE"
