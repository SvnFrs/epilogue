# Quickstart: Core Engine (Phase 2a)

## Local development

Prereqs: Bun (latest), Node 22 LTS (for the Next.js web server), Docker (local Postgres). Bun
workspace monorepo: `apps/web` (Next.js on Node), `apps/api` (Elysia on Bun), `packages/contracts`.

```bash
bun install                                     # all workspaces

# local Postgres
docker run -d --name epi-pg -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:17-alpine

cp apps/api/.env.example apps/api/.env          # DATABASE_URL=postgres://postgres:dev@localhost:5432/epilogue
cp apps/web/.env.example apps/web/.env          # API_URL=http://localhost:4000

bun --filter api db:migrate                     # drizzle-kit migrate (ORM lives in the api)
bun --filter api db:seed                        # local owner + sample entries (RDR2, Karamazov, Vim)

bun dev                                          # parallel: api (Bun) on :4000, web (Next) on :3000
```

## Tests (see testing.md for the full pyramid)

```bash
bun run test:unit          # vitest (node) — resolver, ledger (de)serialize, formatters
bun run test:component     # vitest (jsdom) + Testing Library + MSW
bun run test:integration   # vitest + testcontainers Postgres — owner-scoping, CRUD, polymorphic persistence
bun run test:e2e           # playwright — US1–US4 against the built full stack + disposable DB
bun run test:load          # k6 — smoke locally; average/stress on the server
```

Or run the whole pyramid via the project skill: `/test-pyramid`.

## First self-host deploy (summary — full plan in deployment.md)

1. Containerize: `Dockerfile.web` (Node, Next `output:"standalone"`) + `Dockerfile.api` (`oven/bun` base) + `.dockerignore`.
2. On the Arch laptop: `tailscale up --ssh`; install Docker (done).
3. `docker compose up -d postgres`; run migrations; then `docker compose up -d` (Caddy + web + backup).
4. Reach it at `https://epilogue.<tailnet>.ts.net` over Tailscale.
5. CI: GitHub Actions builds → pushes `ghcr.io/SvnFrs/epilogue:<sha>` → SSHes over Tailscale to run `deploy.sh` (`docker compose pull && up -d`).

## Definition of done (Phase 2a)
US1–US4 pass e2e; integration suite proves owner isolation; the app runs from the Docker Compose
stack on the laptop; `src/` Digital Paper tokens applied (passes `/plan-design-review`); a nightly
pg_dump backup runs and has been restore-tested once.
