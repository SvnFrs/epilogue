# Feature Specification: Epilogue rebuild on Marginalia

**Feature Branch**: `002-marginalia-rebuild`
**Created**: 2026-10-09
**Status**: Draft
**Input**: User description: "Rebuild Epilogue on the Marginalia design system (design/marginalia/ is authoritative; constitution v2.0.0). Epilogue is a private commonplace book for one reader (Tyler): self-hosted, always online, used on an iPhone XS, a Mi 10S and a 34" ultrawide; no accounts, sharing, community, feeds or public scores. Two parts that never mix: Media (game, book, manga, anime, film, series, music, poem, story) and Prologue (tasks and dreams); a task may link a media entry for reference only. Each part has three shelves, Waiting · Open · Closed, derived from state, never stored. Media: Waiting = shelved + paused; Open = open + again; Closed = finished + aside. Prologue: Waiting = waiting (Unsorted inbox, Soon, Someday) + paused; Open = open; Closed = done + aside. An Open item untouched for 21 days gets one quiet prompt to go back to Waiting as paused, keeping its place; never automatic, never repeated. Coming back is the core job: LeftOff (where I left it, a short note, up to 3 facts, pinned keys for games), the log sheet (stepper + where I left it), margin notes, one review per entry, a 5-step verdict in words (no numbers), progress as a page edge, or sittings for things that never end. Add entry searches catalogues through Epilogue's own server (TMDB, AniList, IGDB, Open Library); manual entry is always one tap away; no duplicates; new entries land on Waiting. Each part has its own Find and its own Journal. Saves are optimistic; a failure shows an inline error with Retry and never loses typed text. Deferred, not designed: owner-tuned suggestions; automatic ingest (Trakt for Stremio, Steam local playtime, Kindle clippings). User stories by priority: (P1) coming back + logging; (P2) Media's three shelves; (P3) adding; (P4) Prologue capture and shelves; (P5) Journals and Find. Then requirements and success criteria. What, not how: no stack choices. Three open questions to mark for clarification: a Settings/About screen; Media's Waiting order beyond paused first; whether owner-tuned suggestions come back."

**Sources**: `.specify/memory/constitution.md` v2.0.0 (product rules) and `design/marginalia/`
(authoritative for every screen, component, word and token named here). This spec supersedes
`specs/001-core-engine/`. Words in *italics* below are the interface's own copy.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Come back to something and log a sitting (Priority: P1)

