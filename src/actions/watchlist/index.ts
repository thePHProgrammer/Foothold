'use server'

import { revalidatePath } from 'next/cache'

import { logger } from '@/lib/logger'
import { type WatchlistErrorCode } from '@/lib/watchlist/constants'
import { watchlistSymbolSchema } from '@/lib/validations/watchlist'
import { requireAuth } from '@/server/auth'
import * as watchlistService from '@/server/services/watchlist.service'

export type WatchlistActionResult = { ok: true } | { ok: false; code: WatchlistErrorCode }

export async function addToWatchlist(input: unknown): Promise<WatchlistActionResult> {
  const session = await requireAuth()

  const parsed = watchlistSymbolSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await watchlistService.addSymbol(session.user.id, parsed.data.symbol)
  if (!result.ok) return result

  revalidatePath('/watchlists')
  revalidatePath('/markets')
  logger.info('Watchlist symbol added', { userId: session.user.id, symbol: parsed.data.symbol })
  return { ok: true }
}

export async function removeFromWatchlist(input: unknown): Promise<WatchlistActionResult> {
  const session = await requireAuth()

  const parsed = watchlistSymbolSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await watchlistService.removeSymbol(session.user.id, parsed.data.symbol)
  if (!result.ok) return result

  revalidatePath('/watchlists')
  revalidatePath('/markets')
  logger.info('Watchlist symbol removed', { userId: session.user.id, symbol: parsed.data.symbol })
  return { ok: true }
}
