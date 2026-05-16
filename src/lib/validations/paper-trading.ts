import { z } from 'zod'

import { SYMBOLS_BY_SYMBOL } from '@/lib/market/symbols'
import { MAX_START, MIN_START } from '@/lib/paper-trading/constants'

const tradableSymbol = z.string().refine((s) => s in SYMBOLS_BY_SYMBOL, {
  message: 'Unknown instrument',
})

export const createPortfolioSchema = z.object({
  startingCash: z
    .number()
    .finite()
    .min(MIN_START, `Minimum is $${MIN_START.toLocaleString()}`)
    .max(MAX_START, `Maximum is $${MAX_START.toLocaleString()}`),
})

export const placeOrderSchema = z.object({
  symbol: tradableSymbol,
  side: z.enum(['buy', 'sell']),
  /** USD the user wants to spend (buy) or realise (sell). */
  notional: z.number().finite().positive('Enter an amount greater than zero'),
})

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>
