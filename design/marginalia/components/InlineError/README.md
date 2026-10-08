# InlineError

One line where something failed, with Retry: "Not saved. The server didn't answer." Whatever was typed stays where it was.

**Provide** children (the message), `onRetry`, `retryLabel`.

- Epilogue is always online and saves optimistically; this is the only failure UI. No modal, no toast, no red banner across the screen.
- Glyph and Retry in `scorch` on `scorch-wash`, the message in `ink`.
