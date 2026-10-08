Marginalia is the interface language of **Epilogue**: a private commonplace book for everything one person plays, reads, watches and listens to, for remembering exactly where he left each one, and for what he means to do next. It has two parts that never mix, **Media** and **Prologue** (tasks and dreams), and it is built for exactly one reader, on three screens (an iPhone XS, a Mi 10S and a 34″ Odyssey G5 ultrawide), and it has to hold *Doki Doki Literature Club!* and a death-metal record on the same shelf without either one looking out of place.

## Five rules

1. **One reader, coming back.** Nothing here performs for an audience: no follower counts, no public scores, no streaks, no share sheets. Every screen answers one of four questions, in this order: *where did I leave it, what am I in, what did I think, what's next*. Logging beats displaying: one tap logs progress, and stopping always leaves a bookmark.
2. **The page stays; the ink changes.** The frame (paper, type, layout, controls) never changes genre. Each entry brings exactly one colour, its **ink**, taken from its cover and bound by `bindInk()` to a lightness and chroma the page can carry. Kinds of media never get colours of their own; they get a glyph and a cover shape.
3. **Clay, then glass.** Anything you touch is clay: solid, matte, lifted by `clay`, sunk by `clay-press`. Glass is only for chrome that floats over moving content (the dock, a scrolled top bar, the toast). Never glass on glass; never reading text on glass; what does sit on glass (a label, a toast) is set in `ink`.
4. **Objects are crisp, furniture is soft.** Covers, plates, ribbons and seals are things you collected: `radius-cover` corners and fixed colours (`silk`, `wax`, `gilt`), identical in both themes. The furniture that holds them (rows, sheets, buttons, the dock) is soft clay with large radii.
5. **Thumb first, spread last.** Design at 375pt, one-handed. Width is earned: a wider screen gets more columns and finally an open book, never a stretched phone.

## Two parts, three shelves

Epilogue has two parts, and nothing from one appears on the other's screens.

- **Media**: games, books, manga, anime, films, series, music, poems, stories.
- **Prologue**: tasks and dreams, what hasn't happened yet. (It keeps its name: it is the front matter to everything in Media.)

Each part has the same three **shelves**, switched by `ShelfSwitch` at the top of its tab: **Waiting · Open · Closed**. A shelf is never stored; it is read off the item's state:

| shelf | Media | Prologue |
| --- | --- | --- |
| Waiting | `shelved` (Up next) and `paused` | `waiting` (the Unsorted inbox, then Soon and Someday) and `paused` |
| Open | `open` and `again` | `open` (Doing, or Pursuing for a dream) |
| Closed | `finished` and `aside`; chips filter Finished / Set aside | `done` (Done for a task, Came true for a dream) and `aside` |

- `shelfOf(status)` and `planShelfOf(state)` are the only places this mapping lives. Counts in the switch are quiet (`ink-soft`), never badges.
- **Taking something out of Closed** makes a media entry `again` (Replaying, Rereading, On repeat) and puts it back on Open; a task or dream goes back to `open`.
- **Paused** is not a fourth shelf. A paused thing lives on Waiting, sorts first there (first on the Media shelf, first in Soon on Prologue), keeps its place (`LeftOff` and keymap for media, steps for tasks and dreams), and looks different from both never-started things and replays: its ribbon is tucked in, only the tail showing under the bottom edge, and its word is *Paused*, never *again*. Starting it again makes it `open`, not `again`.
- **Picking up later.** An Open item with no activity for 21 days (a setting, `idleDays`) gets one quiet `IdlePrompt` inside its row or card: "Untouched for 3 weeks. Put it back on Waiting? Your place is kept." with *Put back* and *Keep it open*. It is asked once per quiet stretch, never repeated and never acted on by itself; logging anything resets the clock. Put back makes it `paused`.
- **Links go one way.** A task may point at an entry for reference ("Finish Resident Evil 4 before the weekend"): the link shows the entry's kind glyph and title and opens it, and the entry stays on its media shelf. A task never stands in for a media plan: wanting to watch a film is the film on Waiting, not a task.

## Voice

The app writes like a margin: short, plain, warm, never cheerful *at* you.

