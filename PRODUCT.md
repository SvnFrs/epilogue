# Product

> Epilogue after the Marginalia pivot (2026-10-09). Sources: `design/marginalia/README.md`
> (authoritative for the interface), `.specify/memory/constitution.md` v2.0.0 (product rules),
> `docs/vision.md` (the why). Where this file disagrees with `design/marginalia/`, the design
> system wins.

## Register

product

## Users

One reader, Tyler, and nobody else: no accounts, no guests, no audience. Three screens: an
iPhone XS and a Mi 10S in the hand, and a 34″ ultrawide (3440 × 1440) at the desk.

- **On the phone**, mid-life: log a chapter after a sitting, leave a line about where it stopped,
  check where a paused game was left and which keys matter, capture a task or a dream in one line.
- **At the desk**: read back notes and reviews, sort Prologue's Unsorted inbox into Soon and
  Someday, browse the shelves and the journals.
- The job: **come back** to anything after days or weeks and start in seconds.

## Product Purpose

A private commonplace book for everything played, read, watched and heard, and for what is meant
to happen next. Two parts that never mix: **Media** (game, book, manga, anime, film, series,
music, poem, story) and **Prologue** (tasks and dreams). Each has three shelves, Waiting · Open ·
Closed, derived from state.

Success looks like:

- Reopening a paused entry shows where it was left, in the reader's words, without scrolling.
- Logging a sitting is one tap, plus one line if there is something to say.
- Capturing a task never asks a question; sorting happens later, at the desk.
- Nothing typed is ever lost to a failed save.

## Brand Personality

**Private, literate, quiet.** The app writes like a margin: short, plain, warm, never cheerful
*at* you. Sentence case, no exclamation marks, no emoji, no "Great job". Confirmations name what
happened and offer Undo ("Noted · chapter 10"). Dropping something is *Set aside*. Interface
copy is English; content is in whatever language it was lived in (Vietnamese, Chinese and
Japanese titles are ordinary titles). The emotional target is a well-kept notebook in good
light, by day or at night.

## Anti-references

- **Social trackers**: public profiles, star ratings, averages, follower counts, share sheets,
  "year in review" brags.
- **Habit and productivity apps**: streaks, goals, badges, reminders, priority flags, red due
  dates, colour-coded lists.
- **Generic SaaS and AI-slop**: icon-in-circle feature grids, gradient heroes, glass everywhere,
  uniform bubbly cards, uppercase on everything.
- **Genre theming**: kinds of media colour-coded, or a game screen that looks like a game UI. The
  page stays the same; only the entry's ink changes.
- **A stretched phone**: a wide screen that is just a phone column floating in space.

## Design Principles

From `design/marginalia/README.md`, "Five rules":

1. **One reader, coming back.** Nothing performs for an audience. Logging beats displaying; one
   tap logs progress, and stopping always leaves a bookmark.
2. **The page stays; the ink changes.** The frame never changes genre. Each entry brings one
   colour, its ink, bound to what the page can carry. Kinds get a glyph and a cover shape, never
   a colour.
3. **Clay, then glass.** Anything you touch is solid, matte clay. Glass is only for chrome that
   floats over moving content (the dock, a scrolled top bar, the toast), and text on it is `ink`.
4. **Objects are crisp, furniture is soft.** Covers, ribbons and seals keep crisp corners and
   fixed colours in both themes; rows, sheets and buttons are soft clay.
5. **Thumb first, spread last.** Design at 375pt, one-handed. A wider screen earns more columns
   and finally an open book, never a stretched phone.

## Accessibility & Inclusion

- Text tokens (`ink`, `ink-soft`, `ink-faint`) hold 4.5:1 on every ground in both themes; text on
  glass is `ink` only; entry ink is never text on a wash; meaningful boundaries hold 3:1.
- Every hit area is at least 44px; text inputs are 17px so iOS never zooms.
- State is never colour-only: every state carries a glyph and a word. Finished (quill) and
  destructive (scorch) sit on the blue–red axis, never relying on red–green.
- No italics: quiet text is quieter in colour.
- `prefers-reduced-motion` resolves every motion instantly.
- Literata and Lexend cover every Vietnamese letter and tone mark; CJK falls back to the system
  face with no special-casing.
- Keyboard: focus ring (2px page, then 2px quill), "/" opens Find, `N` focuses capture at the desk.
