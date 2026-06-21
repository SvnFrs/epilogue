/* Epilogue — Home Grid (Letterboxd-style bento catalog). */
(function () {
  const React = window.React;
  const { useState, useMemo } = React;
  const I = window.EpiIcons;
  const { LIBRARY } = window.EPILOGUE_LIBRARY;

  const STATUS = {
    PLAYING: { label: "Playing", dot: "#15803d", chip: "bg-green-50 text-green-800 border-green-200" },
    READING: { label: "Reading", dot: "#15803d", chip: "bg-green-50 text-green-800 border-green-200" },
    PAUSED: { label: "Paused", dot: "#d97706", chip: "bg-amber-50 text-amber-800 border-amber-200" },
    COMPLETED: { label: "Completed", dot: "#9a3412", chip: "bg-orange-50 text-orange-800 border-orange-200" },
  };
  // terracotta for in-progress play, amber paused, sage completed — per brief intent,
  // tuned to the warm palette.
  const BADGE = {
    PLAYING: { label: "Playing", bg: "rgba(180,83,9,.92)", ink: "#fff7ed" },      // terracotta/amber
    READING: { label: "Reading", bg: "rgba(180,83,9,.92)", ink: "#fff7ed" },
    PAUSED: { label: "Paused", bg: "rgba(217,119,6,.92)", ink: "#fffbeb" },        // amber
    COMPLETED: { label: "Completed", bg: "rgba(22,101,52,.92)", ink: "#f0fdf4" },  // sage green
  };

  /* ── painted cover motifs (pure SVG/CSS, no external images) ── */
  function Motif({ kind, ink }) {
    const stroke = { stroke: ink, strokeWidth: 1.4, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.85 };
    const common = { className: "absolute inset-0 h-full w-full", viewBox: "0 0 100 130", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" };
    switch (kind) {
      case "ridge":
        return React.createElement("svg", common,
          React.createElement("path", { d: "M0 96 L20 78 L34 88 L52 64 L70 84 L86 72 L100 86 L100 130 L0 130 Z", fill: ink, opacity: 0.14 }),
          React.createElement("path", { d: "M0 104 L18 92 L40 100 L60 82 L78 96 L100 88", ...stroke, opacity: 0.5 }),
          React.createElement("circle", { cx: 74, cy: 30, r: 9, fill: ink, opacity: 0.55 }));
      case "sun":
        return React.createElement("svg", common,
          React.createElement("circle", { cx: 78, cy: 24, r: 13, fill: ink, opacity: 0.55 }),
          React.createElement("path", { d: "M0 110 L26 96 L50 106 L74 94 L100 104", ...stroke, opacity: 0.55 }),
          React.createElement("path", { d: "M0 122 L30 112 L56 120 L100 110", ...stroke, opacity: 0.35 }));
      case "eva":
        return React.createElement("svg", common,
          React.createElement("path", { d: "M50 18 L78 104 L50 88 L22 104 Z", fill: ink, opacity: 0.16 }),
          React.createElement("path", { d: "M50 26 L72 100 M50 26 L28 100 M34 84 L66 84", ...stroke, opacity: 0.6 }),
          React.createElement("circle", { cx: 50, cy: 62, r: 5, fill: ink, opacity: 0.7 }));
      case "biohazard":
        return React.createElement("svg", common,
          React.createElement("circle", { cx: 50, cy: 58, r: 10, ...stroke, opacity: 0.7 }),
          [0, 120, 240].map((a, i) =>
            React.createElement("path", { key: i, d: "M50 58 m0 -26 a26 26 0 0 1 22 13", ...stroke, opacity: 0.55, transform: `rotate(${a} 50 58)` })));
      case "code":
        return React.createElement("svg", common,
          React.createElement("path", { d: "M34 44 L20 60 L34 76 M66 44 L80 60 L66 76 M56 38 L44 82", ...stroke, opacity: 0.75 }));
      case "verse":
        return React.createElement("svg", common,
          React.createElement("path", { d: "M40 30 L40 92 M60 30 L60 92 M40 38 L60 38", ...stroke, opacity: 0.6 }),
          React.createElement("path", { d: "M30 100 L70 100", ...stroke, opacity: 0.4 }));
      case "ring":
        return React.createElement("svg", common,
          React.createElement("circle", { cx: 50, cy: 56, r: 22, ...stroke, opacity: 0.7 }),
          React.createElement("circle", { cx: 50, cy: 56, r: 13, ...stroke, opacity: 0.4 }));
      case "snow":
        return React.createElement("svg", common,
          [[30, 40], [68, 30], [50, 66], [24, 88], [76, 84]].map((p, i) =>
            React.createElement("g", { key: i, transform: `translate(${p[0]} ${p[1]})` },
              React.createElement("path", { d: "M0 -7 L0 7 M-6 -3.5 L6 3.5 M6 -3.5 L-6 3.5", ...stroke, opacity: 0.6 }))));
      case "terminal":
        return React.createElement("svg", common,
          React.createElement("path", { d: "M28 50 L40 60 L28 70 M46 70 L64 70", ...stroke, opacity: 0.8 }));
      default:
        return null;
    }
  }

  function Badge({ status }) {
    const b = BADGE[status] || BADGE.PAUSED;
    return React.createElement(
      "span",
      {
        className: "absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm",
        style: { background: b.bg, color: b.ink, boxShadow: "0 2px 8px rgba(20,16,14,.25)" },
      },
      b.label
    );
  }

  function Card({ item }) {
    const TypeIcon = I.forType(item.type);
    const c = item.cover;
    const tall = item.span === "tall";
    const go = () => {
      // functional click: deep-link into the detail page if the entry exists there
      const known = ["rdr2", "karamazov", "vimlog"];
      console.log("[Epilogue] open entry →", item.id, item.title);
      if (known.includes(item.id)) location.href = "Epilogue.html?id=" + item.id;
    };
    return React.createElement(
      "button",
      {
        onClick: go,
        className:
          "group block w-full break-inside-avoid overflow-hidden rounded-3xl border border-stone-200 bg-white text-left transition duration-300 ease-out hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_22px_50px_-24px_rgba(41,37,36,0.45)]",
      },
      // cover
      React.createElement(
        "div",
        {
          className: "relative overflow-hidden",
          style: { aspectRatio: tall ? "3 / 4" : "4 / 3", background: c.bg },
        },
        React.createElement("div", { className: "pointer-events-none absolute inset-0", style: { background: c.glow } }),
        React.createElement(Motif, { kind: c.motif, ink: c.ink }),
        // grain
        React.createElement("div", {
          className: "pointer-events-none absolute inset-0 opacity-[0.06]",
          style: { backgroundImage: "repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 6px)" },
        }),
        React.createElement(Badge, { status: item.status }),
        // bottom scrim + title-on-art for tall cards (editorial feel)
        React.createElement("div", {
          className: "pointer-events-none absolute inset-x-0 bottom-0 h-1/2",
          style: { background: "linear-gradient(180deg, transparent, rgba(20,16,14,.55))" },
        }),
        React.createElement(
          "div",
          { className: "absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3.5" },
          React.createElement(TypeIcon, { size: 13, className: "shrink-0", style: { color: c.ink } }),
          React.createElement("span", { className: "text-[10.5px] font-semibold uppercase tracking-[0.16em]", style: { color: c.ink, opacity: 0.85 } }, item.type.replace("_", " "))
        ),
        // hover glow ring
        React.createElement("div", { className: "pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-inset ring-white/20 transition group-hover:opacity-100" })
      ),
      // meta
      React.createElement(
        "div",
        { className: "px-4 pb-4 pt-3.5" },
        React.createElement("h3", { className: "font-serif text-[18px] leading-[1.18] text-stone-800 transition group-hover:text-amber-900", style: { textWrap: "balance" } }, item.title),
        React.createElement(
          "div",
          { className: "mt-2 flex items-center justify-between gap-2" },
          React.createElement("span", { className: "font-mono text-[11px] uppercase tracking-[0.1em] text-stone-400" }, item.meta),
          React.createElement("span", { className: "font-mono text-[11px] text-stone-300" }, item.year)
        )
      )
    );
  }

  function Avatar() {
    return React.createElement(
      "button",
      { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-800 font-serif text-[15px] italic text-amber-50 ring-1 ring-stone-900/10 transition hover:bg-stone-900", title: "Your shelf" },
      "a"
    );
  }

  function Header({ query, onQuery }) {
    return React.createElement(
      "header",
      { className: "sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-md" },
      React.createElement(
        "div",
        { className: "mx-auto flex max-w-[1240px] items-center gap-4 px-5 py-3.5 sm:px-8" },
        React.createElement(
          "a",
          { href: "#", className: "flex shrink-0 items-baseline gap-0.5" },
          React.createElement("span", { className: "font-serif text-[24px] tracking-tight text-stone-800" }, "Epilogue"),
          React.createElement("span", { className: "font-serif text-[24px] text-amber-600" }, ".")
        ),
        React.createElement("span", { className: "ml-1 hidden font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400 lg:inline" }, "digital legacy museum"),
        React.createElement("div", { className: "flex-1" }),
        // search
        React.createElement(
          "div",
          { className: "relative hidden items-center sm:flex" },
          React.createElement(I.Search, { size: 15, className: "pointer-events-none absolute left-3 text-stone-400" }),
          React.createElement("input", {
            value: query,
            onChange: (e) => onQuery(e.target.value),
            placeholder: "Search the shelf…",
            className: "w-44 rounded-full border border-stone-200 bg-white/70 py-2 pl-9 pr-3 text-[13px] text-stone-700 outline-none transition placeholder:text-stone-400 focus:w-60 focus:border-amber-300 focus:ring-2 focus:ring-amber-200/60",
          })
        ),
        React.createElement(Avatar, null)
      )
    );
  }

  const FILTERS = ["All", "GAME", "ANIME", "TECH_LOG", "BOOK"];

  function App() {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");

    const items = useMemo(() => {
      const q = query.trim().toLowerCase();
      return LIBRARY.filter((it) => {
        if (filter !== "All" && it.type !== filter) return false;
        if (q && !(it.title.toLowerCase().includes(q) || it.type.toLowerCase().includes(q))) return false;
        return true;
      });
    }, [query, filter]);

    const counts = useMemo(() => {
      const by = {};
      LIBRARY.forEach((it) => { by[it.status] = (by[it.status] || 0) + 1; });
      return by;
    }, []);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Header, { query, onQuery: setQuery }),
      React.createElement(
        "main",
        { className: "mx-auto max-w-[1240px] px-5 pb-20 pt-10 sm:px-8" },
        // title block
        React.createElement(
          "div",
          { className: "mb-9 flex flex-wrap items-end justify-between gap-5" },
          React.createElement(
            "div",
            null,
            React.createElement("p", { className: "font-mono text-[11.5px] uppercase tracking-[0.2em] text-amber-700/90" }, "The Library"),
            React.createElement("h1", { className: "mt-2 font-serif text-[clamp(34px,4.5vw,50px)] leading-[1.05] text-stone-800", style: { textWrap: "balance" } }, "Everything I've lived through"),
            React.createElement("p", { className: "mt-3 max-w-[44ch] text-[15px] leading-relaxed text-stone-500", style: { textWrap: "pretty" } },
              "A shelf of finished things and things I keep meaning to finish. ",
              React.createElement("span", { className: "text-stone-600" }, LIBRARY.length + " entries"),
              " · ", (counts.PAUSED || 0) + " paused.")
          ),
          // filter pills
          React.createElement(
            "div",
            { className: "flex flex-wrap items-center gap-1.5" },
            FILTERS.map((f) =>
              React.createElement(
                "button",
                {
                  key: f,
                  onClick: () => setFilter(f),
                  className: "whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-medium transition " +
                    (filter === f ? "bg-stone-800 text-stone-50 shadow-sm" : "text-stone-500 hover:bg-stone-200/60 hover:text-stone-700"),
                },
                f === "All" ? "All" : f.replace("_", " ")
              )
            )
          )
        ),
        // bento grid — CSS columns for true masonry, cards break-inside-avoid
        items.length
          ? React.createElement(
              "div",
              { className: "[column-gap:1.5rem] sm:[columns:2] lg:[columns:3]" },
              items.map((it) =>
                React.createElement("div", { key: it.id, className: "mb-6 break-inside-avoid" },
                  React.createElement(Card, { item: it }))
              )
            )
          : React.createElement(
              "div",
              { className: "flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 py-24 text-center" },
              React.createElement(I.Search, { size: 22, className: "text-stone-300" }),
              React.createElement("p", { className: "mt-3 font-serif text-[19px] italic text-stone-500" }, "Nothing on this shelf."),
              React.createElement("p", { className: "mt-1 text-[13px] text-stone-400" }, "Try a different filter or search.")
            )
      )
    );
  }

  window.EpiHome = App;
})();
