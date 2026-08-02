#!/usr/bin/env bash
# Run on EC2 as ubuntu after Docker Hub pull (or image already present).
# Usage: activate-release-docker.sh <www-image-ref>
# Optional env: FORMSPREE_URL, SITE_URL (written into .env for compose)
set -euo pipefail

DOCKER_DIR=/var/www/www/docker
WWW_IMAGE="${1:?Usage: activate-release-docker.sh <www-image>}"

[[ -f "$DOCKER_DIR/docker-compose.yml" ]] || { echo "Missing $DOCKER_DIR/docker-compose.yml"; exit 1; }

if ! docker network inspect book-store >/dev/null 2>&1; then
  echo "Missing Docker network 'book-store'."
  echo "Start nest Compose first (it creates the network), then re-run www deploy."
  exit 1
fi

cd "$DOCKER_DIR"
{
  printf 'WWW_IMAGE=%s\n' "$WWW_IMAGE"
  if [[ -n "${FORMSPREE_URL:-}" ]]; then
    printf 'FORMSPREE_URL=%s\n' "$FORMSPREE_URL"
  fi
  if [[ -n "${SITE_URL:-}" ]]; then
    printf 'SITE_URL=%s\n' "$SITE_URL"
  fi
} > .env
docker compose pull www
docker compose up -d

echo "Waiting for www..."
for i in $(seq 1 30); do
  if docker compose exec -T www node -e \
    "require('http').get('http://127.0.0.1:3000/',r=>process.exit(r.statusCode&&r.statusCode<500?0:1)).on('error',()=>process.exit(1))"; then
    echo "Activated $WWW_IMAGE"
    exit 0
  fi
  sleep 2
done

echo "www did not become healthy in time"
docker compose logs --tail 80 www
exit 1
