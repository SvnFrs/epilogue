# Dock

Compact navigation: a glass bar floating above the content with the two parts, Media and Prologue, and a raised lamp + in the middle, where the thumb rests.

**Provide** `value` (`media` or `prologue`), `onChange(id)`, `onAdd`, `contained` for previews.

- The + adds an entry on Media (opens `AddEntry`) and captures on Prologue (opens `Capture`); its accessible name says which. Logging progress is the row's + and the log sheet, not the dock.
- Find and Journal are not in the dock: they are round buttons in each part's `PartHeader` (Find also on "/"). The rail, with room to spare, lists them.
- Labels and glyphs are `ink`, active or not; the active part gets a raised clay bead and a heavier label. Over a dark cover, `ink-soft` on Paper glass fell to 4.3:1; `ink` holds 9.35:1 even over black art.
- It floats `space-3` from the screen edges, with `radius-xl`; pad scrolling content by `dock-height` plus the safe area so nothing hides under it, and keep a screen's main action above it at rest.
