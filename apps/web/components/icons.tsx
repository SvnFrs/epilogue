/* Minimal lucide-style stroke icons (ported from src/icons.jsx). aria-hidden by default. */
import type { SVGProps } from 'react';
import type { MediaType } from '@epilogue/contracts';

type IconProps = { size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>;

const make =
  (children: React.ReactNode) =>
  ({ size = 18, strokeWidth = 1.75, ...rest }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );

export const Gamepad = make(
  <>
    <path d="M6 12h4" />
    <path d="M8 10v4" />
    <path d="M15 11h.01" />
    <path d="M18 13h.01" />
    <rect x="2" y="6" width="20" height="12" rx="4" />
  </>,
);
export const Book = make(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </>,
);
export const Code = make(
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>,
);
export const Film = make(
  <>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M2 9h5" />
    <path d="M17 9h5" />
    <path d="M2 15h5" />
    <path d="M17 15h5" />
  </>,
);
export const Compass = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </>,
);
export const Pencil = make(
  <>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </>,
);
export const Check = make(<path d="M20 6 9 17l-5-5" />);
export const Keyboard = make(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h.01" />
    <path d="M10 8h.01" />
    <path d="M14 8h.01" />
    <path d="M18 8h.01" />
    <path d="M8 12h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
    <path d="M7 16h10" />
  </>,
);
export const List = make(
  <>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </>,
);
export const Quote = make(
  <>
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z" />
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H6a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z" />
  </>,
);
export const Bookmark = make(<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />);
export const Globe = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </>,
);
export const Link = make(
  <>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>,
);
export const ArrowLeft = make(
  <>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </>,
);
export const Plus = make(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>,
);
export const Star = make(
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
);
export const History = make(
  <>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </>,
);
export const Grid = make(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </>,
);
export const Clock = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>,
);

/** media_type → icon (ux-ui.md). */
export function iconForType(t: MediaType) {
  if (t === 'GAME') return Gamepad;
  if (t === 'FILM' || t === 'SERIES' || t === 'ANIME') return Film;
  if (t === 'BOOK' || t === 'MANGA') return Book;
  return Code;
}
