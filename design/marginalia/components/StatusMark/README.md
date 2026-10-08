# StatusMark

An entry's state as a glyph and a word, with the verb chosen by kind: Up next, Paused, Playing / Reading / Watching / Listening, Replaying / Rereading / Rewatching / On repeat, Finished, Set aside.

**Provide** `status`, `kind`, optional `date` ("14 Sep 2026"), `pill` for a tinted ground.

- Colour is a second channel, never the only one: the word and glyph always come along. Paused is `ink-soft` with the `book-marked` glyph: quiet, and never the moss of a replay.
- Use `pill` where the mark floats on a busy ground; plain everywhere else.
