import { z } from 'zod'

import { isValidLessonChapter } from '@/data/lessons/lessons.meta'

export const markChapterCompleteSchema = z
  .object({
    lessonSlug: z.string().min(1).max(100),
    chapterSlug: z.string().min(1).max(100),
  })
  .refine((d) => isValidLessonChapter(d.lessonSlug, d.chapterSlug), {
    message: 'Unknown lesson or chapter slug',
  })

export type MarkChapterCompleteInput = z.infer<typeof markChapterCompleteSchema>
