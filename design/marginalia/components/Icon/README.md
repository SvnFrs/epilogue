# Icon

Marginalia's glyphs inlined as SVG in `currentColor`: nine hand-sketched kinds, plus Lucide for six states, the two parts, six Prologue marks and sixteen interface marks.

**Provide** `name` (a Marginalia name; kinds come from `SKETCH`, the rest from Lucide via `LUCIDE[name]`), `size` (default 20), `title` when the glyph stands alone and means something, `strokeWidth` (default 1.75, or 2 at 16px and below).

- Glyphs travel with words. Only Back, More, Close and round + buttons go without one, and those carry an aria-label.
- Lucide v1.47.0 is pinned; to add an interface glyph, add its Lucide name to the map. Tabler's outline set is the only fallback.
- A new kind gets a new sketch in `gen_sketch.mjs` (clean paths on the 24px grid, rough.js roughness 0.85, a fixed seed).
