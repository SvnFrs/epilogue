import type { MediaType, VolatileContext } from '@epilogue/contracts';
import { GameContext } from './GameContext';

/**
 * Picks the save-state block by family. GAME is built (T022, US1). Reading / screen /
 * tech blocks land in US4 (T035/T036/T037) — until then they show a minimal read-only
 * view so non-game entries don't break the skeleton.
 */
export function ContextColumn({
  entryId,
  mediaType,
  context,
}: {
  entryId: string;
  mediaType: MediaType;
  context: VolatileContext | null;
}) {
  if (!context) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-300 p-4 text-[13.5px] text-stone-500">
        Capture where you left off — this entry has no save-state yet.
      </p>
    );
  }

  if (context.family === 'game') {
    return <GameContext entryId={entryId} payload={context.payload} />;
  }

  // US4 families (reading / screen / tech) — placeholder until T035–T037.
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/70 p-4">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-400">
        {context.family} save-state
      </p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-[12px] text-stone-600">
        {JSON.stringify(context.payload, null, 2)}
      </pre>
      <p className="mt-2 text-[11px] italic text-stone-400">
        The {mediaType.toLowerCase()} block is built in the next slice (US4).
      </p>
    </div>
  );
}
