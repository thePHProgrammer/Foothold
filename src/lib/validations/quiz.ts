import { z } from 'zod'

import { LESSONS_META_BY_SLUG } from '@/data/lessons/lessons.meta'

export const submitQuizSchema = z.object({
  lessonSlug: z
    .string()
    .refine((s) => s in LESSONS_META_BY_SLUG, { message: 'Unknown lesson slug' }),
  /** Keyed by stable question id (`${lessonSlug}:${chapterSlug}`). */
  answers: z.record(z.string(), z.number().int().min(0).nullable()),
  /** Client-measured wall-clock seconds for the attempt. */
  durationSec: z.number().int().nonnegative().optional(),
})

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
