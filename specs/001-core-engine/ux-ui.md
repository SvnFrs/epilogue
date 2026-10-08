# UX/UI Implementation Plan: Core Engine (Phase 2a)

Visual language is **binding from `src/`** (constitution III; spec clarification). Navigation is
**redesigned** here (library rail; spec FR-019/020). Extracted from `src/tailwind-static.css`,
`Epilogue.html`, `home.jsx`, `sidebar.jsx`, `ledger-view.jsx`.

## 1. Design tokens (port into the Tailwind theme)

- **Surfaces (paper):** `--epi-paper` warm `#faf9f7` (default) / cream `#f7f3ea` / cool `#f5f5f4`;
  `stone-50 #fafaf9`. Never pure `#fff`/`#000`.
- **Ink/text:** body `stone-800 #292524`, `stone-700`, `stone-600`, muted `stone-500 #78716c`,
  mono labels `stone-400`, borders `stone-200 #e7e5e4`.
- **Amber accent:** `amber-600 #d97706` (the dot + rules), `amber-700 #b45309` (buttons/links/
  kicker), `amber-800`, fills `amber-50/100`, selection `amber-200`.
- **Status colors:** Playing/Reading green `#16a34a`; Paused amber `#d97706`; Completed sage
  `#166534`; Tech "digesting" cyan `#0891b2`. Card badges use ~0.92-alpha fills.
- **Triple-font:** serif `var(--epi-headline)` → Playfair Display (Georgia fallback) for
  headlines/titles/quotes; **Geist** sans for UI/body; **Geist Mono** for labels/meta/kbd/byline.
- **Radii:** `rounded-3xl 1.5rem` (cover cards, modal), `rounded-2xl 1rem` (sidebar blocks, cover
  art, callouts, embeds), `rounded-xl`, `rounded-full` (pills/badges).
- **Shadows:** card hover `0 22px 50px -24px rgba(41,37,36,.45)`; cover `0 18px 40px -18px
  rgba(41,37,36,.55)`; paper sheen `inset 0 1px 0 rgba(255,255,255,.6)`; `ring-1 ring-stone-900/10`.
- **Texture:** fixed paper-grain radial + 115° diagonal hairlines; 9px scrollbar; `epiFade`/`epiPop`
  keyframes. Theme via CSS vars `--epi-headline`/`--epi-paper` on `<html>` → port as a theme provider.

## 2. Component inventory (EXISTS in `src/` vs NEW)

| Component | Status | Source |
|---|---|---|
| Masonry/bento catalog grid | EXISTS | `home.jsx:246` |
| Cover card (hover lift, scrim, type chip) | EXISTS | `home.jsx:84` |
| Generative cover (`Motif`: ridge/sun/eva/code/verse/ring/snow…) | EXISTS | `home.jsx:23`, `home-data.js` |
| Status pill / badge + dropdown | EXISTS | `home.jsx:16`, `sidebar.jsx:16` |
| **Library rail** (space switcher + status filters, persistent left) | **NEW** | replaces `app.jsx:45–114` |
| `Space › Title` breadcrumb | NEW (repurpose) | old was space/year/month |
| Split-view detail shell (4-col context / 8-col ledger) | EXISTS, re-host | `app.jsx:255`, `sidebar.jsx:293` |
| Cover art block + meta `<dl>` + SectionLabel | EXISTS | `sidebar.jsx:58–118` |
| Context — **game** (checkpoint+edit, threads, keymap kbd) | EXISTS | `sidebar.jsx:121` |
| Context — **reading** (current chapter, bookmarked verses) | EXISTS | `sidebar.jsx:207` |
| Context — **tech** (sources, backlinks) | EXISTS | `sidebar.jsx:238` |
| Context — **screen** (anime/film: position+rating+note) | **NEW** | no variant exists yet |
| Ledger renderers (`h2/p/quote/callout/embed`) | EXISTS | `ledger-view.jsx:6` |
| Bible-verse blockquote | EXISTS | `ledger-view.jsx:22`, `sidebar.jsx:224` |
| "Previously On" | RE-HOST: modal → contextual left column | `app.jsx:117` |
| Empty state | EXISTS (catalog only) | `home.jsx:255` |
| Embed renderer | EXISTS-PLACEHOLDER → real provider embed | `ledger-view.jsx:54` |

