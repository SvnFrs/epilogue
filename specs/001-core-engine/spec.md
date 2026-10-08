> **Historical — superseded by spec 002** ([`specs/002-marginalia-rebuild/spec.md`](../002-marginalia-rebuild/spec.md)) and constitution v2.0.0, 2026-10-09. Kept as a record; not a source.

# Feature Specification: Core Engine (Phase 2a)

**Feature Branch**: `001-core-engine`
**Created**: 2026-06-20
**Status**: Draft
**Input**: "Phase 2a single-player Core Engine: media catalog grid, polymorphic entry detail
with volatile context block, and structured Ledger journaling."

This is the foundational single-player slice of the hybrid wedge (`docs/roadmap.md`). It is
governed by `.specify/memory/constitution.md` (v1.1.0) and uses the approved Phase 1 design in
`src/` as the visual and structural reference. Out of this spec, by design: full-text search,
bi-directional links, sub-space taxonomy (each its own later spec), and the Phase 2b shareable
read-only sub-space.

## Clarifications

### Session 2026-06-20

- Q: Should the design be based on the approved `src/` Phase 1 UI (built by the user with Claude
  Design)? → A: `src/` is **binding for the visual design language** (Digital Paper aesthetic,
  typography, color, the card/grid and split-view components, bible-verse quotes); where `src/`'s
  visuals and prose disagree, `src/` wins. `src/`'s **navigation and information architecture are
  POC-level and NOT binding** — the year/month breadcrumb, browser-style open-entry tabs, and the
  global "Previously On" button are redesigned in this spec (see Navigation & IA).
- Q: Which media families ship in Phase 2a? → A: Four context-shape families covering seven
  types — Game (GAME), Reading (BOOK, MANGA), Screen (FILM, SERIES, ANIME; position + rating +
  note), and Tech (TECH_LOG).
- Q: Is the fixed `space` grouping from `src/` in scope for Phase 2a? → A: Yes — entries carry a
  fixed top-level `space` (gaming / reading / cinema / tech) with the detail breadcrumb, as in
  `src/`. The full sub-space taxonomy (arbitrary user-created sub-spaces + chronological archive)
  remains a separate later spec (roadmap backlog item 4).
- Q: What navigation shell should Epilogue use (the `src/` POC nav is being replaced)? → A: A
  persistent left sidebar "library rail" (spaces + status filters), present on both Library and
  Entry views. Universal IA fixes apply: breadcrumb is `Space › Title` (no date in the nav path),
  no browser-style open-entry tabs (one back-to-Library affordance instead), "Previously On" is
  the entry's contextual left context column (not a global button), and no controls appear for
  deferred capabilities like search.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resume a paused game cold, the "Previously On" (Priority: P1)

A person who played Red Dead Redemption 2 on and off for months, then stopped for several
weeks, opens its entry in Epilogue. Without launching the game or reading external notes, they
immediately see where they were (the checkpoint), what they meant to do next (open threads),
and the custom controls they always forget (keymap). They re-onboard in seconds and resume.

**Why this priority**: This is the product's reason to exist (constitution Principle I). It is
the headline demo and the single most differentiated value. If only this ships, Epilogue
already solves the core pain.

**Independent Test**: Seed one paused GAME entry with a checkpoint, two open threads, and a
keymap. Close the app, reopen it, navigate to the entry, and confirm the volatile context is
surfaced prominently and is enough to resume without any other source.

**Acceptance Scenarios**:

1. **Given** a paused GAME entry with a saved checkpoint, open threads, and keymap, **When** the
   user opens that entry, **Then** the checkpoint, the unfinished threads, and the keymap are
   shown together in a persistent context area, with the checkpoint and "where I left off"
   visible without scrolling.
2. **Given** the user is about to stop playing, **When** they edit the entry's checkpoint and
   add a next-action thread, **Then** the changes persist and are present on the next visit.
3. **Given** an open thread, **When** the user marks it done, **Then** it shows as completed
   (struck through) and no longer reads as a pending next action.
4. **Given** the entry was last opened weeks ago, **When** the user views it, **Then** the
   elapsed time since last opened is shown (e.g., "112 days ago").

---

### User Story 2 - Browse the library catalog (Priority: P2)

The user opens the home view and sees their whole library as a visual shelf: cover art, titles,
and a status badge on each item, filterable by space and media type from a persistent left
library rail. It feels like a personal museum, not a spreadsheet.

