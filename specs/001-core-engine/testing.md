# Testing Plan: the pyramid for Epilogue

Stack: Next.js (web, Node) + Elysia (api, Bun) + Drizzle + Postgres, solo dev. Tests split by tier
— **web**: Vitest unit + Testing Library/MSW component + Playwright e2e; **api**: Vitest unit +
Testcontainers integration + HTTP tests via Elysia `.handle()`/Eden; **k6** load hits the api. **Proportions by test count: ~65%
unit · ~25% component+integration · ~8% e2e · ~2% load.** Push logic down the pyramid: a bug caught
in a 5ms Vitest test is a bug you don't chase through a browser. This plan seeds the `/test-pyramid` skill.

## 1. Unit — Vitest (`environment: node`) — ~65%
Pure functions, zero I/O (mock nothing; if it needs the DB, it's mis-layered):
- **Polymorphic context resolver** — `mediaType → family → shape`; every variant + unknown/fallback. Table-driven `it.each`. Highest-value suite.
- **status / space mappings** — enum ↔ display, ordering, invalid input.
- **Ledger block (de)serialization** — property: `deserialize(serialize(x)) === x`; malformed/legacy/empty.
- **"N days ago" formatter** — inject a clock (`now: Date` arg, never read `Date.now()` inside); boundaries (0/1/today/future/DST).
Co-locate `*.test.ts`; v8 coverage gate on the resolver + ledger modules (not a global %).

## 2. Component + integration — ~25%
**2a. Components (Vitest `jsdom` + Testing Library):** library rail filters catalog (US2), Ledger
editor renders per family (US3), save-state card. Assert by role/text. Wrap in a fresh
`QueryClient` per test (`retry:false`); mock the **fetch layer with MSW** (not `vi.fn`) so cache
behavior is real. Real Zustand store, reset between tests. Don't mock your own components.

**2b. API + DB integration (Elysia api, REAL Postgres via Testcontainers):**
- **Owner-scoping / tenant isolation (highest priority):** a deliberate cross-owner leak test per
  table — owner A never sees owner B's rows; every repository method enforces scope.
- CRUD round-trips through real Drizzle + real migrations (catches schema drift mocks hide).
- **Polymorphic persistence:** write each media type, read back, resolver reconstructs the right shape.
- US1 save-state write + cold read.
Config: `@testcontainers/postgresql` in Vitest `globalSetup` (one container/run), export
`DATABASE_URL`, migrate once. Isolate per file with a fresh schema (`CREATE SCHEMA test_xxx; SET
search_path`) — fast + parallel-safe. Run as a **separate Vitest project** so it doesn't slow the
unit watch loop. Add **HTTP tests via Elysia `.handle()` (or Eden)** so the owner-scope middleware +
`t`/TypeBox validation + rate-limit are exercised at the route boundary, not just the repository.

## 3. E2E — Playwright — ~8%
One happy path per journey, no more: **US1** resume paused game from cold context; **US2** browse
catalog via rail → open detail; **US3** write a Ledger entry → read it back; **US4** open one book
+ one screen item, verify polymorphic fields. DB: dedicated Postgres on a separate port, migrate +
deterministic seed in `globalSetup`, reset by drop/recreate schema between specs. Auth-less: seed
the single owner, set its id via env/cookie so the app boots "logged in." `webServer` starts the
**full built stack** — the Elysia api (Bun) + the Next.js production build (`next build && next start`),
never `next dev`. Chromium only. Semantic locators; zero `waitForTimeout`.

## 4. Load — k6 — ~2% (never gates PRs)
Target i3/24GB, ≤30 concurrent — test latency under modest load, not internet scale.
- **Read-heavy** (~85%): browse → open item → load context + ledger.
- **Write spike** (US1 save-state): bursts of context writes (serialization + JSONB under contention).

| Profile | VUs | Duration | When |
|---|---|---|---|
| Smoke | 1–2 | 1m | post-deploy / manual |
| Average | 10–15 | 5–10m | nightly |
| Stress | 30→60 ramp | ramp±down | manual (find the i3 knee) |

Thresholds (k6 exits non-zero on breach):
```
http_req_duration: ['p(95)<500']            // reads
http_req_duration{op:save}: ['p(95)<800']   // save-state, tagged
http_req_failed: ['rate<0.01']
```
Watch the Postgres connection pool first — it saturates before CPU on this hardware.

## CI wiring (fast → slow, fail early)
1. **Every push/PR:** `unit` + `component` (no Docker, < ~60s). Blocks merge.
2. **Every PR:** `integration` on a Postgres service container (GH Actions `services: postgres`, or Testcontainers if DinD available). After unit passes.
3. **Pre-merge:** `e2e` against the built app + disposable DB (parallel with integration).
4. **Nightly + manual:** `k6` average (nightly), stress (manual). Never gate PRs.

Four commands map to the pyramid: `test:unit`, `test:integration`, `test:e2e`, `test:load` — each
its own runner so a solo dev runs exactly the tier they need. These are what `/test-pyramid` drives.
