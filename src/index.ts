import { queryEntries, readEntries, tailEntries } from './reader.js';
import { appendEntry } from './writer.js';
import type { AnyEntry } from './schema.js';

export * from './schema.js';

export interface Ledger {
  log(entry: AnyEntry): void;
  query(filter: Partial<AnyEntry>): AnyEntry[];
  tail(n: number): AnyEntry[];
}

export function createLedger(path: string): Ledger {
  return {
    log(entry: AnyEntry) {
      appendEntry(path, entry);
    },
    query(filter: Partial<AnyEntry>) {
      return queryEntries(path, filter);
    },
    tail(n: number) {
      return tailEntries(path, n);
    },
  };
}
