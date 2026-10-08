> **Historical — part of the superseded 001 Core Engine spec** (superseded by spec 002, [`specs/002-marginalia-rebuild/spec.md`](../002-marginalia-rebuild/spec.md), and constitution v2.0.0, 2026-10-09). Kept as a record; not a source.

# Data Model: Core Engine (Phase 2a)

PostgreSQL + Drizzle ORM, living in the **Elysia API tier (Bun)** (the Next.js web tier never
touches the DB). **Every table carries `owner_id` (FK → `users.id`)** and is accessed only through
an owner-scoped repository, enforced by Elysia owner-scope middleware (constitution IV; research.md
D1/D5). All `id`s are UUIDs; all timestamps are `timestamptz`.

## Entities

### User
The owner of all data. One local user now; the column exists everywhere so multi-user needs no migration.
- `id`, `username` (unique), `display_name`, `avatar_url?`, `bio?`, `created_at`.

### Entry  (the "Story" — unit of the catalog)
- `id`, `owner_id`
- `title`, `subtitle?`
- `media_type` — enum: `GAME | BOOK | MANGA | FILM | SERIES | ANIME | TECH_LOG`
- `space` — enum: `gaming | reading | cinema | tech` (derived-but-stored; see mapping below)
- `status` — enum: `PLAYING | PAUSED | READING | COMPLETED | AIRING` (closed set; constitution)
- `year?`, `month?` — metadata only (never in nav path; FR-021)
- `cover` — jsonb: `{ kind: "generative", motif: string } | { kind: "image", url: string }` (FR-018)
- `archived_context?` — jsonb[]: context fields preserved when `media_type` changes to a different
  family, so nothing is silently deleted (spec Edge Cases; built in task T7)
- `created_at`, `last_opened_at?`, `updated_at`
- Relations: 1—1 `VolatileContext`, 1—1 `Ledger` (created lazily), 1—many outgoing `Backlink`.
- **media_type → space** (validation rule): GAME→gaming; BOOK/MANGA→reading; FILM/SERIES/ANIME→cinema; TECH_LOG→tech.
- **media_type → context family**: GAME→game; BOOK/MANGA→reading; FILM/SERIES/ANIME→screen; TECH_LOG→tech.

### VolatileContext  (the save-state — 1:1 with Entry, polymorphic)
- `entry_id` (PK, FK), `owner_id`, `family` enum: `game | reading | screen | tech`, `payload` jsonb.
- `payload` is validated by a Zod schema per family (the "polymorphic resolver", unit-tested):
  - **game**: `{ checkpoint: string, threads: {id,text,done:boolean}[], keymap: {action,key}[] }`
  - **reading**: `{ position: string, quotes: {id,text,reference}[] }`
  - **screen**: `{ position: string, rating: number(0–10), note: string }`
  - **tech**: `{ sources: {id,label,host,kind}[], backlinks: entryId[] }`
- Rule: an Entry MUST have exactly one VolatileContext whose `family` matches its media_type mapping.
  Fields absent for a family are simply not present (FR-005, US4 scenario 4).

### Ledger  (long-form content — 1:1 with Entry, created on first write)
- `id`, `entry_id` (FK), `owner_id`, `title`, `standfirst?`, `byline?`, `blocks` jsonb (ordered array), `created_at`, `updated_at`.
- `blocks[]` — discriminated by `type` (block (de)serialization is unit-tested, FR-010):
  - `{ type:"heading", text, note? }` · `{ type:"paragraph", text }` ·
    `{ type:"quote", text, reference }` · `{ type:"callout", icon, title, text }` ·
    `{ type:"embed", url, label }`
- Named-anchor presets (FR-011) are editor affordances ("The Sandbox" / "The Campfire" /
  "The Post-Credits Blur"), not enforced data.

### Backlink  (basic TECH_LOG cross-link — entry→entry)
- `id`, `owner_id`, `from_entry_id` (FK), `to_entry_id` (FK), `created_at`.
- Phase 2a stores directional links; full bi-directional `@`-mention graph is a later spec (roadmap item 3).

## State transitions (Entry.status)
Free transitions among the closed set, driven by the user. No enforced lifecycle in Phase 2a
(e.g. PAUSED ⇄ PLAYING/READING/AIRING → COMPLETED). Changing `media_type` after creation warns
the user and archives now-inapplicable context as notes rather than deleting (spec Edge Cases).

## Validation rules (enforced at the Elysia API boundary via Zod / Standard Schema)
- `media_type`, `space`, `status` ∈ their enums; `space` and context `family` MUST match the media_type mapping.
- `VolatileContext.payload` MUST satisfy its family schema.
- `quote.reference` may be empty but is flagged in UI (Edge Cases).
- Deleting an Entry cascades to its VolatileContext, Ledger, and Backlinks (no orphans; FR-016).
- Every read/write is scoped by `owner_id`; no query may omit it (verified by integration tests).

## Indexing / future-proofing
- Indexes: `entries(owner_id, space)`, `entries(owner_id, media_type)`, `entries(owner_id, status)`,
  `entries(owner_id, last_opened_at desc)` (powers "recently opened" + default ordering).
- Constitution VI (search, spec 002): leave room for a `tsvector` column / `pg_trgm` index over
  entry titles + ledger block text. Not built now, not precluded.