- Sentence case. No exclamation marks, no emoji, no "Great job".
- Interface copy is English; content is whatever language it was lived in. Vietnamese, Chinese and Japanese sit in the same type with no special-casing: *Bolero, 2 giờ sáng* and *七里香* are ordinary titles.
- Verbs follow the kind: Playing, Reading, Watching, Listening; Replaying, Rereading, Rewatching, On repeat (`statusWord()`).
- Confirmations name what happened and offer Undo: "Noted · chapter 10", "Finished · sealed 8 Oct", "Put back on Waiting · place kept".
- Nothing scolds. Dropping something is **Set aside**, never "Dropped" or "Abandoned"; going quiet for three weeks gets one question, never a reminder. An empty state is a small pen drawing, a `title-md` line and one sentence in `aside`: "Nothing open. Start something from Waiting and it stays here, one tap from logging."
- Never uppercase a work's title or anything Tyler typed. `label` capitals are for short English interface words only: SEPTEMBER 2026, MARGIN, WHERE I LEFT IT.
- Numbers are specific and small: "Chapter 9 of 16", "41 h this month", "Tale 24 of 210". A percentage appears alone only when the source reports nothing else (most games).

## Colour

Two themes: **Paper** (day) and **Lamplight** (night), built in OKLCH around one warm hue. Neither is pure white or pure black (`paper` is #f8f2e9, `lamplight` paper is #1a1410), so text never glares and an OLED does not smear blacks while scrolling.

Grounds, back to front: `desk` (behind the book on wide screens) → `paper` (the page) → `paper-sunk` (wells) and `paper-raised` (clay). Text is `ink`, `ink-soft` and `ink-faint`; every one holds 4.5:1 on all three paper tokens, on `desk` and on every entry wash, in both themes. `ink-faint` is kept for placeholders and the set-aside state; in Paper it was darkened to #6e6056 so it holds on `desk` too (4.56:1; it was 4.18:1).

Where text may sit, as rules rather than hopes:

- **On glass, only `ink`.** Dock and rail labels, toast text and its Undo. Over the worst thing that can scroll underneath (pure black art in Paper, pure white art in Lamplight) `ink` holds 9.35:1 and 6.27:1; `ink-soft` fell to 4.31:1 over an oxblood or mulberry cover and `lamp` to 2.82:1. Paper glass is 80% opaque (it was 72%).
- **On an entry wash**, text is `ink`, `ink-soft`, `ink-faint` or a state colour; all of them hold 4.5:1 on all 36 washes (the tightest is `lamp` on raspberry, 4.73:1). `entry-ink` on a wash is for icons and pips only (rule below).
- **On `desk`**, any of the three inks; nothing else.

Accents are few and each means one thing:

| token | means | text on its fill |
| --- | --- | --- |
| `lamp` | the app's own action, and *in progress*: the thing that is lit. Primary buttons, Log, the open status, links. | `on-lamp` |
| `quill` | *finished*, and keyboard focus. Fountain-pen blue-black. | `paper-raised` |
| `moss` | *returning*: replay, reread, on repeat. | `paper-raised` |
| `scorch` | destructive, always with a word. | `on-scorch` |

Each has a `-wash` for a tinted ground behind its own text. Finished (`quill`) and destructive (`scorch`) sit on the blue–red axis, so they never rely on red–green.

### Entry ink

Every entry carries one cover colour. `bindInk(hex)` keeps its hue, caps chroma (0.13 by day, 0.11 at night) and walks lightness until the ink reads at 4.6:1 on `paper` and `paper-raised` in each theme. Covers with almost no colour (a black sleeve, a white jacket) wear sepia. It returns an ink per theme, a wash per theme, and `cloth` for plates. Pass `ink` to a component, or wrap a subtree in `Inked`; inside, use `entry-ink` and `entry-wash`.

Entry ink may colour: drop caps, the hanging quote mark, filled verdict pips, a note's where-label, the read part of a page edge, the endpaper wash, the fleuron. It is never a button fill, never a large background, never body text. **On a wash (an entry's endpaper, a bookmark card, a dream card) entry ink is for icons and pips only, never text**: entry ink on its own wash measures 4.31–4.49:1 for 17 of the 36 cloths in Paper. Text there is `ink` or `ink-soft`.

### Bookcloth

Entry inks come from a curated set rather than from whatever a cover happens to be: thirty-six **cloths**, twelve families in three tones, named the way a bindery names its stock. Every one carries `gilt` lettering at 4.5:1 or better, and no two sit closer than ΔE 0.034 in OKLab (the closest pair, celadon and verdigris, is 0.0348), so neighbours on a shelf never blur together.

- **Core 24** (deep and true) is the working set. **Extended 12** (dusty) is the quiet register: faded, greyer, for things that should not shout.
- A sampled cover snaps to its nearest cloth (`nearestCloth(hex)`, matched on hue and chroma), so a cover never introduces an off-palette ink. An entry with no art and no pick gets a stable cloth from the core 24 by its title (`autoCloth(title)`); the shelf looks curated, not random.
- From a cloth, `bindInk()` derives everything else: the ink for labels, pips and drop caps in each theme, and the **header wash** (the endpaper of an entry, the top of a bookmark card or a dream). Deeper cloths give deeper washes.
- Greys keep their temperature: Charcoal goes slate, Ash goes stone, Umber goes sepia.

