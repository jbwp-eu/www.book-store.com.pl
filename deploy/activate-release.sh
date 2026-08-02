#!/usr/bin/env bash
# Run on the server as ubuntu after rsync (GitHub Actions CD — OVH).
# Optional env: FORMSPREE_URL, SITE_URL → /var/www/www/shared/.env for systemd.
set -euo pipefail

APP_ROOT=/var/www/www
SERVICE=www-book-store
SHARED_ENV="$APP_ROOT/shared/.env"
RELEASE_SHA="${1:?Usage: activate-release.sh <git-sha>}"

RELEASE="$APP_ROOT/releases/$RELEASE_SHA"

[[ -d "$RELEASE" ]] || { echo "Missing release: $RELEASE"; exit 1; }
[[ -f "$RELEASE/package.json" ]] || { echo "Missing $RELEASE/package.json"; exit 1; }
[[ -d "$RELEASE/build/server" ]] || { echo "Missing $RELEASE/build/server"; exit 1; }

upsert_env_key() {
  local file="$1" key="$2" value="$3"
  mkdir -p "$(dirname "$file")"
  touch "$file"
  grep -v "^${key}=" "$file" > "${file}.tmp" || true
  printf '%s=%s\n' "$key" "$value" >> "${file}.tmp"
  mv "${file}.tmp" "$file"
}

if [[ -n "${FORMSPREE_URL:-}" ]]; then
  upsert_env_key "$SHARED_ENV" FORMSPREE_URL "$FORMSPREE_URL"
  echo "Updated $SHARED_ENV (FORMSPREE_URL)"
fi
if [[ -n "${SITE_URL:-}" ]]; then
  upsert_env_key "$SHARED_ENV" SITE_URL "$SITE_URL"
  echo "Updated $SHARED_ENV (SITE_URL)"
fi

cd "$RELEASE"
npm ci --omit=dev

ln -sfn "$RELEASE" "$APP_ROOT/current"

if ! systemctl cat "${SERVICE}.service" &>/dev/null; then
  echo "Prepared $RELEASE_SHA (current -> $RELEASE)"
  echo "Skip restart: ${SERVICE}.service not installed yet — finish bootstrap (systemd), then re-run deploy."
  exit 0
fi

sudo systemctl restart "$SERVICE"
sleep 3

curl -sf http://127.0.0.1:3000/ >/dev/null
echo "Activated $RELEASE_SHA"
