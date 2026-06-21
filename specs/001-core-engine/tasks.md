# Tasks: Core Engine (Phase 2a)

**Input**: Design docs in `specs/001-core-engine/` (plan.md, spec.md, research.md, data-model.md,
contracts/api.md, ux-ui.md, testing.md). Stack: Next.js (web, Node) + Elysia (api, Bun) + Drizzle +
PostgreSQL, Eden typed boundary, hand-built UI (no component lib), Zod via Standard Schema.

**Tests**: INCLUDED (the testing pyramid is in scope — `testing.md` + `/test-pyramid`).

**Walking-skeleton-first** (eng-review Step 0): the MVP milestone is Setup + Foundational + the
minimal US1 vertical slice (T020, T021, T022, T024, T024-e2e) deployed end-to-end, proving the
Bun + Elysia + Eden + Drizzle-on-Bun combo BEFORE building wide.

**Format**: `- [ ] [ID] [P?] [Story?] Description (file path)`. [P] = parallelizable.

## Phase 1: Setup

- [x] T001 Init Bun-workspace monorepo (root `package.json` workspaces `apps/*`,`packages/*`; `.gitignore` dist/.gstack)
- [x] T002 [P] Scaffold `apps/web` Next.js 15 App Router, TS, `output:"standalone"`
- [x] T003 [P] Scaffold `apps/api` Elysia on Bun, TS, in `apps/api/src/app.ts`
- [x] T004 [P] Scaffold `packages/contracts` (TS + Zod) for shared schemas/types
- [x] T005 Tailwind + Digital Paper theme tokens (stone/amber/emerald, Playfair/Geist/Geist-Mono, radii, shadows, paper texture) in `apps/web/app/globals.css` + `tailwind.config.ts` per ux-ui.md
- [x] T006 [P] Drizzle + drizzle-kit + `postgres.js` driver config in `apps/api/src/db/`
- [x] T007 [P] `docker/`: `Dockerfile.web` (Node), `Dockerfile.api` (oven/bun), `docker-compose.yml` (caddy/web/api/postgres/backup), `Caddyfile`
- [x] T008 [P] Test infra: Vitest `projects` (unit/component/integration), Playwright config, `tests/load/` per testing.md
- [x] T009 [P] TS strict + ESLint/Prettier across workspaces

## Phase 2: Foundational (BLOCKING — no user story starts until done)

- [x] T010 Drizzle schema: `users`, `entries` (+`archived_context`), `volatile_contexts`, `ledgers`, `backlinks` — all `owner_id`; indexes per data-model.md, in `apps/api/src/db/schema.ts`
- [x] T011 Migrate-as-one-shot service that exits 0 before serve + seed the single owner (eng T3) — `apps/api/src/db/migrate.ts` + compose `migrate` service
- [x] T012 Zod domain schemas in `packages/contracts/src/` (VolatileContext per family, LedgerBlock union, Entry, status/space enums) (eng T4)
- [x] T013 Polymorphic context resolver `mediaType→family→shape` in `apps/api/src/context/resolver.ts`
- [x] T013t [P] Unit tests: resolver (every family + unknown fallback), status/space maps, ledger (de)serialize round-trip, "N days ago" with injected clock (`apps/api` + `packages/contracts`)
- [x] T014 Owner-scope middleware: `X-Epilogue-Owner` + `X-Epilogue-Owner-Secret`, reject without secret, 404 cross-owner (eng T2) in `apps/api/src/middleware/owner.ts`
- [x] T015 [P] Security middleware: `@elysiajs/cors`, security-headers, rate-limit on writes (eng T8) in `apps/api/src/middleware/`
- [x] T016 Owner-scoped repository layer (entries/context/ledger/backlinks) in `apps/api/src/db/repositories/`
- [x] T016t [P] Integration tests (Testcontainers Postgres): cross-owner leak per table, CRUD, polymorphic persistence (testing.md 2b)
- [x] T017 Eden client + server-only factory (absolute api URL + injects owner header/secret) (eng T9) in `apps/web/lib/api/`
- [x] T018 Library-rail app shell — labeled ~240px, spaces + status filters, URL-driven, drawer `<768px` — in `apps/web/app/(library)/layout.tsx` per ux-ui.md
- [x] T019 [P] Shared states: error boundary, real 404, loading skeleton primitives in `apps/web/components/states/`

## Phase 3: User Story 1 — Resume a paused game cold (P1) 🎯 MVP / walking skeleton

**Goal:** GAME save-state recall end-to-end. **Independent test:** seed one paused GAME entry, reopen the app, see checkpoint+threads+keymap, resume without other sources.

- [x] T020 [US1] Entry routes: `GET /entries/:id` (+context+ledger), `POST`/`PATCH /entries`, `PUT /entries/:id/context`, `POST /entries/:id/touch` in `apps/api/src/routes/entries.ts`
- [x] T020t [P] [US1] HTTP tests (Elysia `.handle()`): owner header accepted/rejected, context write + cold read
- [x] T021 [US1] Entry detail split-view (`Space › Title` breadcrumb, sticky context column, RSC fetch via Eden) in `apps/web/app/entry/[id]/page.tsx`
- [x] T022 [US1] GAME context block (checkpoint, open threads + done toggle, keymap) — port `src/sidebar.jsx` → `apps/web/components/context/GameContext.tsx`
- [x] T023 [US1] "Previously On" recall: context column surfaces checkpoint/threads/keymap without scroll; Resume cue on the card (no global button)
- [x] T024 [US1] Create/edit GAME entry + capture/update context via TanStack Query `useMutation` → Eden
- [x] T024e [P] [US1] e2e (Playwright, full built stack): open paused game → see save-state → edit → reload (skeleton acceptance) — **PASSING** vs the built stack + system Chromium (Arch: drives /usr/bin/chromium)
- [x] T025 [US1] `last_opened_at` "N days ago" display on detail + card

