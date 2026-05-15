import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LessonCatalog } from '@/components/lessons/lesson-filter'
import { MarketPills } from '@/components/markets/market-pills'
import { Badge } from '@/components/ui/badge'
import { features } from '@/config/features'
import { getCurrentUser } from '@/server/auth'
import { getCatalogWithProgress, computeProgressStats } from '@/server/services/lessons.service'

export const metadata: Metadata = { title: 'Learn — Foothold' }

export default async function LearnPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [lessons, stats] = await Promise.all([
    getCatalogWithProgress(user.id),
    computeProgressStats(user.id),
  ])

  const firstName = user.name?.split(' ')[0] ?? 'there'

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-1">Learn</p>
          <h1 className="text-h1 text-ink">Hi {firstName} 👋</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Pick something for today — small chunks beat marathon sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="brand" size="lg">
            🔥 {stats.streakDays}-day streak
          </Badge>
          <Badge variant="outline" size="lg">
            ✓ {stats.chaptersCompleted} chapters done
          </Badge>
          {features.liveMarket && (
            <Suspense fallback={null}>
              <MarketPills />
            </Suspense>
          )}
        </div>
      </div>

      <LessonCatalog lessons={lessons} />
    </div>
  )
}
