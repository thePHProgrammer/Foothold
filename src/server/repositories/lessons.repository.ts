import { Prisma, type UserLessonProgress } from '@prisma/client'

import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

export async function getUserProgress(userId: string): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  })
}

export async function getCompletedChapters(userId: string, lessonSlug: string): Promise<string[]> {
  const rows = await prisma.userLessonProgress.findMany({
    where: { userId, lessonSlug },
    select: { chapterSlug: true },
  })
  return rows.map((r) => r.chapterSlug)
}

/**
 * Inserts a completion row. P2002 (unique-constraint) is treated as success
 * so double-clicks on "Mark complete" are idempotent.
 */
export async function markChapterComplete(
  userId: string,
  lessonSlug: string,
  chapterSlug: string
): Promise<void> {
  try {
    await prisma.userLessonProgress.create({
      data: { userId, lessonSlug, chapterSlug },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return
    }
    logger.error('Failed to mark chapter complete', { error, userId, lessonSlug, chapterSlug })
    throw error
  }
}

export async function countCompletions(userId: string): Promise<number> {
  return prisma.userLessonProgress.count({ where: { userId } })
}

export async function getRecentCompletions(
  userId: string,
  limit = 10
): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
    take: limit,
  })
}
