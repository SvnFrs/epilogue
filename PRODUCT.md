# Product

> Derived (impeccable `init`) from `docs/vision.md`, `.specify/memory/constitution.md`,
> and `specs/001-core-engine/responsive-aesthetics.md` — the strategic answers were already
> settled there, so this captures rather than re-interviews. 2026-06-21.

## Register

product

## Users

One primary user (the owner) curating a private, self-hosted archive of everything they've
*actively* lived through — games, books/manga, films/series/anime, and tech logs. Context: at a
desk, often on a large/ultrawide monitor, returning after days or weeks away. The job: **resume
cold.** Reopen a paused thing and instantly recall "where was I, what was I doing, why did it
matter" — without digging through Discord/Telegram scrollback. Phase 2b adds small invited
read-only groups; the engine is single-player first.

## Product Purpose

Epilogue is a **cognitive save-state** — a "Previously On" for your own life. It exists because
the things that shaped you decay in chat logs and memory. Success = a returning user recovers full
context in seconds (the polymorphic save-state per media family) and writes lasting, structured
reflection (the Ledger). It is an evergreen knowledge layer, the opposite of the ephemeral feed.

## Brand Personality

Three words: **curated, literary, lived-in.** Voice is a quiet archivist/librarian — warm but
precise, never chirpy SaaS. It should feel like a private reading room at night: personal, calm,
cinematic, a little nostalgic. Emotional goal: the reverent hush of opening a well-kept journal,
not the dopamine of a feed.

## Anti-references

- **Generic SaaS / AI-slop:** cream/parchment near-white backgrounds (the 2026 AI tell), 3-column
  icon-in-circle feature grids, centered-everything, uniform bubbly cards, tiny tracked eyebrows on
  every section, purple gradients. Epilogue is the opposite of a startup landing page.
- **The feed:** infinite scroll, engagement bait, notification noise, recency-as-hierarchy.
- **Flat dead canvas:** a narrow column floating in empty paper (the failure we're fixing). Negative
  space must be *composed*, never *leftover*.

## Design Principles

1. **Cognitive save-state first.** Every screen serves cold recall; the "Previously On" save-state
   is the headline, not a footnote.
2. **Lit by its content.** The page draws light from the work itself — generative covers + amber
   are the light source on a dark ground. Warmth never comes from a beige background.
3. **Composed, not centered.** Use the whole canvas with intent (multi-zone composition, cinematic
   art, ambient atmosphere); cap the *reading measure*, fill the *canvas*.
4. **Evergreen over ephemeral.** Structured digestion (the Ledger) and durable taxonomy over feeds
   and recency.
5. **Local-first, owner-owned.** Single-player, self-hosted, every row owner-scoped; the design can
   be intimate and personal because it isn't a public product.

## Accessibility & Inclusion

WCAG AA: body text ≥ 4.5:1, large/UI ≥ 3:1 (verified against the dark ground — warm-cream ink on
espresso, not muted-gray). `prefers-reduced-motion` honored for every animation. 44px touch
targets. Hand-built widgets carry full ARIA + keyboard/focus (no component-lib safety net). No
color-only encoding (status carries label + dot).
