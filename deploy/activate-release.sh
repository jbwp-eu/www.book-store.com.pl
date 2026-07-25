#!/usr/bin/env bash
# Run on OVH VPS as ubuntu after rsync (GitHub Actions CD).
set -euo pipefail

APP_ROOT=/var/www/www
SERVICE=www-book-store
RELEASE_SHA="${1:?Usage: activate-release.sh <git-sha>}"

RELEASE="$APP_ROOT/releases/$RELEASE_SHA"

[[ -d "$RELEASE" ]] || { echo "Missing release: $RELEASE"; exit 1; }
[[ -f "$RELEASE/package.json" ]] || { echo "Missing $RELEASE/package.json"; exit 1; }
[[ -d "$RELEASE/build/server" ]] || { echo "Missing $RELEASE/build/server"; exit 1; }

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
