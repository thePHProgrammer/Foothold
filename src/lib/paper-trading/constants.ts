/**
 * Paper-trading domain constants. Pure values — safe to import anywhere
 * (client or server).
 */

/** Practice fee rate (0.1%). Matches the design mock: $0.25 on a $250 order. */
export const FEE_RATE = 0.001

/** Quick-fill chips on the order ticket (USD). */
export const QUICK_AMOUNTS = [100, 250, 500] as const

/** Bounds + suggested default for the user-chosen starting balance (USD). */
export const MIN_START = 100
export const MAX_START = 10_000_000
export const SUGGESTED_START = 10_000

/**
 * Typed order-execution failures. Defined here (not in the service) so the
 * client order ticket can map codes → copy exhaustively without importing
 * server code.
 */
export type OrderErrorCode =
  | 'PORTFOLIO_NOT_FOUND'
  | 'STALE_PRICE'
  | 'INVALID_AMOUNT'
  | 'INSUFFICIENT_CASH'
  | 'INSUFFICIENT_QUANTITY'

export const ORDER_ERROR_MESSAGES: Record<OrderErrorCode, string> = {
  PORTFOLIO_NOT_FOUND: 'Set up a practice portfolio first.',
  STALE_PRICE: 'Price unavailable right now — try again in a moment.',
  INVALID_AMOUNT: 'Enter an amount greater than zero.',
  INSUFFICIENT_CASH: 'Not enough play cash for this order.',
  INSUFFICIENT_QUANTITY: "You don't hold enough of this asset to sell.",
}
