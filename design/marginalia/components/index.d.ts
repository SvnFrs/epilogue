import type * as React from 'react';

/** The nine kinds an entry can be. */
export type Kind = 'game' | 'book' | 'manga' | 'anime' | 'film' | 'series' | 'music' | 'poem' | 'story';
/** What a plate can be drawn for: an entry's kind, or an idea (a dream's cover). Never an entry's kind. */
export type PlateKind = Kind | 'idea';
export type Status = 'shelved' | 'paused' | 'open' | 'again' | 'finished' | 'aside';
export type ShelfId = 'waiting' | 'open' | 'closed';
export type PlanState = 'waiting' | 'open' | 'paused' | 'done' | 'aside';
export type Horizon = 'unsorted' | 'soon' | 'someday';
export type IconName = Kind | Status | 'media' | 'prologue' | 'dream' | 'unsorted' | 'soon' | 'someday' | 'link' | 'grip' | 'now' | 'journal' | 'find' | 'plus' | 'minus' | 'back' | 'next' | 'more' | 'note' | 'quote' | 'close' | 'check' | 'undo' | 'retry' | 'alert' | 'idle';

export interface Progress { value?: number; total?: number; unit?: string; sessions?: number; hours?: number; caption?: React.ReactNode; note?: React.ReactNode }
export interface Entry { title: string; by?: string; kind: Kind; status?: Status; date?: string; /** cover colour, any hex */ ink?: string; /** cover art URL */ cover?: string; progress?: Progress; leftOff?: LeftOffData; keymap?: Bind[] }

export interface CoverProps { title: string; by?: string; kind?: PlateKind; src?: string; alt?: string; ink?: string; status?: Status; size?: 'xs' | 'sm' | 'md' | 'lg' | 'fill'; width?: number | string; /** which plate (0–2) when there is no art; default: chosen by title */ variant?: number; className?: string }
export declare function EntryCover(props: CoverProps): React.ReactElement;

export interface PlateText { box: (number | null)[]; al: 'c' | 'l'; va: 'c' | 't' | 'b'; f: 'd' | 'u'; fs: number; w?: number; up?: boolean; band?: boolean }
export interface Plate { name: string; /** inner SVG markup, 100 units wide */ art: string; text: PlateText; shift: number }
/** Three hand-drawn cover compositions per kind. */
export declare const PLATES: Record<PlateKind, Plate[]>;
/** The plate an entry without art wears: by title, or `variant`. */
export declare function plateFor(kind: PlateKind, title?: string, variant?: number): Plate & { index: number; count: number };

export interface ShelfProps { entries: Entry[]; minCell?: number; onOpen?: (entry: Entry) => void; label?: string; className?: string }
export declare function Shelf(props: ShelfProps): React.ReactElement;

export interface EntryRowProps { entry: Entry; onOpen?: () => void; onStep?: () => void; stepLabel?: string; flat?: boolean; current?: boolean; /** days untouched: shows the IdlePrompt, once */ idle?: number; onPutBack?: () => void; onKeep?: () => void; className?: string }
export declare function EntryRow(props: EntryRowProps): React.ReactElement;

export interface ShelfFilterItem { id: string; label: string; count?: number; kind?: Kind }
export interface ShelfFilterProps { items: ShelfFilterItem[]; value: string; onChange?: (id: string) => void; label?: string; className?: string }
export declare function ShelfFilter(props: ShelfFilterProps): React.ReactElement;

export interface EntryHeaderProps { entry: Entry; verdict?: 0 | 1 | 2 | 3 | 4 | 5; onVerdict?: (v: number) => void; onBack?: () => void; onMore?: () => void; wide?: boolean; compact?: boolean; coverSize?: CoverProps['size']; className?: string }
export declare function EntryHeader(props: EntryHeaderProps): React.ReactElement;

export interface VerdictProps { value?: 0 | 1 | 2 | 3 | 4 | 5; onChange?: (v: number) => void; showWord?: boolean; ink?: string; className?: string }
export declare function Verdict(props: VerdictProps): React.ReactElement;

export interface PageEdgeProps extends Progress { size?: 'md' | 'sm' | 'xs'; ink?: string; className?: string }
export declare function PageEdge(props: PageEdgeProps): React.ReactElement;

export interface StatusMarkProps { status: Status; kind?: Kind; date?: string; pill?: boolean; className?: string }
export declare function StatusMark(props: StatusMarkProps): React.ReactElement;

