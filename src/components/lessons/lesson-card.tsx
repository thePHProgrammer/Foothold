import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { ProgressRing } from '@/components/lessons/progress-ring'
import { cn } from '@/lib/utils'
import type { LessonMetaWithProgress, Topic } from '@/types/lessons'

const TOPIC_META: Record<
  Topic,
  { label: string; emoji: string; variant: 'crypto' | 'stocks' | 'forex' }
> = {
  crypto: { label: 'Crypto', emoji: '🪙', variant: 'crypto' },
  stocks: { label: 'Stocks', emoji: '📈', variant: 'stocks' },
  forex: { label: 'Forex', emoji: '💱', variant: 'forex' },
}

const COVER_GRADIENTS: Record<Topic, string> = {
  crypto: 'from-brand/20 via-brand/10 to-paper-alt',
  stocks: 'from-success/20 via-success/10 to-paper-alt',
  forex: 'from-warn/20 via-warn/10 to-paper-alt',
}

export function LessonCard({ lesson }: { lesson: LessonMetaWithProgress }) {
  const topic = TOPIC_META[lesson.topic]
  const ctaLabel = lesson.isCompleted ? 'Review' : lesson.isStarted ? 'Continue' : 'Start'

  return (
    <Link href={`/learn/${lesson.slug}`} className="group block no-underline">
      <Card variant="interactive" padding="none" className="overflow-hidden">
        <div
          className={cn(
            'relative flex h-32 items-center justify-center bg-gradient-to-br',
            COVER_GRADIENTS[lesson.topic]
          )}
        >
          <span className="text-5xl drop-shadow-sm">{topic.emoji}</span>
          <span className="absolute right-3 top-3">
            <ProgressRing value={lesson.progressPercent} size={40} />
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={topic.variant} size="sm">
              {topic.emoji} {topic.label}
            </Badge>
            <span className="font-mono text-[11px] text-ink-faint">{lesson.estimatedMins} min</span>
          </div>

          <div>
            <h3 className="text-base font-bold leading-tight text-ink group-hover:text-brand">
              {lesson.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[13px] text-ink-soft">{lesson.description}</p>
          </div>

          <ProgressBar value={lesson.progressPercent} className="h-1.5" />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-ink-soft">
              {lesson.completedChapters.length} / {lesson.chapterSummaries.length} chapters
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
              {ctaLabel}
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