| family | deep (core) | true (core) | dusty (extended) |
| --- | --- | --- | --- |
| red | `cloth-oxblood` #5b2124 | `cloth-madder` #872b32 | `cloth-rosewood` #724646 |
| rust | `cloth-conker` #592609 | `cloth-rust` #843300 | `cloth-terracotta` #7f5745 |
| ochre | `cloth-tobacco` #4e2f00 | `cloth-ochre` #704600 | `cloth-buckram` #66502c |
| olive | `cloth-loden` #3b3900 | `cloth-olive` #575300 | `cloth-lichen` #65653b |
| green | `cloth-forest` #144218 | `cloth-fern` #11601d | `cloth-sage` #3e5d3f |
| bottle | `cloth-bottle` #004432 | `cloth-jade` #006149 | `cloth-celadon` #3b6d5e |
| teal | `cloth-spruce` #004147 | `cloth-teal` #00555c | `cloth-verdigris` #2e676b |
| petrol | `cloth-prussian` #003d5a | `cloth-petrol` #005882 | `cloth-pewter` #3c687e |
| indigo | `cloth-navy` #243362 | `cloth-indigo` #334994 | `cloth-woad` #465376 |
| violet | `cloth-aubergine` #412959 | `cloth-amethyst` #603a86 | `cloth-heather` #6a597e |
| mulberry | `cloth-mulberry` #542241 | `cloth-raspberry` #7d2d5f | `cloth-mauve` #6c465b |
| neutral | `cloth-charcoal` #2c323b | `cloth-umber` #5b4130 | `cloth-ash` #62594f |

The **Bookcloth** page shows all thirty-six on the shelf and as header cards in both themes.

## Type

