# ShelfFilter

A sideways-scrolling row of chips for narrowing a shelf by kind; the active chip is raised clay, counts are quiet.

**Provide** `items` (`{id, label, count?, kind?}`), `value`, `onChange(id)`, `label` (its accessible name, default "Filter").

- It scrolls its chosen chip into view, clear of the edge fades, including after the fonts load.

- It bleeds `space-4` past its container on both sides so chips scroll edge to edge; place it directly in a `space-4` gutter.
- One row only, never wrapping. Kinds carry their glyph; "All" has none.
- Used for kinds on Media's Waiting shelf, Finished / Set aside on Closed, Done / Came true / Set aside on Prologue's Closed, and the kind row in `AddEntry`. A kind chip only ever carries one of the nine entry kinds.
- Its parent must be allowed to shrink (`min-width: 0`, or a `minmax(0, 1fr)` grid track), or the chips will widen it.
