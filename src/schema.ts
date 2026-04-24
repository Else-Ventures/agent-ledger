import { z } from 'zod';

const isoTimestamp = z.string().datetime({ offset: true });
const agent = z.string().min(1);
const baseEntrySchema = z.object({
  timestamp: isoTimestamp,
  agent,
});

export const decisionLogSchema = baseEntrySchema.extend({
  type: z.literal('decision'),
  decision: z.string().min(1),
  reasoning: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
  context: z.record(z.unknown()).optional(),
}).strict();

export const skillInvocationSchema = baseEntrySchema.extend({
  type: z.literal('skill'),
  skill: z.string().min(1),
  input: z.record(z.unknown()),
  output: z.record(z.unknown()),
  duration_ms: z.number().nonnegative(),
  success: z.boolean(),
  error: z.string().min(1).optional(),
}).strict();

export const positionRecordSchema = baseEntrySchema.extend({
  type: z.literal('position'),
  market_id: z.string().min(1),
  side: z.enum(['yes', 'no']),
  size: z.number(),
  price: z.number(),
  action: z.enum(['open', 'close', 'update']),
}).strict();

export const lessonEntrySchema = baseEntrySchema.extend({
  type: z.literal('lesson'),
  lesson: z.string().min(1),
  source_event: z.string().min(1),
  applies_to: z.array(z.string().min(1)),
}).strict();

export const anyEntrySchema = z.discriminatedUnion('type', [
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
