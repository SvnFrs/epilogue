/* Generative cover (FR-018) — pure SVG/CSS, no external images. Ported from src/home.jsx.
   Per-entry variation (motif pool + tone) keyed off a seed so a shelf of the same title
   doesn't render as identical wallpaper. */
import type { MediaType, Space } from '@epilogue/contracts';

type MotifKind = 'ridge' | 'sun' | 'eva' | 'code' | 'verse' | 'ring' | 'snow' | 'terminal';
type Tone = { bg: string; glow: string; ink: string };

// 3 tones per space — warm, layered, distinct without leaving the palette.
const TONES: Record<Space, Tone[]> = {
  gaming: [
    { bg: '#3f3a33', glow: 'radial-gradient(120% 95% at 30% 0%, #d97706aa, transparent 60%)', ink: '#fde9c8' },
    { bg: '#43352c', glow: 'radial-gradient(120% 95% at 70% 8%, #c2410caa, transparent 60%)', ink: '#fcd9b6' },
    { bg: '#3a3a2b', glow: 'radial-gradient(110% 95% at 45% 0%, #ca8a04aa, transparent 60%)', ink: '#fef0c7' },
  ],
  reading: [
    { bg: '#44403c', glow: 'radial-gradient(120% 95% at 35% 5%, #b4530988, transparent 60%)', ink: '#f5e6cf' },
    { bg: '#412b2b', glow: 'radial-gradient(120% 95% at 65% 8%, #7f1d1d99, transparent 60%)', ink: '#f3d9d0' },
    { bg: '#2f3a32', glow: 'radial-gradient(115% 95% at 40% 0%, #3f621f99, transparent 60%)', ink: '#e7f0d8' },
  ],
  cinema: [
    { bg: '#262531', glow: 'radial-gradient(120% 95% at 50% 0%, #6d28d988, transparent 60%)', ink: '#ede9fe' },
    { bg: '#1e2a2e', glow: 'radial-gradient(120% 95% at 30% 5%, #0e7490aa, transparent 60%)', ink: '#cffafe' },
    { bg: '#2a2330', glow: 'radial-gradient(115% 95% at 60% 0%, #9333ea77, transparent 60%)', ink: '#f3e8ff' },
  ],
  tech: [
    { bg: '#1c1917', glow: 'radial-gradient(120% 95% at 40% 0%, #0891b277, transparent 60%)', ink: '#cffafe' },
    { bg: '#1e293b', glow: 'radial-gradient(120% 95% at 30% 5%, #0ea5e977, transparent 60%)', ink: '#e0f2fe' },
    { bg: '#14201a', glow: 'radial-gradient(115% 95% at 55% 0%, #16a34a66, transparent 60%)', ink: '#dcfce7' },
  ],
};

const MOTIF_POOL: Record<MediaType, MotifKind[]> = {
  GAME: ['ridge', 'sun', 'ring'],
  BOOK: ['verse', 'snow', 'ring'],
  MANGA: ['verse', 'eva', 'ring'],
  FILM: ['sun', 'ring', 'snow'],
  SERIES: ['ring', 'sun', 'eva'],
  ANIME: ['eva', 'snow', 'ring'],
  TECH_LOG: ['code', 'terminal', 'ring'],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function Motif({ kind, ink }: { kind: MotifKind; ink: string }) {
  const stroke = {
    stroke: ink,
    strokeWidth: 1.4,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity: 0.85,
  };
  const common = {
    className: 'absolute inset-0 h-full w-full',
    viewBox: '0 0 100 130',
    preserveAspectRatio: 'xMidYMid slice',
    'aria-hidden': true,
  } as const;
  switch (kind) {
    case 'ridge':
      return (
        <svg {...common}>
          <path d="M0 96 L20 78 L34 88 L52 64 L70 84 L86 72 L100 86 L100 130 L0 130 Z" fill={ink} opacity={0.14} />
          <path d="M0 104 L18 92 L40 100 L60 82 L78 96 L100 88" {...stroke} opacity={0.5} />
          <circle cx={74} cy={30} r={9} fill={ink} opacity={0.55} />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <circle cx={78} cy={24} r={13} fill={ink} opacity={0.55} />
          <path d="M0 110 L26 96 L50 106 L74 94 L100 104" {...stroke} opacity={0.55} />
          <path d="M0 122 L30 112 L56 120 L100 110" {...stroke} opacity={0.35} />
        </svg>
      );
    case 'eva':
      return (
        <svg {...common}>
          <path d="M50 18 L78 104 L50 88 L22 104 Z" fill={ink} opacity={0.16} />
          <path d="M50 26 L72 100 M50 26 L28 100 M34 84 L66 84" {...stroke} opacity={0.6} />
          <circle cx={50} cy={62} r={5} fill={ink} opacity={0.7} />
        </svg>
      );
    case 'code':
    case 'terminal':
      return (
        <svg {...common}>
          <path d="M34 44 L20 60 L34 76 M66 44 L80 60 L66 76 M56 38 L44 82" {...stroke} opacity={0.75} />
        </svg>
      );
    case 'verse':
      return (
        <svg {...common}>
          <path d="M40 30 L40 92 M60 30 L60 92 M40 38 L60 38" {...stroke} opacity={0.6} />
          <path d="M30 100 L70 100" {...stroke} opacity={0.4} />
        </svg>
      );
    case 'ring':
      return (
        <svg {...common}>
          <circle cx={50} cy={56} r={22} {...stroke} opacity={0.7} />
          <circle cx={50} cy={56} r={13} {...stroke} opacity={0.4} />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common}>
          {[[30, 40], [68, 30], [50, 66], [24, 88], [76, 84]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M0 -7 L0 7 M-6 -3.5 L6 3.5 M6 -3.5 L-6 3.5" {...stroke} opacity={0.6} />
            </g>
          ))}
        </svg>
      );
    default:
      return null;
  }
}

export function GenerativeCover({
  mediaType,
  space,
  seed,
  className,
}: {
  mediaType: MediaType;
  space: Space;
  seed?: string;
  className?: string;
}) {
  const h = hash(seed ?? mediaType);
  const tones = TONES[space];
  const tone = tones[h % tones.length]!;
  const pool = MOTIF_POOL[mediaType];
  const kind = pool[(h >> 4) % pool.length]!;
  // subtle per-entry rotation of the fiber overlay so textures differ card-to-card
  const angle = 100 + ((h >> 8) % 40);
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ background: tone.bg }} aria-hidden>
      <div className="pointer-events-none absolute inset-0" style={{ background: tone.glow }} />
      <Motif kind={kind} ink={tone.ink} />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: `repeating-linear-gradient(${angle}deg,#fff 0 1px,transparent 1px 6px)` }}
      />
    </div>
  );
}
