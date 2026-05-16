import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { JournalComposer } from '@/components/journal/journal-composer'
import { JournalList } from '@/components/journal/journal-list'
import { EmptyState } from '@/components/shared/empty-state'
import { features } from '@/config/features'
import { getCurrentUser } from '@/server/auth'
import { getDraftForTrade, getJournalScreenData } from '@/server/services/journal.service'

export const metadata: Metadata = { title: 'Trading journal — Foothold' }

export default async function JournalPage({
  searchParams,
}: {
  searchParams: { tradeId?: string }
}) {
  if (!features.journal) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { entries, linkableTrades } = await getJournalScreenData(user.id)

  const draft = searchParams.tradeId ? await getDraftForTrade(user.id, searchParams.tradeId) : null

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Journal</p>
        <h1 className="text-h1 text-ink">Your trading journal</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The reflection loop: what you did, how you felt, what you&apos;d change. The best traders
          review themselves, not just the market.
        </p>
      </div>

      <JournalComposer
        linkableTrades={linkableTrades}
        prefill={
          draft ? { tradeId: draft.tradeId, suggestedTitle: draft.suggestedTitle } : undefined
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon="📓"
          title="No entries yet"
          description="Write your first reflection above — even a one-liner builds the habit."
        />
      ) : (
        <JournalList entries={entries} linkableTrades={linkableTrades} />
      )}
    </div>
  )
}
