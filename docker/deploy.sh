#!/usr/bin/env bash
# T045 — laptop-side deploy. Pulls the GHCR images built by CI and rolls the stack
# forward. Idempotent and pull-only (no local build): the laptop never compiles.
# Invoked by the CI deploy job over Tailscale SSH, or by hand:
#   IMAGE_TAG=<sha|latest> ./docker/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

IMAGE_TAG="${IMAGE_TAG:-latest}"
COMPOSE="docker compose -f docker/docker-compose.yml"

echo "→ deploying epilogue @ ${IMAGE_TAG}"

# .env (OWNER_SECRET, POSTGRES_*, OWNER_ID, WEB_ORIGIN) must exist on the host; it is
# never committed. docker/.env is symlinked to it.
if [ ! -f docker/.env ] && [ ! -f .env ]; then
  echo "✗ no .env found — copy .env.example → .env and set OWNER_SECRET first" >&2
  exit 1
fi

# log in to GHCR if a token is provided (CI exports it; interactive hosts use a stored login)
if [ -n "${GHCR_TOKEN:-}" ] && [ -n "${GHCR_USER:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
fi

export IMAGE_TAG

echo "→ pulling images"
$COMPOSE pull --quiet postgres caddy api web

echo "→ applying migrations (one-shot)"
$COMPOSE run --rm migrate

echo "→ rolling services forward"
$COMPOSE up -d --no-build --remove-orphans postgres api web caddy backup

echo "→ pruning dangling images"
docker image prune -f >/dev/null || true

echo "→ health"
$COMPOSE ps
echo "✓ deploy complete @ ${IMAGE_TAG}"
