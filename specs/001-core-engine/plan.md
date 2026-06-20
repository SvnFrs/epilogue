# Implementation Plan: Core Engine (Phase 2a)

**Branch**: `001-core-engine` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-core-engine/spec.md`

Companion docs: [research.md](./research.md) · [data-model.md](./data-model.md) ·
[contracts/api.md](./contracts/api.md) · [quickstart.md](./quickstart.md) ·
[deployment.md](./deployment.md) · [testing.md](./testing.md) · [ux-ui.md](./ux-ui.md)

## Summary

Build the single-player Core Engine: a local-first, self-hosted media archive whose core value is
the polymorphic "Previously On" save-state, a cover-forward catalog with a persistent left library
rail, and a structured Ledger. **Architecture: a separate Elysia API on Bun** (owns business logic,
Drizzle data access, owner-scoped authz, and the future share/ingest endpoints) + a **Next.js (App
Router) frontend/BFF on Node** (Server Components fetch the API; client uses TanStack Query over
**Eden** typed client; Zustand for UI-only state; no Server Actions). **Drizzle ORM + PostgreSQL**
with row-level `owner_id`. Self-hosted via Docker Compose (Caddy + web + api + Postgres + backup)
on the Arch laptop.

## Technical Context

**Language/Version**: TypeScript 5.x. **api + tooling/tests on Bun** (latest); **Next.js web server
on Node 22 LTS** (Next standalone is Node-oriented; Bun-on-Next in prod is the riskiest path).
**Frontend** (`apps/web`, Node): Next.js 15 (App Router) · React 19 · TanStack Query v5 · Zustand ·
Tailwind + shadcn/ui · **Eden** typed client. Consumes the API; no Server Actions, no DB access.
**Backend** (`apps/api`, Bun): **Elysia** · Drizzle ORM + drizzle-kit · Elysia `t`/TypeBox
validation · DIY security middleware (`@elysiajs/cors`, security-headers plugin, rate-limit plugin)
· owner-scope middleware (`.derive`/`.guard`).
**Shared**: `packages/contracts` — shared domain schemas/types (Eden carries the API types automatically).
**Storage**: PostgreSQL 17 (single instance, Docker volume; accessed only by the api).
**Testing**: Vitest (FE+BE unit/component) · Testing Library + MSW (FE component) ·
@testcontainers/postgresql (BE integration) · Elysia `.handle()`/Eden for HTTP tests · Playwright
(FE e2e, full stack) · k6 (load vs the api). See `testing.md`.
**Target Platform**: self-hosted Docker on Arch Linux headless laptop (Intel i3-11th, 24GB);
Chromium-first browser support.
**Project Type**: Web app, two tiers (Next.js web on Node + Elysia api on Bun) + Postgres.
**Performance Goals**: reads p95 < 500ms, save-state write p95 < 800ms, error rate < 1% at ≤30
concurrent. First catalog/detail paint server-rendered (RSC fetching the API + hydration).
**Constraints**: local-first (no third-party cloud is a hard dependency); single-player now,
multi-tenant-by-schema (row-level `owner_id` on every table); API not exposed publicly (Tailscale).
Budget: web ~1GB, api ~1GB, Postgres ~2–4GB on the 24GB host.
**Scale/Scope**: one primary user + small invited read groups (Phase 2b); hundreds–low-thousands of entries.

## Constitution Check

*GATE: must pass before Phase 0. Re-checked after design.* Against `.specify/memory/constitution.md` v1.1.0:

| Principle | Status | Note |
|---|---|---|
| I. Cognitive Save-State First | PASS | Polymorphic `VolatileContext` (game/reading/screen/tech) is first-class; US1 is the headline. |
| II. Active Attention Only | PASS | Games/books/screen/tech only; no passive media. |
| III. Digital Paper Aesthetic | PASS | `ux-ui.md` extracts binding tokens/components from `src/`; routed to `/plan-design-review`. |
| IV. Local-First, Single-Player, Multi-Tenant by Schema | PASS+ | Row-level `owner_id`; authz in Elysia owner-scope middleware AND a data-layer repository (defense-in-depth); tenant-isolation integration tests mandatory. Separate API tier strengthens isolation. Self-hosted, no hard cloud dep. |
| V. Structured Digestion over Hoarding | PASS | Ledger `h2/p/quote/callout/embed` block format; sources embedded + synthesized. |
| VI. Evergreen over Ephemeral | PASS (sequenced) | Full-text search in product scope but sequenced to spec 002; Postgres model does not preclude it. Fixed-space taxonomy + non-recency nav (FR-019/020) ARE in this spec. |

**Result: PASS.** Note: Elysia ships fewer built-in security primitives than NestJS, so CORS,
security headers, rate-limiting, and validation are **explicit plan tasks** (not assumed). Tracked
in Complexity + testing (Elysia `.handle()`/Eden HTTP tests exercise them).

## Project Structure

```text
specs/001-core-engine/   # plan.md, spec.md, research.md, data-model.md, contracts/api.md,
                         # quickstart.md, deployment.md, testing.md, ux-ui.md, checklists/