## 3. Key states (per major component)
- **Catalog:** empty (have) · loading (cover-gradient skeletons) NEW · error/retry NEW · first-run CTA NEW.
- **Cover card:** default/hover (have); generative cover *is* the no-image state; broken-image fallback.
- **Library rail:** default / active-space / hover / empty-space ("nothing here yet") / first-run. All NEW.
- **Detail + ledger:** loaded (have) · loading skeletons NEW · real 404 NEW (today it silently falls back to `STORIES[0]`) · empty-ledger NEW.
- **Context blocks:** populated (have); per-family empty states NEW; checkpoint edit/save (have).
- **Previously On:** persistent column collapsed/expanded (replaces modal open/close + auto-fire timer).

## 4. Gaps & risks (POC → rail IA rework)
1. **Two disconnected apps** — `home.jsx`/`home-data.js` vs `app.jsx`/`data.js` with divergent data
   shapes; only 3 of 9 entries deep-linkable. Unify into one `Entry` model + `/[space]/[id]` routes.
2. **Throwaway nav** — top-nav + browser-tab switcher are exactly what the rail replaces; rebuild, don't port.
3. **Spaces inconsistent** — data uses `gaming/reading/tech`; need `gaming/reading/cinema/tech` + media_type→space mapping; **no screen/cinema context block exists.**
4. **"Previously On" re-architecture** — modal → persistent left column (layout/scroll/state change).
5. **Ephemeral, window-coupled state** — reads `window.EPILOGUE_*`, resets on reload. Replace with the real data layer (Drizzle/Postgres + TanStack Query).
6. **Fake embed** — static play button → real provider embeds.
7. **`image-slot.js`** is a 31KB custom web component, SSR-incompatible → replace with `next/image` + generative-cover fallback.
8. **Missing states** — no real loading/error/first-run; not-found masks bugs.
9. **Hardcoded magic numbers** (`lg:top-[88px]` sticky offset assumes old header height — breaks under the rail). Tokenize.
10. **A11y** — status dropdown + rail need roles/keyboard/landmarks; card titles need accessible labels.

> Deeper component-level markup (exact rail behavior, transitions, slop-check) runs through
> `/plan-design-review` with `src/` as the visual acceptance criteria.

## Design Review additions (2026-06-20) — rail, states, a11y

Text-based design review (mockup gen needs OpenAI auth + browser restart; run `/design-shotgun`
later for visuals). Completeness 7 → 9/10. Decisions below are binding for implementation.

### Library rail — labeled, always-visible (~240px)
- Fixed-left, full-height, `bg` paper + `border-r border-stone-200`. Wordmark "Epilogue ·" (amber dot) on top; owner avatar in the footer.
- **SPACES** (mono eyebrow): All / Gaming / Reading / Cinema / Tech — each row = media-family icon + label. Active space = `amber-50` fill + `amber-700` text + a left amber accent bar.
- **STATUS** (mono eyebrow): multi-select toggles for Playing / Paused / Reading / Completed / Airing.
- States: default · hover (`bg-stone-100`) · active (amber) · empty-space (count "0", row muted) · first-run (rail still shows spaces; main area onboards).
- Selection is **URL-driven** (`/[space]?status=`); the rail reflects the route. Zustand holds only rail open/collapsed (research D3), never the selection.
- Responsive (FR-025): `<768px` collapses to a top hamburger → slide-in drawer (same content), 44px targets.

