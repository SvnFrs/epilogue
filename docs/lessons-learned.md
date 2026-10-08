# Lessons Learned

A running log of workflow and process insights for the Epilogue project.

Entries are dated and kept as written. Entries before 2026-10-09 describe decisions since
superseded by the Marginalia pivot (constitution v2.0.0); see the 2026-10-09 entry.

---

## 2026-06-20 — Combining Spec Kit + gstack

**Context:** I (experienced with GitHub Spec Kit, new to gstack) installed gstack
and wanted to know how the two fit together rather than picking one. The takeaway:
they live in *different phases* of the lifecycle, so they compose cleanly instead
of competing.

### Mental model: Spec Kit is the backbone, gstack wraps the two ends

Keep the Spec Kit spine exactly as-is. Bolt gstack on *before* the spec (product/
design framing) and *after* implement (review, QA, security, ship).

```
        gstack (frame)          SPEC KIT (backbone)              gstack (harden + ship)
   ┌──────────────────────┐ ┌──────────────────────────┐ ┌────────────────────────────────────┐
   /office-hours            /constitution                 /review   /cso     /qa
   /plan-ceo-review     →   /specify → /clarify →     →   /codex    /design-review            →   /ship → /land-and-deploy
   /plan-design-review*     /plan → /tasks →              /devex-review                            /canary
                            /analyze → /implement         /retro · /learn · /document-release
   └──────────────────────┘ └──────────────────────────┘ └────────────────────────────────────┘
        "build the RIGHT thing"   "spec it & build it"           "make sure it actually works"
```

### Classification: every gstack skill vs. the Spec Kit flow

What to adopt, and what to ignore because Spec Kit already covers it.

| Bucket | gstack skills | Verdict for a Spec Kit user |
|---|---|---|
| **A. Complements upstream** (before `/specify`) | `/office-hours`, `/plan-ceo-review`, `/plan-devex-review` | **Adopt selectively.** Produce framing that feeds *into* `spec.md`. With a strong vision already written, use them to pressure-test *scope*, not re-derive the product. |
| **B. Overlaps / competes** with `/plan`, `/tasks`, `/analyze`, `/implement` | `/spec`, `/autoplan`, `/spec --execute` | **Skip.** gstack's own spec→plan→build engine. Spec Kit's is more rigorous on artifacts. Don't run two spec systems. |
| **C. Adds a dimension Spec Kit's generic `/plan` lacks** | `/plan-eng-review`, `/plan-design-review` | **Adopt as a plan critique.** Run them *on* `plan.md`. `/plan-design-review` is the standout for a design-heavy project — Spec Kit won't grade aesthetics; this rates each design dimension 0–10 and flags AI slop. |
| **D. Pure complement downstream** (no Spec Kit equivalent — the real payoff) | `/review`, `/codex`, `/cso`, `/qa`, `/qa-only`, `/browse`, `/design-review`, `/devex-review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/document-release`, `/retro`, `/learn` | **Adopt freely.** Spec Kit stops at `/implement`; gstack's center of gravity *is* this phase. Zero conflict. |
| **E. Orthogonal utilities / safety** | `/investigate`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/connect-chrome`, `/setup-*`, `/design-shotgun`, `/design-html` | **Use ad hoc.** Design-generation skills matter less when a UI already exists — you're *preserving* an aesthetic, so `/design-review` (bucket D) fits better than generating new mockups. |

### Where the seams need glue (friction to remember)

These two weren't built to interoperate:

1. **Two "spec" and "plan" concepts.** Pick one owner per phase. **Spec Kit owns
   `spec → plan → tasks → implement`; never run gstack `/spec` or `/autoplan` as
   the driver.** Use gstack only to *review* Spec Kit's plan.
2. **Plan review is interactive, plan.md is a file.** gstack's `/plan-eng-review` /
   `/plan-design-review` expect Claude Code "plan mode" and want to *edit a plan in
   place*. The plan lives in `specs/<feature>/plan.md`. Glue is manual-ish: point
   the review at that file and have it propose edits back into it.
3. **Separate artifact stores.** Spec Kit writes to `specs/…`; gstack writes to its
   own `$GSTACK_STATE_ROOT`. They don't cross-reference automatically. **Keep
   Spec Kit's `specs/` as the canonical record;** treat gstack output as review notes.
4. **Constitution vs. ethos.** `docs/vision.md` is effectively a constitution — feed
   it into `/speckit-constitution`. gstack review skills won't read it unless told,
   so when running `/design-review` or `/cso`, explicitly point them at
   `vision.md`/the constitution so the aesthetic and `user_id` isolation rules
   become acceptance criteria.

### Concrete sequence for Epilogue Phase 2 (Core Engine)

1. **`/speckit-constitution`** — encode `vision.md` as enforceable rules: local-first,
   single-player-now, `user_id` on every table, "Digital Paper" aesthetic,
   active-attention-only.
2. *(optional)* **`/plan-ceo-review`** — sanity-check that "Phase 2 = core engine" is
   the right next slice vs. gold-plating.
3. **`/speckit-specify` → `/clarify`** — spec the core engine (schema, checkpoint/
   "Previously On" engine, digestion engine).
4. **`/speckit-plan`** → then **`/plan-eng-review`** (Next.js App Router + Postgres,
   multi-tenant-ready schema) **and `/plan-design-review`** (does the plan preserve
   the split-view + Digital Paper vibe?).
5. **`/speckit-tasks` → `/analyze` → `/implement`** — normal Spec Kit build.
6. **Harden (gstack):** `/review` → `/codex` (second opinion on the data layer) →
   **`/cso`** (verify `user_id` isolation can't leak — highest-risk item) →
   **`/design-review`** (implemented UI vs. the aesthetic).
7. **Test:** `/qa http://localhost:3000` — real browser through the masonry grid,
   split-view detail page, and checkpoint save/restore flow.
