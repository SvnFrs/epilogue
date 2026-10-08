# EntryHeader

The top of an entry page: the endpaper wash in the entry's ink, the cover, the title in semibold Literata, the by-line, kind and status, and the verdict.

**Provide** `entry` (`{title, by, kind, status, date, ink, cover}`), `verdict`, `onVerdict` (makes it editable), `onBack`, `onMore`, `wide` (cover beside the text, 56px title), `compact` (small cover beside a `title-lg` title, no verdict), `coverSize`.

- Use `compact` on a phone whenever the entry is open or being replayed, so `LeftOff` sits above the fold.

- Phones: centred, Back and More as small clay circles at the top, nothing else up there.
- Spread: use it centred on the left page with `coverSize="lg"`, like a frontispiece.
- The endpaper is the one place entry ink becomes a ground; keep it to this header.
