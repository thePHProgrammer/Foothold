'use client'

import { useState, useTransition } from 'react'

import type { JournalActionResult } from '@/actions/journal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MOOD_LABELS, MOODS, messageForJournalError, type Mood } from '@/lib/journal/constants'
import { formatTradeSnapshot } from '@/lib/journal/format'
import { normalizeTags } from '@/lib/journal/tags'
import type { TradeRow } from '@/server/services/paper-trading.service'
import { cn } from '@/lib/utils'

export type JournalFormValues = {
  title: string
  rationale: string
  mood: Mood
  lesson: string
  tags: string[]
  tradeId: string
}

export function emptyForm(): JournalFormValues {
  return { title: '', rationale: '', mood: 'calm', lesson: '', tags: [], tradeId: '' }
}

export function JournalEntryForm({
  initial,
  linkableTrades,
  submitLabel,
  pendingLabel,
  onSubmit,
  onCancel,
  onSuccess,
}: {
  initial: JournalFormValues
  linkableTrades: TradeRow[]
  submitLabel: string
  pendingLabel: string
  onSubmit: (values: JournalFormValues) => Promise<JournalActionResult>
  onCancel?: () => void
  onSuccess?: () => void
}) {
  const [values, setValues] = useState<JournalFormValues>(initial)
  const [tagDraft, setTagDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof JournalFormValues>(key: K, v: JournalFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  function commitTag() {
    const next = normalizeTags([...values.tags, tagDraft])
    set('tags', next)
    setTagDraft('')
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      const res = await onSubmit(values)
      if (res.ok) onSuccess?.()
      else setError(messageForJournalError(res.code))
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="j-title">Title</Label>
        <Input
          id="j-title"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Bought BTC on the dip"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="j-rationale">What did you do, and why?</Label>
        <Textarea
          id="j-rationale"
          value={values.rationale}
          onChange={(e) => set('rationale', e.target.value)}
          placeholder="Your thinking going in…"
        />
      </div>

      <div className="space-y-1.5">
        <Label>How did you feel?</Label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set('mood', m)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-sm font-semibold transition-colors',
                values.mood === m
                  ? 'border-brand bg-brand text-white'
                  : 'border-line-2 bg-surface text-ink hover:bg-paper-alt'
              )}
            >
              {MOOD_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="j-lesson">What would you do differently? (optional)</Label>
        <Textarea
          id="j-lesson"
          value={values.lesson}
          onChange={(e) => set('lesson', e.target.value)}
          placeholder="The takeaway for next time…"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="j-tag">Tags (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="j-tag"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                commitTag()
              }
            }}
            placeholder="risk, fomo, breakout…"
          />
          <Button type="button" variant="outline" onClick={commitTag} disabled={!tagDraft.trim()}>
            Add
          </Button>
        </div>
        {values.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {values.tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  set(
                    'tags',
                    values.tags.filter((x) => x !== t)
                  )
                }
                className="inline-flex items-center gap-1 rounded-pill border border-line-2 bg-paper-alt px-2.5 py-1 text-[12px] font-semibold text-ink-soft hover:text-ink"
              >
                #{t} <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="j-trade">Link a practice trade (optional)</Label>
        <select
          id="j-trade"
          value={values.tradeId}
          onChange={(e) => set('tradeId', e.target.value)}
          className="h-10 w-full rounded-sm border border-line-2 bg-surface px-3 text-sm text-ink focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
        >
          <option value="">— No linked trade —</option>
          {linkableTrades.map((t) => (
            <option key={t.id} value={t.id}>
              {formatTradeSnapshot({
                side: t.side,
                quantity: t.quantity,
                symbol: t.symbol,
                price: t.price,
              })}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm font-medium text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={submit} disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
