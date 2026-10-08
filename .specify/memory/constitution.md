<!--
SYNC IMPACT REPORT
==================
Version change: 1.2.0 → 2.0.0
Bump rationale: MAJOR. Epilogue is redefined as a private commonplace book for one reader,
designed first as the Marginalia design system (design/marginalia/). Every principle is
replaced or redefined; the community wedge, the share link, TECH_LOG, the four spaces and
the Ledger block format are removed. Backward-incompatible with 001-core-engine's domain
model and UI.

Principles (old → new):
  I.   Cognitive Save-State First      → I.   Coming Back First (REDEFINED: LeftOff + the log
                                              sheet replace the polymorphic volatile context;
                                              TECH_LOG removed)
  II.  Active Attention Only           → REMOVED (the music ban and the "no tracker" rule go;
                                              music is a media kind)
  III. Digital Paper — Reading-Room Dark → III. Marginalia Is the Design Language (REDEFINED:
                                              Paper + Lamplight themes, design/marginalia/ is
                                              authoritative; reading-room dark as the only
                                              theme removed)
  IV.  Local-First, Single-Player —    → IV.  One Reader, Self-Hosted, Always Online
       Multi-Tenant by Schema                 (REDEFINED: owner_id kept as cheap insurance;
                                              Phase 2b share link and Phase 3 community
                                              removed; local-first → always online)
  V.   Structured Digestion over Hoarding → REMOVED (Ledger h2/p/quote/embed/callout format
                                              gone; writing is margin notes + one review)
  VI.  Evergreen over Ephemeral        → REMOVED (community/anti-Discord rationale gone;
                                              Find and Journal per part live in Principle II)
  NEW: II. Two Parts, Three Shelves, Never Mixed
  NEW: V.  Nothing Performs or Nags

Sections:
  - Technology & Architecture Constraints → Scope & Constraints (REWRITTEN: hybrid-wedge
    roadmap, closed status set PLAYING/READING/AIRING/…, `space`, and the stack mandate
    removed; the stack is a plan-level decision for spec 002)
  - Development Workflow & Quality Gates (AMENDED: design review is against
    design/marginalia/; tenant-isolation review becomes an owner_id scoping check)
  - Governance (AMENDED: design/marginalia/ replaces src/ and docs/vision.md as the
    design authority; specs/001-core-engine/ and src/ are historical)

Templates / artifacts reviewed for consistency:
  ✅ .specify/templates/plan-template.md — Constitution Check reads this file; no edit.
  ✅ .specify/templates/spec-template.md — generic; no edit.
  ✅ .specify/templates/tasks-template.md — generic; no edit.
  ✅ .specify/templates/checklist-template.md — generic; no edit.
  ✅ .specify/templates/commands/ — not present in this project.
  ✅ README.md, CLAUDE.md, DESIGN.md, PRODUCT.md, docs/vision.md, docs/roadmap.md,
     TODOS.md — rewritten in the same change set (docs/marginalia-pivot).
  ✅ specs/001-core-engine/ (spec.md, plan.md), docs/ceo-review-2026-06-20.md, src/ —
     marked historical, not rewritten.
  ⚠ .claude/skills/test-pyramid/ — describes the 001 stack (Next.js + Elysia + Drizzle);
     revisit once spec 002's plan chooses a stack.

Deferred / follow-up TODOs: none. Open product questions (Settings/About, Waiting order,
owner-tuned suggestions) are tracked as [NEEDS CLARIFICATION] in spec 002 and in TODOS.md.
-->

# Epilogue Constitution

Epilogue is a private commonplace book for one reader, Tyler: everything played, read,
watched and listened to, where each one was left, and what is meant to happen next. It is
self-hosted, always online, and used on an iPhone XS, a Mi 10S and a 34″ ultrawide. Its
interface language is **Marginalia** (`design/marginalia/`). This constitution encodes the
rules every spec, plan and change must keep. Each rule is written so a reviewer can check it
against a screen or a schema.

## Core Principles

### I. Coming Back First

Epilogue's first job is remembering where each thing was left, so the next sitting starts in
seconds instead of minutes of "what was I doing".

- On an Open media entry, **Where I left it** (`LeftOff`) MUST be the first content under the
  entry header: never behind a tab or disclosure, and above the fold with the dock at rest on
  a 375 × 812pt phone.
- A bookmark holds the position in the work's own units (Chapter 9, S2 · E5 at 23:14,
  Track 18 of 48), a short note in the reader's words, at most **3 facts**, and for games the
  **pinned keys** from its keymap. Anything longer is a margin note.
