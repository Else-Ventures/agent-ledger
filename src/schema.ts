import { z } from 'zod';

const isoTimestamp = z.string().datetime({ offset: true });
const agent = z.string().min(1);

export const decisionLogSchema = z.object({
  timestamp: isoTimestamp,
  agent,
  decision: z.string().min(1),
  reasoning: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
  context: z.record(z.unknown()).optional(),
});

export const skillInvocationSchema = z.object({
  timestamp: isoTimestamp,
  agent,
  skill: z.string().min(1),
  input: z.record(z.unknown()),
  output: z.record(z.unknown()),
  duration_ms: z.number().nonnegative(),
  success: z.boolean(),
  error: z.string().min(1).optional(),
});

export const positionRecordSchema = z.object({
  timestamp: isoTimestamp,
  agent,
  market_id: z.string().min(1),
  side: z.enum(['yes', 'no']),
  size: z.number(),
  price: z.number(),
  action: z.enum(['open', 'close', 'update']),
});

export const lessonEntrySchema = z.object({
  timestamp: isoTimestamp,
  agent,
  lesson: z.string().min(1),
  source_event: z.string().min(1),
  applies_to: z.array(z.string().min(1)),
});

export const anyEntrySchema = z.union([
  decisionLogSchema,
  skillInvocationSchema,
  positionRecordSchema,
  lessonEntrySchema,
]);

export type DecisionLog = z.infer<typeof decisionLogSchema>;
export type SkillInvocation = z.infer<typeof skillInvocationSchema>;
export type PositionRecord = z.infer<typeof positionRecordSchema>;
export type LessonEntry = z.infer<typeof lessonEntrySchema>;
export type AnyEntry = z.infer<typeof anyEntrySchema>;
