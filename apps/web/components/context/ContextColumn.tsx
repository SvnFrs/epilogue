import type { BacklinkRef, VolatileContext } from '@epilogue/contracts';
import { GameContext } from './GameContext';
import { ReadingContext } from './ReadingContext';
import { ScreenContext } from './ScreenContext';
import { TechContext } from './TechContext';

/**
 * Routes the polymorphic save-state to its family block (US1 game + US4 reading/screen/
 * tech). The discriminated union narrows `payload` per family — no game-only fields bleed
 * into other families (US4 scenario 4).
 */
export function ContextColumn({
  entryId,
  context,
  backlinks,
}: {
  entryId: string;
  context: VolatileContext | null;
  backlinks: BacklinkRef[];
}) {
  if (!context) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 p-4 text-[13.5px] text-stone-500">
        Capture where you left off — this entry has no save-state yet.
      </p>
    );
  }

  switch (context.family) {
    case 'game':
      return <GameContext entryId={entryId} payload={context.payload} />;
    case 'reading':
      return <ReadingContext entryId={entryId} payload={context.payload} />;
    case 'screen':
      return <ScreenContext entryId={entryId} payload={context.payload} />;
    case 'tech':
      return <TechContext entryId={entryId} payload={context.payload} backlinks={backlinks} />;
    default:
      return ((_: never) => null)(context);
  }
}
