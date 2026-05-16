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
