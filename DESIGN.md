# Design

> The "reading-room dark" design language for Epilogue (impeccable `init`, 2026-06-21).
> Supersedes the light "Digital Paper" ground; keeps its soul (serif/Playfair, amber, save-state,
> generative covers). Decision + rationale: `specs/001-core-engine/responsive-aesthetics.md` §4.0.

## Theme

**Reading room at night.** A deep warm-dark ground (espresso/near-black) that the content *lights*:
generative covers and the amber accent are the light sources; cards are dim-lit paper. Warmth lives
in the accent, the Playfair serif, and the cover art — never in the background. Mood: a private
library after dark, a journal under a desk lamp. Color strategy: **restrained** — warm-neutral dark
ramp + a single amber accent (~≤10% of surface) + content-driven cover color.

Why dark (the physical scene): one person, at a desk, often at night, returning to recall and
reflect. A dark ground makes the cover art glow, reduces fatigue for long reading/writing, and is
the deliberate opposite of the cream-near-white AI default.

## Color (OKLCH; hex for implementation)

Warm-neutral dark ramp (hue ~60, very low chroma — warmth via hue, not lightness):

| Token | Role | OKLCH | Hex |
|---|---|---|---|
| `--ground` | body / deepest | oklch(0.19 0.012 60) | `#1a1613` |
| `--surface` | rail, panels, raised | oklch(0.23 0.012 58) | `#221d18` |
| `--card` | dim-lit paper (entry cards, blocks) | oklch(0.27 0.013 56) | `#2a2420` |
| `--card-2` | nested/raised within card | oklch(0.31 0.013 56) | `#332c26` |
| `--line` | borders, hairlines | oklch(0.36 0.012 58) | `#3d362d` |
| `--ink` | primary text | oklch(0.93 0.014 82) | `#efe7d8` |
| `--muted` | secondary text | oklch(0.74 0.013 75) | `#b6ab97` |
| `--faint` | labels, meta, mono eyebrows | oklch(0.60 0.013 72) | `#8c8170` |
| `--amber` | accent fill (dot, buttons, rules) | oklch(0.70 0.15 65) | `#d97706` |
| `--amber-lit` | accent on dark (links, labels, glow) | oklch(0.80 0.14 75) | `#f59e0b` |

Status (tuned to read on dark; always paired with a label, never color-only):
Playing/Reading green `#4ade80` · Paused amber `#fbbf24` · Completed sage `#86efac` ·
Airing/tech cyan `#22d3ee`. Card badges use ~0.9-alpha fills of these over the cover.

Contrast: `--ink` on `--ground` ≈ 12:1; `--muted` on `--card` ≈ 5:1 (AA body); `--faint` only for
≥14px labels. No muted-gray body text. Amber text uses `--amber-lit` (not `--amber`) for AA.

## Typography

Triple-font stays. Serif carries the soul; lean into it at display sizes.
- **Serif — Playfair Display** (`--epi-headline`): entry titles, ledger headings, quotes, the
  wordmark. Display clamp `clamp(2rem, 4vw, 3.4rem)` for entry/section titles (ceiling ≤ 6rem;
  letter-spacing ≥ -0.03em; `text-wrap: balance` on h1–h3).
- **Sans — Geist**: UI, body, controls. Body ≥ 16px, line-height 1.6, **measure ≤ 68ch** for the
  Ledger.
- **Mono — Geist Mono**: labels, meta, kbd, byline, the `--faint` eyebrows. Used sparingly.
- `text-wrap: pretty` on long prose. Tabular-nums on any number columns.

## Components

- **Library rail** (`--surface`, right border `--line`): wordmark + amber dot; spaces (icon+label,
  active = `--amber-lit` text + amber left bar + faint amber wash); status multi-select checkboxes;
  owner footer. Roving-tabindex a11y kept.
- **Cover card** (`--card`, `--line` border, soft shadow + ring): generative cover (per-entry tone +
  motif, now glowing on dark), status badge, type chip, serif title (`--ink`), mono meta (`--faint`).
  Hover: lift + cover parallax + amber-tinted ring.
- **Generative cover**: the light source. Keep per-entry tone/motif variation; covers stay vivid
  (they're the color on a dark page). Add soft outer glow tying card light to the page.
- **Save-state blocks** (game/reading/screen/tech): the amber "current checkpoint/chapter" card
  becomes a warm-lit panel (`--card-2`, amber-tinted top glow, `--amber-lit` label). Threads/keymap/
  quotes/sources on `--card`. Inputs: `--card-2` bg, `--line` border, amber focus ring.
- **Ledger**: read view on `--ground` with `--card` callouts/embeds; bible-verse quote = amber left
  rule + serif italic on a faint amber wash. Editor inputs on `--card-2`.
- **Empty Ledger**: dim-lit ruled-journal panel (the warm invitation), now on `--card` with faint
  amber desk-lamp glow top-center.
- **States**: skeletons shimmer between `--card`/`--card-2`; error/404 on `--ground` with `--ink`.

## Layout

- **Surface hierarchy:** `--ground` (page) < `--surface` (rail) < `--card` (entries/blocks) <
  `--card-2` (nested). Depth via lightness steps + soft shadow + 1px `--line`, not borders-as-decor.
- **Catalog:** bento masonry (kept), container cap ~2560 with intentional dark margins; a
  "Continue" featured band (most-recent paused) anchors sparse shelves.
- **Detail = 3-zone composition** (the ultrawide fix):
  - **A — Save-state** (left, sticky, **min-h-screen**): larger cinematic cover that bleeds, then
    Previously On + the family block. Never empties vertically.
  - **B — Ledger** (center, measure ≤ 68ch): the long-form, capped for readability.
  - **C — Around this** (right rail, ≥1280): meta `dl` (type/status/year/dates/N-days-ago) +
    backlinks/related + (ultrawide) a faint ambient panel echoing the cover. Earns the width.
  - Vertical-centers when content is short; both flanks stay alive when the ledger is empty.
- **Responsive:** container queries + `clamp()` fluid type. Bands: mobile (stack, drawer rail) ·
  laptop (2-zone) · desktop ≥1280 (3-zone) · ultrawide ≥1920 (3-zone widened + full-height cover) ·
  super-ultrawide ≥2560 (cap + ambient margins).

## Motion

Intentional, reduced-motion-safe. Entrance `epiFade`/`epiPop` staggered on cards/sections;
cover parallax on hover; scroll-reveal on the ledger (enhances an already-visible default, never
gates content); amber glow transitions. Ease-out-quint, 200–500ms. `transform`/`opacity`/`filter`
(glow/blur) only. Every animation has a `prefers-reduced-motion` crossfade/instant fallback.