**Checkpoint:** US1 works standalone → this is the deployable walking skeleton.

## Phase 4: User Story 2 — Browse the library catalog (P2)

**Goal:** cover-forward catalog via the library rail. **Independent test:** seed mixed entries, load home, filter by space + media type.

- [x] T026 [US2] `GET /entries` (filter by space + multi-select status) in `apps/api/src/routes/entries.ts`
- [x] T027 [US2] Catalog masonry/bento grid + cover card + generative cover + status pill — ported `src/home.jsx` → `CatalogView` (CSS columns, tall/standard variation, ultrawide-responsive)
- [x] T028 [US2] Wire rail space-switching + multi-select status filters (URL-driven, CSV) [depends T018]
- [x] T029 [US2] Catalog states: loading skeleton (`(library)/loading.tsx`), first-run empty, filtered-empty, space-empty (ux-ui.md)
- [x] T029t [P] [US2] component tests (Testing Library): CoverCard + CatalogView; integration/HTTP multi-status; e2e browse → filter → open detail
- [x] T030 [P] [US2] a11y: rail roving-tabindex + real status checkboxes (multi-select); card accessible names

## Phase 5: User Story 3 — Structured Ledger (P2)

**Goal:** long-form structured writing. **Independent test:** add heading/paragraph/quote/callout/embed, reload, structure preserved.

- [x] T031 [US3] `GET`/`PUT /entries/:id/ledger` (blocks validated by Zod) in `apps/api/src/routes/entries.ts`
- [x] T032 [US3] Ledger renderers (heading/paragraph/quote/callout/embed) + bible-verse blockquote — ported `src/ledger-view.jsx` → `apps/web/components/ledger/LedgerView.tsx`
- [x] T033 [US3] Ledger editor with named-anchor presets (Sandbox/Campfire/Post-Credits) + block CRUD/reorder; real provider embed (YouTube/Vimeo iframe, else safe link)
- [x] T034 [US3] Empty-ledger state ("Start the Ledger" + presets) — `LedgerSection`
- [x] T034t [P] [US3] integration: every-block-type round-trip persists; e2e write → read back (`us3-ledger`)

## Phase 6: User Story 4 — Polymorphic context: book / screen / tech (P3)

**Goal:** save-state beyond games. **Independent test:** one BOOK, one SERIES, one TECH_LOG — each shows its family's fields, persists, no game-only fields bleed.

- [ ] T035 [US4] Reading context block (current chapter, pinned quotes + reference) in `apps/web/components/context/ReadingContext.tsx`
- [ ] T036 [US4] Screen context block (position S/E, rating, note) — NEW — `apps/web/components/context/ScreenContext.tsx`
- [ ] T037 [US4] Tech context block (sources, backlinks) + `POST`/`DELETE /entries/:id/backlinks` with owner-scope (eng T6)
- [ ] T037t [P] [US4] integration: each family persists + resolver reconstructs; backlink cross-owner → 404; e2e book + screen render
- [ ] T038 [US4] Full media_type enum + space mapping + generative cover per type

## Phase 7: Polish & Cross-Cutting

- [x] T039 [P] Body-size + JSONB length caps on `PUT` ledger/context (`maxBodySize` + Zod length) (eng T5)
- [ ] T040 [P] media_type-change: warn + preserve to `archived_context` (eng T7)
- [ ] T041 [P] Hand-built a11y widgets to WAI-ARIA + keyboard/focus tests, full pass (eng T11)
- [ ] T042 [P] `prefers-reduced-motion`, AA contrast, 44px targets audit
- [x] T043 [P] k6 load scripts (read-heavy + write-spike) + thresholds (testing.md tier 4)
- [ ] T044 [P] Drizzle lockfile pin + Kysely exit note in research.md (eng T10)
- [ ] T045 Deploy to the Arch laptop: compose over Tailscale, pg_dump backup + one restore test, CI (Actions → GHCR → `deploy.sh`)
- [ ] T046 [P] `/document-release`: update docs to match what shipped

## Dependencies & Execution Order

- **Setup (P1)** → **Foundational (P2)** blocks everything.
- Within Foundational: T012 (contracts) → T013 (resolver) → T016 (repos); T010 → T011; T014/T017 before any route/web fetch.
- **US1 (P3)** after Foundational = the walking skeleton (ship/deploy here, validate the stack).
- **US2, US3** (P2) after US1; **US4** (P3) after US1 (extends the context pattern).
- **Polish (P7)** after the stories it touches.

## Parallel Example (after Foundational)
`Lane C: packages/contracts (T012) → done first.`
`Lane A: apps/api routes + repos (T016, T020, T026, T031, T037).`
`Lane B: apps/web components (T021, T022, T027, T032, T035, T036).`
Launch A ∥ B in worktrees once C lands; tests [P] alongside.

## Implementation Strategy

1. **Walking skeleton MVP:** Setup → Foundational → US1 minimal (T020, T021, T022, T024 + T024e) → **deploy to the laptop**. STOP and validate the Bun+Elysia+Eden+Drizzle combo + the RSC↔Eden seam. If the seam is painful, pivot to a Vite SPA cheaply (nothing wide built).
2. **Expand US1** (full create/edit, recall polish), then **US2** (catalog+rail), **US3** (ledger), **US4** (polymorphic families).
3. **Polish** (caps, a11y, load, deploy hardening).
4. Re-run `/speckit-analyze` now that tasks exist (the coverage pass), then `/speckit-implement` or build T020 by hand.
