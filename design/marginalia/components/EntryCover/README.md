# EntryCover

The physical object an entry is: its art (or a generated cloth plate) at the right shape for its kind, with its state drawn on as a ribbon, a tucked-in ribbon tail, a seal, a dog-ear or a loop.

**Provide** `title`, `kind` (a `Kind`, or `idea` for a dream's cover: `PlateKind`); optionally `by`, `src` (cover art URL), `alt`, `ink` (a hex sampled from the cover, see `sampleCover`), `status`, `size` (`xs` 56px · `sm` 92px · `md` 148px · `lg` 232px · `fill` = parent width), `variant` (0–2: which plate, when the title's pick is wrong for the work).

- `status` draws the state: `open` hangs the ribbon from the top, `paused` tucks it in so only its tail shows under the bottom edge, `again` adds the moss loop, `finished` the seal, `aside` the dog-ear. `shelved` draws nothing.
- Shape follows `kind`: 2:3 for books, manga, stories, poems, ideas (with a spine crease), films, series, anime; 3:4 for games; 1:1 for music (at `md`/`lg` the record slides out from the sleeve, so leave 18% to its right).
- No art? Leave `src` empty and the entry wears a **plate**: one of three hand-drawn compositions for its kind (`PLATES[kind]`), stamped in `gilt` on its cloth (`ink`, or with no ink a core-24 cloth chosen by the title). The title picks the composition and keeps it; `variant` overrides. The title is live text set in the space the drawing leaves, sized to fit (long titles step down before they would be cut).
- Plates scale with the cover: under 130px the by-line goes, under 72px the title goes too and the drawing, in a heavier line and recentred, is the whole cover (rows already print the title beside it).
- Never draw a likeness of a real cover on a plate, and never put text on top of art.
- With art, pass `ink: nearestCloth(sampledColour).hex` so the entry's ink stays inside the bookcloth set.
- Covers are objects: `radius-cover`, `cover` shadow, the same colours in both themes. Never round them further.
- The seal and loop overhang the corner by ~7%; give the cover room rather than clipping it.
