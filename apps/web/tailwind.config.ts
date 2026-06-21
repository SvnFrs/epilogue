import type { Config } from 'tailwindcss';

/**
 * Digital Paper theme (constitution III; ux-ui.md §1). Tokens extracted from the
 * approved `src/` POC — warm paper surfaces, amber accent, status colors, triple-font,
 * generous radii + soft shadows. Never pure #fff / #000.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Ultrawide breakpoints (e.g. 34" UW-QHD 3440px) on top of the defaults.
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        // Reading-room dark (DESIGN.md). Semantic tokens + a deliberately REMAPPED `stone`
        // scale (warm-dark ramp: 800 = brightest ink … 50 = deepest) so the existing utility
        // classes across components flip to dark from one place. Single theme, no toggle.
        ground: '#1a1613',
        surface: '#221d18',
        card: '#2a2420',
        card2: '#332c26',
        line: '#3d362d',
        ink: '#efe7d8',
        muted: '#b6ab97',
        faint: '#8c8170',
        paper: {
          DEFAULT: '#221d18', // rail / panels (surface)
          card: '#2a2420', // entry cards / blocks
          cream: '#2a2420',
          cool: '#221d18',
        },
        amber: {
          accent: '#d97706', // fills: the dot, buttons, rules
          lit: '#f59e0b', // accent ON dark: links, labels, glow (AA)
          ink: '#f59e0b', // remap: amber text reads as lit on the dark ground
          50: '#2c2317', // dark warm amber wash (was light fill)
          100: '#3a2d1a',
          200: '#4d3c20', // warm amber border on dark
        },
        status: {
          playing: '#22c55e',
          paused: '#fbbf24',
          completed: '#4ade80',
          tech: '#22d3ee',
        },
        stone: {
          50: '#1f1a16', // deepest (was lightest) — subtle panels / inverted-button ink
          100: '#2a2420', // subtle dark hover bg
          200: '#3d362d', // hairline borders
          300: '#4a4238', // stronger borders / dim
          400: '#8c8170', // faint labels
          500: '#9c917e', // muted
          600: '#b6ab97', // secondary text
          700: '#d2c7b2', // near-primary text
          800: '#efe7d8', // PRIMARY ink (bright cream) + inverted-button bg
          900: '#f6f0e4', // brightest (button hover) + subtle light rings
          950: '#1a1613',
        },
      },
      fontFamily: {
        serif: ['var(--epi-headline)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card-hover': '0 24px 60px -24px rgba(0,0,0,.65)',
        cover: '0 18px 50px -18px rgba(0,0,0,.75)',
        sheen: 'inset 0 1px 0 rgba(255,240,210,.06)',
        glow: '0 0 44px -10px rgba(245,158,11,.28)',
      },
      keyframes: {
        epiFade: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        epiPop: {
          from: { opacity: '0', transform: 'scale(.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        epiShimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'epi-fade': 'epiFade .4s ease-out both',
        'epi-pop': 'epiPop .25s ease-out both',
        'epi-shimmer': 'epiShimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
