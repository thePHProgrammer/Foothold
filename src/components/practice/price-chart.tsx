'use client'

import { useEffect, useRef } from 'react'

import type { UTCTimestamp } from 'lightweight-charts'

/**
 * Lightweight-charts area chart fed by the existing crypto 7-day sparkline.
 * The library is imported lazily inside the effect so it never runs during
 * SSR. Instruments without history (stocks/forex on the free tier) render a
 * calm placeholder rather than a misleading flat line.
 */

// Canvas lib can't read Tailwind classes — mirror the design tokens here.
const PALETTE = {
  brand: '#D97757',
  up: '#2F8F5A',
  down: '#C75348',
  line: '#EBE6DD',
  faint: '#A39C92',
}

export function PriceChart({ sparkline }: { sparkline?: number[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasHistory = Array.isArray(sparkline) && sparkline.length >= 2

  useEffect(() => {
    if (!hasHistory || !containerRef.current) return
    const el = containerRef.current
    let disposed = false
    let cleanup: (() => void) | undefined

    void import('lightweight-charts').then(({ createChart, ColorType, LineStyle }) => {
      if (disposed) return

      const points = sparkline as number[]
      const first = points[0] ?? 0
      const last = points[points.length - 1] ?? 0
      const colour = last >= first ? PALETTE.up : PALETTE.down

      const chart = createChart(el, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: PALETTE.faint,
          fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
        },
        grid: {
          horzLines: { color: PALETTE.line, style: LineStyle.Dotted },
          vertLines: { visible: false },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false, visible: false },
        crosshair: { horzLine: { visible: false }, vertLine: { visible: false } },
        handleScroll: false,
        handleScale: false,
      })

      const series = chart.addAreaSeries({
        lineColor: colour,
        lineWidth: 2,
        topColor: `${colour}40`,
        bottomColor: `${colour}00`,
        priceLineVisible: false,
        lastValueVisible: false,
      })

      const start = Math.floor(Date.now() / 1000) - (points.length - 1) * 3600
      series.setData(
        points.map((value, i) => ({ time: (start + i * 3600) as UTCTimestamp, value }))
      )
      chart.timeScale().fitContent()

      cleanup = () => chart.remove()
    })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [hasHistory, sparkline])

  if (!hasHistory) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center rounded-md border border-dashed border-line-2 bg-paper-alt text-center">
        <p className="text-sm font-semibold text-ink-soft">Price history unavailable</p>
        <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
          The free data tier doesn&apos;t include intraday history for this instrument. The live
          price still updates every 60 seconds.
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className="h-[240px] w-full" />
}
