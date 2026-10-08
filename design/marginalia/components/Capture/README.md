# Capture

The fastest way into the Prologue: one sunk field in Literata, Enter to keep the line, the field clears for the next. Horizon chips and a Dream switch sit underneath.

**Provide** `onSubmit({text, horizon, kind, state})`, `horizon` + `onHorizon` (Unsorted, Soon, Someday), `dream` + `onDream`; `value` + `onChange` to control the text, `autoFocus` in a sheet, `error` + `onRetry` when a save failed.

- The horizon defaults to Unsorted: capture never asks a question. Sorting happens at the desk.
- The field is 17px so iOS never zooms; the ↵ hint hides on touch screens.
- Saves are optimistic: the line clears and appears in the list at once. If the save fails, put the text back in the field (`value`) and pass `error`: one `InlineError` with Retry appears under the field. Nothing typed is ever lost.
