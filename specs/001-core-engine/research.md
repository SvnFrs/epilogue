# Research: Core Engine (Phase 2a)

Consolidated technology decisions. Format: Decision / Rationale / Alternatives. Sources are 2026
best-practice research; see notes inline.

## D1. Backend architecture — separate Elysia API service (Bun)

**Decision** (set 2026-06-20 by user: separate backend, Bun runtime, Elysia): a standalone
**Elysia** backend on **Bun** owns the entire API, business logic, Drizzle data access, and
owner-scoping/authz. **Next.js is a pure frontend/BFF** (web tier stays on Node) — Server Components
fetch the API for first paint; the client calls it via TanStack Query over **Eden** (Elysia's
end-to-end typed client). **No Server Actions.** The backend also serves the future Phase 2b
read-only share endpoints and the sync-agent ingest endpoint, behind one auditable trust boundary.

**Rationale**
- **Security isolation (deciding factor):** clean web ↔ API ↔ DB boundary, threat-modeled
  independently. Retires the Server Actions CVE surface (e.g. CVE-2024-34351 SSRF); the data tier is
  unreachable through Next.js internals. Defense-in-depth: authz at the API layer AND the
  owner-scoped repository (constitution IV), never trusted from the transport.
- **Bun-native fit:** Elysia is built for Bun (first-class, fastest), so no against-the-grain runtime
  risk; small, auditable surface.
- **Eden end-to-end types:** the frontend derives request/response types directly from the Elysia
  app type — no codegen, no hand-synced contract — fewer correctness/security bugs at the boundary.

**Cost accepted:** security middleware is DIY — assemble from plugins: `@elysiajs/cors`, a
security-headers (helmet-equivalent) plugin, and a rate-limit plugin on writes + `/ingest`. These
are explicit plan tasks (vs NestJS's built-ins).

**Alternatives**
- **NestJS on Bun** — keeps batteries (Guards/Pipes/throttler) but Bun isn't an officially supported
  NestJS platform (against-the-grain, native-dep risk); rejected once Bun became the runtime.
- **Next.js-only (Server Actions)** — the surface + recent Next.js CVEs we're avoiding; rejected.

**Runtime split:** the **api runs on Bun**; the **Next.js web server stays on Node** (Next's
standalone server is Node-oriented; running it under Bun in prod is the riskiest path). Bun is also
the monorepo package manager + test runtime.

**Gotchas:** use a Bun-friendly Postgres driver for Drizzle (`postgres.js` / Bun SQL); run
migrations as a deploy step, not in the request path; keep the API off the public internet
(Tailscale; Phase 2b public route via Cloudflare Tunnel only).

## D2. ORM — Drizzle

**Decision**: Drizzle ORM + drizzle-kit migrations on PostgreSQL.

**Rationale**: SQL-first (fits row-level tenancy + Postgres features like JSONB), no codegen step
(schema is plain TS), tiny runtime, best-in-class typed raw-SQL escape hatch, and plain-SQL
migration files a self-hoster can read and version.

**Alternatives**: Prisma 7 (Rust-free, much leaner now, but still codegen + untyped `$queryRaw` +
awkward row-level tenancy); Kysely (great types but hand-rolled migrations + more boilerplate).

**Gotchas**: Drizzle was acquired by PlanetScale in 2026 — OSS and self-host-friendly today, but
pin versions and watch governance. Use `drizzle-kit generate` + `migrate` (committed SQL), not
`push`, for production.

## D3. Frontend state layering — RSC / TanStack Query / Zustand

**Decision**: Three non-overlapping owners. **RSC** owns server-rendered reads — Server Components
fetch from the **Elysia API** for first paint (no Server Actions). **TanStack Query** owns all
client-side server-state, calling the Elysia API (caching, refetch, mutations, optimistic updates).
**Zustand** owns only ephemeral UI state (rail open/collapsed, non-URL filters, editor draft +
`isDirty`). **Selection (active space, selected entry) is driven by the URL/route**, not Zustand.

**Rationale**: the recurring failure is duplicating server data into Zustand → drift + manual
invalidation. TanStack Query already solves caching/staleness; Zustand holds only what it can't.
RSC removes the client fetch waterfall; hydrate Query so it takes over without a refetch flash.

**DO**: fetch initial catalog/entry in async Server Components → `prefetchQuery` into a
per-request `QueryClient` → wrap in `HydrationBoundary`; `staleTime` 30–60s; per-request
`QueryClient` on server, singleton in browser; drive selection from `/[space]` + `/entry/[id]`;
mutations go through `useMutation` → the Elysia API, with optimistic updates + `invalidateQueries`.
**DON'T**: store entries/lists/saved-Ledger in Zustand; create QueryClient/store at module scope;
fetch in `useEffect` for first paint; put any DB access in the Next.js tier (it calls the API only).

## D4. Validation & supporting libs

**Decision** (eng-review Issue 3): input validation via **Zod**, each domain schema defined ONCE in
`packages/contracts` and used as Elysia validators through **Standard Schema** (Elysia 1.3+ accepts
Zod natively), plus in the polymorphic resolver and the tests — one schema lib, no duplicate shapes.
The frontend gets request/response types through **Eden** (no codegen, no hand-synced contract).
**shadcn/ui + Tailwind** for components (matches the gemini PRD and the `src/` Digital Paper tokens).
**next/image** for covers (replaces the POC `image-slot` web component, SSR-incompatible — see ux-ui.md).

## D5. Tenancy model — row-level `owner_id` (not schema-per-tenant)

**Decision**: Every table carries `owner_id` (FK → `users.id`). All access goes through an
owner-scoped repository layer; cross-owner isolation is verified by mandatory integration tests
(testing.md). This matches constitution Principle IV ("user_id column on every table") and is
simpler than Postgres schema-per-tenant. Revisit schema/RLS only if a real multi-tenant SaaS phase
arrives.

**Rationale**: row-level is the lightest thing that satisfies the constitution and keeps a single
migration set; schema-per-tenant adds `search_path` juggling and per-tenant DDL for zero benefit
at single-player scale.
