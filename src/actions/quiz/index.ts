'use server'

import { revalidatePath } from 'next/cache'

import type { GradedQuizResult } from '@/lib/quiz/scoring'
import { logger } from '@/lib/logger'
import { submitQuizSchema } from '@/lib/validations/quiz'
import { requireAuth } from '@/server/auth'
import * as quizService from '@/server/services/quiz.service'

export type SubmitQuizResult = { ok: true; result: GradedQuizResult } | { ok: false; error: string }

const firstIssue = (messages: string[]): string => messages[0] ?? 'Invalid input.'

export async function submitQuiz(input: unknown): Promise<SubmitQuizResult> {
  const session = await requireAuth()

  const parsed = submitQuizSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error.issues.map((i) => i.message)) }
  }

  const result = await quizService.submitAttempt(session.user.id, parsed.data)

  revalidatePath('/progress')
  revalidatePath('/learn')
  revalidatePath('/learn/[slug]/[chapter]', 'page')

  logger.info('Quiz submitted', {
    userId: session.user.id,
    lessonSlug: parsed.data.lessonSlug,
    scorePct: result.scorePct,
    passed: result.passed,
  })

  return { ok: true, result }
}
