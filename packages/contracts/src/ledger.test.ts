import { describe, it, expect } from 'vitest';
import { Ledger, LedgerBlock, type Ledger as LedgerT } from './ledger';

const sample: LedgerT = {
  title: 'On Red Dead Redemption II',
  standfirst: 'A slow elegy for the dying West.',
  byline: 'The Archivist',
  blocks: [
    { type: 'heading', text: 'The Sandbox', note: 'where I wandered' },
    { type: 'paragraph', text: 'I spent forty hours doing nothing in particular.' },
    { type: 'quote', text: 'We can’t change what’s done.', reference: 'Arthur Morgan' },
    { type: 'callout', icon: 'compass', title: 'Where I stopped', text: 'Chapter 6, the cabin.' },
    { type: 'embed', url: 'https://example.com/clip', label: 'the ending' },
  ],
};

describe('Ledger block (de)serialization — round-trip', () => {
  it('deserialize(serialize(x)) preserves the ledger (FR-010)', () => {
    const wire = JSON.stringify(sample);
    const parsed = Ledger.parse(JSON.parse(wire));
    expect(parsed).toEqual(sample);
  });

  it('each block type validates', () => {
    for (const block of sample.blocks) {
      expect(() => LedgerBlock.parse(block)).not.toThrow();
    }
  });

  it('rejects an unknown block type', () => {
    expect(() => LedgerBlock.parse({ type: 'video', src: 'x' })).toThrow();
  });

  it('accepts an empty ledger', () => {
    expect(() => Ledger.parse({ blocks: [] })).not.toThrow();
  });

  it('rejects a malformed embed url', () => {
    expect(() => LedgerBlock.parse({ type: 'embed', url: 'not-a-url', label: 'x' })).toThrow();
  });
});
