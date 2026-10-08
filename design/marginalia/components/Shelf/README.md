# Shelf

A grid of covers standing on clay planks, bottom-aligned so books, boxes and sleeves of different heights share one shelf; titles sit under the plank.

**Provide** `entries` (`{title, by, kind, status, ink, cover}`), optional `minCell` (default 96px; the column count is measured, minimum 3), `onOpen(entry)`, `label` for the section.

- Use it for the Waiting shelf, a kind's library, search results that are mostly covers. Use `EntryRow` when progress matters (the Open shelf, the Closed list).
- Titles clamp to two lines and by-lines to one; the plate inside drops its by-line because the label already says it.
- A `paused` entry's label reads "Paused · S2 · E5" (its `leftOff.where`) instead of its by-line, and paused entries go first.
- On pointer devices a cover lifts and turns as if pulled out. Do not add other hover effects.
