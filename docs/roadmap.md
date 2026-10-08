# Epilogue: roadmap (v2, 2026-10-09)

Replaces the June roadmap (the "hybrid wedge": single-player engine → shareable read-only
sub-space → community), which is historical; see `docs/ceo-review-2026-06-20.md` and
`docs/lessons-learned.md`. Epilogue is now a private commonplace book for one reader
(`docs/vision.md`), and the order below is design first, documents second, code third.

```
design system ─► constitution v2 ─► spec 002 ─► plan ─► build ─► use it 2–4 weeks ─► deferred items
     ✅               ✅              drafted      next
```

1. **Design system: done (2026-10-08).** Marginalia, in `design/marginalia/`: two themes, tokens,
   36 bookcloths, cover plates, 35 components, and the pages for Media, Prologue, adding, Find,
   the journals and every empty state, on an iPhone XS and the ultrawide spread.
2. **Constitution v2.0.0: done (2026-10-09).** Five principles: coming back first; two parts,
   three shelves, never mixed; Marginalia is the design language; one reader, self-hosted,
   always online; nothing performs or nags.
3. **Spec 002, the rebuild: drafted (2026-10-09).** `specs/002-marginalia-rebuild/spec.md`, in
   priority order: coming back + logging; Media's three shelves; adding; Prologue capture and
   shelves; journals and Find. Three questions are open (`[NEEDS CLARIFICATION]`, also in
   `TODOS.md`); answer them with `/speckit-clarify` before planning.
4. **Plan: next.** `/speckit-plan` picks the stack and decides what to keep from the 001 Core
   Engine (the Bun workspace, the API/web split, Drizzle + PostgreSQL, the Docker/Tailscale deploy
   and backups are candidates; its UI and domain model are superseded). Then `/speckit-tasks`
   and `/speckit-analyze`.
5. **Build.** Walking skeleton first: one Open media entry, its bookmark and the log sheet,
   end to end on the server and on the phone. Then widen, in the spec's priority order.
6. **Use it for 2–4 weeks.** Real entries, real sittings, on all three screens. Nothing from the
   deferred list starts until this has happened; what gets used, and what gets in the way, decides
   what comes next.
7. **Deferred items**, each needing its own spec and a constitution check (`TODOS.md`):
   - owner-tuned suggestions;
   - automatic ingest: Trakt (for Stremio), Steam local playtime, Kindle clippings.

Native iOS and Android apps may come after that; the tokens are already platform-neutral
(`design/marginalia/README.md`, "Native later").

## Out of scope

Accounts, sharing, public links, community, feeds, public scores, streaks, reminders and an
offline mode. These are not deferred; they are not part of what Epilogue is.
