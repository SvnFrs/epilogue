/* Epilogue — mock catalog (the "Hollywood Set"). Static data, no DB.
   Polymorphic: each entry's volatile context block changes by media_type. */
(function () {
  const RDR2_COVER =
    "https://images.unsplash.com/photo-1486916856992-e4db21f9f0bd?q=80&w=1200&auto=format&fit=crop";

  const STORIES = [
    /* ───────────────────────── GAME ───────────────────────── */
    {
      id: "rdr2",
      title: "Red Dead Redemption 2",
      subtitle: "The Campfire Thoughts",
      media_type: "GAME",
      status: "PAUSED",
      space: "gaming",
      year: 2024,
      month: "11",
      cover: RDR2_COVER,
      coverSlotId: "cover-rdr2",
      meta: [
        { label: "Platform", value: "PC · Steam" },
        { label: "Time invested", value: "87 hrs" },
        { label: "Started", value: "Mar 2024" },
        { label: "Last opened", value: "112 days ago" },
      ],
      // Volatile context — the heart of "Previously On"
      checkpoint:
        "Chapter 4 — broke Sadie out of the trapper's cabin near Van Horn and rode into Saint Denis with Dutch. The bounty in Lemoyne is still active ($230). I left Arthur tubercular but pretending he isn't. Next objective: meet the loan shark Bronte. DON'T sell the white Arabian.",
      todos: [
        { text: "Pay off the Lemoyne bounty before next mission", done: false },
        { text: "Stable the white Arabian, never mid-shootout", done: true },
        { text: "Finish the Legendary Bison hunt", done: false },
        { text: "Read Mary's letter — still in the satchel", done: false },
      ],
      keymap: [
        { action: "Dead Eye", key: "Caps Lock" },
        { action: "Cinematic Camera", key: "J" },
        { action: "Whistle for Horse", key: "F" },
        { action: "Loot / Skin", key: "R (hold)" },
        { action: "Greet / Antagonize", key: "B / V" },
        { action: "Slow Walk (cinematic ride)", key: "Alt + W" },
        { action: "Weapon Wheel", key: "Tab (hold)" },
      ],
      ledger: "rdr2",
    },

    /* ───────────────────────── BOOK ───────────────────────── */
    {
      id: "karamazov",
      title: "The Brothers Karamazov",
      subtitle: "Marginalia & Verses",
      media_type: "BOOK",
      status: "READING",
      space: "reading",
      year: 2024,
      month: "10",
      cover:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
      coverSlotId: "cover-karamazov",
      meta: [
        { label: "Author", value: "F. Dostoevsky" },
        { label: "Edition", value: "P&V translation" },
        { label: "Progress", value: "Book VI of XII" },
        { label: "Started", value: "Aug 2024" },
      ],
      currentChapter: "Book VI · 'The Russian Monk' — Zosima's deathbed talks.",
      quotes: [
        {
          text: "Love all God's creation, the whole of it and every grain of sand. Love every leaf, every ray of God's light.",
          reference: "Bk. VI · Ch. 3 · p. 318",
        },
        {
          text: "Above all, don't lie to yourself. The man who lies to himself and listens to his own lie comes to a point that he cannot distinguish the truth within him.",
          reference: "Bk. II · Ch. 2 · p. 44",
        },
        {
          text: "What is hell? I maintain that it is the suffering of being unable to love.",
          reference: "Bk. VI · Ch. 3 · p. 322",
        },
      ],
      ledger: "karamazov",
    },

    /* ──────────────────────── TECH LOG ─────────────────────── */
    {
      id: "vimlog",
      title: "Vim Motions, Internalized",
      subtitle: "Tech Log · digestion run",
      media_type: "TECH_LOG",
      status: "ACTIVE",
      space: "tech",
      year: 2025,
      month: "01",
      cover:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1200&auto=format&fit=crop",
      coverSlotId: "cover-vimlog",
      meta: [
        { label: "Source", value: "ThePrimeagen" },
        { label: "Format", value: "YouTube + Wiki" },
        { label: "Confidence", value: "Digesting" },
        { label: "Started", value: "Jan 2025" },
      ],
      sources: [
        { label: "Vim As Your Editor — Motions", host: "youtube.com", kind: "video" },
        { label: "Vim — text objects (:h text-objects)", host: "vimhelp.org", kind: "wiki" },
        { label: "Practical Vim — Drew Neil, ch. 5", host: "pragprog.com", kind: "book" },
      ],
      backlinks: [
        "Tmux & session muscle memory",
        "Why I left VSCode (the 200ms tax)",
        "Neovim config — Lua migration",
      ],
      ledger: "vimlog",
    },
  ];

  window.EPILOGUE_DATA = { STORIES };
})();
