# EntryRow

One entry as a pressable clay row: small cover, title, by-line, status and kind, its page edge, and an optional round + that logs one more without opening anything.

**Provide** `entry` (`{title, by, kind, status, date, ink, cover, progress, leftOff}` where `progress` is `PageEdge` props), `onOpen`, optional `onStep` + `stepLabel` (the + button's accessible name, e.g. "Log chapter 10"), `flat` for dense lists, `current` for the selected row in a list column, and `idle` (days untouched) with `onPutBack` / `onKeep` to show the `IdlePrompt` inside the row.

- With `entry.leftOff`, the row shows the bookmark line (`leftOff.short`, else `leftOff.where`) in `ui-sm` instead of the by-line: on the Open shelf, where you stopped matters more than who made it.

- Media's Open shelf is a stack of these with `onStep`; that one tap is the most important interaction in the app. The Closed shelf uses `flat` rows grouped by month, with the date in the status mark.
- `idle` is passed once, when an open entry has gone 21 days (the `idleDays` setting) without activity. The app records that it asked and never passes it again for that stretch.
- `flat` rows lose the clay and gain a hairline; use them for long lists and history.
- Never put more than one action on a row. Everything else lives on the entry page or the log sheet.
