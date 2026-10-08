# Epilogue: TODOs

Deferred work and open questions after the Marginalia pivot (2026-10-09). The plan for getting
here is `docs/roadmap.md`; the rules are `.specify/memory/constitution.md` v2.0.0.

## Open questions (spec 002)

These are the three `[NEEDS CLARIFICATION]` markers in `specs/002-marginalia-rebuild/spec.md`.
Answer them with `/speckit-clarify` before `/speckit-plan`.

- [ ] **Settings / About screen.** Where do `idleDays` (default 21) and the theme choice (Paper or
      Lamplight) live, and where does TMDB's required attribution go
      ("This product uses the TMDB API but is not endorsed or certified by TMDB.", plus its
      logo)? The design system says "About" but draws no such screen.
- [ ] **Media's Waiting order.** Paused entries sort first; how is the rest of Waiting ordered:
      a manual order, date added, or something else?
- [ ] **Owner-tuned suggestions.** Do they come back in a later spec, or are they dropped?

## Deferred (not designed)

Each needs its own spec and a check against the constitution before any work starts, and none
starts before Epilogue has been used for 2–4 weeks.

- [ ] **Owner-tuned suggestions**: what to pick up next, tuned to the owner's own history only
      (see the open question above).
- [ ] **Automatic ingest**:
  - [ ] Trakt, for what is watched in Stremio;
  - [ ] Steam local playtime;
  - [ ] Kindle clippings (quotes and positions).
