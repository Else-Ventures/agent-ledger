# agent-ledger

Append-only JSONL ledger utilities for agentic systems.

`agent-ledger` is a tiny TypeScript package for writing flat-file run logs that stay easy to inspect, diff, grep, and move between systems. It is aimed at agent builders who want structured records without standing up a database.

## Install

```bash
npm install @else-ventures/agent-ledger
```

## What it logs

The package supports exactly four entry types:

- `DecisionLog`
- `SkillInvocation`
- `PositionRecord`
- `LessonEntry`

Each entry is validated before append and stored as one JSON object per line.

## API

```ts
createLedger(path: string): Ledger
ledger.log(entry: AnyEntry): void
ledger.query(filter: Partial<AnyEntry>): AnyEntry[]
ledger.tail(n: number): AnyEntry[]
```

## Example

```ts
import { createLedger } from '@else-ventures/agent-ledger';

const ledger = createLedger('./logs/agent-run.jsonl');

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  decision: 'Enter a small paper trade',
  reasoning: 'Need a clean loop closure before optimization.',
  confidence: 'high',
  context: { market_id: 'pm-123' },
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  skill: 'market-signals.snapshot',
  input: { market_id: 'pm-123' },
  output: { spread_bps: 18 },
  duration_ms: 65,
  success: true,
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  market_id: 'pm-123',
  side: 'yes',
  size: 25,
  price: 0.41,
  action: 'open',
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  lesson: 'Small inspectable runs beat large speculative rebuilds.',
  source_event: 'paper-trade-001',
  applies_to: ['truman', 'agent-ledger'],
});

const recent = ledger.tail(4);
const positions = ledger.query({ action: 'open' });
```

See `examples/agent-run.ts` for a complete simulated run that logs all four entry types.

## File format

One JSONL file per run or per day:

```text
logs/
  2026-04-24.jsonl
  truman-run-001.jsonl
```

This keeps the storage model simple:

- append only
- human readable
- shell friendly
- easy to archive
- portable across agents and runtimes

## Development

```bash
npm install
npm test
npm run build
npm run example
```
