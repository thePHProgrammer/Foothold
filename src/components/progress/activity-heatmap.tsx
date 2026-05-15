import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ActivityBucket } from '@/server/services/lessons.service'

const COLOR_STEPS = [
  'bg-paper-alt',
  'bg-brand/30',
  'bg-brand/55',
  'bg-brand/80',
  'bg-brand',
] as const

function colorFor(count: number): (typeof COLOR_STEPS)[number] {
  if (count === 0) return COLOR_STEPS[0]
  if (count === 1) return COLOR_STEPS[1]
  if (count === 2) return COLOR_STEPS[2]
  if (count <= 4) return COLOR_STEPS[3]
  return COLOR_STEPS[4]
}

export function ActivityHeatmap({ buckets }: { buckets: ActivityBucket[] }) {
  const weeks: ActivityBucket[][] = []
  for (let i = 0; i < buckets.length; i += 7) {
    weeks.push(buckets.slice(i, i + 7))
  }

  return (
    <Card padding="lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-h3 text-ink">Your activity</h2>
          <p className="text-xs text-ink-soft">Last {buckets.length} days</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-faint">
          <span>Less</span>
          {COLOR_STEPS.map((c, i) => (
            <span key={i} className={cn('h-2.5 w-2.5 rounded-xs', c)} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.date}: ${day.count} chapter${day.count === 1 ? '' : 's'}`}
                  className={cn('h-3 w-3 rounded-xs', colorFor(day.count))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
