// Marginalia cover plates: what an entry wears when it has no cover art.
// Each kind has three compositions, drawn as clean geometry on a 100-unit-wide grid and given a pen line
// with rough.js (fixed seeds, so every build draws the same covers). The title is live HTML set into a
// zone each composition leaves free. Output: src/plates.ts, plus test/plates.html (a review sheet).
//
// Layers (CSS decides what shows at which size):
//   a  main gilt line          f  fine gilt line (hatching, texture; dropped on small covers)
//   s  solid gilt              sf solid fine (dots, windows; dropped on small covers)
//   fd fine dashed line        c  cloth-coloured fill (a hole punched back to the cloth)
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const rough = createRequire(import.meta.url)('roughjs/bundled/rough.cjs.js');
const gen = rough.generator();
const BASE = { roughness: 0.8, bowing: 1, strokeWidth: 1, disableMultiStroke: true, disableMultiStrokeFill: true, preserveVertices: true, curveFitting: 0.95 };

/* ── helpers ─────────────────────────────────────────────────────────────── */
let rand = 1;
const rnd = () => { rand = (rand * 16807) % 2147483647; return (rand - 1) / 2147483646; };
const f1 = (n) => { const r = Math.round(n * 10) / 10; return Object.is(r, -0) ? '0' : String(r); };
const tidy = (d) => d.replace(/-?\d*\.?\d+(e-?\d+)?/g, (m) => f1(parseFloat(m)));
const P = (pts, close = true) => 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L') + (close ? 'Z' : '');
const rect = (x1, y1, x2, y2) => `M${x1} ${y1}H${x2}V${y2}H${x1}Z`;
const rrect = (x1, y1, x2, y2, r) => `M${x1 + r} ${y1}H${x2 - r}A${r} ${r} 0 0 1 ${x2} ${y1 + r}V${y2 - r}A${r} ${r} 0 0 1 ${x2 - r} ${y2}H${x1 + r}A${r} ${r} 0 0 1 ${x1} ${y2 - r}V${y1 + r}A${r} ${r} 0 0 1 ${x1 + r} ${y1}Z`;
const sq = (x, y, s) => `M${f1(x)} ${f1(y)}h${f1(s)}v${f1(s)}h${f1(-s)}z`;
const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0z`;
const diamond = (x, y, r) => P([[x, y - r], [x + r, y], [x, y + r], [x - r, y]]);
const sparkle = (x, y, r, k = 0.16) => `M${f1(x)} ${f1(y - r)}Q${f1(x + k * r)} ${f1(y - k * r)} ${f1(x + r)} ${f1(y)}Q${f1(x + k * r)} ${f1(y + k * r)} ${f1(x)} ${f1(y + r)}Q${f1(x - k * r)} ${f1(y + k * r)} ${f1(x - r)} ${f1(y)}Q${f1(x - k * r)} ${f1(y - k * r)} ${f1(x)} ${f1(y - r)}Z`;
const heart = (x, y, s) => `M${f1(x)} ${f1(y + 0.32 * s)}C${f1(x - 0.55 * s)} ${f1(y - 0.05 * s)} ${f1(x - 0.3 * s)} ${f1(y - 0.55 * s)} ${f1(x)} ${f1(y - 0.22 * s)}C${f1(x + 0.3 * s)} ${f1(y - 0.55 * s)} ${f1(x + 0.55 * s)} ${f1(y - 0.05 * s)} ${f1(x)} ${f1(y + 0.32 * s)}Z`;
const star5 = (x, y, r, ri = 0.45) => P([...Array(10)].map((_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * ri : r; return [x + rr * Math.cos(a), y + rr * Math.sin(a)]; }));
const leaf = (x, y, ang, len, w) => {
  const c = Math.cos(ang), s = Math.sin(ang), tx = x + c * len, ty = y + s * len, mx = x + c * len * 0.5, my = y + s * len * 0.5;
  return `M${f1(x)} ${f1(y)}Q${f1(mx - s * w)} ${f1(my + c * w)} ${f1(tx)} ${f1(ty)}Q${f1(mx + s * w)} ${f1(my - c * w)} ${f1(x)} ${f1(y)}Z`;
};
const burst = (x, y, n, r1, r2, jit = 0.18) => P([...Array(n * 2)].map((_, i) => { const a = (i * Math.PI) / n - Math.PI / 2, r = (i % 2 ? r1 : r2) * (1 + (rnd() - 0.5) * jit); return [x + r * Math.cos(a), y + r * Math.sin(a)]; }));
function crescent(cx, cy, r, dx, dy, k = 0.84) {
  const x2 = cx + dx, y2 = cy + dy, r2 = r * k, d = Math.hypot(dx, dy), phi = Math.atan2(dy, dx);
  const a = (r * r - r2 * r2 + d * d) / (2 * d), beta = Math.acos(a / r), pts = [];
  for (let i = 0; i <= 24; i++) { const t = phi + beta + (i / 24) * (2 * Math.PI - 2 * beta); pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
  const at = (p) => Math.atan2(p[1] - y2, p[0] - x2), s0 = at(pts[24]), s1 = at(pts[0]);
  let span = s1 - s0; // go round the inner circle the way that passes nearest the outer centre
  const mid = (sp) => { const t = s0 + sp / 2; return Math.hypot(x2 + r2 * Math.cos(t) - cx, y2 + r2 * Math.sin(t) - cy); };
  const alt = span > 0 ? span - 2 * Math.PI : span + 2 * Math.PI;
  if (mid(alt) < mid(span)) span = alt;
  for (let i = 1; i < 16; i++) { const t = s0 + (i / 16) * span; pts.push([x2 + r2 * Math.cos(t), y2 + r2 * Math.sin(t)]); }
  return P(pts);
}
const cubic = (s, t) => { const [p0, p1, p2, p3] = s, u = 1 - t; return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]); };
const segsD = (segs) => `M${segs[0][0].join(' ')}` + segs.map((s) => `C${s[1].join(' ')} ${s[2].join(' ')} ${s[3].join(' ')}`).join('');
const pine = (x, b, h, hw) => P([[x - 0.15 * hw, b], [x - 0.15 * hw, b - 0.1 * h], [x - hw, b - 0.1 * h], [x - 0.35 * hw, b - 0.34 * h], [x - 0.7 * hw, b - 0.36 * h], [x - 0.18 * hw, b - 0.66 * h], [x - 0.4 * hw, b - 0.68 * h], [x, b - h], [x + 0.4 * hw, b - 0.68 * h], [x + 0.18 * hw, b - 0.66 * h], [x + 0.7 * hw, b - 0.36 * h], [x + 0.35 * hw, b - 0.34 * h], [x + hw, b - 0.1 * h], [x + 0.15 * hw, b - 0.1 * h], [x + 0.15 * hw, b]], false);

/* ── a plate under construction ──────────────────────────────────────────── */
function Plate(seed) {
  rand = seed * 7919 + 13;
  let n = seed * 100;
  const L = { a: [], f: [], s: [], sf: [], fd: [], c: [] }, ys = [];
  const opt = (o) => ({ ...BASE, ...o, seed: ++n });
  // the main line and solids are what's left on a thumbnail: remember their vertical extent to centre them there
  const note = (layer, d, pairs) => {
    if (layer !== 'a' && layer !== 's') return;
    if (pairs) { const nums = d.match(/-?\d*\.?\d+/g).map(Number); for (let i = 1; i < nums.length; i += 2) ys.push(nums[i]); }
    else for (const m of d.matchAll(/M\s*(-?[\d.]+)[ ,](-?[\d.]+)/g)) ys.push(+m[2]);
  };
  const take = (layer, drawable, hatchLayer = 'f') => {
    for (const p of gen.toPaths(drawable)) { const d = tidy(p.d); if (p.stroke === 'H') L[hatchLayer].push(d); else { L[layer].push(d); note(layer, d, true); } }
  };
  return {
    L,
    line: (layer, d, o = {}) => take(layer, gen.path(d, opt(o))),
    circle: (layer, x, y, r, o = {}) => take(layer, gen.circle(x, y, r * 2, opt({ roughness: r < 7 ? 0.35 : r < 16 ? 0.5 : 0.65, ...o }))),
    ellipse: (layer, x, y, rx, ry, o = {}) => take(layer, gen.ellipse(x, y, rx * 2, ry * 2, opt(o))),
    hatch: (layer, d, o = {}) => take(layer, gen.path(d, opt({ fill: 'H', stroke: 'S', fillStyle: 'hachure', hachureGap: 2.6, hachureAngle: -41, ...o }))),
    hatchCircle: (layer, x, y, r, o = {}) => take(layer, gen.circle(x, y, r * 2, opt({ fill: 'H', stroke: 'S', fillStyle: 'hachure', hachureGap: 2.6, hachureAngle: -41, roughness: r < 16 ? 0.5 : 0.65, ...o }))),
    hatchOnly: (d, o = {}) => { for (const p of gen.toPaths(gen.path(d, opt({ fill: 'H', stroke: 'S', fillStyle: 'hachure', hachureGap: 2.8, hachureAngle: -41, ...o })))) if (p.stroke === 'H') L.f.push(tidy(p.d)); },
    solid: (layer, d) => { L[layer].push(d); note(layer, d, false); },
    ys,
  };
}
const markup = (L) => ['a', 'f', 'fd', 's', 'sf', 'c'].filter((k) => L[k].length)
  .map((k) => (k === 's' || k === 'sf' || k === 'c') ? `<path class="${k}" d="${L[k].join('')}"/>` : `<g class="${k}">${L[k].map((d) => `<path d="${d}"/>`).join('')}</g>`).join('');

/* text zone: box = [top, right, bottom, left] in % of the plate (null = sized by content)
   al: c|l   va: c|t|b   f: d (Literata) | u (Lexend)   fs: title size in cqw   band: title stamped on a gilt band */
const T = (box, o = {}) => ({ box, al: 'c', va: 'c', ...o });

/* ── the compositions ────────────────────────────────────────────────────── */
const H = { portrait: 150, box: 133.3, square: 100 };
const D = {};

// BOOK — Victorian publisher's cloth: frames, cartouches, a vignette. The cloth leaves room for the hinge.
D.book = [
  ['Panel', (p) => {
    p.line('a', rect(12, 7, 93, 143)); p.line('f', rect(14.6, 9.6, 90.4, 140.4));
    for (const [x, y] of [[18, 13], [87, 13], [18, 137], [87, 137]]) p.solid('s', diamond(x, y, 2.2));
    const cart = (x1, y1, x2, y2, r) => `M${x1 + r} ${y1}H${x2 - r}A${r} ${r} 0 0 0 ${x2} ${y1 + r}V${y2 - r}A${r} ${r} 0 0 0 ${x2 - r} ${y2}H${x1 + r}A${r} ${r} 0 0 0 ${x1} ${y2 - r}V${y1 + r}A${r} ${r} 0 0 0 ${x1 + r} ${y1}Z`;
    p.line('a', cart(20, 28, 86, 86, 4.5)); p.line('f', cart(22.4, 30.4, 83.6, 83.6, 3.4));
    p.line('a', diamond(53, 110, 7.5)); p.solid('s', dot(53, 110, 1.7));
    p.line('f', 'M27 110H42M64 110H79'); p.solid('sf', dot(24.5, 110, 1) + dot(81.5, 110, 1));
    p.line('f', 'M41 127H65'); p.solid('sf', diamond(53, 127, 1.3));
    return T([20, 17, 43, 23], { f: 'd', fs: 11.5 });
  }],
  ['Bands', (p) => {
    p.line('a', 'M12 13H94M12 18.5H94'); p.line('a', 'M12 131.5H94M12 137H94');
    let ds = ''; for (let x = 16; x < 92; x += 6) ds += diamond(x, 15.75, 1) + diamond(x, 134.25, 1); p.solid('sf', ds);
    p.hatchCircle('a', 53, 94, 14, { hachureGap: 2.4 });
    p.line('a', 'M50.5 124C51 117 51 112 50 107M55.5 124C55 117 55 112 56 107');
    p.line('f', 'M50.5 124C48 125 45 125.6 41 125.6M55.5 124C58 125 61 125.6 65 125.6');
    p.line('a', 'M33 125.6H73');
    return T([16, 14, 50, 20], { f: 'd', fs: 11.5 });
  }],
  ['Arch', (p) => {
    p.line('a', 'M19 140V60C19 38 36 22 53 12C70 22 87 38 87 60V140Z');
    p.line('f', 'M22.5 136.5V61C22.5 41 38 26.5 53 16.5C68 26.5 83.5 41 83.5 61V136.5Z');
    p.solid('s', sparkle(53, 27, 4.4));
    p.line('f', 'M31 121H75'); p.solid('s', dot(45, 128, 1.3) + dot(53, 128, 1.3) + dot(61, 128, 1.3));
    return T([26, 19, 33, 25], { f: 'd', fs: 11 });
  }],
];

// STORY — the fairy-tale shelf: castles under a moon, a cottage in the pines, briars round the door.
const castle = (p, oy) => {
  const Y = (y) => y + oy;
  p.line('a', `M38 ${Y(119)}V${Y(92)}H46V${Y(119)}`); p.line('a', `M36.5 ${Y(92)}L42 ${Y(77)}L47.5 ${Y(92)}`);
  p.line('a', `M66 ${Y(119)}V${Y(94)}H74V${Y(119)}`); p.line('a', `M64.5 ${Y(94)}L70 ${Y(80)}L75.5 ${Y(94)}`);
  p.line('a', `M46 ${Y(104)}H66`); p.line('a', `M48 ${Y(104)}V${Y(85)}H58V${Y(104)}`);
  p.line('a', `M46.5 ${Y(85)}L53 ${Y(67)}L59.5 ${Y(85)}`); p.line('a', `M53 ${Y(67)}V${Y(59)}`);
  p.solid('s', `M53 ${Y(59)}L60 ${Y(61.5)}L53 ${Y(64)}Z`);
  p.line('f', `M46 ${Y(104)}V${Y(101.5)}H49V${Y(104)}M52 ${Y(104)}V${Y(101.5)}M60 ${Y(104)}V${Y(101.5)}H63V${Y(104)}`);
  p.line('a', `M50.5 ${Y(119)}V${Y(113.5)}A2.5 2.5 0 0 1 55.5 ${Y(113.5)}V${Y(119)}`);
  p.solid('sf', sq(41, Y(97), 2) + sq(69, Y(99), 2) + sq(52, Y(90), 2));
};
D.story = [
  ['Castle', (p) => {
    p.solid('s', crescent(78, 20, 8.5, -3.4, 2.4));
    p.solid('s', sparkle(24, 17, 3.4) + sparkle(44, 11, 2.4) + sparkle(61, 22, 2));
    p.solid('sf', sparkle(16, 58, 1.6) + sparkle(90, 64, 1.8) + dot(34, 26, 0.7) + dot(88, 40, 0.7) + dot(18, 38, 0.6) + dot(70, 8, 0.6));
    const hill = 'M8 150C14 136 32 128 54 128C72 128 86 132 98 142';
    p.line('a', hill); p.hatchOnly(hill + 'L98 150Z', { hachureGap: 3.2 });
    castle(p, 11);
    return T([20, 14, 56, 20], { f: 'd', fs: 11.5 });
  }],
  ['Pines', (p) => {
    p.hatchCircle('a', 76, 22, 8, { hachureGap: 2.2 });
    p.solid('s', sparkle(26, 20, 2.8) + sparkle(46, 12, 1.9)); p.solid('sf', sparkle(58, 26, 1.2) + sparkle(18, 36, 1.2) + dot(90, 40, 0.6));
    p.line('a', pine(20, 136, 44, 9)); p.line('a', pine(31, 136, 30, 7)); p.line('a', pine(86, 136, 46, 9)); p.line('a', pine(75, 136, 28, 7));
    p.line('a', 'M12 136.5H94');
    p.line('a', 'M46 136.5V126H60V136.5'); p.line('a', 'M43.5 127L53 117.5L62.5 127'); p.line('a', 'M57 121V116.5H59.5V123.5');
    p.line('f', 'M51.5 136.5V131H54.5V136.5'); p.solid('sf', sq(55.8, 128.6, 2.4));
    p.line('f', 'M58.2 114.5C56 112 60.5 110 58.5 107C56.8 104.5 61 102.5 59.5 99.5');
    p.line('fd', 'M53 137C52 140 56 142 54 147');
    return T([24, 16, 41, 22], { f: 'd', fs: 11.5 });
  }],
  ['Briar', (p) => {
    const vine = [[[17, 148], [11, 124], [23, 104], [16, 80]], [[16, 80], [11, 56], [27, 26], [53, 22]], [[53, 22], [79, 26], [95, 56], [90, 80]], [[90, 80], [83, 104], [95, 124], [89, 148]]];
    p.line('a', segsD(vine));
    let th = '', side = 1;
    for (const s of vine) for (const t of [0.18, 0.42, 0.66, 0.88]) {
      const [x, y] = cubic(s, t), [x2, y2] = cubic(s, t + 0.02), dx = x2 - x, dy = y2 - y, m = Math.hypot(dx, dy), nx = -dy / m, ny = dx / m;
      th += `M${f1(x)} ${f1(y)}L${f1(x + nx * 2.4 * side + (dx / m) * 1.4)} ${f1(y + ny * 2.4 * side + (dy / m) * 1.4)}`; side = -side;
    }
    p.line('f', th, { roughness: 0.3 });
    for (const [x, y] of [[16, 80], [90, 80], [53, 22]]) {
      p.circle('a', x, y, 4.6);
      const sp = []; for (let i = 0; i <= 18; i++) { const a = i * 0.55, r = 0.6 + i * 0.19; sp.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
      p.line('f', P(sp, false), { roughness: 0.3 });
    }
    p.line('f', leaf(20, 86, 0.9, 6, 2.2) + leaf(86, 86, 2.2, 6, 2.2) + leaf(47, 25, 2.8, 6, 2.2) + leaf(59, 25, 0.35, 6, 2.2));
    p.line('a', 'M44 133V122L48.5 127L53 118.5L57.5 127L62 122V133Z'); p.line('f', 'M44 129.5H62');
    p.solid('s', dot(44, 120.8, 1.1) + dot(53, 117.3, 1.1) + dot(62, 120.8, 1.1));
    return T([26, 18, 30, 26], { f: 'd', fs: 11 });
  }],
];

// POEM — slim volumes: a laurel, a quill in its pot, a moon over a few lines of verse. Titles sit small and high.
D.poem = [
  ['Laurel', (p) => {
    const cx = 53, cy = 108, R = 20, pt = (deg) => [cx + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180)];
    const [l0, l1, r0, r1] = [pt(100), pt(255), pt(80), pt(-75)];
    p.line('a', `M${f1(l0[0])} ${f1(l0[1])}A${R} ${R} 0 0 1 ${f1(l1[0])} ${f1(l1[1])}`);
    p.line('a', `M${f1(r0[0])} ${f1(r0[1])}A${R} ${R} 0 0 0 ${f1(r1[0])} ${f1(r1[1])}`);
    let lv = '';
    for (let d = 112; d <= 250; d += 19) { const [x, y] = pt(d), t = (d * Math.PI) / 180, g = Math.atan2(Math.cos(t), -Math.sin(t)); lv += leaf(x, y, g - 0.62, 7, 2.3) + leaf(x, y, g + 0.62, 6.4, 2.1); }
    for (let d = 68; d >= -70; d -= 19) { const [x, y] = pt(d), t = (d * Math.PI) / 180, g = Math.atan2(-Math.cos(t), Math.sin(t)); lv += leaf(x, y, g - 0.62, 6.4, 2.1) + leaf(x, y, g + 0.62, 7, 2.3); }
    p.line('a', lv, { roughness: 0.5 });
    p.line('f', 'M53 128C49 125 46 126 46.5 129C47 131.5 50.5 130 53 128C55.5 130 59 131.5 59.5 129C60 126 57 125 53 128');
    p.line('a', 'M52 128.5L48.5 136M54 128.5L57.5 136');
    return T([10, 14, 50, 20], { f: 'd', fs: 10, w: 560 });
  }],
  ['Quill', (p) => {
    p.line('a', 'M18 141V132C18 130 20.5 128.8 23 128.4V126.4H31V128.4C33.5 128.8 36 130 36 132V141Z'); p.line('f', 'M22 126.4H32');
    p.hatchOnly('M19.5 139.5V133H34.5V139.5Z', { hachureGap: 2 });
    const shaft = [[27, 127], [44, 108], [64, 84], [84, 64]];
    p.line('a', segsD([shaft]));
    const vl = [[38, 114], [38, 98], [58, 76], [84, 64]], vr = [[45, 108], [60, 100], [76, 84], [84, 64]];
    p.line('a', segsD([vl])); p.line('a', segsD([vr]));
    let b = ''; for (let t = 0.3; t < 0.92; t += 0.075) { const s = cubic(shaft, t), a = cubic(vl, Math.min(1, t + 0.05)), c = cubic(vr, Math.min(1, t + 0.05)); b += `M${f1(s[0])} ${f1(s[1])}L${f1(a[0])} ${f1(a[1])}M${f1(s[0])} ${f1(s[1])}L${f1(c[0])} ${f1(c[1])}`; }
    p.line('f', b, { roughness: 0.35 });
    return T([10, 14, 58, 20], { f: 'd', fs: 10, w: 560 });
  }],
  ['Verse', (p) => {
    p.solid('s', crescent(53, 28, 7, 2.8, -2.2)); p.solid('sf', sparkle(65, 22, 1.6) + sparkle(41, 36, 1.2));
    p.line('a', 'M37 103H48.5M57.5 103H69'); p.solid('s', diamond(53, 103, 2));
    p.line('f', 'M33 115H72M33 120H66M33 125H70M33 133H62M33 138H69', { roughness: 0.45 });
    return T([28, 14, 35, 20], { f: 'd', fs: 10.5, w: 560 });
  }],
];

// MANGA — speed lines, panels, halftone; the title stamped on a solid band like a tankōbon obi.
D.manga = [
  ['Speed', (p) => {
    const [fx, fy] = [55, 58]; let a1 = '', a2 = '';
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 2 + (rnd() - 0.5) * 0.08, r0 = 21 + rnd() * 18, r1 = 140;
      const seg = `M${f1(fx + r0 * Math.cos(t))} ${f1(fy + r0 * Math.sin(t))}L${f1(fx + r1 * Math.cos(t))} ${f1(fy + r1 * Math.sin(t))}`;
      if (i % 2) a2 += seg; else a1 += seg;
    }
    p.line('a', a1, { roughness: 0.3 }); p.line('f', a2, { roughness: 0.3 });
    p.line('a', burst(fx, fy, 9, 11, 16.5, 0.25)); p.solid('s', sparkle(fx, fy, 6.2, 0.2));
    return T([null, 0, 8, 0], { f: 'u', fs: 11.5, w: 700, band: true });
  }],
  ['Panels', (p) => {
    const yb = (x) => 48 - 0.1 * (x - 14);
    const P1 = [[14, 9], [57, 9], [54, yb(54)], [14, 48]], P2 = [[60, 9], [91, 9], [91, yb(91)], [57, yb(57)]];
    const P3 = [[14, 51], [42, yb(42) + 3], [38, 112], [14, 112]], P4 = [[45, yb(45) + 3], [91, yb(91) + 3], [91, 112], [41, 112]];
    for (const q of [P1, P2, P3, P4]) p.line('a', P(q), { roughness: 0.55 });
    let ht = ''; for (let y = 13; y < 46; y += 3.6) for (let x = 17 + ((y / 3.6) % 2) * 1.8; x < 52; x += 3.6) { const r = 1.25 * (1 - (x - 14) / 42); if (r > 0.3 && y < yb(x) - 2) ht += dot(x, y, r); }
    p.solid('sf', ht); p.solid('s', sparkle(40, 25, 5.2));
    p.ellipse('a', 75, 23.5, 10.5, 7.5); p.line('a', 'M69.5 30L66 36.5L73.5 30.8');
    p.solid('s', dot(71, 23.5, 0.9) + dot(75, 23.5, 0.9) + dot(79, 23.5, 0.9));
    p.line('a', 'M27 62L25.5 88'); p.solid('s', dot(25.2, 96, 1.9));
    p.circle('a', 75, 80, 8.5); let ml = ''; for (const y of [72, 77, 82, 87]) ml += `M${f1(48 + rnd() * 6)} ${y}H${f1(62 + rnd() * 2)}`; p.line('f', ml, { roughness: 0.3 });
    return T([null, 0, 6, 0], { f: 'u', fs: 11.5, w: 700, band: true });
  }],
  ['Halftone', (p) => {
    let big = '', small = '';
    for (let y = 2, row = 0; y < 152; y += 5, row++) for (let x = 2 + (row % 2) * 2.5; x < 102; x += 5) {
      const r = 2.3 * (1 - Math.hypot(100 - x, 150 - y) / 80); if (r < 0.5) continue;
      if (r > 1.15) big += dot(x, y, r); else small += dot(x, y, r);
    }
    p.solid('s', big); p.solid('sf', small);
    p.line('a', burst(48, 88, 8, 17, 27, 0.3)); p.line('f', burst(48, 88, 8, 11, 17, 0.25));
    p.solid('s', sparkle(48, 88, 5.6, 0.2));
    return T([7, 0, null, 0], { f: 'u', fs: 11.5, w: 700, band: true, fix: 0 });
  }],
];

// GAME — box art with a HUD: hearts and a bar along the top, the world below, the title in the corner.
const hud = (p) => { p.solid('s', heart(10, 10, 6) + heart(17.5, 10, 6)); p.line('a', heart(25, 10, 6), { roughness: 0.4 }); p.line('a', rect(62, 7.4, 91, 12.4), { roughness: 0.4 }); p.solid('s', `M63.4 8.8H82.4V11H63.4Z`); };
D.game = [
  ['Quest', (p) => {
    hud(p);
    p.line('a', 'M4 79L22 54L31 63L46 39L61 60L70 51L90 79'); p.line('a', 'M4 79H96');
    p.line('f', 'M40.5 47.5L43 50L46 47L49 50L51.5 47.5M18.5 59.5L21 61.5L24 58.5');
    p.line('a', 'M46 39V27'); p.solid('s', 'M46 27L54 29.5L46 32Z');
    p.line('fd', 'M46 40C50 48 40 53 44 61C48 69 60 69 58 78');
    p.circle('a', 80, 29, 6); p.line('f', 'M18 30q2 -2 4 0q2 -2 4 0M27 36q1.5 -1.5 3 0q1.5 -1.5 3 0');
    return T([61, 8, 5, 8], { f: 'u', fs: 11.5, w: 700, al: 'l', va: 'b' });
  }],
  ['Pixel', (p) => {
    hud(p);
    const px = 3.4; let sun = '', cloud = '', hills = '', dith = '';
    for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) if (i * i + j * j <= 13) sun += sq(72 + i * px, 31 + j * px, px - 0.6);
    ['..XXX...', '.XXXXXX.', 'XXXXXXXX'].forEach((row, j) => [...row].forEach((c, i) => { if (c === 'X') cloud += sq(10 + i * 3, 26 + j * 3, 2.4); }));
    const hs = [6, 6, 8, 10, 12, 12, 14, 14, 12, 10, 10, 8, 8, 10, 12, 14, 16, 16, 14, 12, 10, 10, 8, 6, 6, 8, 10, 10, 8, 6];
    hills = `M0 ${80 - hs[0] * 1.6}`; hs.forEach((h, i) => { hills += `H${f1(i * px)}V${f1(80 - h * 1.6)}`; }); hills += 'H100';
    p.solid('a', hills); // crisp: pixels are not drawn by hand
    hs.forEach((h, i) => { for (let r = 0; r < 4; r++) { const y = 80 - h * 1.6 + 2.4 + r * 3.4; if (y < 77.5 && (i + r) % 2 === 0) dith += sq(i * px + 1, y, 1.3); } });
    p.solid('s', sun + cloud); p.solid('sf', dith); p.line('a', 'M0 80H100', { roughness: 0.3 });
    p.solid('s', dot(30, 48, 1.9) + dot(38, 44, 1.9) + dot(46, 48, 1.9)); p.solid('c', sq(29.4, 46.8, 1.2) + sq(37.4, 42.8, 1.2) + sq(45.4, 46.8, 1.2));
    return T([61, 8, 5, 8], { f: 'u', fs: 11.5, w: 700, al: 'l', va: 'b' });
  }],
  ['Crest', (p) => {
    hud(p);
    const sh = 'M50 18C57.5 21.5 65 22.5 70.5 21.6V46C70.5 61 61 70.5 50 76C39 70.5 29.5 61 29.5 46V21.6C35 22.5 42.5 21.5 50 18Z';
    p.line('a', sh); p.line('f', 'M50 22.3C56.6 25.4 62.6 26.3 66.8 25.8V46C66.8 58.6 58.8 66.8 50 71.6C41.2 66.8 33.2 58.6 33.2 46V25.8C37.4 26.3 43.4 25.4 50 22.3Z');
    p.line('a', star5(50, 45, 9.5)); p.line('a', 'M69.5 24L78.5 14M30.5 24L21.5 14');
    p.line('a', 'M34 68L26 77M66 68L74 77'); p.line('a', 'M28.2 67.2L34.8 73.8M71.8 67.2L65.2 73.8');
    p.solid('s', dot(25, 78, 1.7) + dot(75, 78, 1.7));
    return T([61, 8, 5, 8], { f: 'u', fs: 11.5, w: 700, al: 'l', va: 'b' });
  }],
];

// MUSIC — square sleeves: a record that will not fit, a meter in the red, a sun going down on a stripe.
D.music = [
  ['Record', (p) => {
    p.circle('a', 77, 80, 42); p.circle('a', 77, 80, 27, { roughness: 0.4 }); for (const r of [36.5, 32, 22]) p.circle('f', 77, 80, r, { roughness: 0.45 });
    p.circle('a', 77, 80, 12.5); p.circle('f', 77, 80, 8.5); p.solid('s', dot(77, 80, 3)); p.solid('c', dot(77, 80, 1.3));
    p.line('f', 'M46 64A34 34 0 0 1 57 51');
    return T([8, 40, null, 8], { f: 'u', fs: 10.5, w: 650, al: 'l', va: 't' });
  }],
  ['Meter', (p) => {
    p.line('a', 'M7 90H93');
    const hs = [10, 18, 30, 16, 38, 24, 44, 32, 20, 36, 14, 8]; let caps = '';
    hs.forEach((h, i) => {
      const x = 9 + i * 7;
      if (i % 3 === 1) p.hatch('a', rect(x, 90 - h, x + 4.6, 90), { hachureGap: 1.7, roughness: 0.5 }); else p.line('a', rect(x, 90 - h, x + 4.6, 90), { roughness: 0.5 });
      caps += `M${x} ${f1(86.6 - h)}h4.6v1.3h-4.6z`;
    });
    p.solid('sf', caps);
    return T([8, 30, null, 8], { f: 'u', fs: 10.5, w: 650, al: 'l', va: 't' });
  }],
  ['Sundown', (p) => {
    p.line('a', 'M32.1 82A24 24 0 1 1 67.9 82'); p.line('a', 'M5 82H95');
    let st = ''; for (const y of [60, 67, 73, 78]) { const hw = Math.sqrt(24 * 24 - (y - 66) * (y - 66)); st += `M${f1(50 - hw + 1)} ${y}H${f1(50 + hw - 1)}`; }
    p.line('f', st, { roughness: 0.3 });
    let rays = ''; for (const deg of [196, 212, 228, 312, 328, 344]) { const t = (deg * Math.PI) / 180; rays += `M${f1(50 + 28 * Math.cos(t))} ${f1(66 + 28 * Math.sin(t))}L${f1(50 + 33 * Math.cos(t))} ${f1(66 + 33 * Math.sin(t))}`; }
    p.line('a', rays, { roughness: 0.3 });
    p.line('f', 'M24 87H40M48 87H70M30 91.5H44M56 91.5H66M40 96H58', { roughness: 0.3 });
    return T([7, 10, null, 10], { f: 'u', fs: 10.5, w: 650, va: 't' });
  }],
];

// FILM — one-sheets: a big scene, the title in poster caps, the billing block in the small print.
const billing = (p) => {
  let b = ''; for (const [y, h] of [[137.5, 1.1], [140.6, 0.9], [143.3, 0.9]]) { let x = 20 + rnd() * 3; while (x < 78) { const w = 2 + rnd() * 7; if (x + w > 80) break; b += `M${f1(x)} ${y}h${f1(w)}v${h}h${f1(-w)}z`; x += w + 1 + rnd() * 1.4; } }
  p.solid('sf', b);
};
D.film = [
  ['Horizon', (p) => {
    p.hatchCircle('a', 68, 36, 9, { hachureGap: 2.2 });
    p.line('a', 'M6 84L26 56L36 68L52 46L70 72L80 62L94 80'); p.line('a', 'M4 84H96');
    p.line('f', 'M52 46L48 60M52 46L58 58M26 56L24 66M80 62L78 70');
    p.line('f', 'M38 87.5H62M28 87.8H33M67 87.8H73', { roughness: 0.3 });
    p.line('f', 'M18 30q2 -2 4 0q2 -2 4 0M28 38q1.5 -1.5 3 0q1.5 -1.5 3 0');
    billing(p);
    return T([61, 9, 12, 9], { f: 'd', fs: 10.5, w: 700, up: true });
  }],
  ['Night', (p) => {
    p.hatchCircle('a', 26, 28, 9, { hachureGap: 2.2 });
    const bs = [[5, 10, 30], [15, 8, 44], [23, 12, 26], [35, 9, 52], [44, 11, 38], [55, 8, 60], [63, 12, 34], [75, 9, 46], [84, 11, 28]];
    let sky = 'M4 86'; for (const [x, w, h] of bs) sky += `V${86 - h}H${x + w}`; sky += 'V86';
    p.line('a', sky, { roughness: 0.45 }); p.line('a', 'M59 26V17'); p.line('a', 'M2 86H98', { roughness: 0.3 });
    let win = ''; for (const [x, w, h] of bs) for (let y = 86 - h + 3; y < 83; y += 3.6) for (let xx = x + 2; xx < x + w - 2; xx += 3) if (rnd() < 0.28) win += sq(xx, y, 1.4);
    p.solid('sf', win); p.solid('s', sparkle(78, 16, 2) + sparkle(46, 12, 1.5));
    billing(p);
    return T([61, 9, 12, 9], { f: 'd', fs: 10.5, w: 700, up: true });
  }],
  ['Reel', (p) => {
    p.circle('a', 40, 42, 24); p.circle('a', 40, 42, 4.2); p.solid('s', dot(40, 42, 1.6));
    for (let k = 0; k < 5; k++) { const t = -Math.PI / 2 + (k * 2 * Math.PI) / 5; p.circle('a', 40 + 13.2 * Math.cos(t), 42 + 13.2 * Math.sin(t), 5); }
    const mid = [[45, 65], [60, 76], [72, 70], [80, 78]], mid2 = [[80, 78], [86, 85], [90, 88], [100, 88]];
    const off = (s, k) => { const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10, a = cubic(s, t), b = cubic(s, Math.min(1, t + 0.01)), c = cubic(s, Math.max(0, t - 0.01)); const dx = b[0] - c[0], dy = b[1] - c[1], m = Math.hypot(dx, dy); pts.push([a[0] - (dy / m) * k, a[1] + (dx / m) * k]); } return pts; };
    p.line('a', P([...off(mid, 3.6), ...off(mid2, 3.6).slice(1)], false), { roughness: 0.4 });
    p.line('a', P([...off(mid, -3.6), ...off(mid2, -3.6).slice(1)], false), { roughness: 0.4 });
    let holes = ''; for (const s of [mid, mid2]) for (const t of [0.15, 0.4, 0.65, 0.9]) { const [x, y] = cubic(s, t); holes += sq(x - 0.8, y - 0.8, 1.6); }
    p.solid('sf', holes);
    billing(p);
    return T([62, 9, 12, 9], { f: 'd', fs: 10.5, w: 700, up: true });
  }],
];

// SERIES — episodes: a contact sheet with the one you're on, a set in the corner, the next one waiting behind.
D.series = [
  ['Episodes', (p) => {
    let k = 0;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++, k++) {
      const x = 12 + c * 27, y = 12 + r * 21, q = rect(x, y, x + 22, y + 16);
      if (k < 4) p.hatch('a', q, { hachureGap: 2.2, roughness: 0.5 }); else p.line('a', q, { roughness: 0.5 });
      if (k === 4) p.solid('s', `M${x + 8.5} ${y + 3.5}V${y + 12.5}L${x + 15.5} ${y + 8}Z`);
    }
    return T([54, 12, 10, 12], { f: 'u', fs: 11, w: 650, al: 'l', va: 't' });
  }],
  ['Set', (p) => {
    p.line('a', 'M50 40L36 18M50 40L66 20'); p.solid('s', dot(36, 18, 1.4) + dot(66, 20, 1.4));
    p.line('a', rrect(14, 40, 86, 94, 6)); p.line('a', rrect(20, 46, 66, 88, 7));
    p.circle('a', 76, 54, 3.4); p.circle('a', 76, 66, 3.4); p.line('f', 'M72 76H80M72 80H80M72 84H80', { roughness: 0.3 });
    p.line('a', 'M24 94L20 101M76 94L80 101');
    p.line('f', 'M22 80C30 74 38 76 44 80C50 76 58 72 64 78'); p.solid('sf', sparkle(54, 58, 2.2) + sparkle(32, 56, 1.3));
    return T([70, 12, 6, 12], { f: 'u', fs: 11, w: 650, al: 'l', va: 't' });
  }],
  ['Next', (p) => {
    p.line('a', 'M30 20V12H90V62H82'); p.line('a', 'M22 28V20H82V70H74'); p.line('a', rect(14, 28, 74, 78));
    p.solid('s', 'M37 43V63L54 53Z');
    for (let i = 0; i < 13; i++) p.line(i < 7 ? 'a' : 'f', `M${f1(15 + i * 5.2)} 87V93`, { roughness: 0.3 });
    return T([66, 12, 6, 12], { f: 'u', fs: 11, w: 650, al: 'l', va: 't' });
  }],
];

// ANIME — the sparkle, the summer sky with its telephone pole, the big moon with something falling past it.
D.anime = [
  ['Sparkle', (p) => {
    p.solid('s', sparkle(64, 46, 17, 0.13) + sparkle(30, 28, 7.5)); p.solid('sf', sparkle(80, 18, 3) + sparkle(22, 62, 3.4) + sparkle(86, 80, 2.4));
    p.line('f', 'M64 22A24 24 0 0 1 88 46M40 46A24 24 0 0 1 52 25');
    p.line('f', leaf(16, 82, 0.5, 5, 1.9) + leaf(40, 92, 2.4, 5, 1.9) + leaf(72, 84, 1.2, 5, 1.9) + leaf(86, 72, 0.2, 5, 1.9) + leaf(54, 84, -0.6, 5, 1.9) + leaf(28, 76, 1.7, 4.4, 1.7));
    p.line('a', 'M6 94C26 82 50 80 94 54');
    return T([66, 10, 6, 10], { f: 'u', fs: 11.5, w: 700, al: 'l', va: 'b' });
  }],
  ['Sky', (p) => {
    p.line('a', 'M14 54C9 54 7 48 11.5 45C9.5 38 18 34 23 37C24 28 34 24 40 29C44 20 58 20 62 28C68 24 78 28 78 35C86 34 92 42 88 48C92 52 88 56 84 55Z');
    p.line('f', 'M24 47C28 49 34 49 38 47M50 45C56 48 62 48 68 45M30 37C33 35 37 35 40 37');
    p.line('a', 'M80 62V150'); p.line('a', 'M71 70H89M73.5 76.5H86.5');
    p.line('a', 'M72 70C52 81 30 83 0 77'); p.line('f', 'M74 76.5C54 87 30 91 0 87M89 70C94 72 97 73 100 73');
    p.solid('sf', sq(71, 67.8, 1.6) + sq(87.4, 67.8, 1.6));
    p.line('f', 'M28 64q1.6 -1.6 3.2 0q1.6 -1.6 3.2 0M42 58q1.2 -1.2 2.4 0q1.2 -1.2 2.4 0');
    return T([64, 30, 6, 10], { f: 'u', fs: 11.5, w: 700, al: 'l', va: 'b' });
  }],
  ['Moon', (p) => {
    p.hatchCircle('a', 50, 50, 30, { hachureGap: 3.2 }); p.solid('s', crescent(50, 50, 30, 7, -2, 0.985)); p.circle('f', 44, 42, 4); p.circle('f', 61, 60, 5); p.circle('f', 62, 36, 2.6);
    p.line('a', 'M22 94.5L64 88.4'); p.line('f', 'M30 98.2L58 94.2'); p.solid('s', sparkle(67, 88, 3.6));
    p.solid('sf', sparkle(14, 20, 2) + sparkle(88, 16, 1.6) + sparkle(12, 88, 1.6));
    return T([68, 9, 6, 9], { f: 'u', fs: 11.5, w: 700, va: 'c' });
  }],
];

// IDEA — the covers of things not done yet: a constellation, a lit bulb, a paper plane on its way.
D.idea = [
  ['Stars', (p) => {
    const S = { A: [26, 32], B: [42, 22], C: [58, 36], D: [76, 26], E: [68, 54], F: [50, 62], G: [33, 54], H: [84, 70] };
    const seg = (a, b) => `M${S[a][0]} ${S[a][1]}L${S[b][0]} ${S[b][1]}`;
    p.line('f', seg('A', 'B') + seg('B', 'C') + seg('C', 'D') + seg('C', 'E') + seg('E', 'F') + seg('F', 'G') + seg('G', 'A') + seg('E', 'H'), { roughness: 0.4 });
    p.solid('s', Object.values(S).map(([x, y], i) => sparkle(x, y, [3.6, 2.8, 4.2, 2.6, 3.2, 2.4, 2.8, 3][i])).join(''));
    p.solid('sf', dot(18, 18, 0.7) + dot(64, 14, 0.6) + dot(88, 44, 0.7) + dot(22, 72, 0.6) + dot(60, 78, 0.6));
    p.solid('s', crescent(84, 14, 5.4, -2.2, 1.6));
    return T([55, 14, 9, 20], { f: 'd', fs: 11.5 });
  }],
  ['Bulb', (p) => {
    p.line('a', 'M46 66C46 60 38 56.5 38 46A15 15 0 1 1 68 46C68 56.5 60 60 60 66Z');
    p.line('a', 'M46 66H60M46.5 70.5H59.5M47 75H59M50 79.5H56');
    p.line('a', 'M49.5 66V57L51.2 53L53 57L54.8 53L56.5 57V66', { roughness: 0.4 });
    let rays = ''; for (const deg of [-170, -135, -90, -45, -10]) { const t = (deg * Math.PI) / 180; rays += `M${f1(53 + 20 * Math.cos(t))} ${f1(45 + 20 * Math.sin(t))}L${f1(53 + 25.5 * Math.cos(t))} ${f1(45 + 25.5 * Math.sin(t))}`; }
    p.line('a', rays, { roughness: 0.3 }); p.line('f', 'M44 41A10 10 0 0 1 50 35');
    return T([57, 14, 9, 20], { f: 'd', fs: 11.5 });
  }],
  ['Plane', (p) => {
    p.line('a', 'M84 22L44 38L60 44Z'); p.hatch('a', 'M84 22L60 44L64 56Z', { hachureGap: 2 });
    p.line('fd', 'M44 47C30 55 22 64 30 70C38 76 44 64 34 61C24 58 16 68 18 80');
    p.solid('sf', sparkle(26, 26, 1.8) + sparkle(90, 50, 1.4) + dot(70, 70, 0.7));
    return T([57, 14, 9, 20], { f: 'd', fs: 11.5 });
  }],
];

/* ── emit ────────────────────────────────────────────────────────────────── */
const SHAPE = { game: 'box', music: 'square' };
const out = {}; let seed = 1;
for (const [kind, list] of Object.entries(D)) {
  const h = H[SHAPE[kind] || 'portrait'];
  out[kind] = list.map(([name, draw]) => {
    const p = Plate(seed++); const text = draw(p);
    const ys = p.ys.map((y) => Math.min(h, Math.max(0, y))), mid = (Math.min(...ys) + Math.max(...ys)) / 2;
    const shift = text.fix ?? Math.round(Math.max(-18, Math.min(18, ((h / 2 - mid) / h) * 100)) * 10) / 10; // % of plate height
    delete text.fix;
    return { name, art: markup(p.L), text, shift };
  });
}
const ts = ['// Marginalia cover plates — generated by gen_plates.mjs (rough.js 4.6.6, MIT, at build time). Do not edit by hand.',
  '// art: inner SVG for a 100-wide viewBox (height by shape); text: where the title sits, in % of the plate.',
  'export interface PlateText { box: (number | null)[]; al: string; va: string; f: string; fs: number; w?: number; up?: boolean; band?: boolean }',
  'export interface Plate { name: string; art: string; text: PlateText; /** % of height that centres the drawing when the title is hidden */ shift: number }',
  `export const PLATE_H: Record<string, number> = ${JSON.stringify(H)};`,
  `export const PLATES: Record<string, Plate[]> = ${JSON.stringify(out)};`, ''];
writeFileSync('src/plates.ts', ts.join('\n'));
const size = JSON.stringify(out).length;
console.log('plates:', Object.values(out).reduce((n, l) => n + l.length, 0), 'bytes:', size);
for (const [k, l] of Object.entries(out)) console.log(k.padEnd(7), l.map((v) => `${v.name}:${v.art.length}/${v.shift}%`).join('  '));
