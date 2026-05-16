import type { JournalEntry } from '@prisma/client'

import { JournalEntryCard } from '@/components/journal/journal-entry-card'
import type { TradeRow } from '@/server/services/paper-trading.service'

export function JournalList({
  entries,
  linkableTrades,
}: {
  entries: JournalEntry[]
  linkableTrades: TradeRow[]
}) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} linkableTrades={linkableTrades} />
      ))}
    </div>
  )
}
