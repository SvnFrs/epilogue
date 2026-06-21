/* Epilogue — Left sidebar: the Volatile Context Block (sticky, 4-col).
   Polymorphic by media_type. */
(function () {
  const React = window.React;
  const { useState } = React;
  const I = window.EpiIcons;

  const STATUS = {
    PLAYING: { label: "Playing", dot: "#16a34a" },
    PAUSED: { label: "Paused", dot: "#d97706" },
    COMPLETED: { label: "Completed", dot: "#57534e" },
    READING: { label: "Reading", dot: "#16a34a" },
    ACTIVE: { label: "Digesting", dot: "#0891b2" },
  };

  function StatusBadge({ status, onChange }) {
    const [open, setOpen] = useState(false);
    const s = STATUS[status] || STATUS.PAUSED;
    const opts = ["PLAYING", "PAUSED", "COMPLETED", "READING", "ACTIVE"];
    return React.createElement(
      "div",
      { className: "relative" },
      React.createElement(
        "button",
        {
          onClick: () => setOpen((o) => !o),
          className:
            "group flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-3 py-1.5 text-[12px] font-medium tracking-wide text-stone-700 shadow-sm ring-1 ring-stone-900/10 transition hover:bg-white",
        },
        React.createElement("span", {
          className: "h-2 w-2 rounded-full",
          style: { background: s.dot, boxShadow: `0 0 0 3px ${s.dot}22` },
        }),
        s.label,
        React.createElement(I.Chevron, { size: 13, className: "text-stone-400 transition group-hover:text-stone-600" })
      ),
      open &&
        React.createElement(
          "div",
          { className: "absolute z-30 mt-1 w-40 overflow-hidden rounded-xl bg-white p-1 shadow-xl ring-1 ring-stone-900/10" },
          opts.map((o) =>
            React.createElement(
              "button",
              {
                key: o,
                onClick: () => { onChange(o); setOpen(false); },
                className:
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-stone-600 transition hover:bg-stone-100",
              },
              React.createElement("span", { className: "h-2 w-2 rounded-full", style: { background: STATUS[o].dot } }),
              STATUS[o].label
            )
          )
        )
    );
  }

  function CoverArt({ story, status, onStatus }) {
    const TypeIcon = I.forType(story.media_type);
    return React.createElement(
      "div",
      { className: "epi-cover relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(41,37,36,0.55)] ring-1 ring-stone-900/10" },
      React.createElement("image-slot", {
        id: story.coverSlotId,
        src: story.cover,
        shape: "rect",
        fit: "cover",
        placeholder: "Drop cover art",
      }),
      // gradient + overlay text
      React.createElement("div", {
        className: "pointer-events-none absolute inset-0",
        style: { background: "linear-gradient(180deg, rgba(20,16,14,.55) 0%, rgba(20,16,14,0) 32%, rgba(20,16,14,0) 52%, rgba(20,16,14,.82) 100%)" },
      }),
      React.createElement(
        "div",
        { className: "absolute left-3 right-3 top-3 flex items-start justify-between gap-2" },
        React.createElement(
          "span",
          { className: "flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm" },
          React.createElement(TypeIcon, { size: 12 }),
          story.media_type.replace("_", " ")
        ),
        React.createElement(StatusBadge, { status, onChange: onStatus })
      ),
      React.createElement(
        "div",
        { className: "absolute inset-x-0 bottom-0 p-4" },
        React.createElement("h1", { className: "font-serif text-[26px] leading-[1.08] text-white", style: { textWrap: "balance" } }, story.title),
        React.createElement("p", { className: "mt-1 font-serif text-[14px] italic text-amber-100/85" }, story.subtitle)
      )
    );
  }

  function MetaList({ items }) {
    return React.createElement(
      "dl",
      { className: "grid grid-cols-2 gap-x-3 gap-y-3.5" },
      items.map((m, i) =>
        React.createElement(
          "div",
          { key: i },
          React.createElement("dt", { className: "text-[10.5px] font-medium uppercase tracking-[0.12em] text-stone-400" }, m.label),
          React.createElement("dd", { className: "mt-0.5 text-[13.5px] font-medium text-stone-700" }, m.value)
        )
      )
    );
  }

  function SectionLabel({ icon, children, accent }) {
    const Ico = icon;
    return React.createElement(
      "div",
      { className: "mb-2.5 flex items-center gap-2" },
      React.createElement(Ico, { size: 14, className: accent ? "text-amber-700" : "text-stone-400" }),
      React.createElement("span", { className: `whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] ${accent ? "text-amber-800" : "text-stone-400"}` }, children)
    );
  }

  /* ── GAME volatile block ── */
  function GameContext({ story, checkpoint, onCheckpoint }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(checkpoint);
    return React.createElement(
      React.Fragment,
      null,
      // Current checkpoint — amber note
      React.createElement(
        "div",
        { className: "rounded-2xl border border-amber-200/80 bg-amber-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" },
        React.createElement(
          "div",
          { className: "mb-2 flex items-center justify-between" },
          React.createElement(SectionLabel, { icon: I.Compass, accent: true }, "Current Checkpoint"),
          React.createElement(
            "button",
            {
              onClick: () => { setDraft(checkpoint); setEditing((e) => !e); },
              className: "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-amber-700/80 transition hover:bg-amber-100 hover:text-amber-900",
            },
            React.createElement(I.Pencil, { size: 12 }),
            editing ? "done" : "edit"
          )
        ),
        editing
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement("textarea", {
                value: draft,
                onChange: (e) => setDraft(e.target.value),
                rows: 7,
                className: "w-full resize-none rounded-lg border border-amber-300 bg-white/70 p-2.5 font-serif text-[14px] italic leading-relaxed text-stone-700 outline-none focus:ring-2 focus:ring-amber-300",
              }),
              React.createElement(
                "button",
                { onClick: () => { onCheckpoint(draft); setEditing(false); }, className: "mt-2 rounded-lg bg-amber-700 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-amber-800" },
                "Save state"
              )
            )
          : React.createElement("p", { className: "font-serif text-[14.5px] italic leading-relaxed text-stone-700" }, checkpoint)
      ),
      // To-do
      React.createElement(
        "div",
        { className: "mt-5" },
        React.createElement(SectionLabel, { icon: I.List }, "Open Threads"),
        React.createElement(
          "ul",
          { className: "flex flex-col gap-2.5" },
          story.todos.map((t, i) =>
            React.createElement(
              "li",
              { key: i, className: "flex items-start gap-2.5 text-[13.5px]" },
              React.createElement(
                "span",
                { className: `mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[5px] border ${t.done ? "border-amber-600 bg-amber-600 text-white" : "border-stone-300 bg-white"}` },
                t.done && React.createElement(I.Check, { size: 10, strokeWidth: 3 })
              ),
              React.createElement("span", { className: t.done ? "flex-1 leading-relaxed text-stone-400 line-through" : "flex-1 leading-relaxed text-stone-600" }, t.text)
            )
          )
        )
      ),
      // Keymap
      React.createElement(
        "div",
        { className: "mt-5" },
        React.createElement(SectionLabel, { icon: I.Keyboard }, "Keymap Reference"),
        React.createElement(
          "div",
          { className: "overflow-hidden rounded-xl border border-stone-200/90 bg-stone-50/60" },
          story.keymap.map((k, i) =>
            React.createElement(
              "div",
              { key: i, className: `flex items-center justify-between gap-3 px-3 py-2 ${i ? "border-t border-stone-200/70" : ""}` },
              React.createElement("span", { className: "min-w-0 flex-1 text-[13px] leading-snug text-stone-600" }, k.action),
              React.createElement("kbd", { className: "shrink-0 rounded-md border border-stone-300/80 bg-white px-2 py-0.5 font-mono text-[11.5px] font-medium text-stone-700 shadow-[0_1px_0_rgba(0,0,0,0.06)]" }, k.key)
            )
          )
        )
      )
    );
  }

  /* ── BOOK volatile block ── */
  function BookContext({ story }) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "rounded-2xl border border-amber-200/80 bg-amber-50 p-4" },
        React.createElement(SectionLabel, { icon: I.Bookmark, accent: true }, "Current Chapter"),
        React.createElement("p", { className: "font-serif text-[14.5px] italic leading-relaxed text-stone-700" }, story.currentChapter)
      ),
      React.createElement(
        "div",
        { className: "mt-5" },
        React.createElement(SectionLabel, { icon: I.Quote }, "Bookmarked Verses"),
        React.createElement(
          "div",
          { className: "space-y-3" },
          story.quotes.map((q, i) =>
            React.createElement(
              "figure",
              { key: i, className: "border-l-2 border-amber-600/70 pl-3" },
              React.createElement("blockquote", { className: "font-serif text-[13.5px] italic leading-relaxed text-stone-600" }, "“" + q.text + "”"),
              React.createElement("figcaption", { className: "mt-1 text-right font-mono text-[10.5px] uppercase tracking-wide text-stone-400" }, q.reference)
            )
          )
        )
      )
    );
  }

  /* ── TECH LOG volatile block ── */
  function TechContext({ story }) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "rounded-2xl border border-stone-200 bg-white p-4" },
        React.createElement(SectionLabel, { icon: I.Globe }, "Embedded Sources"),
        React.createElement(
          "ul",
          { className: "space-y-2" },
          story.sources.map((s, i) =>
            React.createElement(
              "li",
              { key: i },
              React.createElement(
                "a",
                { href: "#", className: "group flex items-start gap-2.5 rounded-lg px-1 py-0.5 transition hover:bg-stone-50" },
                React.createElement(s.kind === "video" ? I.Youtube : s.kind === "book" ? I.Book : I.Link, { size: 15, className: "mt-0.5 shrink-0 text-stone-400 group-hover:text-amber-700" }),
                React.createElement(
                  "span",
                  null,
                  React.createElement("span", { className: "block text-[13px] leading-snug text-stone-600 group-hover:text-stone-800" }, s.label),
                  React.createElement("span", { className: "font-mono text-[10.5px] text-stone-400" }, s.host)
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "mt-5" },
        React.createElement(SectionLabel, { icon: I.Link, accent: true }, "Bi-directional Links"),
        React.createElement(
          "div",
          { className: "flex flex-wrap gap-1.5" },
          story.backlinks.map((b, i) =>
            React.createElement(
              "a",
              { key: i, href: "#", className: "rounded-full border border-amber-200 bg-amber-50/60 px-2.5 py-1 text-[12px] text-amber-800 transition hover:bg-amber-100" },
              b
            )
          )
        )
      )
    );
  }

  function Sidebar({ story, status, onStatus, checkpoint, onCheckpoint }) {
    let block;
    if (story.media_type === "GAME") block = React.createElement(GameContext, { story, checkpoint, onCheckpoint });
    else if (story.media_type === "BOOK" || story.media_type === "MANGA") block = React.createElement(BookContext, { story });
    else block = React.createElement(TechContext, { story });

    return React.createElement(
      "aside",
      { className: "col-span-12 lg:col-span-4" },
      React.createElement(
        "div",
        { className: "lg:sticky lg:top-[88px] space-y-5" },
        React.createElement(CoverArt, { story, status, onStatus }),
        React.createElement(
          "div",
          { className: "rounded-2xl border border-stone-200/90 bg-white/70 p-4 shadow-sm backdrop-blur" },
          React.createElement(MetaList, { items: story.meta })
        ),
        block
      )
    );
  }

  window.EpiSidebar = Sidebar;
})();
