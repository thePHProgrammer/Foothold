import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ProgressStats } from '@/server/services/lessons.service'
import type { QuizStats } from '@/server/services/quiz.service'

interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  unlocked: (stats: ProgressStats) => boolean
}

interface QuizAchievement {
  id: string
  emoji: string
  title: string
  description: string
  unlocked: (stats: QuizStats) => boolean
}

const QUIZ_ACHIEVEMENTS: QuizAchievement[] = [
  {
    id: 'first-quiz',
    emoji: '🎯',
    title: 'Quiz cleared',
    description: 'Pass your first lesson quiz.',
    unlocked: (s) => s.quizzesPassed >= 1,
  },
  {
    id: 'quiz-ace',
    emoji: '🏆',
    title: 'Quiz ace',
    description: 'Score 90% or higher on a quiz.',
    unlocked: (s) => s.bestScorePct >= 90,
  },
]

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-chapter',
    emoji: '🌱',
    title: 'First step',
    description: 'Complete your first chapter.',
    unlocked: (s) => s.chaptersCompleted >= 1,
  },
  {
    id: 'first-lesson',
    emoji: '📘',
    title: 'Lesson learned',
    description: 'Finish a whole lesson.',
    unlocked: (s) => s.lessonsCompleted >= 1,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: 'Three in a row',
    description: 'Hit a 3-day streak.',
    unlocked: (s) => s.streakDays >= 3,
  },
  {
    id: 'all-markets',
    emoji: '🌍',
    title: 'Global view',
    description: 'Read at least one chapter in each of crypto, stocks, and forex.',
    unlocked: (s) =>
      s.topicBreakdown.crypto > 0 && s.topicBreakdown.stocks > 0 && s.topicBreakdown.forex > 0,
  },
]

export function Achievements({ stats, quizStats }: { stats: ProgressStats; quizStats: QuizStats }) {
  const badges = [
    ...ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.unlocked(stats) })),
    ...QUIZ_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.unlocked(quizStats) })),
  ]

  return (
    <Card padding="lg">
      <div className="mb-4">
        <h2 className="text-h3 text-ink">Badges</h2>
        <p className="text-xs text-ink-soft">Earn these as you progress.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {badges.map((a) => {
          const unlocked = a.unlocked
          return (
            <div
              key={a.id}
              className={cn(
                'rounded-md border p-3 text-center transition-colors',
                unlocked
                  ? 'border-brand/40 bg-brand-tint/40'
                  : 'border-line bg-paper-alt/30 opacity-60'
              )}
            >
              <span className="text-2xl">{a.emoji}</span>
              <p className="mt-1 text-sm font-bold text-ink">{a.title}</p>
              <p className="text-xs text-ink-soft">{a.description}</p>
              {unlocked && (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-success">
                  Unlocked
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
