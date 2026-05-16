import { formatQty, formatUsd } from '@/lib/paper-trading/format'

export type TradeSnapshotInput = {
  side: 'buy' | 'sell'
  quantity: number
  symbol: string
  price: number
}

/**
 * Pure, deterministic one-line label for a linked trade, e.g.
 * `"BUY 0.0123 BTC @ $64,210.00"`. Stored denormalised on the entry so the
 * reflection stays meaningful even after a portfolio reset deletes the trade.
 */
export function formatTradeSnapshot(t: TradeSnapshotInput): string {
  return `${t.side.toUpperCase()} ${formatQty(t.quantity)} ${t.symbol} @ ${formatUsd(t.price)}`
}
