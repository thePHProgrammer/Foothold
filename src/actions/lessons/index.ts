'use server'

import { revalidatePath } from 'next/cache'

import { markChapterCompleteSchema } from '@/lib/validations/lessons'
import { logger } from '@/lib/logger'
import { requireAuth } from '@/server/auth'
import * as lessonsRepo from '@/server/repositories/lessons.repository'

export async function markChapterComplete(input: unknown) {
  const session = await requireAuth()
  const data = markChapterCompleteSchema.parse(input)

  await lessonsRepo.markChapterComplete(session.user.id, data.lessonSlug, data.chapterSlug)

  revalidatePath('/learn')
  revalidatePath(`/learn/${data.lessonSlug}`)
  revalidatePath('/learn/[slug]/[chapter]', 'page')
  revalidatePath('/progress')

  logger.info('Chapter completed', {
    userId: session.user.id,
    lessonSlug: data.lessonSlug,
    chapterSlug: data.chapterSlug,
  })
}
