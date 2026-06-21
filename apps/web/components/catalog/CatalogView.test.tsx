/* Component test (testing.md tier 2a) — catalog grid vs empty state. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Entry } from '@epilogue/contracts';
import { CatalogView, type EmptyState } from './CatalogView';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mk = (id: string, title: string, status: Entry['status']): Entry => ({
  id,
  title,
  subtitle: null,
  mediaType: 'GAME',
  space: 'gaming',
  status,
  year: null,
  month: null,
  cover: { kind: 'generative', motif: 'game' },
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  lastOpenedAt: null,
});

const empty: EmptyState = {
  title: 'Your shelf is empty',
  sub: 'Start the archive.',
  ctaHref: '/entry/new',
  ctaLabel: 'Add your first entry',
};

describe('CatalogView', () => {
  it('renders the grid with a summary including the paused count', () => {
    render(
      <CatalogView
        kicker="The Library"
        title="Everything"
        entries={[mk('a', 'RDR2', 'PAUSED'), mk('b', 'Elden Ring', 'PLAYING')]}
        empty={empty}
      />,
    );
    expect(screen.getByText('RDR2')).toBeInTheDocument();
    expect(screen.getByText('Elden Ring')).toBeInTheDocument();
    expect(screen.getByText('2 entries')).toBeInTheDocument();
    expect(screen.getByText(/1 paused/)).toBeInTheDocument();
  });

  it('renders the typed empty state with its CTA when there are no entries', () => {
    render(<CatalogView kicker="The Library" title="Everything" entries={[]} empty={empty} />);
    expect(screen.getByText('Your shelf is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add your first entry' })).toHaveAttribute(
      'href',
      '/entry/new',
    );
  });
});
