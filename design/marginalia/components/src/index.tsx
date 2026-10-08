/* Marginalia — the UI language of Epilogue. Components read window.React; no imports at runtime. */
import { GLYPHS, KINDS, STATUSES, HORIZONS, SHELVES, PLAN_STATES, LUCIDE } from './icons';
import { SKETCH, EMPTY } from './sketch';
import { bindInk, inkVars, sampleCover, contrast, toOklch, fromOklch } from './ink';
import { CLOTHS, CORE_24, clothById, nearestCloth, autoCloth } from './cloth';
import { PLATES, PLATE_H } from './plates';

declare const React: any;
const { useState, useRef, useEffect, useLayoutEffect, Fragment } = React;

/** The nine kinds an entry can be. */
export type Kind = (typeof KINDS)[number];
/** What a plate can be drawn for: an entry's kind, or an idea (a dream's cover). Never an entry's kind. */
export type PlateKind = Kind | 'idea';
export type Status = (typeof STATUSES)[number];
export type ShelfId = (typeof SHELVES)[number];
export type PlanState = (typeof PLAN_STATES)[number];
export type Horizon = (typeof HORIZONS)[number];

const cx = (...a: any[]) => a.filter(Boolean).join(' ');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);

/* ── vocabulary ─────────────────────────────────────────────────────────── */

type KindInfo = { word: string; plural: string; open: string; again: string; shape: 'portrait' | 'box' | 'square'; bound: boolean; unit: string | null; provider: string | null };
export const KIND: Record<Kind, KindInfo> = {
  game:   { word: 'Game',   plural: 'Games',  open: 'Playing',   again: 'Replaying',  shape: 'box',      bound: false, unit: null,      provider: 'IGDB' },
  book:   { word: 'Book',   plural: 'Books',  open: 'Reading',   again: 'Rereading',  shape: 'portrait', bound: true,  unit: 'page',    provider: 'Open Library' },
  manga:  { word: 'Manga',  plural: 'Manga',  open: 'Reading',   again: 'Rereading',  shape: 'portrait', bound: true,  unit: 'chapter', provider: 'AniList' },
  anime:  { word: 'Anime',  plural: 'Anime',  open: 'Watching',  again: 'Rewatching', shape: 'portrait', bound: false, unit: 'episode', provider: 'AniList' },
  film:   { word: 'Film',   plural: 'Films',  open: 'Watching',  again: 'Rewatching', shape: 'portrait', bound: false, unit: null,      provider: 'TMDB' },
  series: { word: 'Series', plural: 'Series', open: 'Watching',  again: 'Rewatching', shape: 'portrait', bound: false, unit: 'episode', provider: 'TMDB' },
  music:  { word: 'Music',  plural: 'Music',  open: 'Listening', again: 'On repeat',  shape: 'square',   bound: false, unit: 'track',   provider: null },
  poem:   { word: 'Poem',   plural: 'Poems',  open: 'Reading',   again: 'Rereading',  shape: 'portrait', bound: true,  unit: null,      provider: null },
  story:  { word: 'Story',  plural: 'Stories', open: 'Reading',  again: 'Rereading',  shape: 'portrait', bound: true,  unit: 'page',    provider: null },
};
/** Plates that are not entries: an idea is a dream's cover. */
const PLATE_ONLY: Record<string, { shape: 'portrait'; bound: boolean }> = { idea: { shape: 'portrait', bound: true } };

export const VERDICT = ['No verdict yet', 'Not for me', 'Passed the time', 'Good company', 'Stayed with me', 'Part of me now'];

export const plural = (u: string) => (/s$|h$|%$/.test(u) ? u : u + 's');

export function statusWord(status: Status, kind: Kind = 'book') {
  const k = KIND[kind] || KIND.book;
  return { shelved: 'Up next', paused: 'Paused', open: k.open, again: k.again, finished: 'Finished', aside: 'Set aside' }[status];
}

/* ── shelves: three per part, derived from state, never stored ──────────── */

export const SHELF: Record<ShelfId, { word: string; hint: string }> = {
  waiting: { word: 'Waiting', hint: 'not started, or put back with the place kept' },
  open:    { word: 'Open',    hint: 'in progress' },
  closed:  { word: 'Closed',  hint: 'finished, done, came true or set aside' },
};
/** Media: Waiting = shelved + paused · Open = open + again · Closed = finished + aside. */
export function shelfOf(status: Status): ShelfId {
  return status === 'shelved' || status === 'paused' ? 'waiting' : status === 'open' || status === 'again' ? 'open' : 'closed';
}
/** Prologue: Waiting = waiting + paused · Open = open · Closed = done + aside. */
export function planShelfOf(state: PlanState): ShelfId {
  return state === 'waiting' || state === 'paused' ? 'waiting' : state === 'open' ? 'open' : 'closed';
}
/** Words for a task's or a dream's state. Same colours as media states; no new ones. */
export const PLAN_WORD: Record<PlanState, { task: string; dream: string; icon: string; tone: string }> = {
  waiting: { task: 'Waiting',   dream: 'Dream',     icon: 'dream',    tone: 'soft' },
  open:    { task: 'Doing',     dream: 'Pursuing',  icon: 'now',      tone: 'lamp' },
  paused:  { task: 'Paused',    dream: 'Paused',    icon: 'paused',   tone: 'soft' },
  done:    { task: 'Done',      dream: 'Came true', icon: 'finished', tone: 'quill' },
  aside:   { task: 'Set aside', dream: 'Set aside', icon: 'aside',    tone: 'faint' },
};
/** "21 days" reads as "3 weeks": how long an open thing has gone untouched. */
export function idleWords(days: number) {
  if (days < 14) return `${days} days`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  const m = Math.round(days / 30);
  return m === 1 ? 'a month' : `${m} months`;
}

/* ── Icon ───────────────────────────────────────────────────────────────── */

