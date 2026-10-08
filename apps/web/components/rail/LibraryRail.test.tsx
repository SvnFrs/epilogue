/**
 * T041 — a11y + keyboard for the hand-built rail widgets (testing.md tier 2a; eng T11).
 * The rail is the one place we hand-roll interaction: roving tabindex on the Spaces nav,
 * and a dialog drawer on mobile. These assert the WAI-ARIA contract actually holds
 * (landmark, aria-current, roving focus, real labelled checkboxes, Escape-to-close).
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LibraryRail } from './LibraryRail';
import { useRailStore } from '@/stores/rail';

// next/link mocked WITH ref forwarding — the rail's roving tabindex calls .focus()
// through the link refs, so a plain function mock (no ref) would break the focus test.
vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, { href: string; children: React.ReactNode }>(
    function MockLink({ href, children, ...rest }, ref) {
      return (
        <a ref={ref} href={href} {...rest}>
          {children}
        </a>
      );
    },
  ),
}));

const push = vi.fn();
let pathname = '/';
let search = '';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(search),
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockClear();
  pathname = '/';
  search = '';
  useRailStore.setState({ open: false });
});

describe('LibraryRail — landmarks + active state', () => {
  it('exposes the Library nav landmark and marks the active space with aria-current', () => {
    render(<LibraryRail />);
    expect(screen.getByRole('navigation', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Gaming' })).not.toHaveAttribute('aria-current');
  });
});

describe('LibraryRail — roving tabindex on Spaces', () => {
  it('makes only the first space tabbable; the rest are -1', () => {
    render(<LibraryRail />);
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('link', { name: 'Gaming' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: 'Tech' })).toHaveAttribute('tabindex', '-1');
  });

  it('Arrow keys move focus across spaces and wrap around', async () => {
    const user = userEvent.setup();
    render(<LibraryRail />);
    const all = screen.getByRole('link', { name: 'All' });
    const gaming = screen.getByRole('link', { name: 'Gaming' });
    const tech = screen.getByRole('link', { name: 'Tech' });

    all.focus();
    await user.keyboard('{ArrowDown}');
    expect(gaming).toHaveFocus();

    all.focus();
    await user.keyboard('{ArrowUp}'); // wraps to the last space
    expect(tech).toHaveFocus();
  });
});

describe('LibraryRail — status filters are real checkboxes', () => {
  it('renders labelled checkboxes that push the status into the URL', async () => {
    const user = userEvent.setup();
    render(<LibraryRail />);
    const paused = screen.getByRole('checkbox', { name: 'Paused' });
    expect(paused).not.toBeChecked();
    await user.click(paused);
    expect(push).toHaveBeenCalledWith('/?status=PAUSED');
  });
});

describe('LibraryRail — mobile drawer is a dialog', () => {
  it('opens, reflects aria-expanded, exposes role=dialog, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<LibraryRail />);
    const trigger = screen.getByRole('button', { name: 'Open library menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Library menu' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