apps/
├── web/                 # Next.js App Router (frontend/BFF, Node) — consumes the API via Eden
│   ├── app/(library)/[space]/   # catalog (library-rail shell in layout)
│   ├── app/entry/[id]/          # split-view detail (context + ledger)
│   ├── components/              # library-rail, catalog card, split-view, context blocks, ledger renderers
│   ├── lib/api/                 # Eden client + TanStack Query hooks
│   └── stores/                  # zustand UI stores
└── api/                 # Elysia backend (Bun)
    ├── src/routes/              # entries, context, ledger, share(stub), ingest(stub), health
    ├── src/db/                  # drizzle client, schema, migrations, repositories (owner-scoped)
    ├── src/middleware/          # owner-scope (.derive/.guard), cors, security-headers, rate-limit
    ├── src/context/             # polymorphic volatile-context resolver
    └── src/app.ts               # Elysia app (its type powers Eden)
packages/
└── contracts/           # shared domain schemas/types (Eden carries API types automatically)
tests/                   # unit · component · integration(testcontainers) · http(.handle/Eden) · e2e(playwright) · load(k6)
docker/                  # Dockerfile.web (Node), Dockerfile.api (Bun), compose, Caddyfile, backup
drizzle/                 # generated SQL migrations (owned by api)
```

**Structure Decision**: Bun-workspace monorepo (`apps/web` on Node, `apps/api` on Bun,
`packages/contracts`). The api is the single owner of business logic + DB; the web tier never
touches Postgres. Eden types the boundary from the Elysia app, no codegen.

## Complexity Tracking

| Choice | Why needed | Simpler alternative rejected because |
|---|---|---|
| Separate Elysia API on Bun | Security isolation requested (D1); Bun-native; retires Server Actions CVE surface | Next.js-only reintroduces the Server Actions surface the user rejected; NestJS-on-Bun is against-the-grain once Bun is the runtime. |
| Eden typed boundary | Type-safe FE↔BE across tiers, no codegen | Hand-synced types drift; an untyped boundary is a correctness/security risk. |
| DIY security middleware (CORS, headers, rate-limit) | Elysia has no built-ins (unlike NestJS) | Skipping them is a real security gap; they are explicit tasks + HTTP tests. |
| Drizzle + owner-scoped repository in the api | Constitution IV (tenant isolation) | A bare query layer risks cross-owner leaks; the repository centralizes scoping for the isolation tests. |
| Testcontainers integration tests | Migrations/tenancy can't be safely mocked | Mocked DB hides schema drift + isolation bugs (highest-risk class). |
| Runtime split (api=Bun, web=Node) | Bun-native api + Node-proven Next.js prod server | Bun-on-Next in prod is the least-trodden path; not worth the risk on the web tier. |
