import type { JournalEntry } from '@prisma/client'

import { type JournalErrorCode } from '@/lib/journal/constants'
import { formatTradeSnapshot } from '@/lib/journal/format'
import { normalizeTags } from '@/lib/journal/tags'
import type { CreateJournalInput, UpdateJournalInput } from '@/lib/validations/journal'
import * as journalRepo from '@/server/repositories/journal.repository'
import type { WritableEntry } from '@/server/repositories/journal.repository'
import * as paperTradingRepo from '@/server/repositories/paper-trading.repository'
import type { TradeRow } from '@/server/repositories/paper-trading.repository'

export type JournalResult = { ok: true } | { ok: false; code: JournalErrorCode }

export type JournalScreenData = {
  entries: JournalEntry[]
  linkableTrades: TradeRow[]
}

export type TradeDraft = {
  tradeId: string
  snapshot: string
  suggestedTitle: string
}

export async function getJournalScreenData(userId: string): Promise<JournalScreenData> {
  const [entries, linkableTrades] = await Promise.all([
    journalRepo.list(userId),
    paperTradingRepo.getTradesByUser(userId),
  ])
  return { entries, linkableTrades }
}

const snapshotOf = (t: TradeRow): string =>
  formatTradeSnapshot({ side: t.side, quantity: t.quantity, symbol: t.symbol, price: t.price })

/**
 * Resolves the optional trade link server-side. The client never supplies a
 * snapshot — it's always derived from a trade the user actually owns.
 */
async function buildWritable(
  userId: string,
  input: CreateJournalInput
): Promise<{ ok: true; data: WritableEntry } | { ok: false; code: JournalErrorCode }> {
  let tradeId: string | null = null
  let tradeSnapshot: string | null = null

  if (input.tradeId) {
    const trade = await paperTradingRepo.getTradeForUser(userId, input.tradeId)
    if (!trade) return { ok: false, code: 'TRADE_NOT_OWNED' }
    tradeId = trade.id
    tradeSnapshot = snapshotOf(trade)
  }

  return {
    ok: true,
    data: {
      title: input.title.trim(),
      rationale: input.rationale.trim(),
      mood: input.mood,
      lesson: input.lesson?.trim() ? input.lesson.trim() : null,
      tags: normalizeTags(input.tags ?? []),
      tradeId,
      tradeSnapshot,
    },
  }
}

export async function createEntry(
  userId: string,
  input: CreateJournalInput
): Promise<JournalResult> {
  const built = await buildWritable(userId, input)
  if (!built.ok) return built
  await journalRepo.create(userId, built.data)
  return { ok: true }
}

export async function updateEntry(
  userId: string,
  input: UpdateJournalInput
): Promise<JournalResult> {
  const built = await buildWritable(userId, input)
  if (!built.ok) return built
  const ok = await journalRepo.update(userId, input.id, built.data)
  return ok ? { ok: true } : { ok: false, code: 'NOT_FOUND' }
}

export async function deleteEntry(userId: string, id: string): Promise<JournalResult> {
  const ok = await journalRepo.remove(userId, id)
  return ok ? { ok: true } : { ok: false, code: 'NOT_FOUND' }
}

/** Prefill for the simulator's "Journal this trade" deep-link. */
export async function getDraftForTrade(
  userId: string,
  tradeId: string
): Promise<TradeDraft | null> {
  const trade = await paperTradingRepo.getTradeForUser(userId, tradeId)
  if (!trade) return null
  return {
    tradeId: trade.id,
    snapshot: snapshotOf(trade),
    suggestedTitle: `${trade.side === 'buy' ? 'Bought' : 'Sold'} ${trade.symbol}`,
  }
}
