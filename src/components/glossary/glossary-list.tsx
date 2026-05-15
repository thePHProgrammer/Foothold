'use client'

import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { GlossaryTerm } from '@/data/glossary'

const TOPIC_LABELS: Record<GlossaryTerm['topic'], string> = {
  general: 'General',
  crypto: '🪙 Crypto',
  stocks: '📈 Stocks',
  forex: '💱 Forex',
}

export function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const sorted = useMemo(() => [...terms].sort((a, b) => a.term.localeCompare(b.term)), [terms])

  const letters = useMemo(() => {
    const set = new Set(sorted.map((t) => t.term[0]?.toUpperCase() ?? ''))
    return Array.from(set).filter(Boolean).sort()
  }, [sorted])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter((t) => {
      if (activeLetter && t.term[0]?.toUpperCase() !== activeLetter) return false
      if (!q) return true
      return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    })
  }, [sorted, query, activeLetter])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          aria-label="Search glossary"
          className="md:max-w-sm"
        />
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveLetter(null)}
            className={cn(
              'rounded-pill border px-2.5 py-1 text-xs font-semibold transition-colors',
              activeLetter === null
                ? 'border-brand bg-brand text-white'
                : 'border-line-2 bg-surface text-ink-soft hover:bg-paper-alt'
            )}
          >
            All
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter === activeLetter ? null : letter)}
              className={cn(
                'h-7 w-7 rounded-pill border text-xs font-semibold transition-colors',
                activeLetter === letter
                  ? 'border-brand bg-brand text-white'
                  : 'border-line-2 bg-surface text-ink-soft hover:bg-paper-alt'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-md border border-line bg-surface p-8 text-center text-sm text-ink-soft">
          No terms match. Try a different letter or clear the search.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((term) => (
            <Card key={term.slug} padding="md" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-ink">{term.term}</h3>
                <Badge variant="outline" size="sm">
                  {TOPIC_LABELS[term.topic]}
                </Badge>
              </div>
              <p className="text-sm text-ink-soft">{term.definition}</p>
              {term.example && <p className="text-xs italic text-ink-faint">e.g. {term.example}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
