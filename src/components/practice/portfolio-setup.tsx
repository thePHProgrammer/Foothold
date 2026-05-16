'use client'

import { useState, useTransition } from 'react'

import { createPaperPortfolio } from '@/actions/paper-trading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MAX_START, MIN_START, SUGGESTED_START } from '@/lib/paper-trading/constants'
import { formatUsd } from '@/lib/paper-trading/format'

const PRESETS = [1_000, 10_000, 25_000, 100_000]

/** First-run AND post-reset screen — the learner chooses their play balance. */
export function PortfolioSetup() {
  const [amount, setAmount] = useState<number>(SUGGESTED_START)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function submit() {
    setError(null)
    startTransition(async () => {
      const result = await createPaperPortfolio({ startingCash: amount })
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Practice trade</p>
        <h1 className="text-h1 text-ink">Set up your practice account</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Choose how much play money to start with. None of this is real — it&apos;s a safe sandbox
          to feel how trades work.
        </p>
      </div>

      <Card padding="lg" className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="starting-cash">Starting balance (USD)</Label>
          <Input
            id="starting-cash"
            type="number"
            inputMode="numeric"
            min={MIN_START}
            max={MAX_START}
            value={Number.isNaN(amount) ? '' : amount}
            onChange={(e) => setAmount(Math.floor(Number(e.target.value)))}
            className="font-mono"
          />
          <p className="text-[12px] text-ink-faint">
            Between {formatUsd(MIN_START)} and {formatUsd(MAX_START)}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              className={[
                'rounded-pill border px-3 py-1.5 font-mono text-xs font-semibold transition-colors',
                amount === p
                  ? 'border-brand bg-brand text-white'
                  : 'border-line-2 bg-surface text-ink-soft hover:bg-paper-alt',
              ].join(' ')}
            >
              {formatUsd(p)}
            </button>
          ))}
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button
          variant="primary"
          size="lg"
          onClick={submit}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Setting up…' : 'Start practising'}
        </Button>
      </Card>
    </div>
  )
}
