'use client'

import { useState, useTransition } from 'react'

import type { JournalEntry } from '@prisma/client'

import { deleteJournalEntry, updateJournalEntry } from '@/actions/journal'
import { JournalEntryForm } from '@/components/journal/journal-entry-form'
import { JournalTradeChip } from '@/components/journal/journal-trade-chip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MOOD_LABELS, type Mood } from '@/lib/journal/constants'
import type { TradeRow } from '@/server/services/paper-trading.service'

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function JournalEntryCard({
  entry,
  linkableTrades,
}: {
  entry: JournalEntry
  linkableTrades: TradeRow[]
}) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (editing) {
    return (
      <Card padding="lg">
        <JournalEntryForm
          initial={{
            title: entry.title,
            rationale: entry.rationale,
            mood: entry.mood as Mood,
            lesson: entry.lesson ?? '',
            tags: entry.tags,
            tradeId: entry.tradeId ?? '',
          }}
          linkableTrades={linkableTrades}
          submitLabel="Save changes"
          pendingLabel="Saving…"
          onSubmit={(v) => updateJournalEntry({ id: entry.id, ...v })}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
        />
      </Card>
    )
  }

  return (
    <Card padding="lg" className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-h4 text-ink">{entry.title}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
            {dateFmt.format(entry.createdAt)}
          </p>
        </div>
        <Badge variant="brand" size="md">
          {MOOD_LABELS[entry.mood as Mood] ?? entry.mood}
        </Badge>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{entry.rationale}</p>

      {entry.lesson && (
        <div className="rounded-sm bg-paper-alt p-3 text-sm text-ink">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
            Next time
          </p>
          <p className="whitespace-pre-wrap leading-relaxed">{entry.lesson}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {entry.tradeSnapshot && <JournalTradeChip snapshot={entry.tradeSnapshot} />}
        {entry.tags.map((t) => (
          <span
            key={t}
            className="rounded-pill border border-line-2 bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-3">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} disabled={isPending}>
          Edit
        </Button>
        {confirmingDelete ? (
          <>
            <Button
              variant="danger"
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await deleteJournalEntry({ id: entry.id })
                  setConfirmingDelete(false)
                })
              }
            >
              {isPending ? 'Deleting…' : 'Confirm delete'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmingDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(true)}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  )
}
