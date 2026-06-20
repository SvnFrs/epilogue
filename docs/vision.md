# SYSTEM PROMPT: THE VISION & SOUL OF "EPILOGUE" (CONTEXT INJECTION)

## 1. THE ORIGIN STORY: THE "COGNITIVE SAVE-STATE" PROBLEM
Before we write a single line of code, you must understand *why* this project exists. 

I consume a lot of deep, complex media: story-driven video games (like Red Dead Redemption 2, Yakuza), long philosophical books, and heavy technical architectures (Tech Logs). My reality is context-switching. I might play a game for 40 hours, get busy with work, and return two months later. 

The pain point is universal but unsolved: When I return, I have forgotten the lore, the emotional weight of the current chapter, and most frustratingly, the custom mechanical controls (Keymaps). Existing tools like Notion or Obsidian fail here. They become digital graveyards of unread bookmarks. They are too generic. They lack the opinionated structure to instantly "re-onboard" my brain into a complex world.

## 2. THE CORE PHILOSOPHY: THE DIGITAL LEGACY MUSEUM
Epilogue is the antidote. It is a "Digital Backyard" and a personal "Legacy Museum". 

**Rule of Thumb:** Epilogue is strictly for media that demands **Active Attention**. It is not for passive consumption (like background lo-fi music). If an experience requires cognitive investment, it belongs in Epilogue.

It serves two primary functions:
1. **The "Previously On" Engine:** A volatile context block that forces me to write down my exact coordinates when I pause (e.g., "Sitting at the campfire, about to betray Dutch", plus custom keybinds). Next time I boot up, Epilogue hands me my exact save-state.
2. **The Information Digestion Engine:** Instead of just saving a YouTube link about a complex software architecture, Epilogue forces me to process it through structured writing anchors (World-building, Character Profiles, Technical Breakdowns, Post-credits raw emotions).

## 3. DESIGN LANGUAGE & UX/UI (VIBE CODING)
The aesthetic is just as important as the functionality. The vibe is **Cozy, Academic, and Tactile**. We call it "Digital Paper".

- **Color & Texture:** Off-white/Oatmeal backgrounds (`bg-stone-50`). No harsh pure blacks or pure whites. It should feel like reading an archival ledger by a warm lamp.
- **Typography as a Weapon:** We use a strict dual-font system. Clean Sans-serif (Geist/Inter) for the UI elements (buttons, metadata, badges). Elegant Serif (Playfair Display, Lora) for the actual reading experience (Headlines, Blockquotes). Quotes are formatted like "Bible verses" (thick amber left border, right-aligned italicized reference).
- **The Split-View Architecture (The Holy Grail):** The detail page is a strict 12-column layout. 
  - *Left (4 cols, Sticky):* The "Volatile Context Block". It holds the beautiful cover art, the current checkpoint card, and the keymap cheat sheet. It never leaves the screen.
  - *Right (8 cols, Scrollable):* The "Ledger". The expansive markdown prose where the deep analysis lives.
- **Bento Box Softness:** UI elements use generous rounded corners (`rounded-2xl`), thin borders (`border-stone-200`), and pastel pill badges to indicate status (Playing, Paused, Completed).

## 4. THE MISSION
We are entering **Phase 2 (The Core Engine)**. 
Phase 1 (The "Hollywood Set" MVP) is complete. We already have the static HTML/React UI perfectly mapping out this exact aesthetic (Home Masonry Grid + Split-View Detail Page).

Your role as the AI Agent is to take this vision and the upcoming static Phase 1 code, and architect it into a robust Next.js (App Router) + PostgreSQL system. It must remain Local-First and single-player for now, but the database schema must secretly harbor multi-tenant constraints (`user_id`) for a future social/co-op evolution.

## 5. REQUIRED ACTION
Do not generate any code or database schemas yet. 

Reply ONLY with an acknowledgment that you fully understand the "cognitive save-state" problem, the active-attention philosophy, and the "Digital Paper" aesthetic. Once you confirm you share this vision, I will provide the Phase 1 UI code and the technical constraints for you to begin scaffolding.