import { describe, it, expect } from 'vitest';
import { relativeDays } from './time';

const now = new Date(2026, 5, 21, 12, 0, 0); // 2026-06-21, local

describe('relativeDays — clock injected, never read internally', () => {
  it('same calendar day → today (even hours earlier)', () => {
    expect(relativeDays(new Date(2026, 5, 21, 1, 0, 0), now)).toBe('today');
  });
  it('one calendar day → yesterday', () => {
    expect(relativeDays(new Date(2026, 5, 20, 23, 0, 0), now)).toBe('yesterday');
  });
  it('a few days → N days ago', () => {
    expect(relativeDays(new Date(2026, 5, 18), now)).toBe('3 days ago');
  });
  it('a couple weeks → weeks ago', () => {
    expect(relativeDays(new Date(2026, 5, 5), now)).toBe('2 weeks ago');
  });
  it('months', () => {
    expect(relativeDays(new Date(2026, 2, 21), now)).toBe('3 months ago');
  });
  it('years', () => {
    expect(relativeDays(new Date(2024, 5, 21), now)).toBe('2 years ago');
  });
  it('future dates are guarded', () => {
    expect(relativeDays(new Date(2026, 5, 22), now)).toBe('in the future');
  });
  it('accepts ISO strings', () => {
    expect(relativeDays('2026-06-20T08:00:00', now)).toBe('yesterday');
  });
});
