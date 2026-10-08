> **Historical — part of the superseded 001 Core Engine spec** (superseded by spec 002, [`specs/002-marginalia-rebuild/spec.md`](../../002-marginalia-rebuild/spec.md), and constitution v2.0.0, 2026-10-09). Kept as a record; not a source.

# Contracts: Core Engine (Phase 2a)

The **Elysia API (Bun)** is the single interface surface. The Next.js web tier consumes it two
ways: Server Components fetch server-side (first paint), the client uses TanStack Query — both over
**Eden** (Elysia's typed client, types derived from the Elysia app, no codegen). **No Server
Actions.** Every request is owner-scoped by Elysia owner-scope middleware (`.derive`/`.guard`) that
injects `owner_id` (see owner-scope below). All bodies validated by **Zod** schemas (via Elysia
Standard Schema).

## REST endpoints (Elysia)

| Method + Path | Purpose | Body / Query | Status |
|---|---|---|---|
| `GET /entries` | catalog list | `?space=&status=` (filter) | build now |
| `GET /entries/:id` | entry + volatile context + ledger | — | build now |
| `POST /entries` | create entry | `CreateEntry` (title, subtitle?, mediaType, status, cover?) → derives space + context family | build now |
| `PATCH /entries/:id` | update entry | `UpdateEntry` (partial); media_type change warns + archives stale context | build now |
| `DELETE /entries/:id` | delete | — cascades context/ledger/backlinks | build now |
| `POST /entries/:id/touch` | set `last_opened_at` on open | — | build now |
| `PUT /entries/:id/context` | replace volatile context | `VolatileContext` payload (validated against the entry's family) | build now |
| `PATCH /entries/:id/context/threads/:threadId` | toggle thread done | `{ done }` (game family) | build now |
| `GET /entries/:id/ledger` | read ledger | — | build now |
| `PUT /entries/:id/ledger` | save ledger | `{ title?, standfirst?, byline?, blocks[] }` (blocks validated per type) | build now |
| `POST` / `DELETE /entries/:id/backlinks` | add/remove backlink | `{ toEntryId }` (tech family) | build now |
| `GET /share/:token` | Phase 2b read-only sub-space | token (read-only) | **stub (501)** |
| `POST /ingest` | sync-agent bulk upsert (non-browser) | API key / HMAC | **stub (501)** |
| `GET /health` | liveness for Docker/Caddy | — | build now |

## Elysia conventions
- **Auth/owner-scope** (eng-review Issue 1 + outside-voice #1): the web tier sends `X-Epilogue-Owner`
  **plus `X-Epilogue-Owner-Secret`** (a per-deploy Docker secret only the web tier holds); Elysia
  middleware rejects the owner header unless the secret matches, then sets `owner_id`. A trusted
  header alone is forgeable by anything on the Docker bridge, so the secret is required. Phase 3
  swaps this for an authenticated session, no data change. `/share` (token) and `/ingest`
  (API key/HMAC) have their OWN auth and MUST NOT read the owner header. Repositories require
  `owner_id` on every query (integration tests verify isolation). Cross-owner ids return **404, not 403**.
- **Validation** (eng-review Issue 3): **Zod** schemas from `packages/contracts`, used as Elysia
  validators via Standard Schema; failures → 422 with the validation detail. The same schemas drive
  the resolver + tests (one source of truth).
- **Security middleware (DIY — explicit tasks, since Elysia has no built-ins):** `@elysiajs/cors`
  (allow only the web origin / tailnet), a security-headers (helmet-equivalent) plugin, and a
  rate-limit plugin on writes + `/ingest`.
- **Errors**: `{ error: { code, message } }` + appropriate status; never leak another owner's data.

## Frontend consumption (Next.js via Eden)
- **First paint**: Server Components call the API server-side (over the internal Docker network)
  through the Eden client, prefetch into a per-request `QueryClient`, hydrate.
- **Client**: TanStack Query hooks in `apps/web/lib/api` wrap the Eden client; mutations via
  `useMutation` with optimistic updates + `invalidateQueries`.
- **Catalog filtering** (space/status) is URL-driven RSC navigation (`/[space]?status=`), re-fetching
  server-side — keeps deep-links + back/forward working (research.md D3).

## Contract typing
**Eden** derives the request/response types directly from the Elysia app's type — the web client and
tests are type-checked against the live route definitions with no codegen and no hand-synced
contract. `packages/contracts` optionally holds shared domain schemas (e.g. the `VolatileContext`
per-family shapes, `LedgerBlock` union) reused by the resolver and tests.
