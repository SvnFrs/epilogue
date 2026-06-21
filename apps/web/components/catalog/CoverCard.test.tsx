/* Component test (testing.md tier 2a) — the catalog cover card renders its entry. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Entry } from '@epilogue/contracts';
import { CoverCard } from './CoverCard';

// next/link → plain anchor (no app-router context under jsdom)
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const entry: Entry = {
  id: 'e1',
  title: 'Red Dead Redemption II',
  subtitle: null,
  mediaType: 'GAME',
  space: 'gaming',
  status: 'PAUSED',
  year: 2018,
  month: null,
  cover: { kind: 'generative', motif: 'game' },
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  lastOpenedAt: '2026-06-20T08:00:00.000Z',
};

describe('CoverCard', () => {
  it('renders title, status pill, type, link, and relative time', () => {
    render(<CoverCard entry={entry} now={new Date(2026, 5, 21, 12)} />);
    expect(screen.getByText('Red Dead Redemption II')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('GAME')).toBeInTheDocument();
    expect(screen.getByText('yesterday')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Red Dead Redemption II' })).toHaveAttribute(
      'href',
      '/entry/e1',
    );
  });
});
