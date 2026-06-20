/* Generative cover (FR-018) — pure SVG/CSS, no external images. Ported from src/home.jsx. */
import type { MediaType, Space } from '@epilogue/contracts';

type MotifKind = 'ridge' | 'sun' | 'eva' | 'code' | 'verse' | 'ring' | 'snow' | 'terminal';

const PALETTE: Record<Space, { bg: string; glow: string; ink: string }> = {
  gaming: { bg: '#3f3c38', glow: 'radial-gradient(120% 90% at 30% 0%, #d97706aa, transparent)', ink: '#fde9c8' },
  reading: { bg: '#44403c', glow: 'radial-gradient(120% 90% at 70% 10%, #b4530988, transparent)', ink: '#f5e6cf' },
  cinema: { bg: '#292524', glow: 'radial-gradient(120% 90% at 50% 0%, #0891b288, transparent)', ink: '#dbeafe' },
  tech: { bg: '#1c1917', glow: 'radial-gradient(120% 90% at 40% 0%, #0891b277, transparent)', ink: '#cffafe' },
};

const MOTIF_FOR_TYPE: Record<MediaType, MotifKind> = {
  GAME: 'ridge',
  BOOK: 'verse',
  MANGA: 'verse',
  FILM: 'sun',
  SERIES: 'ring',
  ANIME: 'eva',
  TECH_LOG: 'code',
};

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
  className,
}: {
  mediaType: MediaType;
  space: Space;
  className?: string;
}) {
  const p = PALETTE[space];
  const kind = MOTIF_FOR_TYPE[mediaType];
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={{ background: p.bg }} aria-hidden>
      <div className="pointer-events-none absolute inset-0" style={{ background: p.glow }} />
      <Motif kind={kind} ink={p.ink} />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 6px)' }}
      />
    </div>
  );
}
