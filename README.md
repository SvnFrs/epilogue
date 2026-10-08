# Epilogue

A private commonplace book for one reader: everything played, read, watched and listened to,
exactly where each one was left, and what is meant to happen next. Self-hosted, always online,
used on an iPhone XS, a Mi 10S and a 34″ ultrawide. No accounts, sharing, community, feeds or
public scores.

> **Status (2026-10-09):** the design system is done and the documents describe the rebuild
> (spec 002). The 001 Core Engine in this repo still runs, but its UI and domain model are
> superseded; see [Build status](#build-status).

## What it is

- **Two parts that never mix.** **Media**: game, book, manga, anime, film, series, music, poem,
  story. **Prologue**: tasks and dreams. A task may link a media entry for reference only.
- **Three shelves in each part**, Waiting · Open · Closed, read off each item's state, never
  filed by hand. An Open item untouched for 21 days gets one quiet offer to go back to Waiting,
  place kept; it is never automatic and never repeated.
- **Coming back is the core job.** *Where I left it* comes first on an open entry: the position,
  a short note, up to three facts, and pinned keys for games. The log sheet pairs the stepper with
  that bookmark, so stopping always leaves one. Margin notes, one review per entry, a five-step
  verdict in words (no numbers), and progress as a page edge, or sittings for things that never
  end.
- **Adding** searches TMDB, AniList, IGDB or Open Library through Epilogue's own server; adding
  by hand is always one tap away; nothing is added twice; new entries land on Waiting.
- **Each part has its own Find and its own Journal.** Saves are optimistic; a failed save shows
  an inline error with Retry and never loses typed text.
- **Nothing performs or nags**: no streaks, scores or reminders.

## Design

The interface language is **Marginalia**, in [`design/marginalia/`](design/marginalia/README.md):
Paper and Lamplight themes, Literata + Lexend shipped as font files, no italics, one lamp per
view, and contrast rules that hold in both themes. [`DESIGN.md`](DESIGN.md) summarises it; the
design system is authoritative.

## Documents

| | |
| --- | --- |
| Rules | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) (v2.0.0) |
| Interface | [`design/marginalia/`](design/marginalia/README.md) (authoritative), [`DESIGN.md`](DESIGN.md) (summary) |
| Active spec | [`specs/002-marginalia-rebuild/spec.md`](specs/002-marginalia-rebuild/spec.md) |
| Why and what | [`docs/vision.md`](docs/vision.md), [`PRODUCT.md`](PRODUCT.md) |
| What's next | [`docs/roadmap.md`](docs/roadmap.md), [`TODOS.md`](TODOS.md) |
| History | [`specs/001-core-engine/`](specs/001-core-engine/), [`src/`](src/) (the Phase 1 mockup), [`docs/ceo-review-2026-06-20.md`](docs/ceo-review-2026-06-20.md), [`docs/lessons-learned.md`](docs/lessons-learned.md) |

## Build status

1. **Design system**: done (`design/marginalia/`, 2026-10-08).
2. **Constitution v2.0.0**: done (2026-10-09).
3. **Spec 002, the rebuild**: drafted; three questions are open (`TODOS.md`).
4. **Plan, build, then use it for 2–4 weeks**: not started (`docs/roadmap.md`).

**The 001 Core Engine exists and runs**: a Bun-workspace monorepo with a Next.js 15 web tier
(`apps/web`), an Elysia API on Bun (`apps/api`), shared Zod contracts (`packages/contracts`),
Drizzle + PostgreSQL 17, a test pyramid, and a Docker + Tailscale self-host deploy with backups.
Its **UI** (the reading-room dark catalog, split-view detail and Ledger editor) and its **domain
model** (four spaces, `TECH_LOG`, the Ledger block format, the PLAYING / READING / AIRING
statuses) are **superseded** by spec 002. Which parts of the code and the deploy carry over is
decided in 002's plan. Until then, the instructions below describe the 001 code as it stands.

## Running the 001 code

Requires **Bun** and **Docker** (for Postgres).

```bash
bun install

# 1. Postgres + apply migrations (seeds the single owner)
docker compose -f docker/docker-compose.yml up -d --wait postgres
cp .env.example .env   # set OWNER_SECRET: `openssl rand -hex 32`
DATABASE_URL=postgres://epilogue:epilogue@localhost:5432/epilogue \
  bun run --cwd apps/api db:migrate

# 2. (optional) a curated 10-entry demo library
bun run --cwd apps/api db:seed-demo

# 3. run both tiers
bun run dev:api    # Elysia on :4000
bun run dev:web    # Next on :3000
```

Tests: `bun run test:unit`, `test:component`, `test:integration` (Testcontainers Postgres),
`test:e2e` (Playwright), `test:load` (k6); or the whole pyramid via the `/test-pyramid` skill.

Deploy: CI builds and pushes images to GHCR; the host rolls forward with
`IMAGE_TAG=<sha> ./docker/deploy.sh`; Caddy serves only on the tailnet; a backup sidecar keeps
7 daily + 4 weekly `pg_dump -Fc` dumps, and `./docker/restore-test.sh` proves they restore. Host
setup and known gaps: `specs/001-core-engine/deployment.md` (in the historical spec folder, but
accurate for this code).

### Local host notes (this Arch laptop)

- **No global Node**: only Bun. The web tier builds and runs via `bun --bun next build/start`
  (the `apps/web` scripts already do this).
- **`node` is a broken nvm shim** in non-interactive shells. The real binary is
  `~/.nvm/versions/node/v20.20.0/bin/node`; run Vitest with it on `PATH`.
- **Always `rm -rf apps/web/.next`** before a `next start` you intend to serve: an incremental
  build over an existing `.next` intermittently corrupts the chunk graph.
- **Playwright** drives system Chromium (`/usr/bin/chromium`), not its bundled download.

## Governance

`.specify/memory/constitution.md` v2.0.0: coming back first; two parts, three shelves, never
mixed; Marginalia is the design language; one reader, self-hosted, always online; nothing
performs or nags. Where any document disagrees with `design/marginalia/`, the design system
wins.