**Why this priority**: Navigation and the "shelf" identity. Needed once there is more than one
entry, but the core save-state value (US1) can be demonstrated on a single entry without it.

**Independent Test**: Seed entries across several media types and statuses. Load the home view,
confirm each renders with cover, title, and status badge, and that filtering by media type
narrows the grid correctly.

**Acceptance Scenarios**:

1. **Given** a library with multiple entries, **When** the user opens the home view, **Then**
   entries appear as a grid of cover-forward cards, each showing title, media type, and a status
   pill (PLAYING / PAUSED / READING / COMPLETED / AIRING).
2. **Given** the home view, **When** the user selects a media-type filter (e.g., GAME),
   **Then** only entries of that type remain visible and the count updates.
3. **Given** an empty library (first run), **When** the user opens the home view, **Then** an
   inviting empty state explains how to add the first entry (no blank screen).
4. **Given** any entry card, **When** the user selects it, **Then** they land on that entry's
   detail view.
5. **Given** any view, **When** the user uses the persistent left library rail, **Then** they can
   switch space (All / Gaming / Reading / Cinema / Tech), apply status filters, and return to the
   Library from anywhere.

---

### User Story 3 - Keep a structured Ledger (Priority: P2)

On an entry's detail page, the user writes long-form analysis in a focused, opinionated editor
with named sections (world-building, character profiles, raw post-credits reaction). Quotes are
rendered with reverence. The result reads like a curated archive page, not a scratch note.

**Why this priority**: The Information Digestion Engine (constitution Principle V). It is what
makes Epilogue more than a tracker, but it builds on entries existing (US1).

**Independent Test**: On a seeded entry, create a Ledger with a heading, paragraphs, a quote
with a reference, and a callout. Reload and confirm the structure and content are preserved
exactly.

**Acceptance Scenarios**:

1. **Given** an entry detail view, **When** the user opens its Ledger, **Then** the page uses a
   split layout: a persistent context column and a scrollable long-form reading column.
2. **Given** the Ledger editor, **When** the user adds a section heading, paragraphs, a quote
   (text plus a structured reference), a callout, and an embedded external link, **Then** each
   block renders in its designed style and persists on reload.
3. **Given** the editor, **When** the user starts a new section, **Then** named anchor presets
   are offered (e.g., "The Sandbox", "The Campfire", "The Post-Credits Blur").
4. **Given** a quote block, **When** it is displayed, **Then** it appears as a reverent
   "bible-verse" blockquote with its reference (work / chapter / line) shown distinctly.

---

### User Story 4 - Polymorphic save-state for books, tech logs, and screen media (Priority: P3)

The same "Previously On" power works beyond games. For a book, the context block holds the
current chapter and pinned quotes. For a tech log, it holds embedded sources and backlinks. For
a film or series, it holds the current position, a rating, and a quick note. The block changes
shape by media type instead of forcing one rigid form.

**Why this priority**: Fulfils the polymorphism mandated by constitution Principle I across the
full media set. Extends US1's proven loop; can follow once the GAME shape is solid.

**Independent Test**: Create one BOOK, one TECH_LOG, and one SERIES entry. Confirm each entry's
context block presents the correct fields for its type and persists them, with no game-only
fields bleeding into non-game types.

**Acceptance Scenarios**:

1. **Given** a BOOK entry, **When** the user opens its context block, **Then** it offers current
   position (chapter/page) and a list of pinned quotes (text plus reference), not a keymap.
2. **Given** a TECH_LOG entry, **When** the user opens its context block, **Then** it offers
   embedded sources (label and origin) and backlinks to related entries.
3. **Given** a SERIES or ANIME entry, **When** the user opens its context block, **Then** it
   offers current position (season/episode), a rating, and a short note.
4. **Given** any entry, **When** its media type has no value for a field, **Then** that field is
   simply absent rather than shown empty.

---

### Edge Cases

- First run with zero entries: the home view shows a designed empty state, not a blank page.
- An entry created but with no volatile context yet: the detail view invites the user to capture
  a save-state rather than showing an empty block.
- Very long checkpoint text or many open threads: the context column stays readable and the
  layout holds.
- A quote saved without a reference: allowed, but visually flagged as missing its citation.
- Changing an entry's media type after creation: the user is warned that the volatile context
  shape will change, and existing type-specific context that no longer applies is preserved as
  archived notes rather than silently deleted.