- **Stopping always leaves a bookmark.** The log sheet MUST offer the progress stepper and the
  *Where I left it* field in the same step; logging progress and leaving the bookmark are one
  action, and the time stamps itself.
- One tap on an Open row logs one more, without opening the entry.
- Pausing, putting back, or setting something down MUST NOT clear its bookmark, keymap or steps.
- Progress is drawn as a page edge in the work's units; things that never end count sittings.
  A total is never invented.
- Rationale: the bookmark is the product. Every other surface exists to get back to it faster.

### II. Two Parts, Three Shelves, Never Mixed

- Epilogue has two parts. **Media**: game, book, manga, anime, film, series, music, poem,
  story. **Prologue**: tasks and dreams. Nothing from one part appears on the other's shelves,
  Find results or Journal.
- A task MAY link one media entry **for reference only**: the link opens the entry, and the
  entry stays on its own shelf. A task never stands in for a media plan; wanting to watch a
  film is the film on Waiting.
- Each part has exactly three shelves, **Waiting · Open · Closed**, derived from state by a
  single mapping. A shelf MUST NOT be stored.

  | shelf | Media (status) | Prologue (state) |
  | --- | --- | --- |
  | Waiting | `shelved`, `paused` | `waiting` (Unsorted inbox, Soon, Someday), `paused` |
  | Open | `open`, `again` | `open` |
  | Closed | `finished`, `aside` | `done`, `aside` |

- **Paused is not a fourth shelf.** A paused item lives on Waiting, sorts first there, and
  keeps its place. Starting it again makes it `open`, never `again`.
- Taking something out of Closed makes a media entry `again` (on Open) and a task or dream
  `open`.
- New media entries land on Waiting unless *Starting now* is chosen; Prologue captures land in
  Unsorted and never ask a question.
- Each part has its own **Find** and its own **Journal**.
- A new media kind or state requires a design-system change first (glyph, cover shape,
  plates, words), then an amendment here.
- Rationale: the same three shelves everywhere make both parts learnable at once; deriving them
  from state means a shelf can never disagree with the thing on it.

### III. Marginalia Is the Design Language

`design/marginalia/` (README, `tokens.json`, components) is the authoritative interface
specification. All UI MUST conform to it, and in particular:

- **Two themes, both required**: **Paper** (day) and **Lamplight** (night). Neither ground is
  pure white or pure black.
- **Contrast rules**: `ink`, `ink-soft` and `ink-faint` hold 4.5:1 on every paper token, on
  `desk` and on every entry wash, in both themes. On glass, text is `ink` only. Entry ink is
  never text on a wash (icons and pips only). `ink-faint` never sits on glass. Meaningful
  boundaries use `rule-control` (3:1).
- **One lamp per view**: exactly one primary action wears `lamp` on any screen; inside a sheet,
  the sheet's primary is the lamp.
- **No italics** anywhere; quiet text is quieter in colour, not slanted.
- **Literata** (titles, reading, everything the reader writes) and **Lexend** (interface) ship
  with the app as font files under the SIL OFL. No font is fetched from a third party at
  runtime. Vietnamese is fully covered; CJK falls back to the system face.
- Kinds never get colours of their own; each entry brings one ink, bound from its cover to the
  bookcloth set.
- Every hit area is at least 44px; text inputs are 17px; a glyph always travels with a word
  (except Back, More, Close and round + buttons, which carry an accessible name); no emoji.
- Under `prefers-reduced-motion`, every motion resolves instantly.
- Changes to the language land in `design/marginalia/` first, then in the app.
- Rationale: the design system was made for this one reader on these three screens; the rules
  above are the parts most easily broken by accident.

### IV. One Reader, Self-Hosted, Always Online

- Epilogue serves exactly one reader. There MUST be no accounts, sign-up, sharing, public
  links, community features, follows, comments or feeds. Because there are no accounts, the
  server MUST only be reachable from the owner's own devices or private network.
- It runs on the owner's own server. Coming back, logging, notes, reviews, Find, Journals and
  the Prologue MUST work with nothing but that server; third-party catalogues only enrich
  adding, and adding by hand is always available.
- **Always online**: there is no offline mode. Saves are optimistic. A failed save shows one
  inline error with **Retry** where it happened and MUST NOT lose anything typed.
- Catalogue lookups (TMDB, AniList, IGDB, Open Library) go through Epilogue's server, never
  straight from the client; API secrets MUST NOT ship to a client.
- `owner_id` stays on every table and every query scopes by it, as cheap insurance. It is not
  a promise of multi-user support.
