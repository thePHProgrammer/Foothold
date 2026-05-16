import { z } from 'zod'

import { isTradableSymbol } from '@/lib/watchlist/symbols'

export const watchlistSymbolSchema = z.object({
  symbol: z.string().refine(isTradableSymbol, { message: 'Unknown symbol' }),
})

export type WatchlistSymbolInput = z.infer<typeof watchlistSymbolSchema>
