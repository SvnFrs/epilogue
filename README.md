# Epilogue

A self-hosted, single-player **cognitive save-state** for the media you're actively living
through — games, books & manga, films/series/anime, and tech logs. Not a tracker of what you
*finished*; a place that remembers *where you are* so you can put a story down for three weeks
and pick it back up cold. A Digital Legacy Museum for one.

> **Status:** Core Engine (Phase 2a) — US1–US4 shipped (save-state, catalog, the Ledger,
> polymorphic families + backlinks) on the "reading-room dark" design language.

## What it does

- **Save-state per entry** — a polymorphic *VolatileContext* sized to the medium: a game's
  checkpoint + open threads + keymap; a book's position + quotes; a screen's episode + rating;
  a tech log's sources + backlinks. Resume exactly where you stopped.
- **The Ledger** — a long-form, magazine-style write-up per entry (headings, quotes, callouts,
  embeds) with editor presets.
- **The catalog** — a Letterboxd-style bento masonry with generative covers, a "Continue" band
  for in-progress entries, and a labeled space/status rail.
- **Polymorphic families + backlinks** — cross-link entries (e.g. a tech log → the game that
  inspired it); re-classifying an entry's media type archives the old save-state rather than
  dropping it.
- **Single-owner isolation** — every row is scoped by `owner_id`; the API gates writes behind a
  shared-secret owner header. Cross-owner reads return 404, never a leak.

## Stack

Bun-workspace monorepo:

| Path | What | Runtime |
|---|---|---|
| `apps/web` | Next.js 15 (App Router) — RSC reads, TanStack Query mutations, Zustand UI state, hand-built UI | Node |
| `apps/api` | Elysia API — all business logic + Drizzle data access (no Next Server Actions) | Bun |
| `packages/contracts` | Shared Zod schemas + Eden types — the single source of truth across both tiers | — |

PostgreSQL 17 · Drizzle ORM (pinned exact) · Eden typed client · Tailwind (reading-room dark
theme). See `specs/001-core-engine/plan.md` + its companions (`research.md`, `data-model.md`,
`contracts/api.md`, `deployment.md`, `testing.md`, `ux-ui.md`) for the full design.

## Develop locally

Requires **Bun** and **Docker** (for Postgres). No global Node needed for the API; the web tier
runs Next under Bun.

```bash
bun install

# 1. Postgres + apply migrations (seeds the single owner)
docker compose -f docker/docker-compose.yml up -d --wait postgres
cp .env.example .env   # set OWNER_SECRET — `openssl rand -hex 32`
DATABASE_URL=postgres://epilogue:epilogue@localhost:5432/epilogue \
  bun run --cwd apps/api db:migrate

# 2. (optional) a curated 10-entry demo library
bun run --cwd apps/api db:seed-demo

# 3. run both tiers
bun run dev:api    # Elysia on :4000
bun run dev:web    # Next on :3000
```

Open <http://localhost:3000>.

## Tests — the pyramid

```bash
bun run test:unit          # Vitest: contracts + context resolver
bun run test:component     # Testing Library / jsdom: rail, catalog, context, ledger
bun run test:integration   # Testcontainers Postgres: owner isolation, archive-on-reclassify, HTTP
bun run test:e2e           # Playwright: the US1–US4 flows
bun run test:load          # k6 scripts (see tests/load/README.md)
```

Run the whole pyramid via the `/test-pyramid` skill.

## Deploy (self-host)

Built in CI, pulled by the host — see `.github/workflows/deploy.yml` and `docker/deploy.sh`.

1. GitHub Actions runs the test pyramid, then builds + pushes `ghcr.io/<owner>/epilogue-api`
   and `…-web` (tagged with the commit sha + `latest`).
2. The host pulls and rolls forward: `IMAGE_TAG=<sha> ./docker/deploy.sh` (pull → migrate
   one-shot → `up -d` → prune). The CI `deploy` job runs this over Tailscale SSH when
   `DEPLOY_ENABLED=true` and the tailnet/SSH secrets are set.
3. Caddy fronts the stack with automatic TLS over Tailscale; nothing is exposed publicly.
4. A backup sidecar runs nightly `pg_dump -Fc`. **Verify restores** with
   `./docker/restore-test.sh` (dumps the live DB, restores into a throwaway, checks row
   counts) — a backup you've never restored isn't a backup.

Run the full stack locally with `docker compose -f docker/docker-compose.yml up -d --build`
(needs `.env`).

## Local host notes (this Arch laptop)

- **No global Node** — only Bun. The web tier builds/runs via `bun --bun next build/start`
  (the `apps/web` scripts already do this).
- **`node` is a broken nvm shim** in non-interactive shells. The real binary is
  `~/.nvm/versions/node/v20.20.0/bin/node`; run Vitest with it on `PATH`
  (`PATH="$HOME/.nvm/.../bin:$PATH" "$HOME/.nvm/.../bin/node" ./node_modules/.bin/vitest …`).
- **Always `rm -rf apps/web/.next`** before a `next start` you intend to serve — an incremental
  build over an existing `.next` intermittently corrupts the chunk graph.
- **Playwright** drives system Chromium (`/usr/bin/chromium`), not its bundled download.

## Governance

`.specify/memory/constitution.md` (v1.2.0). Principle III ("Digital Paper") defines the soul:
serif display type, amber accent, save-state-first, generative covers — inverted to a dark
ground in the reading-room theme (tokens in `DESIGN.md`).