8. **Ship & reflect:** `/ship` → (`/land-and-deploy`, `/canary` when deploying) →
   `/document-release` + `/learn`.

**Net:** keep the Spec Kit muscle memory entirely; gstack's real value here is
steps **6–7** (review/security/QA) — which Spec Kit doesn't cover at all — plus the
design-review dimension on the plan.

## 2026-06-21 — Design-language workflow (impeccable → gstack ship pipeline)

Added after the creator rejected the light warm-cream UI ("blank A4, too much blank
space, not alive"). Root cause: the **warm-cream body bg is the 2026 AI default** (per
the `impeccable` skill's own rules) — warmth must come from accent + type + imagery,
never the body bg. Decision + research: `specs/001-core-engine/responsive-aesthetics.md`.
Direction chosen: **reading-room dark** (deep warm-dark ground, covers + amber as the
light source). Constitution III to be amended to match.

**The design engine is `impeccable`** (installed, `npx impeccable`). It is NOT one-shot;
it's a sub-command pipeline that self-verifies with browser screenshots:
- `impeccable init` — one-time: writes `PRODUCT.md` (+ `DESIGN.md`). Feed it the
  responsive-aesthetics plan + the reading-room decision so output is on-brand.
- `impeccable audit` — diagnose the current UI against its rulebook.
- `impeccable layout` / `craft` / `colorize` — P0 (dark token ramp, OKLCH) + P1
  (3-zone ultrawide detail). The structural fix.
- `impeccable bolder` / `polish` / `animate` — P3 art direction + motion (reduced-motion safe).
- `impeccable live` — live in-browser iteration on a single element when needed.

**After the design language lands, hand off to gstack in this order** (the "what next"):

1. **`/design-review`** — designer's-eye QA on the *live* result; residual slop, spacing,
   hierarchy, AI-tells. Point it at the constitution + responsive-aesthetics.md as
   acceptance criteria. Loop anything beyond a trivial CSS tweak back into `impeccable
   polish`/`bolder` (impeccable owns aesthetics; design-review owns the audit).
2. **`/qa`** (or `/qa-only`) — functional QA through the real flows (catalog → rail filter
   → detail → save-state edit → ledger), fixes bugs. The dark re-theme touches every
   component, so re-run the journeys.
3. **`/cso`** — security pass: owner-isolation can't leak (highest-risk; re-confirm after
   broad refactors). Pair with the tenant-isolation integration tests.
4. **`/review`** — pre-landing review of the whole diff (correctness + cleanup).
5. **`/ship`** → **`/land-and-deploy`** (+ **`/canary`** post-deploy) — deploy to the Arch
   laptop over Tailscale (Core Engine T045).
6. **`/document-release`** + **`/learn`** + **`/retro`** — sync docs to what shipped,
   capture learnings, retrospective.

**Rule of thumb:** impeccable = *make it beautiful* (owns the design language + fixes);
gstack design-review/qa/cso/review = *prove it's right* (audit, behavior, security, diff).
Don't ask design-review to redesign; don't ask impeccable to security-audit.

## 2026-10-09 — Scope drift, and rebuilding design-first

**What happened.** The June CEO review (`/plan-ceo-review`, `docs/ceo-review-2026-06-20.md`)
ran in SCOPE EXPANSION mode and pushed Epilogue toward a community product: an "evergreen
knowledge layer" against Discord and Telegram, a hybrid wedge (single-player engine → a
shareable read-only sub-space → full community), and constitution rules to match (Principle
VI, the Phase 2b share link, `user_id` as a social-future hedge). The 001 Core Engine was then
specced, built, re-themed and readied for deployment around that framing. None of it was what the one
actual user needed day to day: picking a game, book or series back up after weeks away, on a
phone, and keeping the next things to do somewhere that isn't a chat-to-self.

**What changed.** The rebuild started from a design system made for exactly one user,
Marginalia (`design/marginalia/`): three real screens (iPhone XS, Mi 10S, a 34″ ultrawide),
real entries (RDR2's campfire, a Vietnamese playlist at 2 a.m., War Thunder with no end), and
every state, empty screen and failure drawn before any rule was written. The decisions (two
parts that never mix, three derived shelves, LeftOff first, the idle prompt asked once, no
accounts or scores) were settled in that design, then written into constitution v2.0.0 and
spec 002. Documents came second and code comes third.

**Lessons.**
- A review mode that expands scope will find a bigger product; that is its job. Before
  accepting the expansion, check it against the person who will actually use the thing.
  "Who opens this tomorrow, and why?" would have stopped the wedge.
- Designing the screens for the real user first surfaced the real decisions (what comes first
  on an open entry, what a shelf is, what happens after three quiet weeks). Writing the spec
  first had produced a domain model (spaces, TECH_LOG, the Ledger) that the screens later
  contradicted.
- Keep superseded work as history, clearly marked, rather than deleting it: the 001 code, its
  spec and the June review still explain how the project got here.