- Deleting an entry: its volatile context and Ledger are removed with it, leaving no orphaned
  data.
- A media type with a lighter context (e.g., a film watched in one sitting): the block adapts
  and does not demand game-style fields.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a home catalog of all of the user's entries as a
  cover-forward visual grid, each card showing title, media type, and a status pill.
- **FR-002**: Users MUST be able to filter the catalog by media type and by fixed top-level
  space (gaming / reading / cinema / tech).
- **FR-003**: Users MUST be able to create an entry with at least a title, a media type, and a
  status; a cover is optional.
- **FR-004**: Each entry's status MUST come from a closed, designed set: PLAYING, PAUSED,
  READING, COMPLETED, AIRING. Adding a new status requires a constitution amendment.
- **FR-005**: Each entry MUST have a volatile context block whose shape is polymorphic by media
  type:
  - GAME: current checkpoint (free prose), open threads (text items that can be marked done),
    and a keymap reference (action to key).
  - BOOK / MANGA: current position (chapter/page) and pinned quotes (text plus structured
    reference).
  - TECH_LOG: embedded sources (label and origin) and backlinks to related entries.
  - FILM / SERIES / ANIME: current position (season/episode or timestamp), a rating, and a
    short note.
- **FR-006**: Users MUST be able to create and update an entry's volatile context, and the
  values MUST persist across sessions.
- **FR-007**: When the user opens a PAUSED or in-progress entry, the system MUST surface that
  entry's volatile context prominently and without requiring a scroll for the primary fields
  (the "Previously On" recall).
- **FR-008**: Open threads MUST support a done / not-done state, and completed threads MUST be
  visually distinct from pending ones.
- **FR-009**: Pinned quotes MUST store the quote text together with a structured reference
  (e.g., work, chapter, line) and render as a reverent "bible-verse" blockquote.
- **FR-010**: Each entry MUST support a Ledger: long-form content composed of structured blocks
  of these types: heading (with an optional category note), paragraph, quote, callout (icon,
  title, body), and embed (an external link with a label).
- **FR-011**: The Ledger editor MUST offer named section-anchor presets (e.g., "The Sandbox",
  "The Campfire", "The Post-Credits Blur") while still allowing custom headings.
- **FR-012**: The entry detail view MUST use a split layout: a persistent context column (the
  volatile context block plus cover and metadata) and a scrollable Ledger column, with a
  `Space › Title` breadcrumb. The context column IS the "Previously On"; there is no global
  Previously On control.
- **FR-013**: Every stored record MUST be scoped to an owner (user_id), even though only a
  single local user exists in this phase. No data operation may assume single-tenancy.
- **FR-014**: All core flows (create, read, update, recall of entries, context, and Ledger) MUST
  function locally without requiring any third-party cloud account.
- **FR-015**: Every entry MUST record creation time and last-opened/last-updated time, and the
  UI MUST express elapsed time since last opened in human terms (e.g., "112 days ago").
- **FR-016**: Users MUST be able to edit and delete entries; deleting an entry MUST remove its
  volatile context and Ledger with it.
- **FR-017**: The interface MUST conform to the "Digital Paper" design language defined in
  constitution Principle III (warm oatmeal surfaces, the triple-font system, amber accent,
  status pills, bible-verse quotes, generative cover art). This is a product requirement, not a
  cosmetic preference.
- **FR-018**: Cover art MUST default to a generated visual keyed to the media type (gradient,
  glow, and texture as in the approved `src/` design), with an optional user-fillable image slot
  for a custom cover.
- **FR-019**: Each entry MUST belong to exactly one fixed top-level space (gaming, reading,
  cinema, or tech), shown in the entry's breadcrumb as in `src/`. Arbitrary user-created
  sub-spaces and the chronological archive tree are out of scope for this phase (separate spec).
- **FR-020**: The app MUST provide a persistent left "library rail" on both the Library and Entry
  views, offering space switching (All / gaming / reading / cinema / tech) and status filters,
  with a clear path back to the Library from anywhere.
- **FR-021**: Navigation paths MUST be `Space › Title`. Date (year/month) is entry metadata and
  MUST NOT appear in the navigation path or breadcrumb.
- **FR-022**: The app MUST NOT use a browser-style open-entry tab strip; movement between entries
  goes through the Library / rail, not persistent document tabs.
