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
      colors: {
        paper: {
          DEFAULT: '#faf9f7', // warm
          cream: '#f7f3ea',
          cool: '#f5f5f4',
        },
        amber: {
          accent: '#d97706', // the dot + rules
          ink: '#b45309', // buttons/links/kicker
        },
        status: {
          playing: '#16a34a',
          paused: '#d97706',
          completed: '#166534',
          tech: '#0891b2',
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
        'card-hover': '0 22px 50px -24px rgba(41,37,36,.45)',
        cover: '0 18px 40px -18px rgba(41,37,36,.55)',
        sheen: 'inset 0 1px 0 rgba(255,255,255,.6)',
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
