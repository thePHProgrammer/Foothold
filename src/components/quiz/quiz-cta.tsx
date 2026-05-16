import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getBestForLesson, getLessonQuiz } from '@/server/services/quiz.service'

/**
 * Shown after the final chapter. Server component — fetches the quiz +
 * the user's best score; renders nothing if the lesson has no quiz.
 */
export async function QuizCTA({ lessonSlug, userId }: { lessonSlug: string; userId: string }) {
  const quiz = await getLessonQuiz(lessonSlug)
  if (!quiz) return null

  const best = await getBestForLesson(userId, lessonSlug)

  return (
    <Card padding="lg" className="border-brand/30 bg-brand-tint/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink">
            Check your understanding
          </p>
          <h3 className="mt-1 text-h4 text-ink">Take the {quiz.title} quiz</h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            {quiz.questions.length} questions · 70% to pass
            {best && (
              <Badge variant={best.passed ? 'success' : 'neutral'} size="sm">
                {best.passed ? `Passed · best ${best.bestScorePct}%` : `Best ${best.bestScorePct}%`}
              </Badge>
            )}
          </p>
        </div>
        <Link
          href={`/learn/${lessonSlug}/quiz`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-strong"
        >
          {best ? 'Retake quiz' : 'Start quiz'} <span aria-hidden>→</span>
        </Link>
      </div>
    </Card>
  )
}
