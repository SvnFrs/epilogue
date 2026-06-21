/* Epilogue — minimal lucide-style stroke icons. Each is a React component
   that takes {size, className, strokeWidth}. */
(function () {
  const React = window.React;
  const S = (children) => (p = {}) =>
    React.createElement(
      "svg",
      {
        width: p.size || 18,
        height: p.size || 18,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: p.strokeWidth || 1.75,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: p.className || "",
        "aria-hidden": "true",
      },
      children.map((d, i) =>
        typeof d === "string"
          ? React.createElement("path", { key: i, d })
          : React.createElement(d.tag, { key: i, ...d.attrs })
      )
    );

  const Icons = {
    Gamepad: S(["M6 12h4", "M8 10v4", "M15 11h.01", "M18 13h.01",
      { tag: "rect", attrs: { x: 2, y: 6, width: 20, height: 12, rx: 4 } }]),
    Book: S(["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]),
    Code: S(["m16 18 6-6-6-6", "m8 6-6 6 6 6"]),
    Compass: S([{ tag: "circle", attrs: { cx: 12, cy: 12, r: 10 } }, "m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"]),
    Link: S(["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
      "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]),
    Pencil: S(["M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z", "m15 5 4 4"]),
    Search: S([{ tag: "circle", attrs: { cx: 11, cy: 11, r: 8 } }, "m21 21-4.3-4.3"]),
    Chevron: S(["m6 9 6 6 6-6"]),
    Clock: S([{ tag: "circle", attrs: { cx: 12, cy: 12, r: 10 } }, "M12 6v6l4 2"]),
    Play: S(["M6 3v18", { tag: "polygon", attrs: { points: "10 5 19 12 10 19 10 5" } }]),
    History: S(["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5", "M12 7v5l4 2"]),
    Check: S(["M20 6 9 17l-5-5"]),
    Keyboard: S([{ tag: "rect", attrs: { x: 2, y: 4, width: 20, height: 16, rx: 2 } }, "M6 8h.01", "M10 8h.01", "M14 8h.01", "M18 8h.01", "M8 12h.01", "M12 12h.01", "M16 12h.01", "M7 16h10"]),
    List: S(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]),
    Sparkle: S(["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"]),
    Quote: S(["M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z", "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H6a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z"]),
    Bookmark: S(["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"]),
    Youtube: S(["M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17", { tag: "polygon", attrs: { points: "10 15 15 12 10 9" } }]),
    Dot: S([{ tag: "circle", attrs: { cx: 12, cy: 12, r: 4 } }]),
    Globe: S([{ tag: "circle", attrs: { cx: 12, cy: 12, r: 10 } }, "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", "M2 12h20"]),
    Film: S([{ tag: "rect", attrs: { x: 2, y: 3, width: 20, height: 18, rx: 2 } }, "M7 3v18", "M17 3v18", "M2 9h5", "M17 9h5", "M2 15h5", "M17 15h5"]),
    Tv: S([{ tag: "rect", attrs: { x: 2, y: 7, width: 20, height: 13, rx: 2 } }, "m17 2-5 5-5-5"]),
    ArrowLeft: S(["m12 19-7-7 7-7", "M19 12H5"]),
    ArrowRight: S(["M5 12h14", "m12 5 7 7-7 7"]),
    Plus: S(["M5 12h14", "M12 5v14"]),
    Grid: S([{ tag: "rect", attrs: { x: 3, y: 3, width: 7, height: 7, rx: 1 } }, { tag: "rect", attrs: { x: 14, y: 3, width: 7, height: 7, rx: 1 } }, { tag: "rect", attrs: { x: 14, y: 14, width: 7, height: 7, rx: 1 } }, { tag: "rect", attrs: { x: 3, y: 14, width: 7, height: 7, rx: 1 } }]),
    Star: S([{ tag: "polygon", attrs: { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" } }]),
  };

  // map media_type -> icon
  Icons.forType = function (t) {
    return t === "GAME" ? Icons.Gamepad
      : t === "ANIME" || t === "MOVIE" || t === "SERIES" ? Icons.Film
      : t === "BOOK" || t === "MANGA" ? Icons.Book
      : Icons.Code;
  };

  window.EpiIcons = Icons;
})();