The reader picks a game, book or series back up after days or weeks away. On the phone, Media
opens on its Open shelf: each open entry is a row showing where it was left ("Ch. 9 · past the
lake, before the gate") and a round + that logs one more. Opening an entry shows **Where I left
it** first: the position in the work's own units, a line in the reader's own words, up to three
facts (save slot, difficulty, platform), and for a game the few keys that always get forgotten.
After a sitting, the reader logs it: either one tap on the row's +, or the log sheet, which holds
the stepper and the *Where I left it* field together so stopping always leaves a bookmark. The
entry also holds margin notes, one review and a verdict in words.

**Why this priority**: coming back is Epilogue's first job (constitution Principle I). On its
own, this story replaces "ten minutes of what was I doing" for anything already open.

**Independent Test**: seed one open game with a bookmark, three facts and a ten-bind keymap
(four pinned); open it on a 375 × 812pt phone; resume from what is shown; log a sitting with a
new bookmark line; reload on another device and see the new bookmark.

**Acceptance Scenarios**:

1. **Given** an open game entry with a position, a note, three facts and ten key binds of which
   four are pinned, **When** the reader opens it on a phone, **Then** *Where I left it* is the
   first thing under a compact header and shows the position, the note, the three facts, the
   four pinned keys and *All 10 keys*; *Update where I left it* is visible above the dock
   without scrolling.
2. **Given** an open book at chapter 9 of 16 on the Open shelf, **When** the reader taps the
   row's +, **Then** progress becomes chapter 10 of 16 without opening the entry, the row's page
   edge moves, and a confirmation names it with Undo (*Noted · chapter 10*).
3. **Given** the log sheet open on an entry, **When** the reader steps progress and types a line
   in *Where I left it*, then logs, **Then** progress and bookmark are saved as one action and the
   bookmark is stamped with the time (*Sun, 23:55*) without the reader entering it.
4. **Given** the log sheet, **When** the reader chooses *Finished it*, **Then** the entry becomes
   finished with today's date and moves to Closed, and its bookmark is kept.
5. **Given** an entry with no last page (a live-service game, a playlist), **When** the reader
   logs it, **Then** a sitting is counted (and hours, if given) and no percentage or total is
   shown.
6. **Given** an entry, **When** the reader adds a margin note, **Then** the note keeps where it
   was written (the position at that moment) and when, appears in the entry's margin in full, and
   appears in the Media Journal.
7. **Given** an entry that already has a review, **When** the reader writes about it again,
   **Then** the existing review is edited; an entry never has two reviews.
8. **Given** an entry, **When** the reader sets its verdict, **Then** it is shown as one of
   *Not for me · Passed the time · Good company · Stayed with me · Part of me now*, never as a
   number; choosing the current step again clears it.
9. **Given** a paused entry, **When** the reader starts it again, **Then** it becomes open (not a
   replay) with its bookmark and keymap unchanged.
10. **Given** the server does not answer, **When** the reader logs, updates the bookmark or
    writes a note, **Then** one inline error appears where it happened (*Not saved. The server
    didn't answer.*) with Retry, and everything typed stays where it was typed.
11. **Given** the 34″ ultrawide, **When** the reader opens an open game, **Then** the entry is an
    open book beside the shelf list: the header and *Where I left it* on the left page, and the
    full keymap and the paused things on Waiting in the margin column.

---

### User Story 2 - Browse Media's three shelves (Priority: P2)

The reader moves between **Waiting · Open · Closed** at the top of Media. Waiting holds what is
up next and what is paused (paused first, each showing where it stopped); Open holds what is
being played, read, watched or listened to, including replays; Closed holds what was finished or
set aside, grouped by month. Something open but untouched for three weeks gets one quiet
question in its own row.

**Why this priority**: the shelves are how the whole library is seen and how things move between
"later", "now" and "done"; without them only already-open entries are reachable.

**Independent Test**: seed entries in all six states across several kinds; check each shelf's
contents, order, counts and filters; let one open entry go 21 days without activity and check
the prompt appears once.

**Acceptance Scenarios**:

1. **Given** entries in every state, **When** the reader switches shelves, **Then** Waiting shows
   up-next and paused entries, Open shows open entries and replays, Closed shows finished and
   set-aside entries, and the switch shows quiet counts (never badges).
2. **Given** a paused series kept at S2 · E5, **When** the reader views Waiting, **Then** paused
   entries come first and this one reads *Paused · S2 · E5* in place of its by-line.
3. **Given** Waiting holds several kinds, **When** the reader picks a kind chip, **Then** only
   that kind shows; *All* restores the shelf.
4. **Given** Closed, **When** the reader picks *Finished* or *Set aside*, **Then** only those show,
   grouped by month with their dates.
5. **Given** a finished entry, **When** the reader takes it out of Closed, **Then** it becomes a
   replay on Open, with the kind's word (*Replaying*, *Rereading*, *Rewatching*, *On repeat*).
6. **Given** an open entry with no activity for 21 days, **When** the reader sees it on Open,
   **Then** its row asks once: *Untouched for 3 weeks. Put it back on Waiting? Your place is
   kept.* with *Put back* and *Keep it open*. *Put back* makes it paused (on Waiting, first, place
   kept); *Keep it open* dismisses it, and it is not asked again for that quiet stretch.
7. **Given** the prompt was dismissed, **When** the reader logs anything on that entry, **Then**
   the 21-day clock restarts, and the entry is never moved without the reader's choice.
8. **Given** the reader opens Media, **Then** it opens on Open.

---

### User Story 3 - Add something to Media (Priority: P3)

From Media's +, the reader picks a kind and types a title; Epilogue searches the matching
catalogue (films and series on TMDB, anime and manga on AniList, games on IGDB, books on Open
Library) through its own server. Picking a result fills the cover, its colour and the total;
the new entry lands on Waiting unless *Starting now* is on. If the catalogue has nothing, fails,
or the kind has no catalogue (music, poems, stories), adding by hand is one tap away with the
typed title carried over.

**Why this priority**: the library has to be filled, but coming back (P1) and the shelves (P2)
can be exercised with seeded entries first.

**Independent Test**: add one film from TMDB, one poem by hand, try to add the film again, and
search while the catalogue is unreachable.

**Acceptance Scenarios**:

1. **Given** Add entry with kind *Film*, **When** the reader types a title and pauses, **Then**
   results show a small cover, the title with the match marked, year, maker and total where known.
2. **Given** a result, **When** the reader picks it, **Then** the entry is created with that
   cover, an ink taken from the cover and snapped to the bookcloth set, and its total, and lands
   on Waiting (*Up next*); the sheet said *Lands on Waiting* before the pick.
3. **Given** *Starting now* is on, **When** the reader adds an entry, **Then** it lands on Open.
4. **Given** the film is already in the library, **When** it appears in results, **Then** it reads
   *In your library* and opens the existing entry instead of adding a second.
5. **Given** kind *Poem*, **When** the reader opens Add entry, **Then** it opens straight on the
   by-hand form.
6. **Given** the catalogue does not answer or finds nothing, **When** results would show,
   **Then** a single line says so (*AniList didn't answer. Your search is kept.*), the search is
   kept, and *Add '…' by hand* is the sheet's primary action, carrying the typed title.
7. **Given** the by-hand form, **When** the reader fills title, maker and an optional total and
   unit, **Then** it shows the cover plate the entry will wear and a cloth picker (*Auto* or one
   of the 24 core cloths), and refuses a title that already exists for that kind by opening the
   existing entry.

---

### User Story 4 - Capture and sort the Prologue (Priority: P4)

On the phone, the reader captures tasks and dreams as fast as they come: one field, type a line,
press Enter, and it lands in the Unsorted inbox while the field clears for the next. At the desk,
Waiting shows Unsorted at the top, then Soon, then Someday, and the reader sorts. Open holds what
is being done or pursued; ticking a task crosses it out and it moves to Closed; a dream that
comes true is sealed with its date. A task may point at a media entry ("Finish Resident Evil 4
before the weekend") for reference.

**Why this priority**: the Prologue is the second part of Epilogue and shares the shelf model,
but Media's coming-back job is the core.

**Independent Test**: capture five lines on a phone without answering any question, sort them at
the desk, start one task, tick it, and mark a dream as come true.

**Acceptance Scenarios**:

1. **Given** Capture, **When** the reader types a line and presses Enter, **Then** it is saved to
   Unsorted on Waiting, appears at once, and the field is empty and focused for the next line; no
   question is asked.
2. **Given** Capture with the *Soon* chip or the Dream switch chosen, **When** the line is saved,
   **Then** it lands in Soon, or as a dream, accordingly.
3. **Given** Waiting, **When** the reader views it, **Then** Unsorted is a strip at the top, then
   Soon (paused items first), then Someday, with no flags, priorities, per-list colours or red
   due dates.
4. **Given** an item in Unsorted, **When** the reader moves it to Soon or Someday (by drag at the
   desk, or from the item on a phone), **Then** it moves to that group.
5. **Given** a task on Open, **When** the reader ticks it, **Then** it is crossed out and stays
   readable, moves to Closed after a moment, and offers Undo.
6. **Given** a dream being pursued, **When** the reader marks it come true, **Then** it is sealed
   with *Came true · date* and moves to Closed; dreams are never ticked.
7. **Given** a task linked to *Resident Evil 4*, **When** the reader views the task, **Then** it
   shows the entry's kind glyph and title and opens the entry; the entry stays on its Media
   shelf, and no Media screen lists the task.
8. **Given** a capture fails to save, **When** the error appears, **Then** the text is back in the
   field with one inline error and Retry.
9. **Given** an open task or dream untouched for 21 days, **Then** the same one-time prompt as
   Media applies; *Put back* makes it paused with its steps kept.
10. **Given** the reader opens the Prologue, **Then** it opens on Open on a phone and on Waiting at
    the desk.
11. **Given** the phone shortcut (Back Tap on the iPhone, the share sheet on Android), **When** the
    reader sends a line from outside Epilogue, **Then** it lands in Unsorted; if the server does
    not answer, the shortcut says so and the line is still in its input.

---

### User Story 5 - Look back and find things (Priority: P5)

Each part keeps its own Journal, a timeline by month and day, and its own Find. The Media Journal
shows margin notes (with the note itself), starts, finishes, set-asides, put-backs and replays;
the Prologue Journal shows captures, starts, done, came true, set-asides and put-backs. Find on
Media searches titles, people (makers and authors) and lines in notes and reviews; Find on the
Prologue searches tasks and dreams.

**Why this priority**: looking back and searching matter once the library has history; the four
stories above create that history.

**Independent Test**: with a seeded month of activity in both parts, open each Journal and jump
to a year; search for a person, a phrase from a note, and a task.

**Acceptance Scenarios**:

1. **Given** a month of Media activity, **When** the reader opens the Media Journal, **Then** events
   are grouped by month and day, each with its kind of event, title and (for notes) the note's
   text, and each line opens the entry it came from.
2. **Given** several years of history, **When** the reader picks a year, **Then** the Journal jumps
   to it.
3. **Given** Find opened from Media, **When** the reader types a maker's name, **Then** results
   show that person with how many entries and of what kinds, plus matching titles and lines in
   notes and reviews, each match marked, each opening its source.
4. **Given** Find opened from Media with no match, **Then** it offers *Add 'query'*, which opens Add
   entry with the query typed in; on the Prologue it offers *Capture 'query'*.
5. **Given** Find opened from either part, **Then** results never include the other part's items.
6. **Given** a keyboard, **When** the reader presses "/", **Then** Find opens for the current part.

---

### Edge Cases

- **No cover art**: the entry wears a generated cover plate on its cloth, chosen from its title
  and stable over time; it never imitates a real cover, logo or character.
- **Long and non-Latin titles**: Vietnamese, Chinese and Japanese titles are ordinary titles; long
  titles step down in size rather than being cut on covers, and clamp to two lines on shelves.
- **Reaching the total**: the stepper stops at the total; reaching it offers *Finished it* but
  never finishes the entry by itself.
- **Logging an entry on Waiting**: logging progress on an up-next entry starts it (it becomes
  open).
- **Idle stretch already asked**: a dismissed prompt is not asked again until the entry has had
  activity and then gone quiet for another 21 days.
- **Same item open on two screens**: the latest save wins; nothing typed on the screen that loses
  is cleared from its field.
- **Same title, different kind** (a novel and its film): two separate entries, not duplicates.
- **Removing an entry**: a destructive action with a confirmation that names it; tasks that
  linked to it keep their text and lose the link.
- **Server unreachable when opening a screen**: the screen shows one inline error with Retry
  where its content would be; there is no offline copy to fall back on.
- **Empty shelves, journals and searches**: each shows a small pen drawing, one line, one sentence
  saying what the space is for, and at most one quiet way on.

## Requirements *(mandatory)*

### Functional Requirements

**Parts and shelves**

- **FR-001**: System MUST keep two parts, Media and Prologue, and MUST NOT show items from one
  part on the other part's shelves, Find or Journal.
- **FR-002**: Media entries MUST be one of nine kinds: game, book, manga, anime, film, series,
  music, poem, story.
- **FR-003**: Media entries MUST have one of six states (up next, paused, open, replay, finished,
  set aside); Prologue items MUST have one of five (waiting, paused, open, done, set aside), and a
  waiting item MUST belong to one group: Unsorted, Soon or Someday.
- **FR-004**: The shelf an item is on (Waiting, Open, Closed) MUST be derived from its state by one
  mapping (constitution Principle II) and MUST NOT be stored or set separately.
- **FR-005**: Paused items MUST appear on Waiting, sort first there, and keep their place; starting
  a paused item MUST make it open, not a replay.
- **FR-006**: Taking a media entry out of Closed MUST make it a replay on Open; taking a task or
  dream out of Closed MUST make it open.
- **FR-007**: Media's Waiting shelf MUST list paused entries first, then the rest ordered by
  [NEEDS CLARIFICATION: How is Media's Waiting shelf ordered beyond paused first: a manual order
  the reader arranges, date added, or something else?].
- **FR-008**: Waiting MUST be filterable by kind; Closed MUST be filterable by Finished / Set aside
  (Media) and Done / Came true / Set aside (Prologue), and grouped by month.
- **FR-009**: An Open item with no activity for the idle period (default 21 days) MUST show one
  prompt inside its own row or card offering to put it back on Waiting as paused with its place
  kept. The prompt MUST be shown at most once per quiet stretch, MUST NOT be a notification, and
  MUST NOT change anything unless the reader chooses *Put back*. Any logged activity on the item
  MUST restart the clock.

**Coming back and logging**

- **FR-010**: Each media entry MUST hold a bookmark: the position in the work's own units, a short
  note in the reader's words, at most 3 facts (label and value), and the time it was last
  updated, stamped automatically.
- **FR-011**: Game entries MUST hold a keymap (action, keys, optional group, pinned or not); the
  bookmark MUST show the pinned keys, with the full map one step away.
- **FR-012**: On an open entry, the bookmark MUST be the first content under the entry header, and
  on a 375 × 812pt phone its update action MUST be visible above the dock without scrolling.
- **FR-013**: Each row on Media's Open shelf MUST log one more unit with a single tap, without
  opening the entry, and confirm it with Undo.
- **FR-014**: The log sheet MUST offer the progress stepper, the *Where I left it* field and
  *Finished it* together, and MUST save progress and bookmark as one action.
- **FR-015**: Pausing, putting back, setting aside or finishing MUST NOT clear an entry's bookmark,
  keymap, notes, review or steps.
- **FR-016**: Progress MUST be shown as a page edge in the work's units (value of total), or, for
  things with no last page, as a count of sittings (and hours, if recorded). A total MUST NOT be
  invented; a percentage alone appears only when the source reports nothing else.
- **FR-017**: The reader MUST be able to add margin notes to an entry, each with where (position)
  and when, optionally marked as a half-thought; other people's words MUST be recordable as
  quotes with their source. Notes MUST never be truncated on the entry's page.
- **FR-018**: Each entry MUST have at most one review.
- **FR-019**: Each entry MAY have a verdict of one of five steps shown only as words (*Not for me ·
  Passed the time · Good company · Stayed with me · Part of me now*); no number, average or half
  step may be shown, and choosing the current step again MUST clear it.

**Adding**

- **FR-020**: Add entry MUST search one catalogue per kind, through Epilogue's own server: TMDB for
  films and series, AniList for anime and manga, IGDB for games, Open Library for books. Music,
  poems and stories MUST open on the by-hand form.
- **FR-021**: Catalogue results MUST show a small cover, the title with the match marked, year,
  maker, and total when the catalogue has one; search MUST wait for a pause in typing.
- **FR-022**: Picking a result MUST fill the cover, an ink snapped to the nearest bookcloth, and the
  total with its unit (episodes, chapters, pages).
- **FR-023**: Adding MUST NOT create duplicates: a result already in the library MUST say *In your
  library* and open the existing entry, and the by-hand form MUST do the same for a title that
  already exists for that kind.
- **FR-024**: New entries MUST land on Waiting, or on Open when *Starting now* is chosen, and the
  sheet MUST say which before the reader adds.
- **FR-025**: Adding by hand MUST always be one tap away from results, and MUST be the primary
  action when there are no results or the catalogue fails, carrying the typed title.
- **FR-026**: The by-hand form MUST show the cover plate the entry will wear and offer a cloth
  (*Auto* or one of the 24 core cloths).
- **FR-027**: Catalogue credentials MUST never reach a client device, and a cover chosen from a
  catalogue MUST stay available if that catalogue later becomes unreachable.

**Prologue**

- **FR-028**: Capture MUST save a line with Enter into Unsorted (or the chosen group, or as a
  dream), clear the field for the next line, and never ask a question.
- **FR-029**: Capture MUST be reachable from the Prologue's +, from a key at the desk (`N`), and from
  outside the app on both phones (an iPhone Back Tap shortcut and the Android share sheet) posting
  straight into Unsorted; if that fails, the shortcut MUST report it and keep the line.
- **FR-030**: Prologue Waiting MUST show Unsorted at the top, then Soon, then Someday, with no
  flags, priorities, per-list colours or red due dates; items MUST be movable between groups.
- **FR-031**: A task MUST hold its text and MAY hold a when, steps (done of total) and a link to one
  media entry; ticking it MUST cross it out, keep it readable, move it to Closed after a moment,
  and offer Undo.
- **FR-032**: A dream MUST hold its name and MAY hold a why, steps and a cloth; it MUST NOT be
  ticked, and coming true MUST seal it with its date and move it to Closed.
- **FR-033**: A link from a task to a media entry MUST be a reference only: it opens the entry,
  leaves the entry on its own shelf, and adds nothing to the entry's own screens.

**Journals and Find**

- **FR-034**: Each part MUST have its own Journal, grouped by month and day with a way to jump to a
  year, in which every line opens what it came from. Media: notes (with their text), started,
  finished, set aside, put back on Waiting (with where its place is kept), replays. Prologue:
  captured, started, done, came true, set aside, put back.
- **FR-035**: Each part MUST have its own Find. Media: titles, people (with how many entries and of
  what kinds) and lines in notes and reviews. Prologue: tasks and dreams. Matches MUST be marked
  and every result MUST open its source.
- **FR-036**: With no match (and below results), Find MUST offer *Add 'query'* on Media and
  *Capture 'query'* on the Prologue; "/" MUST open Find on a keyboard.

**Saving and failure**

- **FR-037**: Saves MUST be optimistic: the change appears at once and is saved behind it.
- **FR-038**: A failed save MUST show one inline error where it happened, with Retry, and MUST keep
  everything typed; failures MUST NOT use modals, toasts or banners.
- **FR-039**: Reversible actions MUST confirm with an Undo; removing an entry MUST ask for
  confirmation that names it.

**Reader, privacy and conduct**

- **FR-040**: The system MUST serve one reader with no accounts, sign-up, sharing, public links,
  follows, comments or feeds, and MUST only be reachable from the owner's own devices or private
  network.
- **FR-041**: Every stored record MUST carry its owner, even though there is one reader.
- **FR-042**: The system MUST NOT show streaks, goals, badges, stars, numeric or public scores, or
  send reminders or notifications.
- **FR-043**: The reader MUST be able to set the idle period (default 21 days) and choose the theme
  (Paper or Lamplight), and the app MUST show TMDB's required attribution ("This product uses the
  TMDB API but is not endorsed or certified by TMDB." and its logo) [NEEDS CLARIFICATION: Is there
  a Settings/About screen, and if so where is it reached from, and does it hold the idle period,
  the theme choice and the TMDB attribution?].
- **FR-044**: Owner-tuned suggestions and automatic ingest (Trakt for Stremio, Steam local
  playtime, Kindle clippings) are out of scope for this spec [NEEDS CLARIFICATION: Do owner-tuned
  suggestions come back in a later spec, or are they dropped from Epilogue?].

**Interface**

- **FR-045**: Every screen MUST follow `design/marginalia/`: Paper and Lamplight themes, its
  contrast rules, one lamp (primary action) per view, no italics, Literata and Lexend shipped with
  the app, a glyph always with a word, hit areas of at least 44px and 17px text inputs.
- **FR-046**: Layout MUST follow the app's width, not the device: one column with a floating dock
  under 600px; a rail from 600px; rail, list column and the entry as a page from 1200px; and on
  the ultrawide (2400px and up) the entry as an open book with a margin column.
- **FR-047**: Interface copy MUST be English; content MUST display in whatever language it was
  written (including Vietnamese, Chinese and Japanese) without special handling.
- **FR-048**: Every motion MUST resolve instantly when the device asks for reduced motion.

### Key Entities *(include if feature involves data)*

- **Owner**: the one reader; every other record belongs to it.
- **Media entry**: title, maker, kind, state and the date it entered that state, date added, cover
  (catalogue art or a plate with its cloth and composition), ink, catalogue reference (which
  catalogue and which item, for duplicate checks), progress (value, total, unit, or sittings and
  hours), bookmark (position, note, up to 3 facts, updated-at), keymap (games), verdict, review,
  last activity, and whether the idle prompt was asked for the current quiet stretch.
- **Margin note**: belongs to one entry; where, when, text, half-thought flag; or a quote with its
  source.
- **Sitting / log**: one logged step of progress on an entry, with when; drives progress, the
  Journal and the idle clock.
- **Task**: text, state, group while waiting (Unsorted, Soon, Someday), optional when, optional
  steps, optional reference to one media entry, state dates, last activity, idle-prompt flag.
- **Dream**: name, why, state, group while waiting, optional steps, cloth and idea-cover choice,
  came-true date, last activity, idle-prompt flag.
- **Journal event**: part, type of event, the item it came from, when, and its detail (a note's
  text, where a place is kept).
- **Settings**: idle period and theme choice (see FR-043).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From opening Epilogue on a phone, the reader sees where an open entry was left in at
  most 2 taps and under 5 seconds, without scrolling.
- **SC-002**: Logging one more from the Open shelf takes exactly 1 tap; logging with a new bookmark
  line takes at most 3 taps plus typing.
- **SC-003**: No typed text is lost to a failed save: with the server unreachable, every kind of
  save (log, bookmark, note, review, verdict, capture, add) keeps its text and succeeds on Retry
  once the server answers.
- **SC-004**: Capturing a line takes one keystroke after typing, asks no question, and leaves the
  field ready for the next line immediately.
- **SC-005**: An item found in its catalogue is added in at most 3 taps after typing its title; an
  item not found is added by hand with at most 1 extra tap from the results.
- **SC-006**: Adding something already in the library creates no duplicate, whether found in a
  catalogue or typed by hand.
- **SC-007**: Every item appears on exactly the shelf its state maps to, in its own part only, in
  100% of checks across all states of both parts.
- **SC-008**: The idle prompt appears exactly once per quiet stretch of 21 days per Open item; no
  item ever changes shelf without the reader's action, and no notification is ever sent.
- **SC-009**: Every screen, in both themes, at phone width and on the ultrawide, passes a design
  review against `design/marginalia/`: text at least 4.5:1 and meaningful boundaries at least
  3:1, exactly one lamp action, no italic text.
- **SC-010**: Find shows matching titles, people and lines within 1 second of the reader pausing
  typing, for a library of 2,000 entries and 10,000 notes.
- **SC-011**: After 2–4 weeks of daily use, the reader can name no open entry whose place had to
  be recovered from anywhere other than Epilogue.

## Assumptions

- One reader; the private network is the access control, so there is no sign-in screen.
- Always online: there is no offline copy or sync; a screen that cannot reach the server says so
  inline with Retry.
- When the same item is changed on two screens, the latest save wins; no merge view is needed.
- Third-party catalogues can be slow, rate-limited or down (AniList allows about 90 requests a
  minute); adding by hand is always the fallback, and the catalogues' terms (including TMDB's
  attribution) are followed.
- A duplicate means the same catalogue item, or, by hand, the same title (ignoring case and
  punctuation) for the same kind. The same title in a different kind is a different entry.
- "Activity" for the idle clock means a log, bookmark update, note, state change or (for tasks and
  dreams) a step; merely viewing an item does not count.
- Prologue "when" is shown quietly as written (Sun, this week); it never triggers reminders.
- Nothing stored by the 001 Core Engine needs to carry over (it held demo data); if some does,
  the plan decides how.
- The plan chooses the stack and what to reuse from the 001 code and deploy; this spec does not.
- Native iOS and Android apps are out of scope here; the design tokens already allow them later.
