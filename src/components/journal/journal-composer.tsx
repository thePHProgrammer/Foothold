'use client'

import { useState } from 'react'

import { createJournalEntry } from '@/actions/journal'
import {
  emptyForm,
  JournalEntryForm,
  type JournalFormValues,
} from '@/components/journal/journal-entry-form'
import { Card } from '@/components/ui/card'
import type { TradeRow } from '@/server/services/paper-trading.service'

export function JournalComposer({
  linkableTrades,
  prefill,
}: {
  linkableTrades: TradeRow[]
  prefill?: { tradeId: string; suggestedTitle: string }
}) {
  // Remount the form on success to reset all fields cleanly.
  const [formKey, setFormKey] = useState(0)
  const [saved, setSaved] = useState(false)

  const initial: JournalFormValues = {
    ...emptyForm(),
    ...(prefill ? { title: prefill.suggestedTitle, tradeId: prefill.tradeId } : {}),
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <h2 className="text-h3 text-ink">New entry</h2>
        <p className="text-xs text-ink-soft">
          Reflection beats memory. Write while it&apos;s fresh.
        </p>
      </div>

      <JournalEntryForm
        key={formKey}
        initial={initial}
        linkableTrades={linkableTrades}
        submitLabel="Save entry"
        pendingLabel="Saving…"
        onSubmit={(v) => createJournalEntry(v)}
        onSuccess={() => {
          setSaved(true)
          setFormKey((k) => k + 1)
        }}
      />

      {saved && <p className="text-sm font-medium text-success">Entry saved.</p>}
    </Card>
  )
}
