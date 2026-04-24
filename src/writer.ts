import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { anyEntrySchema, type AnyEntry } from './schema.js';

export function appendEntry(path: string, entry: AnyEntry): void {
  mkdirSync(dirname(path), { recursive: true });
  const parsed = anyEntrySchema.parse(entry);
  appendFileSync(path, `${JSON.stringify(parsed)}\n`, 'utf8');
}
