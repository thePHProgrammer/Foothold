'use client'

import { useRef, useState, useTransition } from 'react'

import { submitQuiz } from '@/actions/quiz'
import { QuizResultView } from '@/components/quiz/quiz-result-view'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup } from '@/components/ui/radio-group'
import type { GradedQuizResult, QuizQuestion } from '@/lib/quiz/scoring'
import { cn } from '@/lib/utils'

type Answers = Record<string, number | null>

export function QuizRunner({
  lessonSlug,
  title,
  questions,
  backHref,
}: {
  lessonSlug: string
  title: string
  questions: QuizQuestion[]
  backHref: string
}) {
  const blank = (): Answers => Object.fromEntries(questions.map((q) => [q.id, null]))

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>(blank)
  const [result, setResult] = useState<GradedQuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const startedAt = useRef(Date.now())

  const current = questions[idx]
  const isLast = idx === questions.length - 1

  if (result) {
    return (
      <QuizResultView
        title={title}
        result={result}
        backHref={backHref}
        onRetry={() => {
          setResult(null)
          setAnswers(blank())
          setIdx(0)
          setError(null)
          startedAt.current = Date.now()
        }}
      />
    )
  }

  if (!current) return null

  function submit() {
    setError(null)
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000)
    startTransition(async () => {
      const res = await submitQuiz({ lessonSlug, answers, durationSec })
      if (res.ok) setResult(res.result)
      else setError(res.error)
    })
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={cn('h-1.5 flex-1 rounded-pill', i <= idx ? 'bg-brand' : 'bg-paper-alt')}
          />
        ))}
      </div>

      <div className="space-y-5">
        <div>
          <p className="eyebrow mb-1">
            Question {idx + 1} of {questions.length}
          </p>
          <h2 className="text-h3 text-ink">{current.question}</h2>
        </div>

        <RadioGroup
          name={current.id}
          value={answers[current.id] === null ? '' : String(answers[current.id])}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [current.id]: Number(v) }))}
          options={current.options.map((opt, i) => ({
            value: String(i),
            label: `${String.fromCharCode(65 + i)}.  ${opt}`,
          }))}
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0 || isPending}
        >
          Back
        </Button>
        {isLast ? (
          <Button variant="primary" size="lg" onClick={submit} disabled={isPending}>
            {isPending ? 'Scoring…' : 'Submit quiz'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
            disabled={isPending}
          >
            Next
          </Button>
        )}
      </div>
    </Card>
  )
}
