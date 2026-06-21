/* Epilogue — Right main stage: the Ledger (8-col, scrollable long-form). */
(function () {
  const React = window.React;
  const I = window.EpiIcons;

  function Block(b, i) {
    switch (b.type) {
      case "h2":
        return React.createElement(
          "div",
          { key: i, className: "mt-12 mb-4 flex items-baseline gap-3" },
          React.createElement("h2", { className: "font-serif text-[27px] leading-tight text-stone-800" }, b.text),
          b.note &&
            React.createElement("span", { className: "font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400" }, b.note)
        );
      case "p":
        return React.createElement(
          "p",
          { key: i, className: "mt-4 text-[16.5px] leading-[1.75] text-stone-600", style: { textWrap: "pretty" } },
          b.text
        );
      case "quote":
        return React.createElement(
          "figure",
          { key: i, className: "my-8 border-l-[3px] border-amber-600 bg-gradient-to-r from-amber-50/70 to-transparent py-3 pl-6 pr-4" },
          React.createElement(
            "blockquote",
            { className: "font-serif text-[22px] leading-[1.5] italic text-stone-700", style: { textWrap: "balance" } },
            "“" + b.text + "”"
          ),
          React.createElement(
            "figcaption",
            { className: "mt-3 text-right font-mono text-[12px] uppercase tracking-[0.1em] text-amber-800/80" },
            "— " + b.reference
          )
        );
      case "callout":
        const Ico = I[ b.icon === "compass" ? "Compass" : "Link" ];
        return React.createElement(
          "div",
          { key: i, className: "my-7 flex gap-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 p-4" },
          React.createElement(
            "span",
            { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700" },
            React.createElement(Ico, { size: 17 })
          ),
          React.createElement(
            "div",
            null,
            React.createElement("p", { className: "text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-500" }, b.title),
            React.createElement("p", { className: "mt-1 text-[14.5px] leading-relaxed text-stone-600" }, b.text)
          )
        );
      case "embed":
        return React.createElement(
          "div",
          { key: i, className: "my-7 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm" },
          React.createElement(
            "div",
            { className: "relative flex aspect-video items-center justify-center bg-stone-900" },
            React.createElement("div", { className: "absolute inset-0 opacity-30", style: { backgroundImage: "repeating-linear-gradient(135deg,#fff1,#fff1 1px,transparent 1px,transparent 9px)" } }),
            React.createElement(
              "span",
              { className: "relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg" },
              React.createElement(I.Youtube, { size: 26 })
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center justify-between gap-3 px-4 py-3" },
            React.createElement(
              "div",
              null,
              React.createElement("p", { className: "text-[14px] font-medium text-stone-700" }, b.title),
              React.createElement("p", { className: "font-mono text-[11px] text-stone-400" }, b.platform + " · " + b.channel)
            ),
            React.createElement("span", { className: "font-mono text-[11px] text-stone-400" }, b.duration)
          )
        );
      default:
        return null;
    }
  }

  function Ledger({ data, measure }) {
    return React.createElement(
      "main",
      { className: "col-span-12 lg:col-span-8" },
      React.createElement(
        "article",
        { className: "mx-auto", style: { maxWidth: (measure || 680) + "px" } },
        React.createElement("p", { className: "font-mono text-[11.5px] uppercase tracking-[0.2em] text-amber-700/90" }, data.kicker),
        React.createElement("h1", { className: "mt-3 font-serif text-[clamp(38px,5vw,56px)] font-medium leading-[1.04] text-stone-800", style: { textWrap: "balance" } }, data.title),
        React.createElement("p", { className: "mt-5 font-serif text-[20px] italic leading-[1.5] text-stone-500", style: { textWrap: "pretty" } }, data.standfirst),
        React.createElement(
          "div",
          { className: "mt-5 flex items-center gap-2 border-y border-stone-200 py-3 font-mono text-[11.5px] uppercase tracking-[0.1em] text-stone-400" },
          React.createElement(I.Clock, { size: 13 }),
          data.byline
        ),
        React.createElement("div", { className: "pb-8" }, data.blocks.map(Block))
      )
    );
  }

  window.EpiLedger = Ledger;
})();
