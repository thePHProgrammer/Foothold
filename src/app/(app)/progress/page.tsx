import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Achievements } from '@/components/progress/achievements'
import { ActivityHeatmap } from '@/components/progress/activity-heatmap'
import { QuizSummary } from '@/components/progress/quiz-summary'
import { StatsGrid } from '@/components/progress/stats-grid'
import { features } from '@/config/features'
import { getCurrentUser } from '@/server/auth'
import { computeProgressStats, getActivityBuckets } from '@/server/services/lessons.service'
import { getQuizStats } from '@/server/services/quiz.service'

export const metadata: Metadata = { title: 'Your progress — Foothold' }

export default async function ProgressPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [stats, buckets, quizStats] = await Promise.all([
    computeProgressStats(user.id),
    getActivityBuckets(user.id),
    getQuizStats(user.id),
  ])

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Progress</p>
        <h1 className="text-h1 text-ink">Your trading journey</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Small habits, compounded. Here&apos;s what you&apos;ve built so far.
        </p>
      </div>

      <StatsGrid stats={stats} />
      {features.quizzes && <QuizSummary stats={quizStats} />}
      <ActivityHeatmap buckets={buckets} />
      <Achievements stats={stats} quizStats={quizStats} />
    </div>
  )
}
