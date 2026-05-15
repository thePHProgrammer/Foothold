'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { saveOnboardingPreferences } from '@/actions/onboarding'
import { cn } from '@/lib/utils'
import type { Experience, Market } from '@/types/onboarding'

type Step = 0 | 1 | 2

const MARKETS: { value: Market; label: string; emoji: string }[] = [
  { value: 'crypto', label: 'Crypto', emoji: '🪙' },
  { value: 'stocks', label: 'Stocks', emoji: '📈' },
  { value: 'forex', label: 'Forex', emoji: '💱' },
]

const EXPERIENCE: { value: Experience; label: string; description: string }[] = [
  { value: 'beginner', label: 'Total beginner', description: "I'm starting from scratch." },
  {
    value: 'intermediate',
    label: 'Some idea',
    description: 'I know the basics but not much more.',
  },
  { value: 'advanced', label: 'Confident', description: 'I trade already; I want a refresher.' },
]

const DAILY_GOALS = [5, 10, 15, 20, 30]

export function PreferenceWizard() {
  const [step, setStep] = useState<Step>(0)
  const [markets, setMarkets] = useState<Market[]>(['crypto', 'stocks'])
  const [experience, setExperience] = useState<Experience>('beginner')
  const [dailyGoalMins, setDailyGoalMins] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleMarket(m: Market) {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  function next() {
    setError(null)
    if (step === 0 && markets.length === 0) {
      setError('Pick at least one market.')
      return
    }
    setStep((s) => (s < 2 ? ((s + 1) as Step) : s))
  }

  function back() {
    setError(null)
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s))
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      try {
        await saveOnboardingPreferences({ markets, experience, dailyGoalMins })
      } catch (e) {
        // Server actions throw a redirect "error" on success — Next swallows it.
        // Anything else is a real failure.
        const msg = e instanceof Error ? e.message : 'Something went wrong'
        if (!msg.includes('NEXT_REDIRECT')) setError(msg)
      }
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Card padding="lg" className="animate-fade-in">
        <div className="mb-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn('h-1.5 flex-1 rounded-pill', i <= step ? 'bg-brand' : 'bg-paper-alt')}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <p className="eyebrow mb-1">Step 1 of 3</p>
              <h1 className="text-h2 text-ink">Which markets interest you?</h1>
              <p className="mt-2 text-sm text-ink-soft">
                Pick one, two, or all three. You can change this later.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {MARKETS.map((m) => {
                const active = markets.includes(m.value)
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => toggleMarket(m.value)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition-colors',
                      active
                        ? 'border-brand bg-brand text-white'
                        : 'border-line-2 bg-surface text-ink hover:bg-paper-alt'
                    )}
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="eyebrow mb-1">Step 2 of 3</p>
              <h1 className="text-h2 text-ink">How much do you already know?</h1>
              <p className="mt-2 text-sm text-ink-soft">
                We use this to set the starting reading level — not to lock you out of advanced
                lessons.
              </p>
            </div>
            <div className="space-y-2">
              {EXPERIENCE.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExperience(opt.value)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-sm border p-4 text-left transition-colors',
                    experience === opt.value
                      ? 'border-brand bg-brand-tint/40'
                      : 'border-line-2 bg-surface hover:bg-paper-alt'
                  )}
                >
                  <span className="mt-0.5 text-base font-bold text-ink">{opt.label}</span>
                  <span className="text-sm text-ink-soft">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="eyebrow mb-1">Step 3 of 3</p>
              <h1 className="text-h2 text-ink">How much time per day?</h1>
              <p className="mt-2 text-sm text-ink-soft">
                A small daily habit beats a long binge. Pick a goal you can actually keep.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAILY_GOALS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoalMins(mins)}
                  className={cn(
                    'rounded-pill border px-4 py-2 text-sm font-semibold transition-colors',
                    dailyGoalMins === mins
                      ? 'border-brand bg-brand text-white'
                      : 'border-line-2 bg-surface text-ink hover:bg-paper-alt'
                  )}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-danger">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0 || isPending}>
            Back
          </Button>
          {step < 2 ? (
            <Button variant="primary" onClick={next} disabled={isPending}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={submit} disabled={isPending}>
              {isPending ? 'Building your plan…' : 'Build my plan →'}
            </Button>
          )}
        </div>
      </Card>

      <aside className="hidden lg:block">
        <Card variant="flat" padding="lg" className="bg-paper-alt/40">
          <p className="eyebrow mb-2">What happens next</p>
          <h2 className="text-h3 text-ink">A 3-step journey, tailored to you</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex gap-2">
              <span className="text-brand">1.</span> A short catalog of starter lessons in the
              markets you picked.
            </li>
            <li className="flex gap-2">
              <span className="text-brand">2.</span> Bite-sized chapters you can finish inside your
              daily goal.
            </li>
            <li className="flex gap-2">
              <span className="text-brand">3.</span> A glossary that decodes any jargon you hit
              along the way.
            </li>
          </ul>
        </Card>
      </aside>
    </div>
  )
}
