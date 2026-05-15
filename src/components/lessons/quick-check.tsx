'use client'

import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { QuickCheck as QuickCheckType } from '@/types/lessons'

export function QuickCheck({ data }: { data: QuickCheckType }) {
  const [picked, setPicked] = useState<number | null>(null)
  const revealed = picked !== null
  const isCorrect = picked === data.correct

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">🧠</span>
        <h3 className="text-h4 text-ink">Quick check</h3>
      </div>
      <p className="text-[15px] leading-relaxed text-ink">{data.question}</p>

      <ul className="space-y-2">
        {data.options.map((opt, i) => {
          const isPicked = picked === i
          const isCorrectAnswer = i === data.correct

          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => !revealed && setPicked(i)}
                disabled={revealed}
                aria-pressed={isPicked}
                className={cn(
                  'flex w-full items-start gap-3 rounded-sm border p-3 text-left text-sm transition-colors',
                  !revealed && 'cursor-pointer border-line-2 bg-surface hover:bg-paper-alt',
                  revealed && isCorrectAnswer && 'border-success bg-success-tint text-ink',
                  revealed && isPicked && !isCorrect && 'border-danger bg-danger-tint text-ink',
                  revealed && !isPicked && !isCorrectAnswer && 'border-line bg-surface opacity-60'
                )}
              >
                <span className="mt-0.5 font-mono text-[11px] font-bold text-ink-soft">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {revealed && isCorrectAnswer && <span aria-hidden>✓</span>}
                {revealed && isPicked && !isCorrect && <span aria-hidden>✗</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {revealed && (
        <div
          className={cn(
            'rounded-sm px-3 py-2 text-sm font-semibold',
            isCorrect ? 'bg-success-tint text-success' : 'bg-warn-tint text-warn'
          )}
        >
          {isCorrect
            ? "Nice — that's right."
            : "Not quite. Re-read the chapter and you'll spot it."}
        </div>
      )}
    </Card>
  )
}
