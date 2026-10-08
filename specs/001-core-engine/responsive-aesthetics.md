> **Historical — part of the superseded 001 Core Engine spec** (superseded by spec 002, [`specs/002-marginalia-rebuild/spec.md`](../002-marginalia-rebuild/spec.md), and constitution v2.0.0, 2026-10-09). Kept as a record; not a source.

# Plan: Responsive + Aesthetic Optimization (all screens, ultrawide-first)

**Date**: 2026-06-21 · **Trigger**: creator rejection — "even I don't want to enter the
site because of its design." Empty canvas on a 34" ultrawide (3440×1440). This plan makes
Epilogue read as an intentional, art-directed product at every size, not a 1500px column
floating in dead paper.

## 1. The real problem (measured, not vibes)

On the 3440×1440 detail page (screenshot):
- Content column is `max-w-[1500px]` centered → **uses 44% of width; ~970px dead paper each side.**
- Content is **top-aligned and short** (empty ledger) → **the entire bottom ~50% is empty.**
- Net: ~70% of the canvas is unused warm paper. Warm texture helped tone, but **texture can't
  fix a layout that doesn't use the canvas.** The eye lands on a small island and asks "is this
  loading?"

This is NOT "good negative space." Negative space is *composed* emptiness around a focal point
(research: intentional whitespace lifts attention 35–45%). What we have is *leftover* emptiness —
the failure mode every large-screen guide warns about.

The catalog (6-col masonry) is acceptable now; **the detail page is the offender**, plus the
catalog on sparse shelves (2 items) and the overall lack of art direction.

## 2. What the research says

**Ultrawide / large screens** — two rules that look contradictory but aren't:
- **Never stretch reading text full-width** (line length > ~75ch destroys readability; cap it).
- **But DO use the canvas with intent** — multi-column composition, larger art, ambient zones,
  or richer content. A centered column on white is the documented anti-pattern.
- Resolution: cap the *reading measure*, fill the *canvas* with additional purposeful zones.

**Awwwards 2026 aesthetic** — winning sites are *experiences, not pages*: dimensional (layered
depth, not flat), art-directed (big cinematic imagery, expressive oversized typography with
texture), and motion-as-communication (entrance/scroll/hover that mean something). The opposite
of "narrow centered column on a flat background."

