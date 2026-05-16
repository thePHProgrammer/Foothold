import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ChangePill } from '@/components/markets/change-pill'
import { StatusBadge } from '@/components/markets/status-badge'
import { AssetSelector } from '@/components/practice/asset-selector'
import { HoldingsTable } from '@/components/practice/holdings-table'
import { OrderTicket } from '@/components/practice/order-ticket'
import { PortfolioSetup } from '@/components/practice/portfolio-setup'
import { PracticeHeader } from '@/components/practice/practice-header'
import { PracticeTip } from '@/components/practice/practice-tip'
import { PriceChart } from '@/components/practice/price-chart'
import { RecentTrades } from '@/components/practice/recent-trades'
import { features } from '@/config/features'
import { formatAsOf, formatPrice } from '@/lib/market/format'
import { getCurrentUser } from '@/server/auth'
import {
  getPracticeScreenData,
  resolveSelectedSymbol,
} from '@/server/services/paper-trading.service'

export const metadata: Metadata = { title: 'Practice — Foothold' }

export const revalidate = 60

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { symbol?: string }
}) {
  if (!features.paperTrading) notFound()

  const user = await getCurrentUser()
  if (!user) notFound()

  const selectedSymbol = resolveSelectedSymbol(searchParams.symbol)
  const data = await getPracticeScreenData(user.id, selectedSymbol)

  if (!data) {
    return <PortfolioSetup />
  }

  const { portfolioView, selectedQuote, recentTrades } = data
  const positionQty =
    portfolioView.positions.find((p) => p.symbol === selectedQuote.symbol)?.quantity ?? 0

  return (
    <div className="animate-fade-in space-y-8">
      <PracticeHeader
        totalValue={portfolioView.totalValue}
        totalPnl={portfolioView.totalPnl}
        totalPnlPct={portfolioView.totalPnlPct}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4 rounded-md border border-line bg-surface p-5 shadow-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-ink">
                  {selectedQuote.name}{' '}
                  <span className="font-mono text-[11px] font-normal text-ink-faint">
                    {selectedQuote.symbol}
                  </span>
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  As of {formatAsOf(selectedQuote.asOf)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-h3 font-extrabold text-ink">
                  {formatPrice(selectedQuote.price, selectedQuote.kind, selectedQuote.symbol)}
                </p>
                {selectedQuote.change24hPct !== null && (
                  <ChangePill pct={selectedQuote.change24hPct} />
                )}
              </div>
            </div>

            <PriceChart sparkline={selectedQuote.sparkline} />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge freshness={selectedQuote.freshness} session={selectedQuote.session} />
              <AssetSelector selected={selectedQuote.symbol} />
            </div>
          </div>

          <HoldingsTable positions={portfolioView.positions} />
          <RecentTrades trades={recentTrades} />
        </div>

        <div className="space-y-6">
          <OrderTicket
            symbol={selectedQuote.symbol}
            name={selectedQuote.name}
            kind={selectedQuote.kind}
            price={selectedQuote.price}
            cashBalance={portfolioView.cashBalance}
            positionQty={positionQty}
          />
          <PracticeTip />
        </div>
      </div>
    </div>
  )
}
