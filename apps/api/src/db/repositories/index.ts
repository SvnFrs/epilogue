/** Repository barrel — constructs the owner-scoped repos against a Db instance. */
import type { Db } from '../client';
import { makeEntriesRepo } from './entries';
import { makeContextRepo } from './context';
import { makeLedgerRepo } from './ledger';
import { makeBacklinksRepo } from './backlinks';

export function makeRepos(db: Db) {
  return {
    entries: makeEntriesRepo(db),
    context: makeContextRepo(db),
    ledger: makeLedgerRepo(db),
    backlinks: makeBacklinksRepo(db),
  };
}

export type Repos = ReturnType<typeof makeRepos>;
export * from './entries';
export * from './context';
export * from './ledger';
export * from './backlinks';