**Sources:**
- [Awwwards](https://www.awwwards.com/) · [Web design trends dominating award galleries 2026 (TopCSSGallery)](https://www.topcssgallery.com/blog/web-design-trends-dominating-award-galleries/) · [Web design trends 2026 (reallygooddesigns)](https://reallygooddesigns.com/web-design-trends-2026/)
- [Designing websites for large screens (Speckyboy)](https://speckyboy.com/designing-websites-for-large-screens/) · [Ultra-wide displays ≠ ultra-wide pages (Martech Zone)](https://martech.zone/optimal-web-page-width/) · [Optimizing for large-scale displays (CSS-Tricks)](https://css-tricks.com/optimizing-large-scale-displays/)
- [White space in responsive layouts (Designmodo)](https://designmodo.com/white-space-responsive-layouts/)

**Verified this session (web research + the `impeccable` skill's own design guidance):**
- **Large screens:** cap content containers; full-width text on 4K is "a big no-no"; keep line
  length 50–75ch. Use **container queries** (components respond to their parent, not the viewport)
  + **`clamp()` fluid type** (smooth scaling, no breakpoint jumps) — the 2026 standard.
  ([Belov: screen sizes 2026](https://belovdigital.agency/blog/designing-for-different-screen-sizes-best-practices/) ·
  [Scrimba responsive guide 2026](https://scrimba.com/articles/responsive-web-design-a-complete-guide-2026-2/) ·
  [Martech Zone](https://martech.zone/optimal-web-page-width/))
- **Awwwards 2026:** typography-as-hero (oversized, expressive, animated), editorial/asymmetric
  composition with *composed* negative space, depth & dimension (sculpted shadows, soft noise,
  glass/liquid-glass), motion-as-experience. Flat centered columns are the anti-pattern.
  ([reallygooddesigns](https://reallygooddesigns.com/web-design-trends-2026/) ·
  [TopCSSGallery award galleries](https://www.topcssgallery.com/blog/web-design-trends-dominating-award-galleries/))
- **⚠ The cream/sand/beige body background is the saturated AI default of 2026** (impeccable):
  the warm-neutral near-white band (OKLCH L 0.84–0.97, C < 0.06, hue 40–100) reads as
  "paper/parchment" no matter the token name (`--paper`, `--cream`…) — and our last design pass
  warmed the body straight into it (`#f1ebdd`). **This is the deeper reason the site reads bland.**
  Fix: carry warmth via accent + type + imagery, NOT the body bg.

## 3. Responsive system (the spine)

Reading measure is sacred (≤ 72ch). The canvas around it adapts. Breakpoints (already have
3xl/4xl):

| Band | Width | Catalog | Detail composition |
|---|---|---|---|
| mobile | <768 | 1 col, drawer rail | stack: cover → save-state → ledger |
| laptop | 768–1280 | 2–4 col | 2-zone: context (4) / ledger (8) |
| desktop | 1280–1920 | 4–5 col | **3-zone**: context · ledger (≤68ch) · meta/related rail |
| ultrawide | 1920–2560 | 5–6 col | 3-zone widened + **full-height art-directed cover** |
| super-ultrawide | 2560+ | 6 col, cap 2560 | 3-zone + ambient margins (intentional, textured) |

### Detail page redesign (the core fix)
Turn one floating column into a **3-zone composition that fills the canvas with purpose**:
- **Zone A — Save-state (left, sticky, full viewport height).** Larger, art-directed cover that
  *bleeds* (taller, richer), then Previously On + the family context block. Sticky + min-h-screen
  so the left side never goes empty vertically.
- **Zone B — Ledger (center, reading measure ≤68ch).** The long-form, capped for readability.
- **Zone C — Around this (right rail, appears ≥1280).** Metadata (`dl`: type, status, year, dates,
  N-days-ago), backlinks/related entries, and — on ultrawide — a "more from this space" strip or a
  faint ambient generative panel echoing the cover. This is what earns the width.
- **Vertical fill:** content vertically centers on tall viewports when short; the sticky full-height
  cover + the right rail keep both flanks alive even when the ledger is empty.

Same idea, lighter, on the **catalog**: cap the grid container to ~2560 with intentional textured
margins; add a slim "Continue" featured row (most-recent paused) as a hero band so the top isn't a
cold grid, giving vertical anchor on sparse shelves.

## 4. Aesthetic direction (award-tier)

### 4.0 The body-ground decision (the one that breaks the AI look)

> **DECISION (2026-06-21): B — Reading-room (dark).** Deep warm-dark body ("library at night"),
> covers + amber as the light source, dim-lit paper cards. Warmth via accent/type/imagery, never
> the body bg. This supersedes constitution III's literal warm-near-white "Digital Paper" — the
> *soul* (paper, serif, amber, save-state) stays; the *ground* inverts to dark. Constitution III
> to be amended in P0.

The warm-cream body is the AI tell. "Digital Paper" must survive, but the GROUND has to move
off the cream band. Three coherent directions (pick one — touches constitution III):
- **A. True-paper + dark ink (de-AI'd light).** Body to a near-white at **chroma ~0** (cool-neutral,
  not warm-tinted). Reading surfaces = real paper-white cards; warmth comes only from amber, Playfair,
  and the covers. Smallest departure; keeps "paper" honest.
- **B. Reading-room (recommended).** Deep warm-dark body ("library at night" — near-black/espresso/
  oxblood); covers + amber become the *light source*; cards are dim-lit paper. Most award-tier, most
  "alive/cozy" (cozy ≠ beige), highest contrast with the AI default. Biggest departure from src/ POC.
- **C. Ink-on-ground duotone.** A single saturated brand ground (deep ochre/terracotta) with paper
  panels floating on it. Bold, editorial, riskier to keep readable.

Whichever: **stop carrying warmth in the body bg.** Then:

Keep the warm paper soul; add dimension + art direction:
- **Cinematic covers.** Bigger, layered (grain + soft inner shadow + subtle parallax on hover);
  the detail cover is a hero, not a thumbnail.
- **Expressive type.** Lean into Playfair at display sizes for entry titles (clamp up); mono labels
  stay quiet. More size contrast = more editorial.
- **Depth + motion as meaning.** Entrance `epiFade`/`epiPop` on cards + sections (staggered),
  hover lift already present; add scroll-reveal on the ledger; all gated by `prefers-reduced-motion`.
- **Layered surfaces** (done) + soft ambient glows tied to the entry's generative tone, so the page
  feels lit by its content.

## 5. Tooling — "connect Claude Code to Claude Design" (answered)

There is no separate "Claude Design" product to bridge to — the design capability lives *inside*
Claude (the model) and is exposed through skills/MCP. You already have the best of them installed:

1. **`impeccable` v3.7.1 (installed — RECOMMENDED primary).** Purpose-built design engine: real
   production code, committed choices, browser-screenshot self-verification, and explicit anti-AI-slop
   rules (it's where the cream-bg warning came from). Sub-commands fit this job exactly:
   `impeccable audit` (diagnose) → `impeccable layout` (large-screen composition) →
   `impeccable bolder`/`polish`/`animate` (art direction + motion). Runs via `npx impeccable …`.
   It reads PRODUCT.md/DESIGN.md — so we feed it this plan + the chosen body-ground direction.
2. **`frontend-design` skill** (built-in) — distinctive production-grade UI, avoids generic AI
   aesthetics. Good secondary / for net-new components.
3. **Figma MCP** (connected — `mcp__plugin_figma__*` + figma skills) — bidirectional code↔Figma if
   you want to art-direct visually in Figma, then codegen back.
   ([Figma + Claude Code](https://www.figma.com/blog/introducing-claude-code-to-figma/))
4. **firecrawl** (installed) — scrape specific Awwwards winners / reference sites for concrete
   layout + motion patterns to steal-like-an-artist before building.
5. **gstack `/design-shotgun`** — N art-directed variants + comparison board to pick a direction
   (needs OpenAI auth for mockups).

## 6. Phased implementation

Engine: drive each phase with **`impeccable`** (audit → layout → bolder/polish), feeding it this
doc + the chosen body-ground (§4.0). Verify every phase with system-Chromium screenshots at
mobile/laptop/desktop/ultrawide; component tests stay green.

- **P0 — Body-ground + tokens** (decision §4.0): move the body off the cream band, retune the
  surface ramp (OKLCH), keep amber/Playfair/covers carrying warmth. Update constitution III + the
  Tailwind theme to match. This is what actually kills the AI/A4 read.
- **P1 — Detail 3-zone adaptive layout** (the fix): Zone A sticky full-height cover, Zone B capped
  ledger, Zone C meta/related rail; vertical centering; ultrawide widths. Biggest visible win.
- **P2 — Catalog**: container cap + textured margins + "Continue" featured band; sparse-shelf balance.
- **P3 — Aesthetic pass**: cinematic cover treatment, display-type scale, staggered entrance + scroll
  reveals (reduced-motion safe).
- **P4 — Verify** across mobile/laptop/desktop/ultrawide via system-Chromium screenshots; component
  tests stay green; optional Figma push for ongoing art direction.

**Out of scope:** new features (the four user stories are done); this is purely layout + aesthetics.
