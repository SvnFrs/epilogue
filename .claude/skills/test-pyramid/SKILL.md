---
name: test-pyramid
description: Run or scaffold the Epilogue testing pyramid for the Next.js (web, Node) + Elysia (api, Bun) + Drizzle + PostgreSQL stack — unit (Vitest), component (Testing Library + MSW), API+DB integration (Testcontainers Postgres + Elysia .handle()/Eden, owner-isolation), e2e (Playwright, full stack), and load (k6 vs the api). Use when the user asks to test, add or scaffold tests, check coverage, verify a change works, validate before shipping/landing, or load/performance-test.
---

# Testing Pyramid (Epilogue stack)

> Tests the **001 Core Engine** code (superseded UI and domain model: spaces, the Ledger,
> TECH_LOG). Revisit once spec 002's plan chooses the rebuild's stack.

The canonical pyramid for this repo. The plan of record is
`specs/001-core-engine/testing.md`; this skill operationalizes it. Stack: Next.js (App Router) +
Drizzle + PostgreSQL, Vitest + Testing Library + MSW + @testcontainers/postgresql + Playwright + k6.

**Proportions by test count: ~65% unit · ~25% component+integration · ~8% e2e · ~2% load.** Push
logic DOWN the pyramid: prefer a 5ms unit test over a browser test. Never gate PRs on k6.

## Step 0 — Decide the scope
From the user's request pick the tier(s):
- "test this change / before shipping" → run unit + component + integration (fast tiers), then e2e if UI/flows changed.
- "add tests for X" → scaffold the right tier(s) for X (see Step 2).
- "load test / is it fast enough" → k6 (Step 1, tier 4).
If a tier's tooling/config is missing, scaffold it (Step 2) before running.

## Step 1 — Run (fast → slow, stop on first failure)
Run only the tiers in scope. Report each tier's pass/fail with the failing test names.

```bash
bun run test:unit            # vitest (node): resolver, ledger (de)serialize, status/space maps, date formatter
bun run test:component       # vitest (jsdom) + Testing Library + MSW: rail, ledger editor, save-state card
bun run test:integration     # api: vitest + testcontainers Postgres + Elysia .handle(): owner-isolation, CRUD, polymorphic persistence
bun run test:e2e             # playwright against the BUILT full stack (Elysia api on Bun + Next.js) + disposable DB: US1-US4
bun run test:load            # k6: smoke locally; average/stress on the server only
```

## Step 2 — What each tier must cover (scaffold to this)

**Unit — Vitest `environment:node` (pure, mock nothing):**
- Polymorphic context resolver: `mediaType → family → shape`, every variant + unknown fallback (`it.each`).
- status/space enum mappings; ledger block round-trip (`deserialize(serialize(x))===x`, malformed/empty).
- "N days ago" formatter with an injected clock (never read `Date.now()` inside).

**Component — Vitest `environment:jsdom` + Testing Library:**
- Assert by role/text. Fresh `QueryClient` per test (`retry:false`). Mock the FETCH layer with **MSW** (not `vi.fn`) so cache behavior is real. Real Zustand store, reset between tests. Don't mock your own components.

**Integration (Elysia api) — REAL Postgres via Testcontainers (`globalSetup`, one container/run):**
- **Owner-isolation is the top priority**: a deliberate cross-owner leak test per table — owner A never reads owner B's rows.
- CRUD round-trips through real Drizzle + real migrations; polymorphic persistence (write each media type, read back, resolver reconstructs shape); US1 save-state write + cold read.
- **HTTP tests via Elysia `.handle()` (or Eden)** so the owner-scope middleware + `t`/TypeBox validation + rate-limit are exercised at the route boundary, not just the repository.
- Isolate per file with a fresh schema (`CREATE SCHEMA test_xxx; SET search_path`). Run as a separate Vitest project.

**E2E — Playwright (one happy path per journey, no more):**
- US1 resume paused game from cold context; US2 browse via library rail → open detail; US3 write a Ledger → read back; US4 open one book + one screen item, polymorphic fields render.
- `webServer` = the BUILT full stack (Elysia api on Bun + Next.js `next build && next start`), never `next dev`. Seed the single owner in `globalSetup`; reset by drop/recreate schema. Chromium only. Semantic locators; no `waitForTimeout`.

**Load — k6 (never in the PR path):**
- Scenarios: read-heavy (catalog+detail ~85%) and write-spike (save-state). Profiles: smoke (1-2 VU/1m), average (10-15 VU/5-10m, nightly), stress (30→60 ramp, manual).
- Thresholds: `http_req_duration p(95)<500` (reads), `{op:save} p(95)<800`, `http_req_failed rate<0.01`. Watch the Postgres connection pool first.

## Step 3 — Report
Summarize per tier: pass/fail, counts, coverage on the resolver/ledger modules (unit), and any
owner-isolation failures (integration — treat as release-blocking). For k6, report p95 reads,
p95 save, error rate vs thresholds. Recommend the next tier or a fix.

## CI order (reference)
1. push/PR: unit + component (no Docker, <~60s) — blocks merge.
2. PR: integration on a Postgres service/Testcontainers — after unit.
3. pre-merge: e2e on the built app + disposable DB (parallel with integration).
4. nightly/manual: k6 average (nightly), stress (manual).

## Notes
- Commands assume `package.json` scripts `test:unit|component|integration|e2e|load`. If they don't
  exist yet, scaffold them (and the Vitest `projects` config) as part of Step 2.
- This skill is stack-specific by design (the user wanted a real pyramid skill, not a generic one).
  When the stack changes, update this file and `specs/001-core-engine/testing.md` together.