export interface KindMarkProps { kind: Kind; className?: string }
export declare function KindMark(props: KindMarkProps): React.ReactElement;

export interface MarginProps { ink?: string; children?: React.ReactNode; className?: string }
export declare function Margin(props: MarginProps): React.ReactElement;
export interface NoteProps { where?: React.ReactNode; when?: React.ReactNode; half?: boolean; children?: React.ReactNode; className?: string }
export declare function Note(props: NoteProps): React.ReactElement;

export interface QuoteProps { children: React.ReactNode; source?: React.ReactNode; work?: React.ReactNode; ink?: string; className?: string }
export declare function Quote(props: QuoteProps): React.ReactElement;

export interface ReviewProps { ink?: string; children?: React.ReactNode; className?: string }
export declare function Review(props: ReviewProps): React.ReactElement;

export interface FleuronProps { className?: string }
export declare function Fleuron(props: FleuronProps): React.ReactElement;

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; multiline?: boolean; rows?: number; hint?: React.ReactNode }
export declare function Field(props: FieldProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'clay' | 'lamp' | 'quill' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; /** accessible name for icon-only buttons */ label?: string; round?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;

export interface StepperProps { value: number; total?: number; unit?: string; onChange?: (v: number) => void; className?: string }
export declare function Stepper(props: StepperProps): React.ReactElement;

export interface SheetProps { title?: string; children?: React.ReactNode; footer?: React.ReactNode; onClose?: () => void; contained?: boolean; className?: string }
export declare function Sheet(props: SheetProps): React.ReactElement;

export interface ToastProps { children: React.ReactNode; action?: string; onAction?: () => void; className?: string }
export declare function Toast(props: ToastProps): React.ReactElement;

export type Part = 'media' | 'prologue';
export declare const PARTS: { id: Part; label: string; icon: IconName; add: string }[];
export interface DockProps { value?: Part; onChange?: (id: Part) => void; /** Add entry on Media, Capture on Prologue */ onAdd?: () => void; contained?: boolean; className?: string }
export declare function Dock(props: DockProps): React.ReactElement;
export interface RailProps { value?: Part | 'media-journal' | 'prologue-journal' | 'find'; onChange?: (id: string) => void; onAdd?: () => void; className?: string }
export declare function Rail(props: RailProps): React.ReactElement;

export interface ShelfSwitchProps { value?: ShelfId; onChange?: (id: ShelfId) => void; counts?: Partial<Record<ShelfId, number>>; label?: string; className?: string }
export declare function ShelfSwitch(props: ShelfSwitchProps): React.ReactElement;
export interface PartHeaderProps { title: string; kicker?: string; shelf?: ShelfId; onShelf?: (id: ShelfId) => void; counts?: Partial<Record<ShelfId, number>>; onFind?: () => void; onJournal?: () => void; onBack?: () => void; className?: string }
export declare function PartHeader(props: PartHeaderProps): React.ReactElement;
export interface IdlePromptProps { days?: number; onPutBack?: () => void; onKeep?: () => void; className?: string }
export declare function IdlePrompt(props: IdlePromptProps): React.ReactElement;
export interface InlineErrorProps { children?: React.ReactNode; onRetry?: () => void; retryLabel?: string; className?: string }
export declare function InlineError(props: InlineErrorProps): React.ReactElement;
export interface EmptyProps { drawing?: 'shelf' | 'journal' | 'find'; title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; className?: string }
export declare function Empty(props: EmptyProps): React.ReactElement;
export interface SearchFieldProps { value?: string; onChange?: (v: string) => void; placeholder?: string; label?: string; autoFocus?: boolean; className?: string }
export declare function SearchField(props: SearchFieldProps): React.ReactElement;
export interface CatalogueResult { title: string; year?: number | string; by?: string; cover?: string; ink?: string; total?: number; unit?: string; inLibrary?: boolean }
export interface ManualEntry { title?: string; by?: string; total?: string; unit?: string; /** a cloth id, or null for Auto */ cloth?: string | null }
export interface AddEntryProps { kind?: Kind; onKind?: (k: Kind) => void; query?: string; onQuery?: (q: string) => void; state?: 'results' | 'searching' | 'empty' | 'error' | 'manual'; results?: CatalogueResult[]; onPick?: (r: CatalogueResult) => void; onOpenExisting?: (r: CatalogueResult) => void; onRetry?: () => void; error?: boolean | string; starting?: boolean; onStarting?: (v: boolean) => void; manual?: ManualEntry; onManualChange?: (m: ManualEntry) => void; onManual?: () => void; onBack?: () => void; onAdd?: () => void; onClose?: () => void; contained?: boolean; className?: string }
export declare function AddEntry(props: AddEntryProps): React.ReactElement;
export declare const PROVIDERS: Record<string, { name: string; what: string }>;
export interface FindResultsProps { query?: string; titles?: Entry[]; people?: { name: string; count: number; kinds?: string }[]; lines?: { text: string; where?: string; title?: string; when?: string }[]; onOpen?: (r: unknown) => void; onAdd?: () => void; addLabel?: string; part?: Part; className?: string }
export declare function FindResults(props: FindResultsProps): React.ReactElement;
export type JournalEvent = 'note' | 'started' | 'finished' | 'aside' | 'paused' | 'again' | 'captured' | 'done' | 'cametrue';
export interface JournalItem { type: JournalEvent; title: string; kind?: Kind; dream?: boolean; ink?: string; cover?: string; where?: string; time?: string; text?: string }
export interface JournalProps { months: { label: string; days: { day: string; weekday: string; items: JournalItem[] }[] }[]; years?: number[]; year?: number; onYear?: (y: number) => void; onOpen?: (item: JournalItem) => void; part?: Part; className?: string }
export declare function Journal(props: JournalProps): React.ReactElement;

export interface LeftOffData { where?: string; short?: string; note?: string; when?: string; facts?: [string, string][] }
export interface Bind { action: string; /** "Ctrl+S", "Shift or M4", "LB" */ keys: string; pinned?: boolean; group?: string }
export interface LeftOffProps { entry?: Entry & { leftOff?: LeftOffData; keymap?: Bind[] }; leftOff?: LeftOffData; keymap?: Bind[]; keysMore?: React.ReactNode; onUpdate?: () => void; className?: string }
export declare function LeftOff(props: LeftOffProps): React.ReactElement;
export interface KeymapProps { binds: Bind[]; pinnedOnly?: boolean; grouped?: boolean; more?: React.ReactNode; className?: string }
export declare function Keymap(props: KeymapProps): React.ReactElement;
export declare function Keys(props: { keys: string; className?: string }): React.ReactElement;
export declare function Key(props: { k: string; className?: string }): React.ReactElement;

export interface IntentionItem { text: string; kind?: 'task' | 'dream'; state?: PlanState; /** only while waiting */ horizon?: Horizon; due?: string; stateDate?: string; doneDate?: string; steps?: { done: number; total: number }; /** a reference; the entry stays on its own shelf */ entry?: { title: string; kind?: Kind }; why?: string; ink?: string; /** which idea cover a dream wears (0–2) */ plate?: number; /** days untouched while open: shows the IdlePrompt, once */ idle?: number }
export interface IntentionProps { item: IntentionItem; onToggle?: () => void; onOpen?: () => void; onOpenEntry?: (entry: { title: string; kind?: Kind }) => void; onPutBack?: () => void; onKeep?: () => void; showState?: boolean; showHorizon?: boolean; dragHandle?: boolean; className?: string }
export declare function Intention(props: IntentionProps): React.ReactElement;
export interface CaptureProps { onSubmit?: (x: { text: string; horizon: Horizon; kind: 'task' | 'dream'; state: 'waiting' }) => void; horizon?: Horizon; onHorizon?: (h: Horizon) => void; dream?: boolean; onDream?: (d: boolean) => void; value?: string; onChange?: (v: string) => void; autoFocus?: boolean; /** a failed save: shows InlineError; keep the text in value */ error?: boolean | string; onRetry?: () => void; className?: string }
export declare function Capture(props: CaptureProps): React.ReactElement;
export declare function HorizonMark(props: { horizon: Horizon; count?: number; className?: string }): React.ReactElement;
export declare const HORIZON: Record<Horizon, { word: string; icon: IconName }>;
/** Marginalia glyph name → Lucide icon name */
export declare const LUCIDE: Record<IconName, string>;

export interface IconProps { name: IconName; size?: number; title?: string; strokeWidth?: number; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface InkedProps extends React.HTMLAttributes<HTMLElement> { ink?: string; as?: keyof JSX.IntrinsicElements }
export declare function Inked(props: InkedProps): React.ReactElement;

export interface BoundInk { inkPaper: string; inkLamplight: string; washPaper: string; washLamplight: string; cloth: string; gilt: string }
/** Any cover colour in; a legible ink and wash per theme, and a cloth colour for plates, out. */
export declare function bindInk(coverHex: string): BoundInk;
/** The CSS custom properties an inked subtree needs (--ink-p, --ink-l, --wash-p, --wash-l, --cloth). */
export declare function inkVars(coverHex?: string): Record<string, string>;
/** Best-effort dominant colour of a same-origin or CORS-enabled image. */
export declare function sampleCover(src: string): Promise<string>;
export declare function statusWord(status: Status, kind?: Kind): string;
/** Media: Waiting = shelved + paused, Open = open + again, Closed = finished + aside. */
export declare function shelfOf(status: Status): ShelfId;
/** Prologue: Waiting = waiting + paused, Open = open, Closed = done + aside. */
export declare function planShelfOf(state: PlanState): ShelfId;
/** 21 → "3 weeks" */
export declare function idleWords(days: number): string;
export declare const SHELF: Record<ShelfId, { word: string; hint: string }>;
export declare const PLAN_WORD: Record<PlanState, { task: string; dream: string; icon: IconName; tone: string }>;
export declare const KIND: Record<Kind, { word: string; plural: string; open: string; again: string; shape: 'portrait' | 'box' | 'square'; bound: boolean; unit: string | null; provider: string | null }>;
export declare const VERDICT: readonly string[];
export interface Cloth { id: string; name: string; family: string; tone: 'deep' | 'true' | 'dusty'; core: boolean; hex: string }
/** 36 bookcloths: 12 families x deep / true / dusty. */
export declare const CLOTHS: Cloth[];
export declare const CORE_24: Cloth[];
export declare function clothById(id: string): Cloth | undefined;
/** Nearest bookcloth to any colour, matched on hue and chroma. */
export declare function nearestCloth(hex: string, set?: Cloth[]): Cloth;
/** A stable core-24 cloth for an entry with no art, chosen by its title. */
export declare function autoCloth(title: string): Cloth;
/** Hand-sketched kind glyphs (inner SVG markup). */
export declare const SKETCH: Record<Kind, string>;
/** Empty-state drawings (inner SVG markup, viewBox 0 0 120 72). */
export declare const EMPTY: Record<'shelf' | 'journal' | 'find', string>;

declare global {
  interface Window {
    Marginalia: {
      EntryCover: typeof EntryCover; Shelf: typeof Shelf; EntryRow: typeof EntryRow; ShelfFilter: typeof ShelfFilter; EntryHeader: typeof EntryHeader;
      Verdict: typeof Verdict; PageEdge: typeof PageEdge; StatusMark: typeof StatusMark; KindMark: typeof KindMark; Margin: typeof Margin; Note: typeof Note;
      Quote: typeof Quote; Review: typeof Review; Fleuron: typeof Fleuron; Field: typeof Field; Button: typeof Button; Stepper: typeof Stepper;
      Sheet: typeof Sheet; Toast: typeof Toast; Dock: typeof Dock; Rail: typeof Rail; Icon: typeof Icon; Inked: typeof Inked;
      ShelfSwitch: typeof ShelfSwitch; PartHeader: typeof PartHeader; IdlePrompt: typeof IdlePrompt; InlineError: typeof InlineError; Empty: typeof Empty; SearchField: typeof SearchField; AddEntry: typeof AddEntry; FindResults: typeof FindResults; Journal: typeof Journal;
      CLOTHS: typeof CLOTHS; CORE_24: typeof CORE_24; clothById: typeof clothById; nearestCloth: typeof nearestCloth; autoCloth: typeof autoCloth; SKETCH: typeof SKETCH; EMPTY: typeof EMPTY; PLATES: typeof PLATES; plateFor: typeof plateFor;
      LeftOff: typeof LeftOff; Keymap: typeof Keymap; Keys: typeof Keys; Key: typeof Key; Intention: typeof Intention; Capture: typeof Capture; HorizonMark: typeof HorizonMark; HORIZON: typeof HORIZON; LUCIDE: typeof LUCIDE;
      bindInk: typeof bindInk; inkVars: typeof inkVars; sampleCover: typeof sampleCover; statusWord: typeof statusWord; shelfOf: typeof shelfOf; planShelfOf: typeof planShelfOf; idleWords: typeof idleWords;
      KIND: typeof KIND; SHELF: typeof SHELF; PLAN_WORD: typeof PLAN_WORD; PARTS: typeof PARTS; PROVIDERS: typeof PROVIDERS; VERDICT: typeof VERDICT;
    };
  }
}
