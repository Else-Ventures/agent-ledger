import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createLedger } from '../src/index.js';

const outDir = join(process.cwd(), '.tmp');
mkdirSync(outDir, { recursive: true });
const path = join(outDir, 'agent-run.jsonl');
rmSync(path, { force: true });

const ledger = createLedger(path);

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  decision: 'Take a small paper trade to validate the loop',
  reasoning: 'The goal is end-to-end confirmation, not prediction brilliance.',
  confidence: 'high',
  context: { market_id: 'pm-btc-2026-04' },
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  skill: 'market-signals.orderbook',
  input: { market_id: 'pm-btc-2026-04' },
  output: { best_yes: 0.44, best_no: 0.57 },
  duration_ms: 42,
  success: true,
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  market_id: 'pm-btc-2026-04',
  side: 'yes',
  size: 10,
  price: 0.44,
  action: 'open',
});

ledger.log({
  timestamp: new Date().toISOString(),
  agent: 'elsie',
  lesson: 'A tiny complete loop beats a larger incomplete simulation.',
  source_event: 'paper-trade-2026-04-24',
  applies_to: ['truman', 'agent-ledger'],
});

console.log(`Wrote ledger to ${path}`);
console.log(ledger.tail(4));
