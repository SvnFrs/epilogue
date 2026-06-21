/**
 * Ledger read view (T032) — renders the long-form blocks. Ported from src/ledger-view.jsx
 * (the binding visual reference) to the contract schema (heading/paragraph/quote/callout/
 * embed). The quote is the bible-verse blockquote; embeds use real provider iframes.
 */
import type { Ledger, LedgerBlock } from '@epilogue/contracts';
import { Compass, Link as LinkIcon, Book, Star, Quote, Clock } from '../icons';
import { resolveEmbed } from './embed';

const CALLOUT_ICON: Record<string, typeof Compass> = {
  compass: Compass,
  link: LinkIcon,
  book: Book,
  star: Star,
  quote: Quote,
};

function Block({ block }: { block: LedgerBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="mb-4 mt-12 flex items-baseline gap-3">
          <h2 className="font-serif text-[27px] leading-tight text-stone-800">{block.text}</h2>
          {block.note && (
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400">
              {block.note}
            </span>
          )}
        </div>
      );
    case 'paragraph':
      return <p className="mt-4 text-[16.5px] leading-[1.75] text-stone-600">{block.text}</p>;
    case 'quote':
      return (
        <figure className="my-8 border-l-[3px] border-amber-accent bg-gradient-to-r from-amber-50/70 to-transparent py-3 pl-6 pr-4">
          <blockquote className="font-serif text-[22px] italic leading-[1.5] text-stone-700">
            “{block.text}”
          </blockquote>
          {block.reference && (
            <figcaption className="mt-3 text-right font-mono text-[12px] uppercase tracking-[0.1em] text-amber-ink/80">
              — {block.reference}
            </figcaption>
          )}
        </figure>
      );
    case 'callout': {
      const Icon = CALLOUT_ICON[block.icon] ?? Compass;
      return (
        <div className="my-7 flex gap-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-ink">
            <Icon size={17} />
          </span>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-500">
              {block.title}
            </p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-stone-600">{block.text}</p>
          </div>
        </div>
      );
    }
    case 'embed': {
      const embed = resolveEmbed(block.url);
      return (
        <figure className="my-7 overflow-hidden rounded-2xl border border-stone-200 bg-card shadow-sm">
          {embed.kind === 'iframe' ? (
            <iframe
              src={embed.src}
              title={block.label || embed.provider}
              className="aspect-video w-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <a
              href={embed.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-stone-50"
            >
              <LinkIcon size={16} className="text-stone-400" />
              <span className="truncate text-[14px] text-stone-600">{block.label || embed.href}</span>
            </a>
          )}
          {embed.kind === 'iframe' && block.label && (
            <figcaption className="px-4 py-3 text-[14px] text-stone-600">{block.label}</figcaption>
          )}
        </figure>
      );
    }
    default:
      // exhaustiveness guard
      return ((_: never) => null)(block);
  }
}

export function LedgerView({ ledger }: { ledger: Ledger }) {
  return (
    <article className="mx-auto max-w-[680px]">
      {ledger.title && (
        <>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-amber-ink">
            The Ledger
          </p>
          <h1 className="mt-3 font-serif text-[clamp(32px,4vw,48px)] font-medium leading-[1.05] text-stone-800">
            {ledger.title}
          </h1>
        </>
      )}
      {ledger.standfirst && (
        <p className="mt-5 font-serif text-[20px] italic leading-[1.5] text-stone-500">
          {ledger.standfirst}
        </p>
      )}
      {ledger.byline && (
        <div className="mt-5 flex items-center gap-2 border-y border-stone-200 py-3 font-mono text-[11.5px] uppercase tracking-[0.1em] text-stone-400">
          <Clock size={13} />
          {ledger.byline}
        </div>
      )}
      <div className="pb-8">
        {ledger.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}
