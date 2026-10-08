// Marginalia glyphs: Lucide v1.47.0 (ISC; some icons MIT via Feather). See components/LICENSE-lucide.txt.
// Our name -> Lucide's drawing. Inner SVG markup for a 24px viewBox; stroke comes from the <svg>.
export const LUCIDE: Record<string, string> = {"shelved": "library-big", "paused": "book-marked", "open": "bookmark", "again": "repeat", "finished": "stamp", "aside": "sticky-note", "media": "library", "prologue": "sunrise", "dream": "moon-star", "unsorted": "inbox", "soon": "calendar-clock", "someday": "telescope", "link": "link", "grip": "grip-vertical", "now": "lamp-desk", "journal": "notebook-pen", "find": "search", "plus": "plus", "minus": "minus", "back": "chevron-left", "next": "chevron-right", "more": "ellipsis", "note": "pencil", "quote": "quote", "close": "x", "check": "check", "undo": "undo-2", "retry": "rotate-cw", "alert": "circle-alert", "idle": "hourglass"};
export const GLYPHS: Record<string, string> = {
  'shelved': '<rect width="8" height="18" x="3" y="3" rx="1" /><path d="M7 3v18" /><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />',
  'paused': '<path d="M10 2v7.751a.25.25 0 00.407.195l2.28-1.834a.5.5 0 01.627 0l2.28 1.834A.25.25 0 0016 9.751V2" /><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H19a1 1 0 011 1v18a1 1 0 01-1 1H6.5a1 1 0 010-5H20" />',
  'open': '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
  'again': '<path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />',
  'finished': '<path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" /><path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z" /><path d="M5 22h14" />',
  'aside': '<path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" /><path d="M15 3v5a1 1 0 0 0 1 1h5" />',
  'media': '<path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />',
  'prologue': '<path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 6 4-4 4 4" /><path d="M16 18a4 4 0 0 0-8 0" />',
  'dream': '<path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
  'unsorted': '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />',
  'soon': '<path d="M16 14v2.2l1.6 1" /><path d="M16 2v3" /><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338" /><path d="M3 9h5.859" /><path d="M8 2v3" /><circle cx="16" cy="16" r="6" />',
  'someday': '<path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" /><path d="m13.56 11.747 4.332-.924" /><path d="m16 21-3.105-6.21" /><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" /><path d="m6.158 8.633 1.114 4.456" /><path d="m8 21 3.105-6.21" /><circle cx="12" cy="13" r="2" />',
  'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />',
  'grip': '<circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />',
  'now': '<path d="M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z" /><path d="m14.207 4.793-3.414 3.414" /><path d="M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18" />',
  'journal': '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" /><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />',
  'find': '<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />',
  'plus': '<path d="M5 12h14" /><path d="M12 5v14" />',
  'minus': '<path d="M5 12h14" />',
  'back': '<path d="m15 18-6-6 6-6" />',
  'next': '<path d="m9 18 6-6-6-6" />',
  'more': '<circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />',
  'note': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" />',
  'quote': '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />',
  'close': '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
  'check': '<path d="M20 6 9 17l-5-5" />',
  'undo': '<path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />',
  'retry': '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />',
  'alert': '<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />',
  'idle': '<path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />',
};

export const KINDS = ['game', 'book', 'manga', 'anime', 'film', 'series', 'music', 'poem', 'story'] as const;
export const STATUSES = ['shelved', 'paused', 'open', 'again', 'finished', 'aside'] as const;
export const HORIZONS = ['unsorted', 'soon', 'someday'] as const;
export const SHELVES = ['waiting', 'open', 'closed'] as const;
export const PLAN_STATES = ['waiting', 'open', 'paused', 'done', 'aside'] as const;
