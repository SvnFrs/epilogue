/**
 * Component test (testing.md tier 2a) — the save-state block renders checkpoint/threads/
 * keymap and opens the editor. A fresh QueryClient per test (retry off); the MSW-backed
 * mutation/cache assertions live with the US2 component suite (T029t).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { GamePayload } from '@epilogue/contracts';
import { GameContext } from './GameContext';

// GameContext calls useRouter(); stub it (no app-router context under jsdom).
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }));

const payload: GamePayload = {
  checkpoint: 'Saved at the cabin in the snow',
  threads: [
    { id: 't1', text: 'pay off the debt', done: false },
    { id: 't2', text: 'visit the doctor', done: true },
  ],
  keymap: [{ action: 'Dead Eye', key: 'R' }],
};

function renderBlock(p: GamePayload = payload) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <GameContext entryId="e1" payload={p} />
    </QueryClientProvider>,
  );
}

describe('GameContext (US1 save-state)', () => {
  it('surfaces checkpoint, threads, and keymap for a cold resume', () => {
    renderBlock();
    expect(screen.getByText('Saved at the cabin in the snow')).toBeInTheDocument();
    expect(screen.getByText('pay off the debt')).toBeInTheDocument();
    expect(screen.getByText('visit the doctor')).toBeInTheDocument();
    expect(screen.getByText('Dead Eye')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('marks a done thread with an accessible pressed toggle', () => {
    renderBlock();
    expect(
      screen.getByRole('button', { name: /Mark "visit the doctor" not done/ }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens the checkpoint editor with the current text', async () => {
    renderBlock();
    await userEvent.click(screen.getByRole('button', { name: 'edit' }));
    expect(screen.getByRole('textbox')).toHaveValue('Saved at the cabin in the snow');
  });
});
