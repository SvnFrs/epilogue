# ShelfSwitch

The segmented control at the top of each part: Waiting · Open · Closed, the same three shelves in Media and in Prologue.

**Provide** `value` (`waiting`, `open`, `closed`), `onChange(id)`, `counts` (`{waiting, open, closed}`, optional), `label`.

- Shelves are read off state, never stored: `shelfOf(status)` for entries, `planShelfOf(state)` for tasks and dreams.
- Counts are quiet `ink-soft`, never badges. The active segment is raised clay with a semibold word.
- Media opens on Open. Prologue opens on Open on a phone and on Waiting at the desk.