- **FR-023**: "Previously On" recall MUST be the entry's contextual left context column (FR-007),
  optionally surfaced as a "Resume" cue on catalog cards. There MUST NOT be a global "Previously
  On" control.
- **FR-024**: The interface MUST NOT present controls for deferred capabilities (e.g., search)
  until those capabilities ship; no dead or non-functional controls.
- **FR-025**: On a narrow viewport, the library rail MUST collapse to a toggle without losing
  access to spaces, status filters, or back-to-Library.

### Key Entities *(include if data involved)*

- **User**: the owner of all data. A single local user in this phase, but every other entity
  references the owner so multi-tenancy is exercised from day one.
- **Entry** (the "Story"): the unit of the catalog. Holds title, optional subtitle, media type,
  a fixed top-level space (gaming / reading / cinema / tech), status, year/month, cover, and
  timestamps (created, last opened/updated). Owned by a User.
- **Volatile Context**: a one-to-one companion to an Entry whose fields vary by media type
  (the shapes in FR-005). It is the save-state, distinct from the long-form Ledger.
  - **Open Thread**: a context item with text and a done flag (GAME).
  - **Keymap Entry**: an action-to-key pair (GAME).
  - **Pinned Quote**: quote text plus a structured reference (BOOK / MANGA).
  - **Source**: an external reference with a label and origin (TECH_LOG).
  - **Backlink**: a link from one Entry to a related Entry (TECH_LOG).
- **Ledger**: the long-form content for an Entry. Holds a title, an optional standfirst/byline,
  and an ordered list of Blocks.
  - **Block**: a typed unit of the Ledger (heading, paragraph, quote, callout, embed) with the
    fields appropriate to its type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user returning to a paused entry after several weeks can state their exact
  stopping point and their next action within 30 seconds, using only what Epilogue shows them.
- **SC-002**: Capturing a save-state (checkpoint plus a couple of threads plus a few keymap
  entries) takes under 2 minutes.
- **SC-003**: 100% of entries can store a save-state appropriate to their media type, with no
  media type left without a defined context shape.
- **SC-004**: From the home view, a user can find all PAUSED items within 5 seconds.
- **SC-005**: A Ledger entry reloads with its full structure (headings, quotes, callouts,
  embeds) intact and zero content loss.
- **SC-006**: All data remains available on the user's own hardware with no feature blocked by
  the absence of a third-party cloud account.
- **SC-007**: Every stored record carries an owner reference (verifiable by inspecting the data
  model), so a later multi-user evolution needs no destructive migration.
- **SC-008**: A first-time user can go from an empty library to one fully captured entry (created
  plus save-state plus one Ledger section) in under 5 minutes without external instructions.
- **SC-009**: From any view, a user can reach any entry in at most two actions (choose a
  space/filter, then the entry) and return to the Library in one.

## Assumptions

- **Single-player only.** This phase has no sign-up, login, or multi-user UI, but every record
  carries an owner reference per constitution Principle IV. The Phase 2b shareable read-only
  sub-space is a separate spec.
- **Out of scope for this spec (tracked separately, see `docs/roadmap.md`):** full-text search,
  bi-directional `@`-links beyond the basic TECH_LOG backlink field, and the full sub-space
  taxonomy (arbitrary user-created sub-spaces + chronological archive). The fixed top-level space
  and breadcrumb from `src/` ARE in scope (FR-019); the catalog filters by media type, space, and
  status in this phase.
- **Media types in scope (confirmed):** seven types in four context-shape families — Game
  (GAME), Reading (BOOK, MANGA), Screen (FILM, SERIES, ANIME), and Tech (TECH_LOG). GAME, BOOK,
  and TECH_LOG use the shapes designed in `src/`; the Screen family uses position + rating + note.
- **Cover art** defaults to a generated visual per media type (matching `src/`), with an optional
  user-fillable image slot for a custom cover.
- **Design basis (split):** the approved `src/` Phase 1 UI is binding for the **visual design
  language** — the "Digital Paper" treatment, typography, color, the card/grid and split-view
  components, status pills, and bible-verse quotes (constitution Principle III; `src/` wins on
  visual conflicts). Its **navigation and information architecture are POC-only and are
  redesigned in this spec** (see the Navigation & IA requirements), not inherited from `src/`.
- **Deferred personal-automation** (quick-capture hotkey, local library sync agent, Kindle
  import) is recorded in `TODOS.md` and is not part of this phase.
