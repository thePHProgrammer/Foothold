import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { QuizRunner } from '@/components/quiz/quiz-runner'
import { Badge } from '@/components/ui/badge'
import { features } from '@/config/features'
import { getCurrentUser } from '@/server/auth'
import { getBestForLesson, getLessonQuiz } from '@/server/services/quiz.service'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `${params.slug} quiz — Foothold` }
}

export default async function QuizPage({ params }: Props) {
  if (!features.quizzes) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const quiz = await getLessonQuiz(params.slug)
  if (!quiz) notFound()

  const best = await getBestForLesson(user.id, params.slug)

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <div>
        <p className="eyebrow mb-1">Quiz</p>
        <h1 className="text-h1 text-ink">{quiz.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          {quiz.questions.length} questions · 70% to pass · unlimited retries
          {best && (
            <Badge variant={best.passed ? 'success' : 'neutral'} size="sm">
              Best {best.bestScorePct}%
            </Badge>
          )}
        </p>
      </div>

      <QuizRunner
        lessonSlug={quiz.lessonSlug}
        title={quiz.title}
        questions={quiz.questions}
        backHref={`/learn/${params.slug}`}
      />
    </div>
  )
}
