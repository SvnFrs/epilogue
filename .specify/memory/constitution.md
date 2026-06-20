<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Bump rationale: MINOR. Adds Principle VI (Evergreen over Ephemeral), names the
community "evergreen knowledge layer" purpose in the preamble, and pulls the
shareable read-only sub-space (Phase 2b) into Principle IV as a near-term
deliverable. No principle removed or redefined incompatibly. Reflects the
"hybrid wedge" decision in docs/ceo-review-2026-06-20.md and docs/roadmap.md.

Principles:
  I.   Cognitive Save-State First (unchanged)
  II.  Active Attention Only (unchanged)
  III. The "Digital Paper" Aesthetic (unchanged)
  IV.  Local-First, Single-Player — Multi-Tenant by Schema (amended: Phase 2b
       shareable read-only sub-space pulled near-term)
  V.   Structured Digestion over Hoarding (unchanged)
  VI.  Evergreen over Ephemeral (NEW)

Sections:
  - Technology & Architecture Constraints (amended: wedge roadmap + accepted scope)
  - Development Workflow & Quality Gates (unchanged)
  - Governance (unchanged)

Templates / artifacts reviewed for consistency:
  ✅ .specify/templates/plan-template.md — "Constitution Check" gate pulls from
       this file dynamically; no edit required.
  ✅ .specify/templates/spec-template.md — generic; no edit required.
  ✅ .specify/templates/tasks-template.md — generic; no edit required.
  ✅ docs/roadmap.md + docs/ceo-review-2026-06-20.md — source of this amendment.
  ✅ TODOS.md — deferred backlog items 5-7 recorded there.

Note: applied directly during /plan-ceo-review at the user's request, not via a
separate /speckit-constitution run.

Deferred / follow-up TODOs: backlog items 5-7 (quick-capture global hotkey, local
Steam/repack sync agent, Kindle clippings import) deferred to TODOS.md.
-->

# Epilogue Constitution

Epilogue is a "Digital Legacy Museum" and an **evergreen knowledge layer**: a
cognitive save-state for media that demands active attention, built single-player
first and shareable with niche communities by invitation (the hybrid wedge in
`docs/roadmap.md`). It exists because that knowledge currently dies in the message
streams of Discord and Telegram. This constitution encodes the non-negotiable rules
that govern how it is built. Where the approved design in `src/` and the origin
narrative in `docs/vision.md` disagree, the rules below resolve the conflict (see
Governance).

## Core Principles

### I. Cognitive Save-State First (The Volatile Context Block Is Sacred)

The product exists to solve one problem: re-onboarding a human brain into a complex
world after a long absence. Therefore every entry MUST be able to capture a
"Previously On" state precise enough that the user can resume cold.

- The **volatile context block** is a first-class feature, never an afterthought or
  a generic notes field. It is **polymorphic by media type** and MUST preserve the
  shape proven in the approved design:
  - **GAME** → current checkpoint (free prose), open threads (todos), keymap
    reference (action → key).
  - **BOOK** → current chapter/position, pinned quotes (text + precise reference).
  - **TECH_LOG** → embedded sources, bi-directional backlinks.
- Adding a new media type REQUIRES defining its volatile context block shape; an
  entry without a meaningful save-state is incomplete.
- Rationale: every competitor (Notion, Obsidian) fails by treating all content the
  same. The polymorphic save-state is the entire reason Epilogue exists.

### II. Active Attention Only (Curatorial Scope)

Epilogue is strictly for media that demands **active cognitive investment**. Passive
consumption (background music, idle scrolling) is out of scope, permanently.

- Any feature that turns Epilogue into a generic bookmark manager, a passive media
  tracker, or a "digital graveyard of unread links" MUST be rejected.
- New features are judged against the question: *does this help the user re-enter a
  world they invested in, or does it just accumulate more stuff?* Only the former
  ships.
- Rationale: scope discipline is what keeps the museum a museum. The opinionated "no"
  is a feature.

### III. The "Digital Paper" Aesthetic (Non-Negotiable Design Language)

The look and feel is a product requirement, not decoration. The approved design in
`src/` is the source of truth. All UI MUST conform to these concrete, testable rules:

- **Surface**: warm oatmeal/stone backgrounds (`stone-50` base, `stone-200`
  hairline borders). **No pure black (`#000`) or pure white (`#fff`).**
- **Typography — strict triple-font system**:
  - Serif (Playfair Display / Georgia fallback) for headlines, entry titles,
    standfirsts, and reading prose.
  - Sans (Geist / system-ui) for UI chrome: buttons, nav, body controls.
  - Mono (Geist Mono) for labels, eyebrows, metadata, and references — uppercase
    with wide letter-spacing (≈0.1–0.2em).
- **Accent**: amber is the single accent (`amber-600`–`amber-800` for text/borders,
  `amber-50`/`amber-100` for callout fills). Emerald/green is reserved for the
  COMPLETED status only.
- **Shape**: generous rounded corners (`rounded-2xl`), thin borders, pastel **status
  pills** (PLAYING / PAUSED / READING / COMPLETED / AIRING).
- **Signature components** MUST be preserved: the **split-view detail page** (sticky
  left context column + scrollable right "Ledger"), the **"Bible-verse" blockquote**
  (amber left border, right-aligned italic mono reference), and **generative cover
  art** keyed to media type.
- Rationale: the vibe — "reading an archival ledger by a warm lamp" — is the
  emotional payload. AI-generic styling ("AI slop") is a defect, not a near-miss.

### IV. Local-First, Single-Player — Multi-Tenant by Schema

Epilogue runs **local-first and single-player** today, but the data layer MUST be
built so the community evolution requires no destructive migration.

- Every persisted table MUST carry a `user_id` column from day one, even while only
  one user exists. No query or schema may assume single-tenancy at the data layer.
