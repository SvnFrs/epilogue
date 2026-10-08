'use client';

/**
 * Library rail (T018; ux-ui.md §rail) — the redesigned navigation IA that replaces the
 * POC top-nav + browser-tab switcher (spec FR-019/020/022). Labeled, always-visible
 * ~240px on desktop; a slide-in drawer < 768px (FR-025). Selection is URL-driven; the
 * rail only reflects the route. A11y: <nav> landmark + roving tabindex (arrows move,
 * Enter selects) + real status checkboxes.
 */
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { STATUSES, type Status } from '@epilogue/contracts';
import { Gamepad, Book, Film, Code, Grid } from '../icons';
import { useRailStore } from '@/stores/rail';

const SPACES = [
  { href: '/', label: 'All', key: 'all', Icon: Grid },
  { href: '/gaming', label: 'Gaming', key: 'gaming', Icon: Gamepad },
  { href: '/reading', label: 'Reading', key: 'reading', Icon: Book },
  { href: '/cinema', label: 'Cinema', key: 'cinema', Icon: Film },
  { href: '/tech', label: 'Tech', key: 'tech', Icon: Code },
] as const;

const STATUS_LABEL: Record<Status, string> = {
  PLAYING: 'Playing',
  PAUSED: 'Paused',
  READING: 'Reading',
  COMPLETED: 'Completed',
  AIRING: 'Airing',
};

function RailContent() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const activeStatuses = new Set((params.get('status') ?? '').split(',').filter(Boolean));
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isSpaceActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href;

  function onSpaceKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = e.key === 'ArrowDown' ? index + 1 : index - 1;
    const clamped = (next + SPACES.length) % SPACES.length;
    refs.current[clamped]?.focus();
  }

  function toggleStatus(s: Status) {
    const next = new Set(activeStatuses);
    if (next.has(s)) next.delete(s);
    else next.add(s);
    const sp = new URLSearchParams(params.toString());
    if (next.size) sp.set('status', [...next].join(','));
    else sp.delete('status');
    const base = pathname === '/' ? '/' : pathname;
    const qs = sp.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  return (
    <nav aria-label="Library" className="flex h-full w-full flex-col">
      <Link href="/" className="flex items-baseline gap-0.5 px-5 py-5">
        <span className="font-serif text-[22px] tracking-tight text-stone-800">Epilogue</span>
        <span className="font-serif text-[22px] text-amber-accent">·</span>
      </Link>

      <p className="px-5 pb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
        Spaces
      </p>
      <ul className="px-2">
        {SPACES.map((s, i) => {
          const active = isSpaceActive(s.href);
          const Icon = s.Icon;
          return (
            <li key={s.key}>
              <Link
                href={s.href}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                tabIndex={i === 0 ? 0 : -1}
                onKeyDown={(e) => onSpaceKeyDown(e, i)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-[14px] transition ${
                  active
                    ? 'bg-amber-50 font-medium text-amber-ink'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-amber-accent" />
                )}
                <Icon size={17} />
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="px-5 pb-2 pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-400">
        Status
      </p>
      <ul className="px-3">
        {STATUSES.map((s) => (
          <li key={s}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] text-stone-600 hover:bg-stone-100">
              <input
                type="checkbox"
                checked={activeStatuses.has(s)}
                onChange={() => toggleStatus(s)}
                className="h-4 w-4 rounded border-stone-300 accent-amber-accent"
              />
              {STATUS_LABEL[s]}
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-2.5 border-t border-stone-200 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 font-serif text-sm italic text-amber-50">
          a
        </span>
        <span className="font-mono text-[11px] text-stone-400">Your shelf</span>
      </div>
    </nav>
  );
}

export function LibraryRail() {
  const { open, setOpen } = useRailStore();
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // A11y (T041): the hand-built drawer behaves like a real dialog — Escape closes it,
  // and focus moves into the panel on open (so keyboard + SR users aren't stranded
  // behind the backdrop). Reflected on the trigger via aria-expanded/aria-controls.
  useEffect(() => {
    if (!open) return;
    drawerRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  return (
    <>
      {/* mobile top bar */}
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open library menu"
          aria-expanded={open}
          aria-controls="library-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-stone-100"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-stone-700" />
            <span className="block h-0.5 w-5 bg-stone-700" />
            <span className="block h-0.5 w-5 bg-stone-700" />
          </span>
        </button>
        <span className="font-serif text-lg text-stone-800">Epilogue ·</span>
        <span className="w-11" />
      </div>

      {/* desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 border-r border-stone-200 bg-paper md:flex">
        <RailContent />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div
            ref={drawerRef}
            id="library-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Library menu"
            tabIndex={-1}
            className="absolute left-0 top-0 h-full w-[280px] bg-paper shadow-xl outline-none"
          >
            <RailContent />
          </div>
        </div>
      )}
    </>
  );
}
