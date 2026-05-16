import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { GradedQuizResult } from '@/lib/quiz/scoring'
import { cn } from '@/lib/utils'

export function QuizResultView({
  title,
  result,
  backHref,
  onRetry,
}: {
  title: string
  result: GradedQuizResult
  backHref: string
  onRetry: () => void
}) {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="text-center">
        <p className="eyebrow mb-1">{title} quiz</p>
        <p className="font-mono text-display text-ink">{result.scorePct}%</p>
        <p className="mt-1 text-sm text-ink-soft">
          {result.correct} of {result.total} correct
        </p>
        <div className="mt-3 flex justify-center">
          <Badge variant={result.passed ? 'success' : 'warn'} size="lg">
            {result.passed ? '✓ Passed' : 'Keep practising'}
          </Badge>
        </div>
      </Card>

      <div className="space-y-4">
        {result.questions.map((q, qi) => (
          <Card key={q.id} padding="lg" className="space-y-3">
            <p className="text-[15px] font-semibold leading-relaxed text-ink">
              <span className="font-mono text-[11px] text-ink-faint">Q{qi + 1}. </span>
              {q.question}
            </p>
            <ul className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrectAnswer = i === q.correct
                const isPickedWrong = i === q.chosen && !q.isCorrect
                return (
                  <li
                    key={i}
                    className={cn(
                      'flex items-start gap-3 rounded-sm border p-3 text-sm',
                      isCorrectAnswer && 'border-success bg-success-tint text-ink',
                      isPickedWrong && 'border-danger bg-danger-tint text-ink',
                      !isCorrectAnswer && !isPickedWrong && 'border-line bg-surface opacity-60'
                    )}
                  >
                    <span className="mt-0.5 font-mono text-[11px] font-bold text-ink-soft">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrectAnswer && <span aria-hidden>✓</span>}
                    {isPickedWrong && <span aria-hidden>✗</span>}
                  </li>
                )
              })}
            </ul>
            {q.chosen === null && (
              <p className="text-xs font-semibold text-warn">You skipped this question.</p>
            )}
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-2 bg-surface px-4 py-2 text-sm font-semibold text-ink no-underline hover:bg-paper-alt"
        >
          <span aria-hidden>←</span> Back to lesson
        </Link>
        <Button variant="primary" onClick={onRetry}>
          Retry quiz
        </Button>
      </div>
    </div>
  )
}
