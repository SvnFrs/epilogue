# Epilogue: vision

## The problem

Long things get put down. A story-driven game stops at chapter 2 for three weeks; a novel waits
on a bedside table; a series is left at S2 · E5; a playlist is half heard. Coming back costs ten
minutes of "what was I doing": which save, what was about to happen, which key whistles for the
horse. Sometimes that cost is why something never gets picked up again.

General tools don't help. A notes app holds anything and so remembers nothing in particular.
Public trackers remember *that* something was watched, not *where* it was left, and they are
built for an audience: stars, follower counts, streaks, a profile to keep up.

Plans have the same shape. "Renew the domain", "learn the F chord", "see the northern lights"
are scattered across phone notes and messages-to-self, and the ones that matter go quiet without
anyone deciding to drop them.

## What Epilogue is

A private commonplace book for one reader. It keeps everything played, read, watched and heard,
remembers exactly where each one was left, and holds what is meant to happen next. It runs on
its owner's server, is always online, and is used on an iPhone XS, a Mi 10S and a 34″
ultrawide. There is no one else in it: no accounts, no sharing, no community, no feed, no
public score.

It has two parts that never mix:

- **Media**: games, books, manga, anime, films, series, music, poems and stories.
- **Prologue**: tasks and dreams, everything that hasn't happened yet. It is the front matter to
  everything in Media. A task may point at a media entry for reference ("Finish Resident Evil 4
  before the weekend"), but wanting to watch a film is the film waiting on the shelf, not a task.

## Coming back is the core job

Every screen answers one of four questions, in this order: *where did I leave it, what am I in,
what did I think, what's next*.

- **Where I left it.** On anything open, the bookmark comes first: the position in the work's own
  units (Chapter 9, S2 · E5 at 23:14, Track 18 of 48), a line in the reader's own words ("past
  the lake, before the castle gate"), up to three facts (save slot, difficulty, platform), and for
  games the few keys that always get forgotten.
- **Stopping is logging.** One tap on a row logs one more chapter or episode. The log sheet holds
  the stepper and the *Where I left it* field together, so updating progress and leaving a
  bookmark are the same moment.
- **What I thought.** Margin notes, timed and placed ("Ch. 2, 23:55"). One review per entry, set
  like a book. A verdict in five steps, each a phrase and never a number: *Not for me · Passed the
  time · Good company · Stayed with me · Part of me now*.
- **How far.** Progress is a page edge in the work's units. Things that never end (a live-service
  game, a playlist) count sittings instead of pretending to a percentage.

## Three shelves

Both parts have the same three shelves, read off each item's state and never filed by hand:

- **Waiting**: not started yet, or paused with its place kept. In Prologue, captures land in an
  Unsorted inbox, then get sorted into Soon or Someday at the desk.
- **Open**: being played, read, watched, listened to, done or pursued.
- **Closed**: finished, done, came true, or set aside.

Something open and untouched for three weeks gets one quiet question in its own row: put it back
on Waiting, place kept? It is asked once, never repeated, never a notification, never done
automatically.

## Adding, finding, remembering

- **Add entry** searches the right catalogue for the kind (films and series, anime and manga,
  games, books) through Epilogue's own server. Adding by hand is always one tap away, and is the
  only way for music, poems and stories. Something already in the library opens instead of being
  added twice. New things land on Waiting.
- **Capture** in Prologue is one field: type a line, press Enter, the field clears for the next.
  It never asks a question.
- Each part has its own **Find** (titles, people, lines in notes) and its own **Journal**, a
  month-by-month record of what started, paused, finished and was noted.

## What it refuses

- Performing: no streaks, goals, badges, stars, numeric ratings or averages.
- Nagging: no reminders, no red due dates, no notifications. Dropping something is *Set aside*.
- Losing words: saves are optimistic, and a failed save shows an inline error with Retry and keeps
  every typed character.
- Audiences: nothing is public, and there is no one to perform for.

## How it should feel

Like a well-kept notebook in good light. The interface language is **Marginalia**
(`design/marginalia/`): paper and ink in two themes, **Paper** by day and **Lamplight** by
night; Literata for titles and everything the reader writes, Lexend for the interface; no
italics; each entry brings one colour from its cover; finished things get a wax seal and paused
things keep their ribbon tucked in. The voice is a margin: short, plain, warm, never cheerful *at*
you.

## Later

Native iOS and Android apps may come later; the design tokens are platform-neutral. Suggestions
tuned to the owner and automatic ingest (Trakt for Stremio, Steam playtime, Kindle clippings) are
deferred and not yet designed (`TODOS.md`).
