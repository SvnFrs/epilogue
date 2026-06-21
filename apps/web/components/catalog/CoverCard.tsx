import Link from 'next/link';
import { type Entry, type Status, relativeDays } from '@epilogue/contracts';
import { GenerativeCover } from '../covers/GenerativeCover';
import { iconForType } from '../icons';

const STATUS_STYLE: Record<Status, { label: string; bg: string; ink: string }> = {
  PLAYING: { label: 'Playing', bg: 'rgba(22,163,74,.92)', ink: '#f0fdf4' },
  READING: { label: 'Reading', bg: 'rgba(22,163,74,.92)', ink: '#f0fdf4' },
  PAUSED: { label: 'Paused', bg: 'rgba(217,119,6,.92)', ink: '#fffbeb' },
  COMPLETED: { label: 'Completed', bg: 'rgba(22,101,52,.92)', ink: '#f0fdf4' },
  AIRING: { label: 'Airing', bg: 'rgba(8,145,178,.92)', ink: '#ecfeff' },
};

export function CoverCard({ entry, now, tall = false }: { entry: Entry; now: Date; tall?: boolean }) {
  const Icon = iconForType(entry.mediaType);
  const status = STATUS_STYLE[entry.status];
  return (
    <Link
      href={`/entry/${entry.id}`}
      className="group block overflow-hidden rounded-3xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      aria-label={entry.title}
    >
      <div className={`relative ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <GenerativeCover mediaType={entry.mediaType} space={entry.space} className="h-full w-full" />
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm"
          style={{ background: status.bg, color: status.ink }}
        >
          {status.label}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-stone-900/60 to-transparent p-3.5">
          <Icon size={13} className="text-white/85" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/85">
            {entry.mediaType.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <h3 className="font-serif text-[18px] leading-tight text-stone-800 group-hover:text-amber-ink">
          {entry.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-stone-400">
            {entry.space}
          </span>
          {entry.lastOpenedAt && (
            <span className="font-mono text-[11px] text-stone-300">
              {relativeDays(entry.lastOpenedAt, now)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
