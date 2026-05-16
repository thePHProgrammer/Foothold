import type { UserQuizAttempt } from '@prisma/client'

import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/**
 * Persistence-only layer for quiz attempts. Unlike `lessons.repository`,
 * there is intentionally NO idempotency / dedupe here — every submission is
 * its own row (event history). "Best score" is a derived view, never stored.
 */

export type RecordAttemptInput = {
  lessonSlug: string
  correct: number
  total: number
  scorePct: number
  passed: boolean
  durationSec?: number
  quizVersion?: number
}

export type LessonBest = { bestScorePct: number; passed: boolean; attempts: number }

export async function recordAttempt(
  userId: string,
  input: RecordAttemptInput
): Promise<UserQuizAttempt> {
  try {
    return await prisma.userQuizAttempt.create({
      data: {
        userId,
        lessonSlug: input.lessonSlug,
        correct: input.correct,
        total: input.total,
        scorePct: input.scorePct,
        passed: input.passed,
        durationSec: input.durationSec ?? null,
        quizVersion: input.quizVersion ?? 1,
      },
    })
  } catch (error) {
    logger.error('Failed to record quiz attempt', { error, userId, lessonSlug: input.lessonSlug })
    throw error
  }
}

export async function getAttempts(userId: string): Promise<UserQuizAttempt[]> {
  return prisma.userQuizAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

/** Derived per-lesson view: best score so far + whether ever passed. */
export async function getBestByLesson(userId: string): Promise<Record<string, LessonBest>> {
  const rows = await prisma.userQuizAttempt.findMany({
    where: { userId },
    select: { lessonSlug: true, scorePct: true, passed: true },
  })

  const best: Record<string, LessonBest> = {}
  for (const r of rows) {
    const cur = best[r.lessonSlug]
    if (!cur) {
      best[r.lessonSlug] = { bestScorePct: r.scorePct, passed: r.passed, attempts: 1 }
    } else {
      cur.bestScorePct = Math.max(cur.bestScorePct, r.scorePct)
      cur.passed = cur.passed || r.passed
      cur.attempts += 1
    }
  }
  return best
}
