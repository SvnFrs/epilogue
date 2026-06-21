/* Component test (testing.md tier 2a) — the Ledger renders every block type. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Ledger } from '@epilogue/contracts';
import { LedgerView } from './LedgerView';

const ledger: Ledger = {
  title: 'On Red Dead Redemption II',
  standfirst: 'A slow elegy for the dying West.',
  byline: 'The Archivist',
  blocks: [
    { type: 'heading', text: 'The Sandbox', note: 'where I wandered' },
    { type: 'paragraph', text: 'I spent forty hours doing nothing in particular.' },
    { type: 'quote', text: 'We can’t change what’s done.', reference: 'Arthur Morgan' },
    { type: 'callout', icon: 'compass', title: 'Where I stopped', text: 'Chapter 6, the cabin.' },
    { type: 'embed', url: 'https://www.youtube.com/watch?v=abc123', label: 'the ending' },
  ],
};

describe('LedgerView', () => {
  it('renders heading, paragraph, bible-verse quote, callout, and embed', () => {
    render(<LedgerView ledger={ledger} />);
    expect(screen.getByText('On Red Dead Redemption II')).toBeInTheDocument();
    expect(screen.getByText('The Sandbox')).toBeInTheDocument();
    expect(screen.getByText('where I wandered')).toBeInTheDocument();
    expect(screen.getByText(/forty hours/)).toBeInTheDocument();
    expect(screen.getByText(/change what/)).toBeInTheDocument(); // bible-verse blockquote
    expect(screen.getByText('— Arthur Morgan')).toBeInTheDocument();
    expect(screen.getByText('Where I stopped')).toBeInTheDocument();
    // a known provider becomes a real iframe titled by the label
    expect(screen.getByTitle('the ending')).toBeInTheDocument();
  });

  it('renders a non-provider embed as a safe link, not an iframe', () => {
    render(
      <LedgerView
        ledger={{ blocks: [{ type: 'embed', url: 'https://example.com/post', label: 'a link' }] }}
      />,
    );
    expect(screen.getByRole('link', { name: /a link/ })).toHaveAttribute(
      'href',
      'https://example.com/post',
    );
  });
});
