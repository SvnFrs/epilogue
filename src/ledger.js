/* Epilogue — the Ledger: long-form reading content, keyed by story.
   Rendered into the 8-col main stage as prose. Lightweight block format:
   { type: 'h2'|'p'|'quote'|'embed'|'callout', ... } */
(function () {
  const LEDGERS = {
    rdr2: {
      kicker: "GAMING · STORY-DRIVEN · WESTERN",
      title: "The Campfire Thoughts",
      standfirst:
        "Field notes from a slow dissolve. Not a review — a record of what it felt like to be Arthur Morgan while the world quietly decided he was already gone.",
      byline: "Logged across 87 hours · last entry 112 days ago",
      blocks: [
        { type: "h2", text: "The Sandbox", note: "World-building" },
        {
          type: "p",
          text: "The genius of this map is that it refuses to perform for you. You crest a ridge expecting a setpiece and instead there is just weather — fog pooling in the Grizzlies, a deer that notices you a half-second before you notice it. The world is indifferent, and that indifference is the point. Saint Denis arrives like a cough of industry against all that silence: gaslight, trams, the smell of a century ending.",
        },
        {
          type: "callout",
          icon: "compass",
          title: "Where I left the world",
          text: "Mid-Chapter 4. The gang is flush and rotting at the same time. Everyone can feel it except Dutch, who has started saying 'I have a plan' the way other men say their prayers.",
        },
        {
          type: "p",
          text: "What I keep returning to is the honor system as a moral weather report. It never lectures. It just quietly tilts how strangers look at you, whether a shopkeep meets your eye. You are not told you are good or bad. You are simply, slowly, treated accordingly.",
        },

        { type: "quote", text: "We can't change what's done. We can only move on.", reference: "Arthur Morgan · Ch. 4 · Camp" },

        { type: "h2", text: "The Campfire", note: "Character profiles" },
        {
          type: "p",
          text: "Hosea is the gang's conscience and he knows it is a losing position. Sadie is grief that learned to aim. And Arthur — Arthur is a ledger himself, a man keeping accounts in a journal nobody will read, sketching birds while his lungs fill up. The diagnosis doesn't change his to-do list. It just removes the lie that there will be a later.",
        },
        {
          type: "p",
          text: "I find I play him gently now. I tip my hat. I let debtors off. Not because the game rewards it — though it does — but because it has started to feel like the only honest thing left to do with the time on the clock.",
        },

        { type: "h2", text: "The Post-Credits Blur", note: "raw, unedited" },
        {
          type: "p",
          text: "I haven't finished it. I know how it ends — everyone does — and that's exactly why I paused. There is a version of grief that is anticipatory, where you stop the film one frame before the cut because the held breath is more bearable than the exhale. Epilogue exists because of this entry. I needed somewhere to write down that the save file isn't abandoned. It's being protected.",
        },
        {
          type: "p",
          text: "When I come back — and the checkpoint note in the sidebar is for exactly this — I want to remember that I left him alive on purpose.",
        },
      ],
    },

    karamazov: {
      kicker: "READING · RUSSIAN · PHILOSOPHICAL NOVEL",
      title: "Marginalia & Verses",
      standfirst:
        "A reading ledger kept like scripture: every verse pinned to its chapter and line, so the underlines survive long after the book is back on the shelf.",
      byline: "Book VI of XII · started Aug 2024",
      blocks: [
        { type: "h2", text: "The Sandbox", note: "what the book is building" },
        {
          type: "p",
          text: "Dostoevsky doesn't write a plot so much as a courtroom where every character is both witness and accused. The murder is almost an afterthought; the real trial is whether a person can love without first demanding that the world be just. Zosima's monastery and Smerdyakov's kitchen are the same room argued from opposite ends.",
        },
        {
          type: "quote",
          text: "Love all God's creation, the whole of it and every grain of sand. Love every leaf, every ray of God's light.",
          reference: "Bk. VI · Ch. 3 · p. 318",
        },
        { type: "h2", text: "The Campfire", note: "the brothers" },
        {
          type: "p",
          text: "Alyosha is the only one who listens without preparing his rebuttal. Ivan builds cathedrals of logic and then can't live inside them. Dmitri feels everything a half-second before he understands it. I keep underlining Ivan and living like Alyosha.",
        },
        {
          type: "quote",
          text: "What is hell? I maintain that it is the suffering of being unable to love.",
          reference: "Bk. VI · Ch. 3 · p. 322",
        },
        { type: "h2", text: "The Post-Credits Blur", note: "raw" },
        {
          type: "p",
          text: "I read the 'grain of sand' passage on a train and had to put the book face-down on my knee for a stop and a half. That's the entry. No analysis. Just the fact of it.",
        },
      ],
    },

    vimlog: {
      kicker: "TECH · TOOLING · DIGESTION RUN",
      title: "Vim Motions, Internalized",
      standfirst:
        "Not a bookmark graveyard. A digestion run: embed the source, then force myself to re-explain it in my own words until it's actually mine.",
      byline: "Tech Log · digesting · started Jan 2025",
      blocks: [
        { type: "h2", text: "The source", note: "embedded, not hoarded" },
        {
          type: "embed",
          platform: "YouTube",
          channel: "ThePrimeagen",
          title: "Vim As Your Editor — Motions",
          duration: "16:42",
        },
        { type: "h2", text: "What I actually took away", note: "in my own words" },
        {
          type: "p",
          text: "The unlock isn't the keybindings — it's the grammar. Vim is verb + motion + (text object). Once 'change inside parentheses' reads as ci( instead of three separate facts to memorize, the whole editor collapses into a language you can improvise in. Memorizing commands is vocabulary; understanding the grammar is fluency.",
        },
        {
          type: "callout",
          icon: "link",
          title: "Bi-directional link",
          text: "This connects to my note on the '200ms tax' of mouse-reaching. Motions are the antidote: the hands never leave home row, so the thought never has to wait for the cursor.",
        },
        {
          type: "p",
          text: "Drill for the week: text objects only. iw, i\", ip, it. No arrow keys, no hjkl spam. If I catch myself pressing l five times I owe myself one re-watch of the section at 9:30.",
        },
      ],
    },
  };

  window.EPILOGUE_LEDGERS = { LEDGERS };
})();
