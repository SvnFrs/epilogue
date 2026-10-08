# Journal

One per part: a timeline by month and day, with a row of years to jump to. Every line opens what it came from.

**Provide** `months` (`{label, days: [{day, weekday, items: [{type, title, kind?, dream?, ink?, cover?, where?, time?, text?}]}]}`), `years` + `year` + `onYear`, `onOpen(item)`, `part` (`media` or `prologue`).

- Media types: `note` (the note's text under it), `started`, `finished` (sealed cover), `aside`, `paused` (put back on Waiting, with where its place is kept), `again`.
- Prologue types: `captured`, `started`, `done`, `cametrue` (sealed idea cover), `aside`, `paused`.
- The event's glyph takes its state colour; entry ink is never the text colour here.