export function Icon({ name, size = 20, title, className, strokeWidth }: any) {
  strokeWidth = strokeWidth ?? (size <= 16 ? 2 : 1.75);
  const body = (title ? `<title>${esc(title)}</title>` : '') + (SKETCH[name] || GLYPHS[name] || '');
  return (
    <svg className={cx('mg-icon', className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} focusable="false"
      dangerouslySetInnerHTML={{ __html: body }} />
  );
}

/* ── Ink ────────────────────────────────────────────────────────────────── */

/** Wraps children in an inked subtree: everything inside that uses entry-ink / entry-wash takes this entry's colour. */
export function Inked({ ink, as = 'div', className, style, children, ...rest }: any) {
  const Tag = as;
  return <Tag className={cx(ink && 'mg-inked', className)} style={{ ...inkVars(ink), ...style }} {...rest}>{children}</Tag>;
}

/* ── Button ─────────────────────────────────────────────────────────────── */

export function Button({ variant = 'clay', size = 'md', icon, label, round, children, className, type = 'button', ...rest }: any) {
  const iconOnly = !children;
  return (
    <button type={type} className={cx('mg-btn', size === 'lg' ? 'ui-lg' : 'ui', `mg-btn--${variant}`, `mg-btn--${size}`, (round || iconOnly) && 'mg-btn--round', className)}
      aria-label={iconOnly ? label : undefined} title={iconOnly ? label : undefined} {...rest}>
      {icon && <Icon name={icon} size={size === 'lg' ? 22 : size === 'sm' ? 18 : 20} />}
      {children != null && <span className="mg-btn__label">{children}</span>}
    </button>
  );
}

/* ── Marks ──────────────────────────────────────────────────────────────── */

export function KindMark({ kind = 'book', className }: any) {
  return <span className={cx('mg-kind', 'ui-sm', className)}><Icon name={kind} size={16} /><span>{(KIND as any)[kind]?.word}</span></span>;
}

export function StatusMark({ status = 'open', kind = 'book', date, pill = false, className }: any) {
  return (
    <span className={cx('mg-status', 'ui-sm', `mg-status--${status}`, pill && 'mg-status--pill', className)}>
      <Icon name={status} size={16} />
      <span>{statusWord(status, kind)}{date ? <span className="mg-status__date"> · {date}</span> : null}</span>
    </span>
  );
}

/* ── Cover ──────────────────────────────────────────────────────────────── */

const SEAL = (
  <svg viewBox="0 0 40 40">
    <path fill="currentColor" d="M20 1.8c2.7 0 4.4 2.2 6.9 3 2.6.8 5.5-.1 7.5 1.8 2 1.9 1.2 4.8 2 7.3.8 2.6 3 4.1 3 6.6 0 2.7-2.4 4.2-3.1 6.7-.8 2.6.2 5.6-1.8 7.6-2 1.9-5 1-7.6 1.8-2.4.8-4.1 3.1-6.9 3.1-2.6 0-4.3-2.3-6.8-3-2.6-.8-5.6.1-7.5-1.8-1.9-2-1-4.9-1.8-7.5C3 25.2.8 23.6.8 20.9c0-2.6 2.3-4.2 3-6.7.8-2.5-.1-5.4 1.8-7.4 2-2 5-1 7.5-1.9 2.5-.8 4.2-3.1 6.9-3.1z" />
    <circle cx="14.5" cy="13.5" r="9" fill="#fff" opacity=".1" />
    <circle cx="13.5" cy="12.5" r="4.5" fill="#fff" opacity=".1" />
    <circle className="mg-seal__ring" cx="20" cy="20.5" r="11.5" />
    <path className="mg-seal__mark" d="M20 15.5v10M15.7 18l8.6 5M15.7 23l8.6-5" />
  </svg>
);

const fnv = (t: string) => { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const CJK = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/;

/** The plate an entry wears without cover art: one of its kind's compositions, chosen by title unless `variant` is given. */
export function plateFor(kind: string, title = '', variant?: number) {
  const list = (PLATES as any)[kind] || PLATES.book;
  const i = variant != null ? ((variant % list.length) + list.length) % list.length : (fnv(String(title)) >>> 7) % list.length;
  return { ...list[i], index: i, count: list.length };
}

/** Title size and line budget for a plate's zone (cqw). Estimates the wrap; shrinks a long title before it would be cut. */
function plateType(title: string, by: any, tx: any, shape: string) {
  const [t, r, b, l] = tx.box, n = title.length, cjk = CJK.test(title);
  const w = (tx.band ? 80 : 100 - (r || 0) - (l || 0)) * 0.94; // a little air: estimates, not measurements
  const cw = cjk ? 1 : tx.up ? 0.8 : tx.f === 'u' ? (tx.w >= 700 ? 0.66 : 0.62) : 0.6, lh = tx.up ? 1.14 : 1.1;
  const words = cjk ? [] : title.split(/\s+/).filter(Boolean);
  const linesAt = (fs: number) => {
    const per = w / (fs * cw);
    if (cjk) return Math.ceil(n / Math.max(1, Math.floor(per)));
    let lines = 1, cur = 0;
    for (const word of words) { const len = word.length; if (cur && cur + 1 + len > per) { lines++; cur = len; } else cur += (cur ? 1 : 0) + len; }
    return lines;
  };
  const zone = t == null || b == null ? 0 : ((100 - t - b) / 100) * (PLATE_H as any)[shape];
  const budgetAt = (fs: number) => (zone ? Math.max(1, Math.floor((zone - (by ? 11.5 : 0)) / (fs * lh) + 0.12)) : 3);
  let fs = tx.fs * (n <= 8 ? 1.12 : 1);
  if (!cjk) { const long = Math.max(...words.map((x) => x.length), 1); fs = Math.min(fs, w / (long * cw)); }
  while (fs > tx.fs * 0.62 && linesAt(fs) > budgetAt(fs)) fs *= 0.94;
  fs = Math.max(fs, tx.fs * 0.6);
  return { fs: Math.round(fs * 10) / 10, lines: Math.min(5, budgetAt(fs)) };
}

export function Cover({ title, by, kind = 'book', src, alt, ink, status, size = 'md', width, variant, className, style }: any) {
  const k = (KIND as any)[kind] || PLATE_ONLY[kind] || KIND.book;
  if (!ink && !src && title) ink = autoCloth(String(title)).hex; // no art, no pick: a stable cloth from the core 24
  let plate: any = null;
  if (!src) {
    const pl = plateFor((KIND as any)[kind] || PLATE_ONLY[kind] ? kind : 'book', title, variant), tx = pl.text, [t, r, b, l] = tx.box;
    const { fs, lines } = plateType(String(title || ''), by, tx, k.shape);
    const pos: any = { top: t == null ? 'auto' : `${t}%`, right: `${r}%`, bottom: b == null ? 'auto' : `${b}%`, left: `${l}%`, '--fs': `${fs}cqw`, '--lines': lines };
    if (tx.w) pos['--fw'] = tx.w;
    plate = (
      <div className={cx('mg-plate', `mg-plate--${kind}`)} role="img" aria-label={title} data-plate={pl.name}>
        <svg className="mg-plate__art" viewBox={`0 0 100 ${(PLATE_H as any)[k.shape]}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style={{ '--art-shift': `${pl.shift || 0}%` } as any} dangerouslySetInnerHTML={{ __html: pl.art }} />
        <div className={cx('mg-plate__text', `al-${tx.al}`, `va-${tx.va}`, tx.f === 'u' ? 'is-ui' : 'is-display', tx.up && 'is-caps', tx.band && 'is-band')} style={pos}>
          <span className="mg-plate__title">{title}</span>
          {by && <span className="mg-plate__by">{by}</span>}
        </div>
      </div>
    );
  }
  return (
    <figure className={cx('mg-cover', `mg-cover--${size}`, `mg-cover--${k.shape}`, k.bound && 'mg-cover--bound', status && `is-${status}`, ink && 'mg-inked', className)}
      style={{ ...inkVars(ink), ...(width ? { width } : {}), ...style }}>
      <div className="mg-cover__face">
        {src ? <img src={src} alt={alt ?? title ?? ''} loading="lazy" decoding="async" draggable={false} /> : plate}
      </div>
      {status === 'open' && <span className="mg-cover__ribbon" aria-hidden="true" />}
      {status === 'paused' && <span className="mg-cover__tail" aria-hidden="true" />}
      {status === 'finished' && <span className="mg-cover__seal" aria-hidden="true">{SEAL}</span>}
      {status === 'again' && <span className="mg-cover__loop" aria-hidden="true"><Icon name="again" size={14} strokeWidth={2} /></span>}
      {status === 'aside' && <span className="mg-cover__ear" aria-hidden="true" />}
    </figure>
  );
}

/* ── PageEdge (progress) ────────────────────────────────────────────────── */

function Tally({ count, max = 25 }: any) {
  const shown = Math.min(count, max), groups = Math.ceil(shown / 5), w = groups * 22;
  const marks: any[] = [];
  for (let g = 0; g < groups; g++) {
    const n = Math.min(5, shown - g * 5), x0 = g * 22 + 2;
    for (let i = 0; i < Math.min(n, 4); i++) marks.push(<path key={`${g}-${i}`} d={`M${x0 + i * 4} 2.5v11`} />);
    if (n === 5) marks.push(<path key={`${g}-x`} d={`M${x0 - 2} 11.5L${x0 + 14} 4.5`} />);
  }
  return (
    <span className="mg-tally">
      <svg width={w} height="16" viewBox={`0 0 ${w} 16`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">{marks}</svg>
      {count > max && <span className="mg-tally__more">+{count - max}</span>}
    </span>
  );
}

export function PageEdge({ value = 0, total, unit = 'chapter', caption, note, sessions, hours, size = 'md', ink, className }: any) {
  const endless = total == null;
  if (endless) {
    return (
      <div className={cx('mg-edge', 'mg-edge--endless', `mg-edge--${size}`, ink && 'mg-inked', className)} style={inkVars(ink)}>
        <Tally count={sessions ?? value} />
        <div className="mg-edge__cap ui-sm">
          <span>{caption ?? (hours != null ? `${hours} h` : '')}</span>
          <span className="mg-soft">{note ?? `${sessions ?? value} sittings`}</span>
        </div>
      </div>
    );
  }
  const pct = Math.max(0, Math.min(1, total ? value / total : 0));
  const u = unit === '%' ? '' : unit.charAt(0).toUpperCase() + unit.slice(1);
  return (
    <div className={cx('mg-edge', `mg-edge--${size}`, ink && 'mg-inked', className)} style={inkVars(ink)}
      role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={value} aria-label={caption ?? `${u} ${value} of ${total}`}>
      <div className="mg-edge__track">
        <div className="mg-edge__read" style={{ width: `${pct * 100}%` }} />
        <span className="mg-edge__mark" style={{ left: `${pct * 100}%` }} />
      </div>
      {size !== 'xs' && (
        <div className="mg-edge__cap ui-sm">
          <span>{caption ?? (unit === '%' ? `${value}%` : <>{u} {value} <span className="mg-soft">of {total}</span></>)}</span>
          {unit !== '%' && <span className="mg-soft">{Math.round(pct * 100)}%</span>}
        </div>
      )}
    </div>
  );
}

/* ── Verdict ────────────────────────────────────────────────────────────── */

export function Verdict({ value = 0, onChange, showWord = true, size = 'md', ink, className }: any) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const interactive = typeof onChange === 'function';
  const pips = [1, 2, 3, 4, 5].map((i) => {
    const on = i <= shown;
    if (!interactive) return <span key={i} className={cx('mg-pip', on && 'is-on')} style={{ '--i': i } as any} />;
    return (
      <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={VERDICT[i]} tabIndex={value === i || (!value && i === 1) ? 0 : -1}
        className={cx('mg-pip-hit')} style={{ '--i': i } as any}
        onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onFocus={() => setHover(0)}
        onClick={() => onChange(value === i ? 0 : i)}
        onKeyDown={(e: any) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(5, (value || 0) + 1)); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(1, (value || 1) - 1)); }
        }}>
        <span className={cx('mg-pip', on && 'is-on')} />
      </button>
    );
  });
  return (
    <div className={cx('mg-verdict', `mg-verdict--${size}`, interactive && 'is-input', ink && 'mg-inked', className)} style={inkVars(ink)}
      role={interactive ? 'radiogroup' : 'img'} aria-label={interactive ? 'Verdict' : `Verdict: ${VERDICT[value]}`}>
      <span className="mg-verdict__pips">{pips}</span>
      {showWord && <span className={cx('mg-verdict__word', 'aside', !shown && 'is-empty')}>{VERDICT[shown]}</span>}
    </div>
  );
}

/* ── Writing: Margin, Note, Quote, Review, Fleuron ──────────────────────── */

export function Margin({ ink, children, className }: any) {
  return <div className={cx('mg-margin', ink && 'mg-inked', className)} style={inkVars(ink)}>{children}</div>;
}

export function Note({ where, when, children, half = false, className }: any) {
  return (
    <article className={cx('mg-note', half && 'mg-note--half', className)}>
      <header className="mg-note__where ui-sm">{where && <span className="mg-note__at">{where}</span>}{when && <time>{when}</time>}</header>
      <div className={cx('mg-note__body', half ? 'aside' : 'read')}>{children}</div>
    </article>
  );
}

export function Quote({ children, source, work, ink, className }: any) {
  return (
    <figure className={cx('mg-quote', ink && 'mg-inked', className)} style={inkVars(ink)}>
      <blockquote><p className="quote">{children}</p></blockquote>
      {(source || work) && <figcaption className="ui-sm">{source}{source && work ? ', ' : ''}{work && <cite>{work}</cite>}</figcaption>}
    </figure>
  );
}

export function Review({ ink, children, className }: any) {
  return <div className={cx('mg-review', 'read', ink && 'mg-inked', className)} style={inkVars(ink)}>{children}</div>;
}

export function Fleuron({ className }: any) {
  const star = (x: number, y: number) => `M${x} ${y - 3.2}v6.4M${x - 2.8} ${y - 1.6}l5.6 3.2M${x - 2.8} ${y + 1.6}l5.6-3.2`;
  return (
    <div className={cx('mg-fleuron', className)} role="separator">
      <svg width="34" height="20" viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
        <path d={star(17, 5) + star(10, 14.5) + star(24, 14.5)} />
      </svg>
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────────────── */

export function Field({ label, multiline = false, hint, className, rows = 4, ...rest }: any) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className={cx('mg-field', className)}>
      {label && <span className="mg-field__label ui-sm">{label}</span>}
      <Tag className={cx('mg-field__input', multiline ? 'mg-field__input--write read' : 'ui-lg')} rows={multiline ? rows : undefined} {...rest} />
      {hint && <span className="mg-field__hint">{hint}</span>}
    </label>
  );
}

/* ── ShelfFilter ────────────────────────────────────────────────────────── */

export function ShelfFilter({ items = [], value, onChange, label = 'Filter', className }: any) {
  const ref = useRef(null);
  useLayoutEffect(() => { // keep the chosen chip in view (a kind picked off-screen, a restored filter), clear of the edge fades
    const show = () => {
      const el: any = ref.current, on = el && el.querySelector('.is-on');
      if (!on) return;
      const l = on.offsetLeft - el.offsetLeft, r = l + on.offsetWidth;
      if (l < el.scrollLeft + 24) el.scrollLeft = Math.max(0, l - 24);
      else if (r > el.scrollLeft + el.clientWidth - 48) el.scrollLeft = r - el.clientWidth + 48;
    };
    show();
    const d: any = typeof document !== 'undefined' ? document : null;
    if (d && d.fonts && d.fonts.ready) d.fonts.ready.then(show); // widths change once the faces load
  }, [value]);
  return (
    <div ref={ref} className={cx('mg-filter', className)} role="tablist" aria-label={label}>
      {items.map((it: any) => (
        <button key={it.id} type="button" role="tab" aria-selected={it.id === value} className={cx('mg-chip', 'ui', it.id === value && 'is-on')}
          onClick={() => onChange && onChange(it.id)}>
          {it.kind && <Icon name={it.kind} size={16} />}
          <span>{it.label}</span>
          {it.count != null && <span className="mg-chip__n">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ── EntryRow ───────────────────────────────────────────────────────────── */

export function EntryRow({ entry, onOpen, onStep, stepLabel = 'Log one more', flat = false, current = false, idle, onPutBack, onKeep, className }: any) {
  const { title, by, kind = 'book', status = 'open', ink, cover, progress, leftOff } = entry || {};
  const line = leftOff && status !== 'finished' && status !== 'aside' ? leftOff.short || leftOff.where : null;
  return (
    <div className={cx('mg-row', flat && 'mg-row--flat', current && 'is-current', onStep && 'has-step', ink && 'mg-inked', className)} style={inkVars(ink)}>
      <button type="button" className="mg-row__main" onClick={onOpen} aria-current={current ? 'page' : undefined}>
        <Cover title={title} by={by} kind={kind} src={cover} ink={ink} status={status === 'paused' ? 'paused' : undefined} size="xs" />
        <span className="mg-row__text">
          <span className="mg-row__title title-md">{title}</span>
          {line ? <span className="mg-row__left ui-sm"><span>{line}</span></span> : <span className="mg-row__by ui-sm">{by}</span>}
          <span className="mg-row__marks"><StatusMark status={status} kind={kind} date={entry.date} /><KindMark kind={kind} /></span>
        </span>
      </button>
      {onStep && <Button className="mg-row__step" variant="clay" icon="plus" label={stepLabel} onClick={onStep} />}
      {progress && <PageEdge className="mg-row__edge" size="sm" {...progress} />}
      {idle != null && <IdlePrompt className="mg-row__idle" days={idle} onPutBack={onPutBack} onKeep={onKeep} />}
    </div>
  );
}

/* ── Shelf ──────────────────────────────────────────────────────────────── */

export function Shelf({ entries = [], minCell = 96, onOpen, label, className }: any) {
  const ref = useRef(null);
  const [cols, setCols] = useState(3);
  useLayoutEffect(() => {
    const el: any = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]: any) => setCols(Math.max(3, Math.floor((e.contentRect.width + 12) / (minCell + 12)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [minCell]);
  const tiers: any[] = [];
  for (let i = 0; i < entries.length; i += cols) tiers.push(entries.slice(i, i + cols));
  const grid = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };
  // a paused thing says where its place is kept, instead of who made it
  const sub = (e: any) => (e.status === 'paused' ? `Paused${e.leftOff ? ' · ' + (e.leftOff.where || '') : ''}` : e.by);
  return (
    <section ref={ref} className={cx('mg-shelf', className)} aria-label={label}>
      {tiers.map((tier, t) => (
        <div className="mg-shelf__tier" key={t}>
          <div className="mg-shelf__books" style={grid}>
            {tier.map((e: any, i: number) => (
              <button type="button" key={i} className="mg-shelf__book" onClick={() => onOpen && onOpen(e)} aria-label={`${e.title}${sub(e) ? ', ' + sub(e) : ''}`}>
                <Cover title={e.title} by={e.by} kind={e.kind} src={e.cover} ink={e.ink} status={e.status} size="fill" />
              </button>
            ))}
          </div>
          <div className="mg-shelf__plank" aria-hidden="true" />
          <div className="mg-shelf__labels" style={grid} aria-hidden="true">
            {tier.map((e: any, i: number) => (
              <span className={cx('mg-shelf__label', e.status === 'paused' && 'is-paused')} key={i}><span className="mg-shelf__t title-sm">{e.title}</span>{sub(e) && <span className="mg-shelf__b ui-sm">{sub(e)}</span>}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── EntryHeader (the top of an entry page) ─────────────────────────────── */

export function EntryHeader({ entry, verdict = 0, onVerdict, onBack, onMore, wide = false, compact = false, coverSize, className }: any) {
  const { title, by, kind = 'book', status, date, ink, cover } = entry || {};
  return (
    <header className={cx('mg-entryhead', wide && 'mg-entryhead--wide', compact && 'mg-entryhead--compact', ink && 'mg-inked', className)} style={inkVars(ink)}>
      <div className="mg-entryhead__endpaper" aria-hidden="true" />
      {(onBack || onMore) && (
        <div className="mg-entryhead__bar">
          {onBack ? <Button variant="clay" size="sm" icon="back" label="Back" onClick={onBack} /> : <span />}
          {onMore && <Button variant="clay" size="sm" icon="more" label="More" onClick={onMore} />}
        </div>
      )}
      <Cover title={title} by={by} kind={kind} src={cover} ink={ink} status={status} size={coverSize || (wide ? 'lg' : compact ? 'sm' : 'md')} className="mg-entryhead__cover" />
      <div className="mg-entryhead__text">
        <h1 className={cx('mg-entryhead__title', compact ? 'title-lg' : 'title-xl')}>{title}</h1>
        {by && <p className="mg-entryhead__by ui-sm">{by}</p>}
        <div className="mg-entryhead__marks"><KindMark kind={kind} />{status && <StatusMark status={status} kind={kind} date={date} />}</div>
        {!compact && <Verdict value={verdict} onChange={onVerdict} />}
      </div>
    </header>
  );
}

/* ── Where I left it: LeftOff, Keymap, Key ──────────────────────────────── */

const PAD_ROUND = /^(A|B|X|Y|△|○|✕|□)$/;
const PAD_PILL = /^(LB|RB|LT|RT|L1|R1|L2|R2|L3|R3|LS|RS|Start|Select|View|Menu|Options|D-pad.*)$/i;
const MOUSE = /^(LMB|RMB|MMB|M[345]|Mouse ?\d|Wheel.*|Scroll.*)$/i;

export function Key({ k, className }: any) {
  const t = String(k).trim();
  const kind = PAD_ROUND.test(t) ? 'pad' : PAD_PILL.test(t) ? 'pill' : MOUSE.test(t) ? 'mouse' : t.length > 1 ? 'wide' : 'char';
  return <kbd className={cx('mg-key', `mg-key--${kind}`, className)}>{t}</kbd>;
}

/** "Shift+E", "Caps or M", "LB+A" → keycaps; "or" separates alternatives, "+" joins a chord. */
export function Keys({ keys, className }: any) {
  const alts = String(keys).split(/\s+or\s+/i);
  return (
    <span className={cx('mg-keys', className)}>
      {alts.map((alt, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mg-keys__or ui-sm">or</span>}
          {alt.split('+').map((k, j) => (
            <Fragment key={j}>{j > 0 && <span className="mg-keys__plus" aria-hidden="true">+</span>}<Key k={k} /></Fragment>
          ))}
        </Fragment>
      ))}
    </span>
  );
}

export function Keymap({ binds = [], pinnedOnly = false, grouped = true, more, className }: any) {
  const [open, setOpen] = useState(false);
  pinnedOnly = pinnedOnly && !open;
  const rows = pinnedOnly ? binds.filter((b: any) => b.pinned) : binds;
  const groups: any[] = [];
  rows.forEach((b: any) => {
    const g = grouped && !pinnedOnly ? b.group || '' : '';
    let last = groups[groups.length - 1];
    if (!last || last.name !== g) groups.push((last = { name: g, rows: [] }));
    last.rows.push(b);
  });
  const hidden = binds.length - rows.length;
  return (
    <div className={cx('mg-keymap', className)}>
      {groups.map((g, i) => (
        <div key={i} className="mg-keymap__group">
          {g.name && <p className="mg-keymap__name label">{g.name}</p>}
          <dl className="mg-keymap__rows">
            {g.rows.map((b: any, j: number) => (
              <div key={j} className={cx('mg-keymap__row', b.pinned && !pinnedOnly && 'is-pinned')}>
                <dt className="ui">{b.action}</dt>
                <span className="mg-keymap__lead" aria-hidden="true" />
                <dd><Keys keys={b.keys} /></dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {pinnedOnly && hidden > 0 && (more
        ? <p className="mg-keymap__more ui-sm">{more}</p>
        : <button type="button" className="mg-keymap__more mg-keymap__toggle ui-sm" aria-expanded="false" onClick={() => setOpen(true)}>All {binds.length} keys</button>)}
      {open && <button type="button" className="mg-keymap__more mg-keymap__toggle ui-sm" aria-expanded="true" onClick={() => setOpen(false)}>Only the ones I forget</button>}
    </div>
  );
}

export function LeftOff({ entry, leftOff, keymap, keysMore, onUpdate, className }: any) {
  const lo = leftOff || (entry && entry.leftOff) || {};
  const km = keymap || (entry && entry.keymap);
  const ink = entry && entry.ink;
  return (
    <section className={cx('mg-leftoff', ink && 'mg-inked', className)} style={inkVars(ink)} aria-label="Where I left it">
      <span className="mg-leftoff__ribbon" aria-hidden="true" />
      <header className="mg-leftoff__head">
        <span className="label">Where I left it</span>
        {lo.when && <time className="ui-sm">{lo.when}</time>}
      </header>
      {lo.where && <p className="mg-leftoff__where title-md">{lo.where}</p>}
      {lo.note && <p className="mg-leftoff__note read">{lo.note}</p>}
      {onUpdate && <div className="mg-leftoff__act"><Button icon="open" onClick={onUpdate}>Update where I left it</Button></div>}
      {lo.facts && lo.facts.length > 0 && (
        <dl className="mg-leftoff__facts">
          {lo.facts.map((f: any, i: number) => <div key={i}><dt className="ui-sm">{f[0]}</dt><dd className="ui-sm">{f[1]}</dd></div>)}
        </dl>
      )}
      {km && km.length > 0 && <Keymap binds={km} pinnedOnly={km.some((b: any) => b.pinned)} more={keysMore} />}
    </section>
  );
}

/* ── Stepper (log progress) ─────────────────────────────────────────────── */

export function Stepper({ value = 0, total, unit = 'chapter', onChange, className }: any) {
  const set = (v: number) => onChange && onChange(Math.max(0, total ? Math.min(total, v) : v));
  return (
    <div className={cx('mg-stepper', className)}>
      <Button variant="clay" size="lg" icon="minus" label={`One ${unit} back`} onClick={() => set(value - 1)} disabled={value <= 0} />
      <div className="mg-stepper__read" aria-live="polite">
        <span className="mg-stepper__n numeral" key={value}>{value}</span>
        <span className="mg-stepper__unit ui-sm">{total ? `of ${total} ${plural(unit)}` : (value === 1 ? unit : plural(unit))}</span>
      </div>
      <Button variant="clay" size="lg" icon="plus" label={`One more ${unit}`} onClick={() => set(value + 1)} disabled={total != null && value >= total} />
    </div>
  );
}

/* ── Sheet ──────────────────────────────────────────────────────────────── */

export function Sheet({ title, children, footer, onClose, contained = false, className }: any) {
  return (
    <div className={cx('mg-sheetwrap', contained && 'is-contained', className)}>
      <div className="mg-scrim" onClick={onClose} />
      <section className="mg-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mg-sheet__grab" aria-hidden="true" />
        {title && (
          <header className="mg-sheet__head">
            <h2 className="mg-sheet__title title-md">{title}</h2>
            {onClose && <Button variant="ghost" size="sm" icon="close" label="Close" onClick={onClose} />}
          </header>
        )}
        <div className="mg-sheet__body">{children}</div>
        {footer && <footer className="mg-sheet__foot">{footer}</footer>}
      </section>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────── */

export function Toast({ children, action, onAction, className }: any) {
  return (
    <div className={cx('mg-toast', className)} role="status">
      <Icon name="check" size={18} />
      <span className="mg-toast__text ui">{children}</span>
      {action && <button type="button" className="mg-toast__action ui" onClick={onAction}>{action}</button>}
    </div>
  );
}

/* ── Shelves: the switch at the top of each part, and the part's header ──── */

export function ShelfSwitch({ value = 'open', onChange, counts, label = 'Shelf', className }: any) {
  return (
    <div className={cx('mg-switch', className)} role="tablist" aria-label={label}>
      {SHELVES.map((id) => (
        <button key={id} type="button" role="tab" aria-selected={id === value} className={cx('mg-switch__seg', id === value && 'is-on')}
          onClick={() => onChange && onChange(id)}>
          <span className="ui">{SHELF[id].word}</span>
          {counts && counts[id] != null && <span className="mg-switch__n ui-sm">{counts[id]}</span>}
        </button>
      ))}
    </div>
  );
}

/** The top of Media or Prologue: kicker, name, Journal and Find, then the shelf switch. */
export function PartHeader({ title, kicker, shelf, onShelf, counts, onFind, onJournal, onBack, className }: any) {
  return (
    <header className={cx('mg-parthead', className)}>
      <div className="mg-parthead__top">
        {onBack && <Button size="sm" icon="back" label="Back" onClick={onBack} />}
        <div className="mg-parthead__name">
          {kicker && <p className="label">{kicker}</p>}
          <h1 className="title-lg">{title}</h1>
        </div>
        <div className="mg-parthead__acts">
          {onJournal && <Button size="sm" icon="journal" label="Journal" onClick={onJournal} />}
          {onFind && <Button size="sm" icon="find" label="Find" aria-keyshortcuts="/" onClick={onFind} />}
        </div>
      </div>
      {shelf && <ShelfSwitch value={shelf} onChange={onShelf} counts={counts} />}
    </header>
  );
}

/** Asked once, never repeated, never acted on by itself: an open thing that has gone quiet. */
export function IdlePrompt({ days = 21, onPutBack, onKeep, className }: any) {
  return (
    <div className={cx('mg-idle', className)} role="group" aria-label="Not touched lately">
      <Icon name="idle" size={16} />
      <p className="mg-idle__text ui-sm"><b>Untouched for {idleWords(days)}.</b> Put it back on Waiting? Your place is kept.</p>
      <div className="mg-idle__acts">
        <Button size="sm" onClick={onPutBack}>Put back</Button>
        <Button size="sm" variant="ghost" onClick={onKeep}>Keep it open</Button>
      </div>
    </div>
  );
}

/** One inline line when a save (or a search) fails. Whatever was typed stays where it was. */
export function InlineError({ children = 'Not saved. The server didn’t answer.', onRetry, retryLabel = 'Retry', className }: any) {
  return (
    <div className={cx('mg-error', className)} role="alert">
      <Icon name="alert" size={16} />
      <span className="mg-error__text ui-sm">{children}</span>
      {onRetry && <button type="button" className="mg-error__retry ui-sm" onClick={onRetry}><Icon name="retry" size={14} /><span>{retryLabel}</span></button>}
    </div>
  );
}

/** An empty shelf, journal or search: a small pen drawing, one line, a quiet way forward. */
export function Empty({ drawing = 'shelf', title, children, action, className }: any) {
  return (
    <div className={cx('mg-empty', className)}>
      <svg className="mg-empty__art" viewBox="0 0 120 72" width="120" height="72" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" dangerouslySetInnerHTML={{ __html: EMPTY[drawing] || EMPTY.shelf }} />
      <p className="mg-empty__title title-md">{title}</p>
      {children && <p className="mg-empty__text aside">{children}</p>}
      {action && <div className="mg-empty__act">{action}</div>}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder = 'Find a title, a person, a line…', autoFocus, label = 'Find', className }: any) {
  const [own, setOwn] = useState('');
  const v = value ?? own;
  const set = (x: string) => (onChange ? onChange(x) : setOwn(x));
  return (
    <label className={cx('mg-search', className)}>
      <Icon name="find" size={20} />
      <input className="mg-search__input ui-lg" type="search" value={v} onChange={(e: any) => set(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
        aria-label={label} enterKeyHint="search" autoComplete="off" spellCheck={false} />
      {v && <button type="button" className="mg-search__clear" aria-label="Clear" onClick={() => set('')}><Icon name="close" size={18} /></button>}
    </label>
  );
}

const mark = (text: string, q: string) => {
  const i = q ? String(text).toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark className="mg-mark">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
};

/* ── Add entry: search a catalogue by kind, or add it by hand ───────────── */

export const PROVIDERS: Record<string, { name: string; what: string }> = {
  TMDB: { name: 'TMDB', what: 'films and series' }, AniList: { name: 'AniList', what: 'anime and manga' },
  IGDB: { name: 'IGDB', what: 'games' }, 'Open Library': { name: 'Open Library', what: 'books' },
};

function ClothPicker({ value, onChange }: any) {
  return (
    <div className="mg-cloths" role="radiogroup" aria-label="Cloth">
      <button type="button" role="radio" aria-checked={!value} className={cx('mg-cloths__auto', 'ui-sm', !value && 'is-on')} onClick={() => onChange && onChange(null)}>Auto</button>
      {CORE_24.map((c) => (
        <button key={c.id} type="button" role="radio" aria-checked={value === c.id} aria-label={c.name} title={c.name}
          className={cx('mg-cloths__sw', value === c.id && 'is-on')} style={{ backgroundColor: c.hex }} onClick={() => onChange && onChange(c.id)} />
      ))}
    </div>
  );
}

export function AddEntry({ kind = 'film', onKind, query = '', onQuery, state = 'results', results = [], onPick, onOpenExisting, onRetry, error,
  starting = false, onStarting, manual = {}, onManual, onManualChange, onBack, onAdd, onClose, contained = false, className }: any) {
  const k = (KIND as any)[kind] || KIND.book, provider = k.provider, typed = String(query || '').trim();
  const mode = !provider ? 'manual' : state;
  const lands = starting ? 'Open' : 'Waiting';
  const kinds = KINDS.map((id) => ({ id, label: (KIND as any)[id].word, kind: id }));
  const byHand = <Button variant="lamp" size="lg" icon="note" onClick={onManual}>{typed ? `Add ‘${typed}’ by hand` : 'Add it by hand'}</Button>;
  const m = { title: typed, ...manual };
  const cloth = m.cloth ? clothById(m.cloth) : null;
  let body: any = null, footer: any = null;
  if (mode === 'manual') {
    body = (
      <div className="mg-manual">
        <div className="mg-manual__preview">
          <Cover title={m.title || 'Untitled'} by={m.by} kind={kind} ink={cloth ? cloth.hex : undefined} size="sm" />
          <p className="aside">The cover it wears until it has art. Pick a cloth, or leave it to the title.</p>
        </div>
        <Field label="Title" value={m.title} onChange={(e: any) => onManualChange && onManualChange({ ...m, title: e.target.value })} />
        <Field label="By" placeholder="Who made it" value={m.by || ''} onChange={(e: any) => onManualChange && onManualChange({ ...m, by: e.target.value })} />
        {k.unit && (
          <div className="mg-manual__row">
            <Field label="How long" placeholder="—" inputMode="numeric" value={m.total || ''} onChange={(e: any) => onManualChange && onManualChange({ ...m, total: e.target.value })} />
            <Field label="Counted in" value={m.unit || plural(k.unit)} onChange={(e: any) => onManualChange && onManualChange({ ...m, unit: e.target.value })} />
          </div>
        )}
        <div className="mg-field"><span className="mg-field__label ui-sm">Cloth</span><ClothPicker value={m.cloth} onChange={(id: any) => onManualChange && onManualChange({ ...m, cloth: id })} /></div>
        {error && <InlineError onRetry={onRetry}>{error === true ? 'Not saved. The server didn’t answer; everything you typed is still here.' : error}</InlineError>}
        {provider && onBack && <Button variant="ghost" icon="find" onClick={onBack}>Back to {provider}</Button>}
      </div>
    );
    footer = <Button variant="lamp" size="lg" icon="plus" onClick={onAdd}>Add to {lands}</Button>;
  } else if (mode === 'searching') {
    body = <p className="mg-add__status ui-sm">Searching {provider} for ‘{typed}’…</p>;
  } else if (mode === 'empty') {
    body = <Empty drawing="find" title={`Nothing called ‘${typed}’ on ${provider}`}>Spelled another way, maybe. Or add it yourself; it still gets a cover.</Empty>;
    footer = byHand;
  } else if (mode === 'error') {
    body = <InlineError onRetry={onRetry}>{error && error !== true ? error : `${provider} didn’t answer. Your search is kept.`}</InlineError>;
    footer = byHand;
  } else {
    body = (
      <>
        <ul className="mg-results">
          {results.map((r: any, i: number) => (
            <li key={i}>
              <button type="button" className={cx('mg-result', r.inLibrary && 'is-owned')} onClick={() => (r.inLibrary ? onOpenExisting && onOpenExisting(r) : onPick && onPick(r))}>
                <Cover title={r.title} kind={kind} src={r.cover} ink={r.ink} size="xs" />
                <span className="mg-result__text">
                  <span className="mg-result__title title-md">{mark(r.title, typed)}</span>
                  <span className="ui-sm mg-soft">{[r.year, r.by].filter(Boolean).join(' · ')}</span>
                  {r.total != null && <span className="ui-sm mg-soft">{r.total} {r.total === 1 ? r.unit || k.unit : plural(r.unit || k.unit || '')}</span>}
                </span>
                {r.inLibrary && <span className="mg-result__owned ui-sm"><span>In your library</span><Icon name="next" size={16} /></span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="mg-results__foot">
          <Button variant="ghost" icon="note" onClick={onManual}>Not here? Add it by hand</Button>
          <span className="ui-sm mg-soft">Results from {provider}</span>
        </div>
      </>
    );
  }
  return (
    <Sheet contained={contained} title="Add to Media" onClose={onClose} footer={footer} className={cx('mg-add', className)}>
      <ShelfFilter items={kinds} value={kind} onChange={onKind} label="Kind" />
      {mode !== 'manual' && <SearchField value={query} onChange={onQuery} placeholder={`Search ${PROVIDERS[provider] ? PROVIDERS[provider].what : k.plural.toLowerCase()} by title`} label={`Search ${provider}`} />}
      {!provider && <p className="mg-add__status ui-sm">No catalogue for {k.plural.toLowerCase()}: add it by hand.</p>}
      <div className="mg-add__lands">
        <button type="button" role="switch" aria-checked={starting} className={cx('mg-chip', 'ui', starting && 'is-on')} onClick={() => onStarting && onStarting(!starting)}>
          <Icon name="open" size={16} /><span>Starting now</span>
        </button>
        <span className="ui-sm mg-soft">Lands on {lands}</span>
      </div>
      {body}
    </Sheet>
  );
}

/* ── Find: titles, people, lines ────────────────────────────────────────── */

export function FindResults({ query = '', titles = [], people = [], lines = [], onOpen, onAdd, addLabel, part = 'media', className }: any) {
  const q = String(query).trim();
  const add = onAdd && <Button icon="plus" onClick={onAdd}>{addLabel || (part === 'media' ? `Add ‘${q}’` : `Capture ‘${q}’`)}</Button>;
  if (!titles.length && !people.length && !lines.length) {
    return <Empty drawing="find" title={`Nothing for ‘${q}’`} action={add} className={className}>Nothing on your shelves or in your margins matches. Check the spelling, or add it.</Empty>;
  }
  return (
    <div className={cx('mg-find', className)}>
      {titles.length > 0 && (
        <section className="mg-find__sec">
          <p className="label">Titles</p>
          <ul className="mg-find__list">
            {titles.map((e: any, i: number) => (
              <li key={i}>
                <button type="button" className={cx('mg-hit', e.ink && 'mg-inked')} style={inkVars(e.ink)} onClick={() => onOpen && onOpen(e)}>
                  <Cover title={e.title} kind={e.kind} src={e.cover} ink={e.ink} status={e.status === 'paused' ? 'paused' : undefined} size="xs" />
                  <span className="mg-hit__text">
                    <span className="mg-hit__title title-md">{mark(e.title, q)}</span>
                    <span className="mg-hit__marks"><StatusMark status={e.status || 'shelved'} kind={e.kind} /><span className="ui-sm mg-soft">on {SHELF[shelfOf(e.status || 'shelved')].word}</span></span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {people.length > 0 && (
        <section className="mg-find__sec">
          <p className="label">People</p>
          <ul className="mg-find__list">
            {people.map((p: any, i: number) => (
              <li key={i}>
                <button type="button" className="mg-hit mg-hit--person" onClick={() => onOpen && onOpen(p)}>
                  <span className="mg-hit__initial title-md" aria-hidden="true">{String(p.name).trim().charAt(0)}</span>
                  <span className="mg-hit__text">
                    <span className="mg-hit__title title-sm">{mark(p.name, q)}</span>
                    <span className="ui-sm mg-soft">{p.count} {p.count === 1 ? 'entry' : 'entries'}{p.kinds ? ' · ' + p.kinds : ''}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {lines.length > 0 && (
        <section className="mg-find__sec">
          <p className="label">Lines in notes and reviews</p>
          <ul className="mg-find__list">
            {lines.map((l: any, i: number) => (
              <li key={i}>
                <button type="button" className="mg-hit mg-hit--line" onClick={() => onOpen && onOpen(l)}>
                  <span className="mg-hit__quote read-sm">{mark(l.text, q)}</span>
                  <span className="ui-sm mg-soft">{[l.where, l.title, l.when].filter(Boolean).join(' · ')}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {add && <div className="mg-find__add">{add}</div>}
    </div>
  );
}

/* ── Journal: one per part, by day and month ────────────────────────────── */

const JOURNAL_EVENT: Record<string, { word: (it: any) => string; icon: string; tone: string }> = {
  note:     { word: () => 'Margin note',          icon: 'note',     tone: 'ink' },
  started:  { word: () => 'Started',              icon: 'open',     tone: 'lamp' },
  finished: { word: () => 'Finished',             icon: 'finished', tone: 'quill' },
  aside:    { word: () => 'Set aside',            icon: 'aside',    tone: 'faint' },
  paused:   { word: () => 'Put back on Waiting',  icon: 'paused',   tone: 'soft' },
  again:    { word: (it) => (KIND as any)[it.kind] ? (KIND as any)[it.kind].again : 'Again', icon: 'again', tone: 'moss' },
  captured: { word: () => 'Captured',             icon: 'unsorted', tone: 'soft' },
  done:     { word: () => 'Done',                 icon: 'check',    tone: 'quill' },
  cametrue: { word: () => 'Came true',            icon: 'finished', tone: 'quill' },
};

export function Journal({ months = [], years, year, onYear, onOpen, part = 'media', className }: any) {
  return (
    <div className={cx('mg-journal', className)}>
      {years && years.length > 1 && (
        <div className="mg-journal__years" role="tablist" aria-label="Jump to a year">
          {years.map((y: any) => (
            <button key={y} type="button" role="tab" aria-selected={y === year} className={cx('mg-chip', 'ui', y === year && 'is-on')} onClick={() => onYear && onYear(y)}>{y}</button>
          ))}
        </div>
      )}
      {months.map((m: any, i: number) => (
        <section key={i} className="mg-jmonth" aria-label={m.label}>
          <h2 className="mg-jmonth__name title-md">{m.label}</h2>
          {m.days.map((d: any, j: number) => (
            <div key={j} className="mg-jday">
              <div className="mg-jday__date"><span className="mg-jday__n">{d.day}</span><span className="ui-sm">{d.weekday}</span></div>
              <ol className="mg-jday__items">
                {d.items.map((it: any, n: number) => {
                  const ev = JOURNAL_EVENT[it.type] || JOURNAL_EVENT.note;
                  const plate = part === 'media' ? it.kind : it.dream ? 'idea' : null;
                  return (
                    <li key={n}>
                      <button type="button" className={cx('mg-jitem', `is-${it.type}`, it.ink && 'mg-inked')} style={inkVars(it.ink)} onClick={() => onOpen && onOpen(it)}>
                        <span className={cx('mg-jitem__glyph', `tone-${ev.tone}`)}><Icon name={ev.icon} size={16} /></span>
                        <span className="mg-jitem__body">
                          <span className="mg-jitem__line ui-sm"><span className="mg-jitem__verb">{ev.word(it)}</span>{it.where && <span> · {it.where}</span>}{it.time && <span> · {it.time}</span>}</span>
                          <span className="mg-jitem__title title-sm">{it.title}</span>
                          {it.text && <span className="mg-jitem__text read-sm">{it.text}</span>}
                        </span>
                        {plate && <Cover title={it.title} kind={plate} src={it.cover} ink={it.ink} status={it.type === 'finished' || it.type === 'cametrue' ? 'finished' : undefined} size="xs" className="mg-jitem__cover" />}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/* ── Prologue: tasks and dreams ─────────────────────────────────────────── */

export const HORIZON: Record<Horizon, { word: string; icon: string }> = {
  unsorted: { word: 'Unsorted', icon: 'unsorted' },
  soon: { word: 'Soon', icon: 'soon' },
  someday: { word: 'Someday', icon: 'someday' },
};

/** A group inside Waiting: Unsorted (the inbox), Soon, Someday. */
export function HorizonMark({ horizon = 'soon', count, className }: any) {
  const h = (HORIZON as any)[horizon] || HORIZON.soon;
  return (
    <span className={cx('mg-horizon', `mg-horizon--${horizon}`, 'ui-sm', className)}>
      <Icon name={h.icon} size={16} /><span>{h.word}</span>{count != null && <span className="mg-horizon__n">{count}</span>}
    </span>
  );
}

const planState = (item: any): PlanState => item.state || (item.done ? 'done' : 'waiting');

function IntentionMeta({ item, state, showState, showHorizon, onOpenEntry }: any) {
  const { horizon, due, steps, entry, stateDate } = item;
  const kind = item.kind === 'dream' ? 'dream' : 'task';
  const bits: any[] = [];
  if (showState || state === 'paused' || state === 'aside') {
    const w = PLAN_WORD[state as PlanState];
    bits.push(<span key="st" className={cx('mg-int__state', `tone-${w.tone}`)}><Icon name={w.icon} size={14} /><span>{w[kind as 'task' | 'dream']}{stateDate ? ` · ${stateDate}` : ''}</span></span>);
  }
  if (showHorizon && horizon && state === 'waiting') bits.push(<HorizonMark key="h" horizon={horizon} />);
  if (due) bits.push(<span key="d">{due}</span>);
  if (steps) bits.push(<span key="s">{steps.done} of {steps.total} steps</span>);
  if (entry) bits.push(
    <button key="e" type="button" className="mg-int__entry" onClick={(e: any) => { e.stopPropagation(); onOpenEntry && onOpenEntry(entry); }} aria-label={`Open ${entry.title}`}>
      <Icon name={entry.kind || 'link'} size={14} /><span>{entry.title}</span>
    </button>);
  if (!bits.length) return null;
  return <span className="mg-int__meta ui-sm">{bits}</span>;
}

export function Intention({ item, onToggle, onOpen, onOpenEntry, onPutBack, onKeep, showState = false, showHorizon = false, dragHandle = false, className }: any) {
  const { text, kind = 'task', doneDate, why, steps, idle } = item || {};
  const state = planState(item || {});
  const done = state === 'done';
  if (kind === 'dream') {
    const ink = item.ink || autoCloth(String(text || '')).hex; // a dream always has a cloth: picked, or taken from its words
    const w = PLAN_WORD[state];
    const coverState = state === 'open' ? 'open' : state === 'paused' ? 'paused' : state === 'aside' ? 'aside' : undefined;
    return (
      <article className={cx('mg-dream', `is-${state}`, done && 'is-true', 'mg-inked', className)} style={inkVars(ink)}>
        <div className="mg-dream__cover" aria-hidden="true" onClick={onOpen}><Cover title={text} kind="idea" ink={ink} variant={item.plate} status={coverState} size="xs" /></div>
        <button type="button" className="mg-dream__main" onClick={onOpen}>
          <span className={cx('mg-dream__kind', 'ui-sm', `tone-${w.tone}`)}><Icon name={state === 'waiting' ? 'dream' : w.icon} size={16} /><span>{w.dream}{done && doneDate ? ' · ' + doneDate : ''}</span></span>
          <span className="mg-dream__title title-md">{text}</span>
          {why && <span className="mg-dream__why aside">{why}</span>}
          {steps && !done && <PageEdge size="sm" value={steps.done} total={steps.total} unit="step" />}
        </button>
        <div className="mg-dream__meta"><IntentionMeta item={{ ...item, steps: undefined }} state={state} showHorizon={showHorizon} onOpenEntry={onOpenEntry} /></div>
        {idle != null && <IdlePrompt className="mg-dream__idle" days={idle} onPutBack={onPutBack} onKeep={onKeep} />}
        {done && <span className="mg-cover__seal mg-dream__seal" aria-hidden="true">{SEAL}</span>}
      </article>
    );
  }
  return (
    <div className={cx('mg-int', `is-${state}`, done && 'is-done', dragHandle && 'has-grip', className)}>
      {dragHandle && <span className="mg-int__grip" aria-hidden="true"><Icon name="grip" size={16} /></span>}
      <button type="button" role="checkbox" aria-checked={done} aria-label={done ? `Not done: ${text}` : `Done: ${text}`} className="mg-int__check" onClick={onToggle}>
        <span className="mg-int__pip"><Icon name="check" size={14} strokeWidth={2.75} /></span>
      </button>
      <div className="mg-int__body">
        <button type="button" className="mg-int__main" onClick={onOpen}>
          <span className="mg-int__text read"><span className="mg-int__strike">{text}</span></span>
        </button>
        <IntentionMeta item={item} state={state} showState={showState} showHorizon={showHorizon} onOpenEntry={onOpenEntry} />
      </div>
      {idle != null && <IdlePrompt className="mg-int__idle" days={idle} onPutBack={onPutBack} onKeep={onKeep} />}
    </div>
  );
}

export function Capture({ value, onChange, onSubmit, horizon = 'unsorted', onHorizon, dream = false, onDream, autoFocus, error, onRetry, className }: any) {
  const [own, setOwn] = useState('');
  const v = value ?? own;
  const set = (x: string) => (onChange ? onChange(x) : setOwn(x));
  return (
    <form className={cx('mg-capture', className)} onSubmit={(e: any) => { e.preventDefault(); if (v.trim() && onSubmit) onSubmit({ text: v.trim(), horizon, kind: dream ? 'dream' : 'task', state: 'waiting' }); set(''); }}>
      <label className="mg-capture__well">
        <Icon name={dream ? 'dream' : 'plus'} size={20} />
        <input className="mg-capture__input read" value={v} onChange={(e: any) => set(e.target.value)} autoFocus={autoFocus}
          placeholder={dream ? 'Something to dream about…' : 'Something to do, now or later…'} enterKeyHint="done" aria-label="New task or dream" />
        <span className="mg-capture__enter ui-sm" aria-hidden="true">↵</span>
      </label>
      {error && <InlineError onRetry={onRetry}>{error === true ? 'Not saved. The server didn’t answer; the line is still in the field.' : error}</InlineError>}
      <div className="mg-capture__opts" role="radiogroup" aria-label="When">
        {HORIZONS.map((h) => (
          <button key={h} type="button" role="radio" aria-checked={horizon === h} className={cx('mg-chip', 'ui', horizon === h && 'is-on')} onClick={() => onHorizon && onHorizon(h)}>
            <Icon name={HORIZON[h].icon} size={16} /><span>{HORIZON[h].word}</span>
          </button>
        ))}
        <span className="mg-capture__sep" aria-hidden="true" />
        <button type="button" role="switch" aria-checked={dream} className={cx('mg-chip', 'ui', 'mg-capture__dream', dream && 'is-on')} onClick={() => onDream && onDream(!dream)}>
          <Icon name="dream" size={16} /><span>Dream</span>
        </button>
      </div>
    </form>
  );
}

/* ── Navigation: two parts, never mixed ─────────────────────────────────── */

export const PARTS = [
  { id: 'media', label: 'Media', icon: 'media', add: 'Add an entry' },
  { id: 'prologue', label: 'Prologue', icon: 'prologue', add: 'Capture a task or dream' },
];
const addLabel = (part: string) => (PARTS.find((p) => p.id === part) || PARTS[0]).add;

/** Compact layouts: Media · + · Prologue. The + adds an entry on Media and opens Capture on Prologue. */
export function Dock({ value = 'media', onChange, onAdd, onLog, contained = false, className }: any) {
  const item = (it: any) => (
    <button key={it.id} type="button" className={cx('mg-dock__item', it.id === value && 'is-on')} aria-current={it.id === value ? 'page' : undefined}
      onClick={() => onChange && onChange(it.id)}>
      <span className="mg-dock__bead"><Icon name={it.icon} size={22} /></span>
      <span className="mg-dock__label tab">{it.label}</span>
    </button>
  );
  return (
    <nav className={cx('mg-dock', contained && 'is-contained', className)} aria-label="Main">
      <div className="mg-dock__bar">
        {item(PARTS[0])}
        <button type="button" className="mg-dock__log" aria-label={addLabel(value)} onClick={onAdd || onLog}><Icon name="plus" size={26} strokeWidth={2} /></button>
        {item(PARTS[1])}
      </div>
    </nav>
  );
}

/** Medium and up: +, each part with its Journal under it, then Find. */
export function Rail({ value = 'media', onChange, onAdd, onLog, className }: any) {
  const part = String(value).split('-')[0];
  const go = (id: string) => () => onChange && onChange(id);
  const item = (id: string, label: string, icon: string, sub = false) => (
    <button key={id} type="button" className={cx('mg-rail__item', sub && 'mg-rail__item--sub', id === value && 'is-on')} aria-current={id === value ? 'page' : undefined} onClick={go(id)}>
      <span className="mg-dock__bead"><Icon name={icon} size={sub ? 18 : 22} /></span>
      <span className="mg-dock__label tab">{label}</span>
    </button>
  );
  return (
    <nav className={cx('mg-rail', className)} aria-label="Main">
      <button type="button" className="mg-rail__log" aria-label={addLabel(part === 'find' ? 'media' : part)} onClick={onAdd || onLog}><Icon name="plus" size={24} strokeWidth={2} /></button>
      {item('media', 'Media', 'media')}
      {item('media-journal', 'Journal', 'journal', true)}
      <span className="mg-rail__rule" aria-hidden="true" />
      {item('prologue', 'Prologue', 'prologue')}
      {item('prologue-journal', 'Journal', 'journal', true)}
      <span className="mg-rail__rule" aria-hidden="true" />
      {item('find', 'Find', 'find')}
    </nav>
  );
}

/* ── namespace ──────────────────────────────────────────────────────────── */

const Marginalia = {
  Icon, Inked, Button, KindMark, StatusMark, EntryCover: Cover, PageEdge, Verdict, Margin, Note, Quote, Review, Fleuron, Field,
  ShelfFilter, EntryRow, Shelf, EntryHeader, Stepper, Sheet, Toast, Dock, Rail,
  ShelfSwitch, PartHeader, IdlePrompt, InlineError, Empty, SearchField, AddEntry, FindResults, Journal,
  Intention, Capture, HorizonMark, LeftOff, Keymap, Keys, Key,
  CLOTHS, CORE_24, clothById, nearestCloth, autoCloth, SKETCH, EMPTY, PLATES, plateFor,
  bindInk, inkVars, sampleCover, contrast, toOklch, fromOklch, statusWord, shelfOf, planShelfOf, idleWords,
  KIND, VERDICT, HORIZON, SHELF, PLAN_WORD, PARTS, PROVIDERS, GLYPHS, LUCIDE, KINDS, STATUSES, HORIZONS, SHELVES, PLAN_STATES,
};
(window as any).Marginalia = Object.assign((window as any).Marginalia || {}, Marginalia);
