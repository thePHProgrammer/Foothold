import { LESSON_LOADERS } from '@/data/lessons'
import { LESSONS_META } from '@/data/lessons/lessons.meta'
import {
  gradeQuiz,
  type GradedQuizResult,
  type QuizQuestion,
  type RawQuestion,
} from '@/lib/quiz/scoring'
import type { SubmitQuizInput } from '@/lib/validations/quiz'
import * as quizRepo from '@/server/repositories/quiz.repository'
import type { LessonBest } from '@/server/repositories/quiz.repository'

export type LessonQuiz = {
  lessonSlug: string
  title: string
  questions: QuizQuestion[]
}

export type QuizStats = {
  /** Total attempts across all lessons (event count). */
  quizzesTaken: number
  /** Distinct lessons with at least one passing attempt. */
  quizzesPassed: number
  /** Lessons that have a quiz at all. */
  totalQuizzes: number
  /** Mean score across every attempt, 0–100. */
  avgScorePct: number
  /** Best single score across all lessons, 0–100. */
  bestScorePct: number
  bestByLesson: Record<string, LessonBest>
}

const qid = (lessonSlug: string, chapterSlug: string) => `${lessonSlug}:${chapterSlug}`

/** Server-only — includes the answer key. Never returned to the client. */
async function loadRawQuestions(lessonSlug: string): Promise<RawQuestion[] | null> {
  const loader = LESSON_LOADERS[lessonSlug]
  if (!loader) return null

  const lesson = await loader()
  const raw: RawQuestion[] = []
  for (const ch of lesson.chapters) {
    if (!ch.quickCheck) continue
    raw.push({
      id: qid(lessonSlug, ch.slug),
      question: ch.quickCheck.question,
      options: ch.quickCheck.options,
      correct: ch.quickCheck.correct,
    })
  }
  return raw
}

/** Sanitised quiz for the client (answer key stripped). */
export async function getLessonQuiz(lessonSlug: string): Promise<LessonQuiz | null> {
  const loader = LESSON_LOADERS[lessonSlug]
  if (!loader) return null

  const lesson = await loader()
  const questions: QuizQuestion[] = lesson.chapters
    .filter((ch) => ch.quickCheck)
    .map((ch) => ({
      id: qid(lessonSlug, ch.slug),
      // Non-null: filtered above.
      question: ch.quickCheck!.question,
      options: ch.quickCheck!.options,
    }))

  if (questions.length === 0) return null
  return { lessonSlug, title: lesson.title, questions }
}

/**
 * Grades + persists one attempt. All scoring runs server-side via the pure
 * `gradeQuiz` helper from the static answer key.
 *
 * TODO(anti-abuse): no per-user attempt cap / cooldown / rate-limit yet —
 * duplicate attempts are intentional (event history). Add a cooldown and
 * achievement-abuse guards before this is exposed at scale.
 */
export async function submitAttempt(
  userId: string,
  input: SubmitQuizInput
): Promise<GradedQuizResult> {
  const raw = (await loadRawQuestions(input.lessonSlug)) ?? []
  const result = gradeQuiz(raw, input.answers)

  await quizRepo.recordAttempt(userId, {
    lessonSlug: input.lessonSlug,
    correct: result.correct,
    total: result.total,
    scorePct: result.scorePct,
    passed: result.passed,
    durationSec: input.durationSec,
    quizVersion: 1,
  })

  return result
}

export async function getBestForLesson(
  userId: string,
  lessonSlug: string
): Promise<LessonBest | null> {
  const best = await quizRepo.getBestByLesson(userId)
  return best[lessonSlug] ?? null
}

export async function getQuizStats(userId: string): Promise<QuizStats> {
  const [attempts, bestByLesson] = await Promise.all([
    quizRepo.getAttempts(userId),
    quizRepo.getBestByLesson(userId),
  ])

  const quizzesTaken = attempts.length
  const avgScorePct =
    quizzesTaken > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.scorePct, 0) / quizzesTaken)
      : 0

  const lessonBests = Object.values(bestByLesson)
  const quizzesPassed = lessonBests.filter((b) => b.passed).length
  const bestScorePct = lessonBests.reduce((max, b) => Math.max(max, b.bestScorePct), 0)

  return {
    quizzesTaken,
    quizzesPassed,
    totalQuizzes: LESSONS_META.length,
    avgScorePct,
    bestScorePct,
    bestByLesson,
  }
}
