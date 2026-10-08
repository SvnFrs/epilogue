// The ink binder: any cover colour in, one legible ink per theme out.
// Hue is kept (that is the entry's identity); lightness is set by the theme; chroma is capped so
// nothing shouts. Near-neutral covers (a black metal sleeve, a white poetry jacket) wear sepia.

type Lch = [number, number, number];

const PAPER_RAISED = { paper: '#fdfaf3', lamplight: '#241d18' };
const PAPER = { paper: '#f8f2e9', lamplight: '#1a1410' };
export const GILT = '#efe0bc';

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export function toOklch(hex: string): Lch {
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

function lchToRgb(L: number, C: number, H: number): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function fromOklch(L: number, C: number, H: number): string {
  // reduce chroma until in sRGB gamut (keeps lightness and hue, the two things that matter here)
  let c = C, rgb = lchToRgb(L, c, H);
  while (c > 0 && rgb.some((v) => v < -0.0005 || v > 1.0005)) { c -= 0.004; rgb = lchToRgb(L, Math.max(c, 0), H); }
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('');
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export interface BoundInk {
  /** text-safe ink on paper / paper-raised in the Paper theme */ inkPaper: string;
  /** text-safe ink on paper / paper-raised in the Lamplight theme */ inkLamplight: string;
  washPaper: string; washLamplight: string;
  /** book-cloth colour for generated plates; theme-independent */ cloth: string;
  gilt: string;
}

export function bindInk(cover: string): BoundInk {
  let [, C, H] = toOklch(cover);
  if (C < 0.012) { H = 62; C = 0.035; } // truly colourless covers (a black sleeve, a white jacket) wear sepia
  else if (C < 0.03) C = 0.03;           // greys keep their temperature: cool greys go slate, warm greys go stone
  const cText = Math.min(C, 0.13), cWash = Math.min(C * 0.4, 0.05); // deeper cloth, deeper wash
  let Lp = 0.52;
  let inkPaper = fromOklch(Lp, cText, H);
  while (Lp > 0.2 && (contrast(inkPaper, PAPER_RAISED.paper) < 4.6 || contrast(inkPaper, PAPER.paper) < 4.6)) { Lp -= 0.01; inkPaper = fromOklch(Lp, cText, H); }
  let Ll = 0.76;
  let inkLamplight = fromOklch(Ll, Math.min(C, 0.11), H);
  while (Ll < 0.97 && contrast(inkLamplight, PAPER_RAISED.lamplight) < 4.6) { Ll += 0.01; inkLamplight = fromOklch(Ll, Math.min(C, 0.11), H); }
  return {
    inkPaper, inkLamplight,
    washPaper: fromOklch(0.93, cWash, H),
    washLamplight: fromOklch(0.27, cWash, H),
    cloth: contrast(GILT, cover) >= 4.5 ? cover : fromOklch(0.36, Math.min(C, 0.1), H), // a bookcloth is used as-is; a bright cover is deepened until gilt reads on it
    gilt: GILT,
  };
}

/** CSS custom properties for an inked subtree; bundle.css picks the right pair per theme. */
export function inkVars(cover?: string): Record<string, string> {
  if (!cover) return {};
  const k = bindInk(cover);
  return { '--ink-p': k.inkPaper, '--ink-l': k.inkLamplight, '--wash-p': k.washPaper, '--wash-l': k.washLamplight, '--cloth': k.cloth };
}

/** Best-effort cover colour from a same-origin (or CORS-enabled) image: the most saturated well-lit cluster. */
export function sampleCover(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const cv = document.createElement('canvas'); cv.width = 32; cv.height = 32;
        const g = cv.getContext('2d')!; g.drawImage(img, 0, 0, 32, 32);
        const d = g.getImageData(0, 0, 32, 32).data;
        const bins: Record<number, { w: number; r: number; g: number; b: number }> = {};
        for (let i = 0; i < d.length; i += 4) {
          const hex = '#' + [d[i], d[i + 1], d[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
          const [L, C, H] = toOklch(hex);
          if (L < 0.15 || L > 0.95) continue;
          const key = Math.round(H / 20);
          const w = C * C * (1 - Math.abs(L - 0.6));
          const bin = (bins[key] ||= { w: 0, r: 0, g: 0, b: 0 });
          bin.w += w; bin.r += d[i] * w; bin.g += d[i + 1] * w; bin.b += d[i + 2] * w;
        }
        const best = Object.values(bins).sort((a, b) => b.w - a.w)[0];
        if (!best || best.w === 0) return resolve('#5a4636');
        resolve('#' + [best.r, best.g, best.b].map((v) => Math.round(v / best.w).toString(16).padStart(2, '0')).join(''));
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = src;
  });
}
