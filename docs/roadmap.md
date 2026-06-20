# Epilogue — Positioning & Roadmap (v1, 2026-06-20)

Decision: **Hybrid wedge (C)**, chosen in the CEO review (`docs/ceo-review-2026-06-20.md`).
This doc is the forward-looking expansion of `docs/vision.md` (the origin/soul) and the
genesis in `docs/gemini_og.md` / `docs/gemini_1.md`. It does not replace them.

---

## Positioning: the evergreen knowledge layer

Epilogue is where active-attention knowledge (games, films, books, tech deep-dives) is
**structured at capture, attributed to a person, and retrievable for years** — the layer
niche communities currently fail to keep inside Discord and Telegram. Single-player first;
community by invitation.

It is not a chat tool (those optimize for *now*), not a feed (those optimize for
*engagement*), and not a wiki (those have no personal voice). It is the place a community's
hard-won knowledge stops scrolling out of the channel forever.

---

## The wedge — what proves the thesis, in order

```
  PHASE 2a                      PHASE 2b                       PHASE 3
  Single-player Core Engine --> Shareable read-only       -->  Full community
  (you as user 1)               sub-space (the link)            (accounts + roles)

  polymorphic Story +           one curated sub-space,          invite / contribute /
  volatile context block +      shared by link, readable        read roles, follow,
  structured Ledger +           with no account. Proves         comment, self-host.
  Digital Paper, on             the community thesis with        Only after 2a + 2b
  Next.js + Postgres,           ONE feature, not a platform.     prove stickiness.
  user_id on every table.
```

- **Phase 2a (Core Engine).** Exactly the current `vision.md` / constitution scope. Build it
  for yourself. `user_id` on every table from day one (already a constitution rule), so 2b is
  cheap.
- **Phase 2b (Shareable read-only sub-space).** The one community feature pulled forward. A
  sub-space gets a public read-only link; visitors read the curated archive without an account.
  This is the "Grinding Gang" link, reborn so the knowledge does not die in a Discord channel.
  It exercises the multi-tenant scoping in production instead of leaving it latent.
- **Phase 3 (Full community).** Accounts, invite/contribute/read roles, follow, comment,
  self-host for niche communities. Deferred until 2a/2b prove people actually capture and
  return.

---

## Expansion backlog (cherry-pick)

Effort is shown as human-team / Claude-Code time. Reply with which to **Add** (into the wedge),
**Defer** (write to a TODO for later), or **Skip**.

| # | Feature | Serves | Effort (human / CC) | My rec |
|---|---------|--------|---------------------|--------|
| 1 | Embedded external sources (YouTube / wiki link cards in the Ledger) | Information Digestion Engine; the "curator" model | 1d / 30m | **Add** (near-core to the thesis) |
| 2 | Full-text search across entries + Ledger | "Evergreen and findable" — the anti-Reddit/Discord differentiator | 2d / 1h | **Add** (this IS the differentiator) |
| 3 | Bi-directional `@`-links between entries (wiki-style knowledge graph) | Turns isolated logs into a knowledge network | 2-3d / 1-2h | **Add** (compounding value) |
| 4 | Sub-space taxonomy + chronological archive (Reddit-sub structure + dev-blog year/month tree) | Navigation for a growing, mixed library | 1-2d / 45m | **Add** (needed once >20 entries) |
| 5 | Quick-capture global hotkey (AHK "Previously On" mid-game save) | Personal save-state convenience | 1-2d / 1h | **Defer** (Windows-specific polish) |
| 6 | Local agent: Steam / repack library auto-sync (Bun scraper) | Library hydration automation | 3-4d / 2h | **Defer** (automation, not the thesis) |
| 7 | Kindle `My Clippings.txt` import for book quotes | Book-quote capture | 1d / 30m | **Defer** (revisit later; manual entry is fine now) |

Net (confirmed 2026-06-20): **Add 1-4** into the wedge — they all push the "evergreen
community knowledge layer" thesis. **Defer 5-7** to `TODOS.md`; revisit after the wedge
ships. Nothing skipped outright.

---

## Constitution impact (APPLIED — v1.1.0, 2026-06-20)

Applied to `.specify/memory/constitution.md`:

- Preamble now names the "evergreen knowledge layer" community purpose (anti-Discord/Telegram).
- Principle IV now pulls the Phase 2b shareable read-only sub-space near-term, so multi-tenant
  scoping is exercised early, not merely latent.
- New Principle VI "Evergreen over Ephemeral": structured-at-capture, full-text search in
  scope, durable taxonomy (not a recency feed), bi-directional links.
- Architecture section now carries the wedge roadmap and the in-scope / deferred / out-of-scope
  split.

---

## Out of scope (now)

Real-time chat, public global feed, mobile apps, music/passive media, full social graph before
2a/2b validate. These are not rejections, just not the wedge.
