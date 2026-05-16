/**
 * Pure quiz grading. No I/O — deterministic so it can be unit-tested and is
 * the single source of scoring truth on the server. The client never sees
 * `correct`; grading always runs here from static lesson data.
 */

/** Fraction of questions required to pass. */
export const PASS_THRESHOLD = 0.7

/** Sanitised question shipped to the client (no answer key). */
export type QuizQuestion = {
  /** Stable id: `${lessonSlug}:${chapterSlug}` — answers key by id, not index. */
  id: string
  question: string
  options: string[]
}

/** Server-side question including the answer key. */
export type RawQuestion = QuizQuestion & { correct: number }

export type GradedQuestion = QuizQuestion & {
  chosen: number | null
  correct: number
  isCorrect: boolean
}

export type GradedQuizResult = {
  correct: number
  total: number
  /** 0–100, rounded. */
  scorePct: number
  passed: boolean
  questions: GradedQuestion[]
}

export function gradeQuiz(
  raw: RawQuestion[],
  answers: Record<string, number | null>
): GradedQuizResult {
  const questions: GradedQuestion[] = raw.map((q) => {
    const chosen = answers[q.id] ?? null
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      chosen,
      correct: q.correct,
      isCorrect: chosen !== null && chosen === q.correct,
    }
  })

  const total = questions.length
  const correct = questions.filter((q) => q.isCorrect).length
  const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = total > 0 && correct / total >= PASS_THRESHOLD

  return { correct, total, scorePct, passed, questions }
}
