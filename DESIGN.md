# Design

**`design/marginalia/` is authoritative.** Marginalia is Epilogue's interface language: read
`design/marginalia/README.md` for the rules, `tokens.json` for every value, and
`components/*/README.md` + `components/index.d.ts` for each component. This page is a summary;
where it disagrees with the design system, the design system wins. (It replaces the June
"reading-room dark" design, which is historical.)

## Themes

Two themes built in OKLCH around one warm hue: **Paper** (day) and **Lamplight** (night).
Neither is pure white or pure black.

| token | Paper | Lamplight | role |
| --- | --- | --- | --- |
| `desk` | #e8ded2 | #0e0a08 | behind the page on wide layouts and sheets |
| `paper` | #f8f2e9 | #1a1410 | the page |
| `paper-raised` | #fdfaf3 | #241d18 | clay: cards, buttons, sheets |
| `paper-sunk` | #f1e9de | #140f0b | wells: inputs, pressed clay |
| `ink` / `ink-soft` / `ink-faint` | #2b2018 / #5e4f44 / #6e6056 | #ede5d8 / #bfb6a8 / #9c9287 | text |
| `lamp` | #a14c00 | #f2a85f | the app's own action; *in progress* |
| `quill` | #2e567a | #8fbada | *finished*; keyboard focus |
| `moss` | #4b6436 | #a3bf89 | *returning*: replay, reread, on repeat |
| `scorch` | #a13029 | #eb8373 | destructive, always with a word |

- Objects keep fixed colours in both themes: `silk` (the ribbon), `wax` (the seal), `gilt`
  (plate lettering).
- Each entry brings exactly one colour, its **ink**, from its cover, snapped to one of 36
  **bookcloths** and bound by `bindInk()` to what the page can carry. Kinds never get colours.
- One glow (`lamp-wash` from the top of the page) and a fine paper grain; glass only for the
  dock, a scrolled top bar and the toast.

## Type

Two faces, shipped as variable woff2 files in `design/marginalia/fonts/` (SIL OFL 1.1), never
fetched at runtime. Both cover every Vietnamese letter; CJK falls back to the system face.

- **Literata** (`display`, `read`): titles of works (semibold, optical sizing), quotes, the big
  logged number, and everything the reader writes, including the fields it is written in.
- **Lexend** (`ui`): everything the app says, and anything read at a glance: by-lines, bookmark
  lines in rows, metadata, chips, the dock.
- **No italics anywhere.** Quiet text is quieter in colour (`ink-soft`); a quote is marked by its
  hanging quotation marks.
- Scale: `title-xl` 38/42 · `title-lg` 30/34 · `title-md` 19/24 · `title-sm` 15/19 · `quote`
  22/31 · `numeral` 44/44 · `read` 17/28 · `read-sm`/`aside` 15/23 · `ui-lg`/`ui`/`ui-sm` 17/15/13
  · `tab`/`label` 11/14. Reading text never runs past `measure` (66ch); inputs are 17px.

## Contrast rules

- `ink`, `ink-soft` and `ink-faint` hold **4.5:1** on all three paper tokens, on `desk` and on
  every entry wash, in both themes.
- **On glass, only `ink`** (dock and rail labels, toast text and its Undo).
- **On an entry wash**, text is `ink`, `ink-soft`, `ink-faint` or a state colour. **Entry ink is
  never text on a wash**, only icons and pips.
- **On `desk`**, any of the three inks; nothing else. `ink-faint` never sits on glass.
- Boundaries that carry meaning use `rule-control` (3:1); plain hairlines use `rule`.
- **One lamp per view**: one primary action in `lamp` per screen; inside a sheet, the sheet's
  primary is the lamp. *Finished it* is `quill`, not a second lamp.
- State is never colour alone: a glyph and a word always come with it.
