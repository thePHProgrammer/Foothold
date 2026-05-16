import { z } from 'zod'

import { BODY_MAX, MOODS, TITLE_MAX } from '@/lib/journal/constants'

export const createJournalSchema = z.object({
  title: z.string().trim().min(1, 'Add a short title').max(TITLE_MAX),
  rationale: z.string().trim().min(1, 'Write what you did and why').max(BODY_MAX),
  mood: z.enum(MOODS),
  lesson: z.string().trim().max(BODY_MAX).optional(),
  tags: z.array(z.string()).optional(),
  tradeId: z.string().min(1).optional(),
})

export const updateJournalSchema = createJournalSchema.extend({
  id: z.string().min(1),
})

export const deleteJournalSchema = z.object({
  id: z.string().min(1),
})

export type CreateJournalInput = z.infer<typeof createJournalSchema>
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>
export type DeleteJournalInput = z.infer<typeof deleteJournalSchema>
