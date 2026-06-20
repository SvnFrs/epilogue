# Lessons Learned

A running log of workflow and process insights for the Epilogue project.

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
