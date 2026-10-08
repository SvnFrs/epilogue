# Intention

One thing in the Prologue. A **task** is a line in Literata with a round check that crosses it out in quill; a **dream** (`kind: 'dream'`) is a card with a small idea cover (constellation, bulb or paper plane, drawn in gilt on its cloth), its name in `title-md`, a *why*, optional steps, and a wax seal when it comes true.

**Provide** `item` (`{text, kind, state, horizon, due, stateDate, doneDate, steps: {done, total}, entry: {title, kind}, why, ink, plate, idle}`), `onToggle` (tasks), `onOpen`, `onOpenEntry` (the linked entry), `onPutBack` + `onKeep` (with `idle`), `showState` (outside its own shelf), `showHorizon` (outside its own group), `dragHandle` (desk layouts).

- `state` is `waiting`, `open`, `paused`, `done` or `aside` (`PLAN_WORD` has the words: Doing / Pursuing, Paused, Done / Came true, Set aside). The shelf follows from it (`planShelfOf`). `horizon` (`unsorted`, `soon`, `someday`) only matters while it is waiting.
- Open tasks have their pip ringed in `lamp`; a pursued dream's cover wears the ribbon, a paused one's ribbon is tucked in, a set-aside one is dog-eared.
- `entry` is a reference, opened with `onOpenEntry`; the entry stays on its own shelf. Never write a task that only stands in for watching, reading or playing something: that is the entry on Waiting.
- A dream with no `ink` takes a core-24 cloth from its words, so the card's wash and its cover always match.
- Group tasks in `.mg-intlist` (a clay group with hairlines) or its `.flat` form on a page.
- Crossed-out tasks stay readable. They move to Closed after a moment, never instantly, and always with Undo.