Two faces, shipped with the system as variable woff2 files in `fonts/` and listed in `tokens.json` `type.fonts`, so `tokens.css` declares them and nothing is fetched from Google at runtime. Both are SIL Open Font License 1.1 (`licenses/OFL-Literata.txt`, `licenses/OFL-Lexend.txt`), converted from the upstream variable TTFs without subsetting, and both cover every Vietnamese letter (checked against the font's character map: Ă Â Đ Ê Ô Ơ Ư and all their tone marks). CJK falls back to the system's face (PingFang, Noto Sans CJK). No italics anywhere:

- **Literata** (`display` and `read`) for the names of works, the big number and everything Tyler writes, plus every field he writes it in. It began as Google Play Books' reading face, so it holds up at phone sizes and on the G5's ~110ppi. Titles are the same face set semibold; optical sizing (`opsz` 7–72, chosen by the browser from the size) gives the display sizes their tighter, crisper cut. One serif means titles and notes never fight.
- **Lexend** (`ui`) for everything the app says, and for any line meant to be read at a glance: by-lines, bookmark lines in rows, metadata, chips, the dock. Its letters are wide and openly spaced, which keeps 11–13px text legible on the G5's coarser pixels; its designers built it to reduce visual stress in reading. Vietnamese is covered, stacked diacritics included.
- **No italics, no slanted or swashy display faces.** Quiet text is quieter in colour (`ink-soft`), not slanted; a quote is marked by its hanging quotation marks; a work's title in a caption is set in `ink` against `ink-soft`.

| style | size | use |
| --- | --- | --- |
| `title-xl` | 38/42 semibold | an entry's title on its page (56/58 on wide) |
| `title-lg` | 30/34 semibold | part titles (Media, Prologue, Journal, Find), the compact entry header |
| `title-md` | 19/24 | a work's title in rows, sheets, plates; the bookmark's position |
| `title-sm` | 15/19 | titles under covers on a shelf |
| `quote` | 22/31 | words someone else wrote |
| `numeral` | 44/44 | the number being logged |
| `read` | 17/28 | reviews, notes, the note and bookmark fields |
| `read-sm`, `aside` | 15/23 | note previews; `aside` in `ink-soft` for half-thoughts, a dream's why, the verdict's sentence |
| `ui-lg`, `ui`, `ui-sm` | 17, 15, 13 | interface; numbers are tabular |
| `tab`, `label` | 11/14 | dock and rail labels, in `ink`; capitals for running heads |

Reading text never runs longer than `measure` (66ch). Inputs are 17px (`ui-lg` or `read`), because iOS Safari zooms into any field set under 16px. Reviews are set like a book: the first paragraph opens on a three-line drop cap in entry ink, later paragraphs indent 1.4em, and there are no blank lines between them.

## Surfaces

- **Clay**: `paper-raised` with `clay`. On hover (pointer devices only) it rises 1px to `clay-lift`. On press it sinks: 1px down, scale .985, `clay-press`, ground `paper-sunk`. The press takes 90ms, the release 240ms; that asymmetry is what makes it feel solid.
- **Wells**: `paper-sunk` with `sunk`. Inputs add a 1.5px `rule-control` underline (their 3:1 boundary) that turns `quill` on focus. The note field is ruled every 28px, like the notebook it is.
- **Glass**: `glass` + `backdrop-filter: blur(var(--glass-blur)) saturate(1.2)` + `glass-edge`. The dock, a scrolled top bar, the toast. Nothing else. Everything written on it is `ink`.
- **Grain and light**: paper carries a fine fractal grain (`--grain` in bundle.css; plates use `--grain-cloth`). There is exactly one glow, `lamp-wash` falling from the top of the page: morning light on paper, a lamp at night. The only other gradients are the highlights inside clay fills.
- **Focus**: `focus-ring` (2px of page, then 2px of `quill`), added on top of the object's own shadow, never replacing it.

## Objects and states

Every state of an entry is a physical object on its cover, and a glyph plus a word everywhere else:

| state | word | on the cover |
| --- | --- | --- |
| `shelved` | Up next | nothing; it is on the shelf |
| `paused` | Paused | the ribbon tucked in: only its tail shows under the bottom edge, over the plank |
| `open` | Playing · Reading · Watching · Listening | a `silk` ribbon bookmark, unrolling from the top (the same ribbon marks its *Where I left it* card) |
| `again` | Replaying · Rereading · Rewatching · On repeat | a `moss` loop |
| `finished` | Finished · date | a `wax` seal with a `gilt` ring, pressed in at the corner |
| `aside` | Set aside | the corner dog-eared, the colour drained |

Tasks and dreams use the same objects and colours, with their own words (`PLAN_WORD`):

| state | task | dream | the mark |
| --- | --- | --- | --- |
| `waiting` | (its group: Unsorted, Soon, Someday) | Dream | an empty pip; a dream's plain idea cover |
| `paused` | Paused | Paused | `book-marked` glyph in `ink-soft`; the dream's ribbon tucked in |
| `open` | Doing | Pursuing | the pip ringed in `lamp`; the dream's cover wears the ribbon |
| `done` | Done | Came true · date | `quill` pip and a quill line through the words; the dream gets the `wax` seal |
| `aside` | Set aside | Set aside | a dashed pip, words in `ink-soft`; the dream's cover dog-eared |

Cover shapes follow the kind: book, manga, story and poem are 2:3 with a spine crease; film, series and anime are 2:3 posters; games are 3:4 boxes; music is a 1:1 sleeve, with the record sliding out on its entry page. An entry without art gets a **plate** (see *Covers*).

## Covers

A plate is what an entry wears until it has real art, and it should look like something you'd keep: a Victorian publisher's binding, gilt stamped on cloth. Each kind has three compositions, drawn as clean geometry and then given a pen line with rough.js at build time (fixed seeds, so a cover never changes). The title picks one and keeps it; an entry can pin another (`variant`).

| kind | the three plates | the title |
| --- | --- | --- |
| book | Panel (double frame, cartouche, lozenge) · Bands (rules and a hatched tree) · Arch | Literata, centred, in the frame |
| story | Castle under a moon · Pines with a cottage · Briar round the door, a crown | Literata, centred above the picture |
| poem | Laurel · Quill in its pot · Verse (a moon over a few lines) | Literata 560, small and high: slim volumes |
| manga | Speed lines · Panels with halftone and a balloon · Halftone with a burst | Lexend 700 stamped on a gilt band, like an obi |
| game | Quest (a summit and a flag) · Pixel (a crisp pixel landscape) · Crest (shield and swords), all under a HUD of hearts and a bar | Lexend 700, bottom left, box-art style |
| music | Record (it doesn't fit the sleeve) · Meter · Sundown | Lexend, top left, artist under it |
| film | Horizon · Night city · Reel, with a billing block in the small print | Literata 700 in poster caps |
| series | Episodes (a contact sheet, the one you're on marked) · Set (a CRT) · Next (the next one waiting behind) | Lexend, left |
| anime | Sparkle · Sky (a cloud and a telephone pole) · Moon with something falling past | Lexend 700 |
| idea (not an entry kind: dream covers only) | Stars (a constellation) · Bulb · Plane | Literata, centred under the drawing |

- The drawing is `gilt` on the entry's cloth in both themes, three weights: a main line, a fine line for hatching and texture, and solids. Line weight is set per cover width (1 unit = 1% of the cover), so a plate reads the same in a phone row and on the ultrawide shelf.
- The title is live text in a zone the drawing leaves free. Its size is estimated from its length and longest word and steps down before a line would be cut; CJK titles are sized by character count.
- Smaller covers shed detail: under 130px the by-line goes; under 72px (row thumbnails, dream cards) the fine line, the dots and the title go, the main line gets heavier and the drawing is recentred, so the thumbnail is a little picture, not tiny text.
- Plates are generic on purpose. Never draw a likeness of a real cover, logo or character onto one; real art goes in `src`.

Progress is a **page edge**: the fore-edge of a book, the read part in entry ink, a 2px marker where you are. Things that never end (War Thunder, WoT Blitz, a playlist) count sittings in tally marks instead of pretending to a percentage.

The **verdict** is five steps, each a sentence: *Not for me · Passed the time · Good company · Stayed with me · Part of me now*. No stars, no decimals, no average.

## Layout

Layouts switch on the width of the app, not the device.

| layout | app width | structure |
| --- | --- | --- |
| compact | < 600px | one column with `space-4` gutters; the glass `Dock` (Media · + · Prologue) floats `space-3` from the edges with `radius-xl` (concentric with the XS's screen corners), + in the middle under the thumb; each part's header carries Journal and Find; sheets rise from the bottom |
| medium | 600–1199px | a clay `Rail` on `desk`: +, Media and its Journal, Prologue and its Journal, Find; one column of content up to `page-width` |
| wide | 1200–2399px | rail + list column (`shelf-width`: the part header, the shelf switch, the list) + the entry as one page (`page-width`); sheets become centred dialogs |
| spread | ≥ 2400px | rail + list + the entry as an **open book** (two `page-width` pages, a gutter fold, running heads, folios) + a margin column (Media: the keymap and the paused things on Waiting; Prologue: its journal, lately) |

- **Phones.** iPhone XS is 375 × 812pt with 44pt top and 34pt bottom safe areas; the Mi 10S is roughly 393 × 873dp. Design for 360–430 wide. Primary actions live in the lower third; the top of a screen holds only Back, More, Journal and Find. Every hit area is at least `tap-min`.
- **Ultrawide.** On the G5 (3440 × 1440, about 110ppi, viewed from arm's length) 17px subtends noticeably less than 17pt does on the XS in the hand, so on a 1dppx screen at least 2560px wide the spread is zoomed 1.2×. The working set is centred and stays inside the middle ~2,950px, so nothing important sits where you have to turn your head; the rest is desk and lamplight.

## Navigation

- **Dock** (compact): **Media · + · Prologue**. Media opens on Open, the old Now screen: the open entries as rows, each with its one-tap +. Prologue opens on Open on a phone (what I'm on) and on Waiting at the desk, where sorting happens.
- **+** depends on the part: on Media it opens **Add entry**, on Prologue it opens **Capture**. Logging progress stays where it was: each row's + logs one more, and the log sheet holds the stepper and the bookmark.
- **The part header** (`PartHeader`): a kicker (the date on Media, "What hasn't happened yet" on Prologue), the part's name in `title-lg`, then Journal and Find as round clay buttons, then the shelf switch. Find is also on "/" with a keyboard. Both open screens that belong to that part.
- **Rail** (medium and up): +, Media with its Journal under it, Prologue with its Journal under it, then Find.
- **One lamp per view.** The dock's + (or the rail's) is the lamp; everything else on that screen is clay: a row's +, *Update where I left it*, the stepper's + and −. A sheet covers the dock, so inside a sheet its own primary is the lamp (*Log chapter 10*, *Add to Waiting*, *Add 'frieren' by hand*). *Finished it* is `quill`, not a second lamp.

## Adding

**Add entry** (`AddEntry`) is a sheet: kind chips, a search field, a *Starting now* switch, results.

- Each kind searches one catalogue by title: films and series on **TMDB**, anime and manga on **AniList**, games on **IGDB**, books on **Open Library**. Music, poems and stories have no catalogue here and open straight on the by-hand form.
- Results are a small cover, the title (the match marked), year and maker, and a total when the catalogue has one. Picking one fills the cover, the ink (`nearestCloth` of the sampled cover) and the total (episodes for series and anime, chapters for finished manga, pages for books); things with no end count sittings.
- **Already in the library?** The result says *In your library* and opens the entry instead of adding a second one. The by-hand form does the same check on the title.
- New entries land on **Waiting** (Up next). *Starting now* puts them straight on Open. The sheet says which: "Lands on Waiting".
- **By hand is always one tap away**: *Not here? Add it by hand* under the results, and the sheet's primary when there are no results or the catalogue fails. The typed title comes along. The by-hand form shows the plate it will wear and a cloth picker (Auto, or one of the core 24).
- Catalogue calls go through Epilogue's own server, never straight from the page: IGDB only issues app tokens from a client secret, which must not ship in an app; the server also caches results and covers, and samples the cover colour, so `sampleCover` never meets a cross-origin image. TMDB is free for non-commercial use with attribution: its logo and "This product uses the TMDB API but is not endorsed or certified by TMDB." go in About. AniList allows 90 requests a minute (30 while its API is degraded), so search waits for a pause in typing.

## Find

Find belongs to the part it was opened from. On Media it searches titles, people (makers and authors, with how many entries and of what kind) and lines in notes and reviews, each match marked in `lamp-wash` with a `lamp` underline; every result opens its source. Below the results, and as the empty state, it offers *Add 'query'*, which opens Add entry with the query typed in. On Prologue it searches tasks and dreams and offers *Capture 'query'*.

## Journals

Each part keeps its own **Journal** (`Journal`), a timeline grouped by month and day, with a row of years to jump to. Every line opens what it came from.

- **Media**: margin notes (with the note itself), started, finished (with its seal), set aside, put back on Waiting (with where its place is kept), replays.
- **Prologue**: captured, started, done, came true (sealed), set aside, put back on Waiting.

A day is its number in Literata over its weekday; each line is the event's glyph in its state colour, the verb in `ui-sm`, the title in `title-sm`, and for media a 34px cover.

## Coming back

Epilogue's first job is remembering where each thing was left, so the next sitting starts in seconds instead of ten minutes of "what was I doing".

- **Where I left it** (`LeftOff`) is a clay card with a `silk` ribbon hanging from its top edge. It holds the position in the work's own units (Chapter 9, S2 · E5 at 23:14, Tale 24, page 112, Track 18 of 48), one line of state in Tyler's words ("past the lake, before the castle gate"), a few facts as sunk chips (save slot, difficulty, honour, platform), and for games the keys he forgets.
- On an **open** entry it comes first. A phone uses the compact `EntryHeader` (small cover beside the title) so the card sits above the fold; the big frontispiece header is for finished and shelved entries. On the spread it sits on the left page under the header.
- Its action, *Update where I left it*, sits right under the bookmark (before the facts and the keymap), so on an iPhone XS it is above the dock at rest, never under it. It is clay with a `lamp` glyph: the dock's + is the screen's lamp.
- In lists, an open entry's `EntryRow` shows its bookmark line (`leftOff.short`, in `ui-sm`) in place of the by-line.
- **Stopping is logging.** The log sheet holds the stepper and a *Where I left it* field in the same moment, so updating progress and leaving the bookmark are one action. The time stamps itself ("Sun, 23:55").
- **Keymap** sets each bind as an action, a dot leader and clay keycaps (`Key`): square caps for single keys, wide caps for words (Caps, Tab, Ctrl), rounded caps for mouse buttons, circles for face buttons (A, B, X, Y) and pills for shoulders (LB, RT). "+" joins a chord, "or" separates alternatives. Pin the binds that are always forgotten: the card shows only those, with "All 10 keys" to open the rest. Groups (Combat, World, Menus) appear on the full map. On the spread the full map lives in the margin column.

## Prologue

What hasn't happened yet: tasks and dreams, now or later. One list across every screen, because it lives on Epilogue's own server, not in a phone note or a chat-to-self. Capture happens on the phone; sorting happens at the desk.

- **Waiting** holds what hasn't started: the **Unsorted** inbox as a strip at the top ("sort them at the desk"), then **Soon**, then **Someday**. These are groups, not priorities: no flags, no colours per list, no due-date pressure in red. `HorizonMark` heads each group. There is no Now horizon any more: what is being worked on is on **Open**.
- **A task** (`Intention`) is one line in Literata with a round check. Ticking it fills the pip with `quill` and draws a quill line through the words, left to right over `--dur-turn`; it stays readable in `ink-soft` and moves to Closed after a beat, with Undo. Meta under it, in `ui-sm`: when (Sun, this week), steps (2 of 5), a linked entry (its kind glyph and title, which opens the entry).
- **A dream** is a card: a small idea cover (constellation, bulb or paper plane on its cloth), its name in `title-md`, a *why* in `aside`, and a page edge when it has steps. It is never ticked; when it comes true it gets the `wax` seal and *Came true · date*.
- **Capture** is one sunk field in Literata plus the Unsorted · Soon · Someday chips and a Dream switch. Enter keeps the line and clears the field for the next; it lands in Unsorted, so capturing never asks a question. Ways in: the dock's + on the Prologue tab, an iPhone Back Tap shortcut and the Android share sheet (both post straight to the server), and on desk layouts the field pinned at the top of the list column (`N` focuses it).
- **Layouts.** The phone shows one shelf at a time. The spread puts the header, capture and Unsorted (with drag grips) in the list column, Soon on the left page, Someday's dreams and tasks on the right page, and the Prologue journal in the margin. Prologue pages are front matter, so their folios are lowercase roman numerals.

## Always online

Epilogue is always online; there is no offline mode to explain.

- Saves are optimistic: the line, the log, the new entry appears at once and the request runs behind it.
- When a save fails, one `InlineError` appears where it happened ("Not saved. The server didn't answer; the line is still in the field.") with **Retry**. Whatever was typed stays where it was typed; nothing is ever cleared by a failure. Catalogue searches fail the same way ("AniList didn't answer. Your search is kept."), with by-hand one tap away.
- Back Tap and the share sheet post straight to the server; if that fails, the shortcut reports it, and the line is not lost because it is still in the shortcut's input.

## Motion

Motion confirms that something physical happened; it never decorates. Easing and durations live in bundle.css: `--ease-settle` (default), `--ease-press`, `--ease-turn`, `--ease-seal`; `--dur-press` 90ms, `--dur-settle` 240ms, `--dur-turn` 420ms, `--dur-ink` 560ms.

- **Press**: clay sinks in 90ms and settles back in 240ms.
- **Log**: the stepper's number slides up into place, the page-edge marker travels (`--dur-turn`), a glass toast rises with Undo.
- **Open**: the ribbon unrolls from the top edge of the cover.
- **Put back**: the ribbon tucks in, sliding down until only its tail shows under the bottom edge.
- **Finish**: the seal drops in at 1.4×, overshoots and settles (`--ease-seal`). A dream coming true uses the same seal.
- **Cross out**: a task's check pip fills and a quill line draws through it, left to right.
- **Verdict**: pips ink in left to right, 35ms apart.
- **Shelf** (pointer only): a book lifts 7px and turns 11°, as if being pulled out.
- Under `prefers-reduced-motion` every one of these resolves instantly.

## Iconography

Two kinds of glyph. The **nine kinds** (game, book, manga, anime, film, series, music, poem, story) are Marginalia's own: drawn on the 24px grid as paths, then given a pen-sketch line with rough.js (MIT) at build time, fixed seeds so they never change. They are the things you collected, so they look like margin sketches: a controller, a record sliding out of its sleeve, a clapperboard, a book with its ribbon, a page of panels, a little castle. Everything the app *does* uses **Lucide** (v1.47.0, ISC; `components/LICENSE-lucide.txt`), chosen over Tabler for its softer joins and because its drawings carry this system's metaphors: `bookmark` (open), `book-marked` (paused: the ribbon inside), `stamp` (the seal), `sticky-note` (the dog-ear), `library` (Media), `library-big` (up next), `sunrise` (Prologue), `lamp-desk` (doing), `hourglass` (gone quiet), `circle-alert` and `rotate-cw` (a failed save and its retry). `Icon` inlines both sets, so nothing loads at runtime; `SKETCH` holds the kinds and `LUCIDE` maps the rest to Lucide's names. Stroke 1.75 at 20px and up, 2 at 16px and below, round caps and joins, one ink (`currentColor`). The files in **assets/Icons** are the same drawings in `ink` (#2b2018). If Lucide lacks an interface glyph, take Tabler's outline at the same stroke; a new kind gets a new sketch. Never mix in a third set.

Empty states have three small pen drawings of their own (`EMPTY`, same rough.js line, 120 × 72): an empty shelf with a ribbon left on the plank, a journal open at its first page, a blank page under the glass.

A glyph always travels with a word, except Back, More, Close and the round + buttons, which carry an aria-label. No emoji. Stars, hearts, trophies and flames are out: they are other apps' vocabulary for performance.

## Native later

The tokens are platform-neutral data (hex colours per theme, lengths in px, type styles as size, line height and weight); a SwiftUI or Jetpack Compose build reads the same `tokens.json`. Lengths map 1:1 to pt and dp. A few things the web build gets from CSS need their own native form:

| web | SwiftUI (iOS) | Jetpack Compose (Android) |
| --- | --- | --- |
| **Glass**: `backdrop-filter: blur(20px) saturate(1.2)` over `glass` | `.background(.ultraThinMaterial, in: shape)` (iOS 15+) with a `glass`-coloured overlay at its token alpha | **Haze** (Apache 2.0) blurs what is behind on Android 12+ (SDK 31); on 11 and below it falls back to a translucent scrim, which is fine here. `Modifier.blur` is not a substitute: it blurs the composable's own content, not its backdrop |
| Glass fallback, anywhere | the `glass` colour alone at 96% | the same |
| **Clay** shadows (`clay`, `clay-lift`, `clay-press`, `sunk`, `cover`): CSS box-shadow strings in `tokens.json` | parse each layer to x, y, blur, colour: `.shadow(.drop(color:radius:x:y:))`, with `radius` ≈ blur ÷ 2; the 1px inner top light and `sunk` use `.shadow(.inner(...))` (iOS 16+). SwiftUI shadows have no spread: inset the shape instead | `Modifier.dropShadow()` and `Modifier.innerShadow()` (Compose 1.9, BOM 2025.08.00), one call per layer |
| **Paper grain** (`--grain`, `--grain-cloth`: SVG feTurbulence) | ship the grain as two tiling PNGs (160px paper, 120px cloth, per theme) and lay them with `Image(...).resizable(resizingMode: .tile)` at the token opacity | the same PNGs as an `ImageShader(bitmap, TileMode.Repeated)` brush; or an AGSL `RuntimeShader` noise on Android 13+ |
| **Drop cap** (`initial-letter: 3`, float fallback) | no equivalent in `Text`; lay the capital out beside the first three lines with TextKit exclusion paths (a `UITextView` wrapper), or fall back to no drop cap and the first word in semibold | no equivalent; measure with `TextMeasurer` and split the first paragraph around the capital, or the same fallback |
| **Plates** (SVG art sized in container units) | convert each composition's path data to `Path` at build time; draw in a `GeometryReader` so 1 unit = 1% of the cover width; title in its zone from `text.box` | the same paths as `PathParser` / vector data in a `BoxWithConstraints` |
| `text-wrap: balance` on titles | none; accept the natural break | a `LineBreak` whose strategy is `LineBreak.Strategy.Balanced` |
| Fonts | iOS and Android do not load woff2: bundle the upstream variable TTFs (same OFL). Set Literata's `opsz` axis to the point size yourself (a font-descriptor variation); automatic optical sizing is documented for the system font, not for a custom one | the same TTFs via `Font(..., variationSettings = FontVariation.Settings(...))`, with `opsz` set to the size |
| Easing (`--ease-settle` cubic-bezier(.2,.8,.2,1), 240ms) | `.timingCurve(0.2, 0.8, 0.2, 1, duration: 0.24)` | `tween(240, easing = CubicBezierEasing(0.2f, 0.8f, 0.2f, 1f))` |
| `prefers-reduced-motion` | `accessibilityReduceMotion` environment value | the system animator duration scale; skip motion when it is 0 |

Contrast rules travel unchanged: text on glass is `ink`, entry ink is never text on a wash, `ink-faint` never on glass.

## Components

`window.Marginalia` (React 18 on the page). Load `tokens.css`, then `components/bundle.css`, then `components/bundle.js`.

- **Objects**: `EntryCover`, `Shelf`
- **Lists**: `ShelfSwitch`, `EntryRow`, `ShelfFilter`, `FindResults`, `Empty`
- **Coming back**: `LeftOff`, `Keymap` (with `Keys`, `Key`), `IdlePrompt`, `Journal`
- **Entry**: `EntryHeader`, `Verdict`, `PageEdge`, `StatusMark`, `KindMark`
- **Prologue**: `Intention` (task or dream), `Capture`, `HorizonMark`
- **Writing**: `Note` (inside `Margin`), `Quote`, `Review`, `Fleuron`, `Field`, `SearchField`
- **Actions**: `Button`, `Stepper`, `Sheet`, `Toast`, `AddEntry`, `InlineError`
- **Navigation**: `PartHeader`, `Dock` (compact), `Rail` (medium and up)
- **Glyphs**: `Icon`
- **Helpers**: `Inked`, `bindInk`, `inkVars`, `sampleCover`, `CLOTHS`, `CORE_24`, `nearestCloth`, `autoCloth`, `PLATES`, `plateFor`, `statusWord`, `shelfOf`, `planShelfOf`, `idleWords`, `KIND`, `SHELF`, `PLAN_WORD`, `PARTS`, `PROVIDERS`, `VERDICT`, `HORIZON`, `LUCIDE`, `SKETCH`, `EMPTY`

`Kind` is the nine kinds an entry can be; `PlateKind` adds `idea`, which only draws a dream's cover and never appears on an entry, in a filter or in `statusWord`.

The **Covers** page lays out every plate at full size and as thumbnails. The pages under **Pages** show the language assembled on an iPhone XS: Media's three shelves; coming back, stopping and adding; adding by hand; Find and both journals; Prologue's three shelves and Capture; every empty state; and both parts on the G5 spread. Full-size renders are in **assets/Screens**.
