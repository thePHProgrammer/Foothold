import { Card } from '@/components/ui/card'
import type { ProgressStats } from '@/server/services/lessons.service'

export function StatsGrid({ stats }: { stats: ProgressStats }) {
  const items: { label: string; value: string; sub?: string }[] = [
    {
      label: 'Lessons completed',
      value: `${stats.lessonsCompleted}`,
      sub: `${stats.lessonsStarted} started`,
    },
    {
      label: 'Chapters read',
      value: `${stats.chaptersCompleted}`,
      sub: `of ${stats.totalChapters}`,
    },
    { label: 'Estimated time', value: `${stats.estimatedHours}h` },
    { label: 'Day streak', value: `${stats.streakDays}` },
    { label: 'Crypto', value: `${stats.topicBreakdown.crypto}` },
    { label: 'Stocks', value: `${stats.topicBreakdown.stocks}` },
    { label: 'Forex', value: `${stats.topicBreakdown.forex}` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => (
        <Card key={item.label} padding="md" className="text-center">
          <p className="font-mono text-h2 text-ink">{item.value}</p>
          <p className="mt-1 text-xs font-semibold text-ink-soft">{item.label}</p>
          {item.sub && <p className="text-[10px] text-ink-faint">{item.sub}</p>}
        </Card>
      ))}
    </div>
  )
}
