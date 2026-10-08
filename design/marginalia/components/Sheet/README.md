# Sheet

A clay panel that rises from the bottom over a scrim, for short tasks: logging, a quick note, a confirmation.

**Provide** `title`, children, `footer` (one or two large buttons), `onClose`; `contained` keeps it inside a positioned parent instead of the viewport.

- From 720px wide it becomes a centred dialog.
- Sheets are clay, not glass: they carry reading text.
- At most two footer actions, the primary on the right.
- The footer stays pinned to the bottom while the body scrolls, so the primary action is always in reach.
- The log sheet is Stepper + a *Where I left it* field + Finished it / Log; capture (on the Prologue tab) is `Capture` alone, no footer, because Enter saves; `AddEntry` is its own sheet.
