/* Epilogue — App: header, entry switcher, "Previously On" recap, layout. */
(function () {
  const React = window.React;
  const { useState, useEffect } = React;
  const I = window.EpiIcons;
  const { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakRadio, TweakSlider, TweakToggle } = window;

  const HEADLINES = {
    "Playfair Display": '"Playfair Display"',
    "Cormorant Garamond": '"Cormorant Garamond"',
    "DM Serif Display": '"DM Serif Display"',
  };
  const PAPERS = { Warm: "#faf9f7", Cream: "#f7f3ea", Cool: "#f5f5f4" };

  const TWEAK_DEFAULTS = {
    headline: "Playfair Display",
    paper: "Warm",
    measure: 680,
    grain: true,
    autoRecap: true,
  };
  const { STORIES } = window.EPILOGUE_DATA;
  const { LEDGERS } = window.EPILOGUE_LEDGERS;
  const Sidebar = window.EpiSidebar;
  const Ledger = window.EpiLedger;

  function Wordmark() {
    return React.createElement(
      "a",
      { href: "Epilogue Home.html", className: "flex items-center gap-2.5 transition hover:opacity-80", title: "Back to the Library" },
      React.createElement(
        "span",
        { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-stone-800 font-serif text-[15px] italic text-amber-50" },
        "E"
      ),
      React.createElement(
        "div",
        { className: "leading-none" },
        React.createElement("span", { className: "font-serif text-[18px] tracking-tight text-stone-800" }, "Epilogue"),
        React.createElement("span", { className: "ml-2 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400 sm:inline" }, "digital legacy museum")
      )
    );
  }

  function Breadcrumb({ story }) {
    const seg = (t) =>
      React.createElement("span", { className: "font-mono text-[11.5px] uppercase tracking-[0.1em] text-stone-400" }, t);
    const sl = React.createElement("span", { className: "text-stone-300" }, "/");
    return React.createElement(
      "div",
      { className: "hidden items-center gap-2 md:flex" },
      seg(story.space), sl, seg(String(story.year)), sl, seg(story.month), sl,
      React.createElement("span", { className: "font-mono text-[11.5px] uppercase tracking-[0.1em] text-amber-700" }, story.id)
    );
  }

  function Switcher({ stories, activeId, onPick }) {
    return React.createElement(
      "div",
      { className: "flex items-center gap-1.5 overflow-x-auto" },
      stories.map((s) => {
        const TypeIcon = I.forType(s.media_type);
        const active = s.id === activeId;
        return React.createElement(
          "button",
          {
            key: s.id,
            onClick: () => onPick(s.id),
            className:
              "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition " +
              (active
                ? "bg-stone-800 text-stone-50 shadow-sm"
                : "text-stone-500 hover:bg-stone-200/60 hover:text-stone-700"),
          },
          React.createElement(TypeIcon, { size: 14, className: active ? "text-amber-300" : "text-stone-400" }),
          s.title.length > 22 ? s.title.slice(0, 20) + "…" : s.title
        );
      })
    );
  }

  function Header({ story, stories, activeId, onPick, onRecap }) {
    return React.createElement(
      "header",
      { className: "sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-md" },
      React.createElement(
        "div",
        { className: "mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-3.5 sm:px-8" },
        React.createElement(Wordmark, null),
        React.createElement("div", { className: "ml-1 hidden h-5 w-px bg-stone-200 lg:block" }),
        React.createElement(Breadcrumb, { story }),
        React.createElement("div", { className: "flex-1" }),
        React.createElement(
          "button",
          {
            onClick: onRecap,
            className: "group hidden items-center gap-2 rounded-full bg-amber-700 px-3.5 py-1.5 text-[12.5px] font-semibold text-amber-50 shadow-sm transition hover:bg-amber-800 sm:flex",
          },
          React.createElement(I.History, { size: 14 }),
          "Previously On"
        ),
        React.createElement(
          "button",
          { className: "flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-200/60 hover:text-stone-700" },
          React.createElement(I.Search, { size: 17 })
        )
      ),
      React.createElement(
        "div",
        { className: "mx-auto max-w-[1240px] px-5 pb-3 sm:px-8" },
        React.createElement(Switcher, { stories, activeId, onPick })
      )
    );
  }

  /* ── "Previously On" — save-state for the brain ── */
  function PreviouslyOn({ story, checkpoint, onClose }) {
    if (!story) return null;
    const isGame = story.media_type === "GAME";
    return React.createElement(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        onClick: onClose,
      },
      React.createElement("div", { className: "absolute inset-0 bg-stone-900/45 backdrop-blur-[3px]", style: { animation: "epiFade .25s ease" } }),
      React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "relative w-full max-w-[560px] overflow-hidden rounded-3xl bg-stone-50 shadow-2xl ring-1 ring-stone-900/10",
          style: { animation: "epiPop .3s cubic-bezier(.2,.8,.2,1)" },
        },
        // header strip
        React.createElement(
          "div",
          { className: "flex items-center gap-3 border-b border-stone-200 bg-white px-6 py-4" },
          React.createElement(
            "span",
            { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700" },
            React.createElement(I.History, { size: 18 })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("p", { className: "font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber-700" }, "Previously On"),
            React.createElement("p", { className: "font-serif text-[19px] leading-tight text-stone-800" }, story.title)
          ),
          React.createElement(
            "button",
            { onClick: onClose, className: "ml-auto rounded-full px-2 py-1 font-mono text-[12px] text-stone-400 transition hover:bg-stone-100 hover:text-stone-700" },
            "esc"
          )
        ),
        React.createElement(
          "div",
          { className: "max-h-[64vh] overflow-y-auto px-6 py-5" },
          React.createElement("p", { className: "text-[13px] leading-relaxed text-stone-500" },
            "You stepped away ", React.createElement("strong", { className: "font-semibold text-stone-700" }, story.meta.find((m) => /last|opened/i.test(m.label))?.value || "a while ago"),
            ". Here's where you left off — re-onboard before you dive back in."),
          // checkpoint recap
          React.createElement(
            "div",
            { className: "mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4" },
            React.createElement("p", { className: "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800" },
              React.createElement(I.Compass, { size: 13 }), isGame ? "Where you were" : "Current chapter"),
            React.createElement("p", { className: "font-serif text-[15px] italic leading-relaxed text-stone-700" }, isGame ? checkpoint : story.currentChapter)
          ),
          // keymap recap for games
          isGame &&
            React.createElement(
              "div",
              { className: "mt-4" },
              React.createElement("p", { className: "mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400" },
                React.createElement(I.Keyboard, { size: 13 }), "Keys you'll have forgotten"),
              React.createElement(
                "div",
                { className: "grid grid-cols-2 gap-1.5" },
                story.keymap.slice(0, 6).map((k, i) =>
                  React.createElement(
                    "div",
                    { key: i, className: "flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5" },
                    React.createElement("span", { className: "truncate text-[12px] text-stone-500" }, k.action),
                    React.createElement("kbd", { className: "shrink-0 rounded border border-stone-300 bg-stone-50 px-1.5 py-0.5 font-mono text-[10.5px] text-stone-600" }, k.key)
                  )
                )
              )
            ),
          isGame &&
            React.createElement(
              "p",
              { className: "mt-4 flex items-center gap-1.5 text-[12px] text-stone-400" },
              React.createElement(I.List, { size: 13 }),
              story.todos.filter((t) => !t.done).length + " open threads waiting in the sidebar"
            )
        ),
        React.createElement(
          "div",
          { className: "border-t border-stone-200 bg-white px-6 py-3.5" },
          React.createElement(
            "button",
            { onClick: onClose, className: "flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 py-2.5 text-[13.5px] font-semibold text-stone-50 transition hover:bg-stone-900" },
            React.createElement(I.Play, { size: 15 }), "Resume — I'm caught up"
          )
        )
      )
    );
  }

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const initialId = (() => {
      const q = new URLSearchParams(location.search).get("id");
      return STORIES.some((s) => s.id === q) ? q : STORIES[0].id;
    })();
    const [activeId, setActiveId] = useState(initialId);
    const [statuses, setStatuses] = useState(() => Object.fromEntries(STORIES.map((s) => [s.id, s.status])));
    const [checkpoints, setCheckpoints] = useState(() => Object.fromEntries(STORIES.map((s) => [s.id, s.checkpoint || ""])));
    const [recap, setRecap] = useState(null);
    const [seenRecap, setSeenRecap] = useState(false);

    const story = STORIES.find((s) => s.id === activeId);
    const ledger = LEDGERS[story.ledger];

    // apply tweak-driven theme to the document
    useEffect(() => {
      const r = document.documentElement.style;
      r.setProperty("--epi-headline", HEADLINES[t.headline] || HEADLINES["Playfair Display"]);
      r.setProperty("--epi-paper", PAPERS[t.paper] || PAPERS.Warm);
      document.body.classList.toggle("epi-no-grain", !t.grain);
    }, [t.headline, t.paper, t.grain]);

    // auto-fire "Previously On" once for the dormant game
    useEffect(() => {
      if (t.autoRecap && !seenRecap && story.media_type === "GAME") {
        const t = setTimeout(() => { setRecap(story); setSeenRecap(true); }, 650);
        return () => clearTimeout(t);
      }
    }, []);

    useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") setRecap(null); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Header, {
        story, stories: STORIES, activeId,
        onPick: setActiveId,
        onRecap: () => setRecap(story),
      }),
      React.createElement(
        "div",
        { className: "mx-auto max-w-[1240px] px-5 py-9 sm:px-8" },
        React.createElement(
          "div",
          { className: "grid grid-cols-12 gap-7 lg:gap-10" },
          React.createElement(Sidebar, {
            story,
            status: statuses[activeId],
            onStatus: (v) => setStatuses((m) => ({ ...m, [activeId]: v })),
            checkpoint: checkpoints[activeId],
            onCheckpoint: (v) => setCheckpoints((m) => ({ ...m, [activeId]: v })),
          }),
          React.createElement(Ledger, { data: ledger, measure: t.measure })
        )
      ),
      React.createElement(
        TweaksPanel,
        null,
        React.createElement(TweakSection, { label: "Typography" }),
        React.createElement(TweakSelect, { label: "Headline", value: t.headline, options: Object.keys(HEADLINES), onChange: (v) => setTweak("headline", v) }),
        React.createElement(TweakSlider, { label: "Reading width", value: t.measure, min: 560, max: 820, step: 20, unit: "px", onChange: (v) => setTweak("measure", v) }),
        React.createElement(TweakSection, { label: "Surface" }),
        React.createElement(TweakRadio, { label: "Paper", value: t.paper, options: Object.keys(PAPERS), onChange: (v) => setTweak("paper", v) }),
        React.createElement(TweakToggle, { label: "Paper grain", value: t.grain, onChange: (v) => setTweak("grain", v) }),
        React.createElement(TweakSection, { label: "Behavior" }),
        React.createElement(TweakToggle, { label: "Auto 'Previously On'", value: t.autoRecap, onChange: (v) => setTweak("autoRecap", v) })
      ),
      React.createElement(PreviouslyOn, {
        story: recap,
        checkpoint: recap ? checkpoints[recap.id] : "",
        onClose: () => setRecap(null),
      })
    );
  }

  window.EpiApp = App;
})();
