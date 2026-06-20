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
Tailwind (hand-built components, no component lib) · **Eden** typed client. Consumes the API; no Server Actions, no DB access.
**Backend** (`apps/api`, Bun): **Elysia** · Drizzle ORM + drizzle-kit · **Zod** validation (via
Elysia Standard Schema, schemas from `packages/contracts`) · DIY security middleware
(`@elysiajs/cors`, security-headers plugin, rate-limit plugin) · owner-scope middleware reading the
`X-Epilogue-Owner` header (`.derive`/`.guard`).
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

## Engineering Review (2026-06-20)

Mode: FULL_REVIEW. Step 0: scope accepted — **walking skeleton first** (prove the Bun + Elysia +
Eden + Drizzle-on-Bun combo on one vertical slice before building wide).

### Decisions (this review)
- **Issue 1 + outside-voice #1 — owner auth:** `X-Epilogue-Owner` **+ `X-Epilogue-Owner-Secret`**
  (shared Docker secret only the web tier holds); API rejects the header without the secret. `/share`
  + `/ingest` use their own auth and never read the owner header.
- **Issue 2 — web framework:** keep **Next.js** (SSR/RSC for Phase 2b shareable + SEO, the wedge's
  differentiator). The walking skeleton validates the RSC↔Eden seam; **Vite SPA is the bail-out** if
  that seam is painful.
- **Issue 3 — schema lib:** **Zod everywhere** via Elysia Standard Schema, defined once in
  `packages/contracts`, reused by routes + resolver + tests.

### What already exists (reuse, don't rebuild)
`src/` POC supplies catalog grid, cover cards + generative covers, status pills, game/reading/tech
context blocks, ledger renderers, bible-verse quote — reused per `ux-ui.md`. NEW: library rail,
screen/cinema context block, the real data layer, real embeds, owner-scope.

### NOT in scope (deferred, with rationale)
- Full-text search → spec 002 (constitution VI; data model doesn't preclude it).
- Bi-directional `@`-link graph → roadmap item 3 (Phase 2a keeps the basic TECH_LOG backlink only).
- Sub-space taxonomy + chronological archive → roadmap item 4 (fixed `space` only this phase).
- Phase 2b shareable read-only sub-space; multi-user auth → Phase 3.
- quick-capture / sync-agent / Kindle import → `TODOS.md`.

### Failure modes (new codepaths)
| Codepath | Failure | Test? | Error handling? | Silent? |
|---|---|---|---|---|
| `POST /entries` | FK violation: no `users` row seeded | integration | 500 | **was silent → T3 (critical)** |
| any write | migrate not run before serve | integration | inconsistent | **was silent → T3 (critical)** |
| owner header | forged on the bridge | HTTP test | 401 | fixed (shared secret) |
| `PUT /ledger`,`/context` | unbounded JSONB body | integration | 413 | degrades → T5 |
| `POST /backlinks` | `toEntryId` other-owner | integration | 404 | leak → T6 |
| RSC → Elysia (Eden) | API down at first paint | e2e | error boundary | blank page → T1 covers |

Two **critical gaps** (silent + no handling) — unseeded owner and unmigrated DB — both closed by T3.

### Test coverage (walking skeleton)
```
WALKING SKELETON: GAME + US1 (resume paused game cold)
[+] api: POST /entries, PUT /context, GET /entries/:id
  ├── [→unit]        resolver (game family shape)                 — vitest
  ├── [→integration] owner-scope + cross-owner leak + cold read    — testcontainers + Elysia .handle()
  └── [→http]        X-Epilogue-Owner(+secret) accepted/rejected   — Elysia .handle()
[+] web: /entry/[id] split-view via Eden (RSC server fetch)
  ├── [→component]   context block renders checkpoint/threads/keymap — Testing Library + MSW
  └── [→e2e]         open paused entry, see save-state, edit, reload — Playwright (full stack)
COVERAGE TARGET: 1 test per tier on the slice (proves the stack), then expand per testing.md.
```
Full Phase 2a coverage is specified in `testing.md` (pyramid 65/25/8/2); no gaps there.

### Parallelization
Skeleton is **sequential** (one vertical slice, shared modules). After it merges:
`Lane A: apps/api routes + repositories` · `Lane B: apps/web screens/components` · `Lane C: packages/contracts schemas (do first, both depend on it)`. Order: C → (A ∥ B) → tests.

### Implementation Tasks
Synthesized from findings; checkbox as you ship. P1 blocks the skeleton/ship.

- [ ] **T1 (P1)** — walking skeleton: GAME + US1 end-to-end (Next RSC → Eden → Elysia → Drizzle → Postgres), deployed via compose, 1 test/tier. *Surfaced by: Step 0.* Verify: e2e green + reachable on the tailnet.
- [ ] **T2 (P1)** — owner-scope middleware: `X-Epilogue-Owner` + secret; reject without; `/share`+`/ingest` separate auth. *Issue 1 / OV#1,#2.*
- [ ] **T3 (P1, critical)** — migrate as a one-shot service that exits 0 before api/web; seed the single owner in it. *OV#6,#9.*
- [ ] **T4 (P1)** — Zod schemas in `packages/contracts` as single source (routes via Standard Schema + resolver + tests); spike Eden type-inference from Zod routes. *Issue 3 / OV#4.*
- [ ] **T5 (P2)** — body-size + JSONB length caps on `PUT /ledger`,`/context`. *OV#3.*
- [ ] **T6 (P2)** — backlink `toEntryId` owner-scope (404 otherwise). *OV#7.*
- [ ] **T7 (P2)** — `archived_context` jsonb on Entry for media_type-change archive. *OV#8.*
- [ ] **T8 (P2)** — DIY security middleware: `@elysiajs/cors`, security-headers, rate-limit on writes + `/ingest`. *Plan / Section 2.*
- [ ] **T9 (P2)** — server-only Eden factory (absolute API URL + injects owner header/secret) for RSC. *OV#5.*
- [ ] **T10 (P3)** — Drizzle exit note: pin lockfile + document Kysely as the escape hatch. *OV#10.*
- [ ] **T11 (P2)** — hand-build accessible interactive widgets (status listbox, menus, any dialog) to WAI-ARIA per `ux-ui.md`; dedicated keyboard-nav + focus tests (no Radix/shadcn safety net). *Design review — no component lib.*

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | clean | hybrid wedge chosen |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | issues_found | 3 issues (all resolved) + 10 outside-voice gaps (1 resolved, 9 → tasks); 2 critical gaps → T3 |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | clean | 7→9/10 (targeted); labeled 240px rail + key states + a11y specified in ux-ui.md |

- **OUTSIDE VOICE:** Claude subagent (Codex not installed) — 10 findings; #1 (owner-header forgery) accepted and folded; #2–#10 captured as T2–T10.
- **CROSS-MODEL:** one tension (owner auth); resolved toward the outside voice (shared secret).
- **VERDICT:** ENG + DESIGN CLEARED (walking-skeleton-first) — ready to implement (T1 skeleton). Design: 7→9/10, labeled 240px rail + key states + a11y in `ux-ui.md`; no component lib (hand-built, a11y via T11).

NO UNRESOLVED DECISIONS
