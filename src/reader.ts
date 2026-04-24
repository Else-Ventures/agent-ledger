import { existsSync, readFileSync } from 'node:fs';
import { anyEntrySchema, type AnyEntry } from './schema.js';

function matchesFilter(entry: AnyEntry, filter: Partial<AnyEntry>): boolean {
  return Object.entries(filter).every(([key, value]) => {
    const entryValue = (entry as Record<string, unknown>)[key];
    if (Array.isArray(value)) return JSON.stringify(entryValue) === JSON.stringify(value);
    if (value && typeof value === 'object') return JSON.stringify(entryValue) === JSON.stringify(value);
    return entryValue === value;
  });
}

export function readEntries(path: string): AnyEntry[] {
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8').trim();
  if (!text) return [];
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => anyEntrySchema.parse(JSON.parse(line)));
}

export function queryEntries(path: string, filter: Partial<AnyEntry>): AnyEntry[] {
  return readEntries(path).filter((entry) => matchesFilter(entry, filter));
}

export function tailEntries(path: string, n: number): AnyEntry[] {
  if (n <= 0) return [];
  const entries = readEntries(path);
  return entries.slice(-n);
}
