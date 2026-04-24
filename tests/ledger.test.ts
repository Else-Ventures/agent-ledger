import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test } from 'vitest';
import { createLedger, type AnyEntry } from '../src/index.js';
import { readEntries } from '../src/reader.js';

describe('agent-ledger', () => {
  test('writes, reads, queries, and tails ledger entries', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agent-ledger-'));
    const file = join(dir, 'run.jsonl');
    const ledger = createLedger(file);

    const entries: AnyEntry[] = [
      {
        timestamp: '2026-04-24T12:00:00Z',
        agent: 'elsie',
        decision: 'Enter thin market with capped size',
        reasoning: 'Order book depth is sufficient for a small test.',
        confidence: 'medium',
        context: { market: 'pm-123' },
      },
      {
        timestamp: '2026-04-24T12:00:01Z',
        agent: 'elsie',
        skill: 'market-signals.snapshot',
        input: { market_id: 'pm-123' },
        output: { spread_bps: 18 },
        duration_ms: 87,
        success: true,
      },
      {
        timestamp: '2026-04-24T12:00:02Z',
        agent: 'elsie',
        market_id: 'pm-123',
        side: 'yes',
        size: 25,
        price: 0.41,
        action: 'open',
      },
      {
        timestamp: '2026-04-24T12:00:03Z',
        agent: 'elsie',
        lesson: 'Small positions are easier to inspect than dashboard abstractions.',
        source_event: 'paper-trade-001',
        applies_to: ['truman', 'agent-ledger'],
      },
    ];

    entries.forEach((entry) => ledger.log(entry));

    const raw = readFileSync(file, 'utf8').trim().split('\n');
    expect(raw).toHaveLength(4);
    expect(readEntries(file)).toEqual(entries);
    expect(ledger.query({ agent: 'elsie' })).toHaveLength(4);
    expect(ledger.query({ action: 'open' })).toEqual([entries[2]]);
    expect(ledger.tail(2)).toEqual(entries.slice(-2));
  });
});