- Tokens stay platform-neutral so native iOS and Android apps can come later without a redesign.
- Rationale: one reader means no account system to build or secure; always-online removes sync
  conflicts; the server boundary is the whole access-control story.

### V. Nothing Performs or Nags

- There MUST be no streaks, goals, achievements, badges, public or numeric scores, stars,
  averages, reminders or notifications.
- The **verdict** is five steps in words (*Not for me · Passed the time · Good company · Stayed
  with me · Part of me now*), never shown as a number. Each entry has at most one review.
- **The idle prompt asks once**: an Open item untouched for `idleDays` (default 21) gets one
  quiet prompt inside its own row or card offering to put it back on Waiting as `paused`,
  keeping its place. It is never automatic, never repeated within the same quiet stretch,
  never a notification; logging anything resets the clock.
- Counts are quiet text, never badges. Due dates never turn red.
- The voice never scolds or cheers: no exclamation marks, no "Great job"; dropping something
  is *Set aside*.
- Rationale: Epilogue is for the reader, not an audience or a habit loop. Pressure turns a
  commonplace book into a chore.

## Scope & Constraints

- **Coming back**: LeftOff, the log sheet (stepper + where I left it), margin notes, one review
  per entry, the five-step verdict, progress as a page edge or sittings.
- **Adding**: Add entry searches a catalogue per kind through Epilogue's server (TMDB for films
  and series, AniList for anime and manga, IGDB for games, Open Library for books); music,
  poems and stories are added by hand. Adding by hand is always one tap away. An item already
  in the library opens instead of being added twice.
- **Prologue**: Capture lands in Unsorted; tasks are crossed out, dreams come true; Waiting is
  grouped Unsorted · Soon · Someday, never prioritised by flags or colours.
- **Stack**: a plan-level decision for spec 002. The 001 Core Engine code (Next.js + Elysia on
  Bun + Drizzle + PostgreSQL) exists and MAY be reused, but its UI and domain model (spaces,
  TECH_LOG, the Ledger, PLAYING/READING/AIRING statuses) are superseded.
- **Deferred, not designed** (need their own spec and a check against this constitution):
  owner-tuned suggestions; automatic ingest (Trakt for Stremio, Steam local playtime, Kindle
  clippings).
- **Out of scope**: accounts, sharing, community, feeds, public scores, offline mode.

## Development Workflow & Quality Gates

This project runs the **Spec Kit backbone wrapped by a gstack review layer**
(`docs/lessons-learned.md`).

1. **Spec Kit owns** `constitution → specify → clarify → plan → tasks → analyze → implement`.
2. **Plan gate**: every `plan.md` MUST pass the Constitution Check; any UI-bearing plan MUST
   name the `design/marginalia/` components and tokens it uses.
3. **Post-implement gates** (no UI or data change merges without the relevant ones):
   - Correctness review of the diff.
   - **owner_id scoping check** whenever schema or queries change (Principle IV).
   - **Design review** of rendered UI against `design/marginalia/`: both themes, the contrast
     rules, one lamp per view, no italics (Principle III).
   - Browser QA of coming back, logging, adding and capture at phone width and on the spread.
- Tests accompany behaviour changes. Priorities: shelf derivation for both parts, bookmark
  persistence across pause and put-back, the idle prompt asking once, and failed saves keeping
  typed text.

## Governance

- This constitution supersedes ad-hoc preferences. When a decision conflicts with a principle,
  the principle wins unless the constitution is amended first.
- **Source-of-truth precedence**: `design/marginalia/` is authoritative for the interface
  (tokens, components, layout, copy). This constitution is authoritative for product rules.
  Every other document (`docs/vision.md`, `PRODUCT.md`, `DESIGN.md`, `docs/roadmap.md`, specs)
  MUST agree with both; where one disagrees with the design system, the design system wins and
  the document is corrected. `specs/001-core-engine/`, `docs/ceo-review-2026-06-20.md` and
  `src/` are historical records, not sources.
- **Amendment procedure**: changes go through `/speckit-constitution`, which records a Sync
  Impact Report, bumps the version and propagates to dependent templates and docs.
- **Versioning policy** (semantic):
  - MAJOR: removing or redefining a principle in a backward-incompatible way.
  - MINOR: adding a principle or section, or materially expanding guidance.
  - PATCH: clarifications and wording with no change in meaning.
- **Compliance review**: plans, reviews and PRs verify adherence; any deviation MUST be
  justified in the plan's Complexity Tracking and approved by the owner.

**Version**: 2.0.0 | **Ratified**: 2026-06-20 | **Last Amended**: 2026-10-09
