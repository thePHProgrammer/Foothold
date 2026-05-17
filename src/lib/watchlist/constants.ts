/**
 * Watchlist domain constants. Pure values — safe to import anywhere.
 */

/** Cap so a watchlist stays a focused shortlist, not the whole catalog. */
export const MAX_WATCHLIST = 20

/** Typed watchlist failures → friendly copy (exhaustive). */
export type WatchlistErrorCode = 'VALIDATION' | 'UNKNOWN_SYMBOL' | 'LIMIT_REACHED'

const WATCHLIST_ERROR_MESSAGES: Record<WatchlistErrorCode, string> = {
  VALIDATION: 'That request was invalid — please try again.',
  UNKNOWN_SYMBOL: "That symbol isn't in the market catalog.",
  LIMIT_REACHED: `You can watch up to ${MAX_WATCHLIST} symbols. Remove one first.`,
}

export function messageForWatchlistError(code: WatchlistErrorCode): string {
  return WATCHLIST_ERROR_MESSAGES[code]
}
