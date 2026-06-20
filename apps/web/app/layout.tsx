import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from './providers';
import './globals.css';

// Triple-font (ux-ui.md §1): Playfair serif headlines, Geist sans UI, Geist Mono labels.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--epi-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Epilogue · Digital Legacy Museum',
  description: 'A cognitive save-state for everything you have lived through.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
