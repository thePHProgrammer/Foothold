import { Card } from '@/components/ui/card'
import type { QuizStats } from '@/server/services/quiz.service'

export function QuizSummary({ stats }: { stats: QuizStats }) {
  const items: { label: string; value: string; sub?: string }[] = [
    {
      label: 'Quizzes passed',
      value: `${stats.quizzesPassed}`,
      sub: `of ${stats.totalQuizzes} lessons`,
    },
    { label: 'Best score', value: `${stats.bestScorePct}%` },
    {
      label: 'Average score',
      value: `${stats.avgScorePct}%`,
      sub: `${stats.quizzesTaken} attempts`,
    },
  ]

  return (
    <Card padding="lg">
      <div className="mb-4">
        <h2 className="text-h3 text-ink">Quizzes</h2>
        <p className="text-xs text-ink-soft">
          {stats.quizzesTaken === 0
            ? 'Finish a lesson, then test yourself with its quiz.'
            : 'How you’re doing on lesson quizzes.'}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-line p-4 text-center">
            <p className="font-mono text-h2 text-ink">{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">{item.label}</p>
            {item.sub && <p className="text-[10px] text-ink-faint">{item.sub}</p>}
          </div>
        ))}
      </div>
    </Card>
  )
}