- The UI and product surface MAY assume a single local user; the **database MUST
  NOT**. This split is the rule.
- **Phase 2b pulls one community feature forward**: a shareable read-only sub-space
  (a curated space readable by link, no account required). Multi-tenant scoping MUST
  therefore be exercised in production early, not left latent. Full social (accounts,
  contribute/read roles, follow, comment, self-host) remains Phase 3.
- No cloud dependency may be introduced as a hard requirement for core
  read/write/recall flows while in the local-first phase.
- Rationale: cheap forethought now (one column, consistent scoping) buys the entire
  community direction. Retrofitting tenancy later is the expensive mistake.

### V. Structured Digestion over Hoarding

Saving is not the goal; processing is. The Information Digestion Engine MUST force
content through structured writing, not store raw links.

- The **Ledger** uses the proven structured block format
  (`h2` / `p` / `quote` / `embed` / `callout`) — not freeform blobs — so prose stays
  consistent and renderable.
- Sources are **embedded and re-explained in the user's own words**, anchored by
  named sections (e.g. World-building, Character Profiles, Technical Breakdown,
  Post-Credits raw emotion). A bare bookmark with no digestion is an anti-pattern.
- Rationale: the antidote to the "bookmark graveyard" is forcing cognitive work at
  capture time. The structure is what makes recall possible.

### VI. Evergreen over Ephemeral (Anti-Stream)

Epilogue's reason to exist against Discord and Telegram: captured knowledge MUST stay
findable for years, never buried by recency.

- Every entry and Ledger MUST be **structured at capture, attributed to a person, and
  retrievable** later. Full-text search across entries and Ledgers is in scope, not
  optional: knowledge that cannot be found again has not been preserved.
- Ordering and navigation MUST NOT be a recency-only feed. A durable taxonomy
  (sub-space → category → chronological archive) is required so old knowledge stays
  reachable.
- Entries MAY link to each other (bi-directional `@`-links) to form a knowledge
  network rather than isolated logs.
- Rationale: chat tools optimize for *now*, feeds optimize for *engagement*. Epilogue
  optimizes for *still useful in two years*. That is the wedge.

## Technology & Architecture Constraints

- **Stack**: Next.js (App Router) + PostgreSQL. Phase 1 (the static "Hollywood Set"
  React/HTML UI in `src/`) is the visual and structural reference for the Phase 2
  rebuild.
- **Domain model**: the core entity is the polymorphic **Entry** (title, subtitle,
  `media_type`, `status`, `space`, year/month, cover) plus its media-typed volatile
  context block (Principle I) and its structured Ledger (Principle V).
- **Statuses** are a closed, designed set: PLAYING, PAUSED, READING, ACTIVE,
  COMPLETED, AIRING. New statuses require a constitution amendment and a status-pill
  design.
- **Data scoping**: `user_id` on every table (Principle IV).
- **Roadmap (the hybrid wedge, see `docs/roadmap.md`)**: Phase 2a single-player Core
  Engine → Phase 2b shareable read-only sub-space → Phase 3 full community.
- **In scope for the wedge**: structured Ledger, polymorphic volatile context block,
  full-text search, bi-directional `@`-links, and sub-space + chronological archive
  taxonomy (Principle VI).
- **Deferred (revisit later, see `TODOS.md`)**: quick-capture global hotkey, local
  Steam/repack sync agent, Kindle clippings import.
- **Out of scope now**: accounts, contribute/read roles, real-time sync, public
  global feed, and mobile apps — not precluded by schema, but not built until 2a/2b
  validate.

## Development Workflow & Quality Gates

This project runs the **Spec Kit backbone wrapped by a gstack review layer**, as
documented in `docs/lessons-learned.md`. The flow:

1. **Spec Kit owns** `constitution → specify → clarify → plan → tasks → analyze →
   implement`. It is the single driver; gstack's own `/spec` and `/autoplan` are not
   used as the driver.
2. **Plan gate**: every `plan.md` MUST pass the Constitution Check, and any UI-bearing
   plan MUST receive a design critique against Principle III.
3. **Post-implement hardening gates** (no UI/data feature merges without the relevant
   ones):
   - Correctness review of the diff.
   - **Tenant-isolation review** whenever schema or queries change — verify `user_id`
     scoping cannot leak across users (Principle IV). This is the highest-risk check.
   - **Design review** of any rendered UI against Principle III, with `docs/vision.md`
     and the approved `src/` design supplied as acceptance criteria.
   - Browser-level QA of the affected flows (home grid, split-view detail, checkpoint
     save/restore).
- Tests accompany behavioral changes; recall and save-state flows are the priority to
  cover.

## Governance

- This constitution supersedes ad-hoc preferences and convenience. When a decision
  conflicts with a principle, the principle wins unless the constitution is amended
  first.
- **Source-of-truth precedence**: for **design language and UX**, the approved code
  in `src/` is authoritative and overrides any description in `docs/vision.md`. For
  **product philosophy and the "why"**, `docs/vision.md` is authoritative. Amendments
  reconcile the two explicitly.
- **Amendment procedure**: changes are made via `/speckit-constitution`, which records
  a Sync Impact Report, bumps the version, and propagates to dependent templates.
- **Versioning policy** (semantic):
  - MAJOR — removing or redefining a principle in a backward-incompatible way.
  - MINOR — adding a principle/section or materially expanding guidance.
  - PATCH — clarifications and wording with no change in meaning.
- **Compliance review**: plans, reviews, and PRs verify adherence to these principles;
  any deviation MUST be justified in the plan's Complexity Tracking and approved by the
  project owner.

**Version**: 1.1.0 | **Ratified**: 2026-06-20 | **Last Amended**: 2026-06-20