### Key states (designed, not just listed)
- **Catalog loading:** cover-card skeletons reusing the generative-cover gradient as a shimmer; serif title bars as gray blocks. No spinner.
- **Catalog empty (first run):** warm centered serif "Your shelf is empty" + one-line sub + amber "Add your first entry".
- **Space/filter empty:** dashed-border "Nothing here yet" + "Add to {Space}". Never a blank grid.
- **Entry 404:** real not-found page ("This entry isn't here" + back-to-Library). Fixes the POC silently falling back to `STORIES[0]` (`app.jsx:213`).
- **Detail loading:** split-view skeleton — labeled placeholder rows left, standfirst + paragraph skeletons right.
- **Empty ledger:** invite "Start the Ledger" with the named-anchor presets (The Sandbox / The Campfire / The Post-Credits Blur) as one-tap section starters.
- **Empty volatile context (per family):** typed prompt ("Capture where you left off") showing the family's fields, not empty containers.
- **API unreachable at first paint:** error boundary → "Couldn't reach your library" + retry. Never blank.

### Accessibility (specified)
**No component library (hand-built, user choice)** — every interactive widget below is hand-rolled
to WAI-ARIA with no Radix safety net, so each gets dedicated keyboard/focus tests (T11).
- Landmarks: rail `<nav aria-label="Library">`, catalog/detail `<main>`, context column `<aside aria-label="Save-state">`.
- Keyboard: rail roving `tabindex` (arrows move, Enter selects); status = real checkboxes; replace the POC role-less status dropdown (`sidebar.jsx:16`) with a real listbox (`aria-expanded` + arrows). Visible focus ring (`ring-2 ring-amber-400`); never bare `outline:none`.
- Contrast: body `stone-800` on paper = AA; any actionable mono text uses `stone-600`+ (not the `stone-400` label tone); status pill fill/text combos checked for AA.
- Touch: 44px min targets (rail rows, pills, card tap area, checkpoint edit).
- Motion: gate `epiFade`/`epiPop` + hover lifts on `prefers-reduced-motion`.
- Images: generative covers `aria-hidden`; card link's accessible name = the entry title.

### Accessibility audit — reading-room dark (T042, verified 2026-06-21)
Audited against WCAG 2.1 AA on the shipped dark theme; results + the one fix:
- **Reduced motion**: `globals.css` `@media (prefers-reduced-motion: reduce)` zeroes `epiFade`/shimmer/transition durations + iteration counts — verified gating the `.epi-rise` stagger and card hover-lift.
- **Contrast (computed ratios, foreground × dark surfaces)**: `ink #efe7d8` 11.2–14.6 (AAA); `muted #b6ab97` 6.1–7.9 (AA/AAA); `amber-lit #f59e0b` 6.4–8.4 (AA/AAA); `stone-500` 4.4–5.8 (AA on its real surfaces). **Fix**: `faint`/`stone-400` was `#8c8170` (3.6:1 on `card2` placeholders, 4.0 on `card` — sub-AA for small text/placeholders) → bumped to **`#a09684`** (≥4.7:1 on every surface, still below `muted` so the hierarchy holds). All body/label/placeholder text now ≥4.5:1; large text ≥3:1.
- **Touch targets**: primary controls ≥44px — rail space rows + status labels (`min-h-[44px]`), mobile hamburger (`h-11 w-11`), create-entry submit (`py-3`), and the catalog "+ Add entry" CTA (bumped to `min-h-[44px]`); entry cards are full-card tap areas. Secondary inline micro-buttons (ledger thread toggles, context edit/save) are deliberately small — WCAG 2.5.8 (AA) exempts inline controls (24px floor); 44px (2.5.5) is AAA.
- **Hand-built widgets**: rail drawer is now a real `role="dialog" aria-modal` with Escape-to-close + focus-on-open and an `aria-expanded` trigger (T041); roving tabindex + `aria-current` + native checkboxes covered by `LibraryRail.test.tsx`.
