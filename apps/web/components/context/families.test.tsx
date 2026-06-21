/* Component test (testing.md tier 2a) — US4 family blocks render their own fields. */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReadingPayload, ScreenPayload } from '@epilogue/contracts';
import { ReadingContext } from './ReadingContext';
import { ScreenContext } from './ScreenContext';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }));

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('ReadingContext', () => {
  const payload: ReadingPayload = {
    position: 'Book 5 — Pro and Contra',
    quotes: [{ id: 'q1', text: 'rebellion', reference: 'p.241' }],
  };
  it('renders the current chapter and pinned verses', () => {
    wrap(<ReadingContext entryId="e1" payload={payload} />);
    expect(screen.getByText('Book 5 — Pro and Contra')).toBeInTheDocument();
    expect(screen.getByText(/rebellion/)).toBeInTheDocument();
    expect(screen.getByText('p.241')).toBeInTheDocument();
    // no game-only fields bleed in (US4 scenario 4)
    expect(screen.queryByText('Open Threads')).not.toBeInTheDocument();
    expect(screen.queryByText('Keymap Reference')).not.toBeInTheDocument();
  });
});

describe('ScreenContext', () => {
  const payload: ScreenPayload = { position: 'S2E07 · 00:42:15', rating: 8.5, note: 'the turn' };
  it('renders position, rating, and note', () => {
    wrap(<ScreenContext entryId="e2" payload={payload} />);
    expect(screen.getByText('S2E07 · 00:42:15')).toBeInTheDocument();
    expect(screen.getByText('8.5 / 10')).toBeInTheDocument();
    expect(screen.getByText('the turn')).toBeInTheDocument();
    expect(screen.queryByText('Open Threads')).not.toBeInTheDocument();
  });
});
