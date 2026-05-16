'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { CRYPTO_SYMBOLS, FOREX_SYMBOLS, STOCK_SYMBOLS } from '@/lib/market/symbols'

const GROUPS = [
  { label: 'Crypto', symbols: CRYPTO_SYMBOLS },
  { label: 'Stocks', symbols: STOCK_SYMBOLS },
  { label: 'Forex', symbols: FOREX_SYMBOLS },
]

/** Switches the traded asset via a URL param so the page stays server-rendered. */
export function AssetSelector({ selected }: { selected: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <label className="flex items-center gap-2 text-[12px] text-ink-faint">
      <span>Asset</span>
      <select
        value={selected}
        disabled={isPending}
        onChange={(e) => {
          const symbol = e.target.value
          startTransition(() => {
            router.replace(`/practice?symbol=${symbol}`, { scroll: false })
          })
        }}
        className="rounded-pill border border-line-2 bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
      >
        {GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.symbols.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}
