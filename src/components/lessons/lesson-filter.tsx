'use client'

import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { LessonCard } from '@/components/lessons/lesson-card'
import { cn } from '@/lib/utils'
import type { LessonMetaWithProgress, Topic } from '@/types/lessons'

type Filter = 'all' | Topic

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'crypto', label: '🪙 Crypto' },
  { value: 'stocks', label: '📈 Stocks' },
  { value: 'forex', label: '💱 Forex' },
]

export function LessonCatalog({ lessons }: { lessons: LessonMetaWithProgress[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return lessons.filter((l) => {
      if (filter !== 'all' && l.topic !== filter) return false
      if (!q) return true
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.chapterSummaries.some((c) => c.title.toLowerCase().includes(q))
      )
    })
  }, [lessons, filter, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
            🔍
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons or terms…"
            className="pl-9"
            aria-label="Search lessons"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === f.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-line-2 bg-surface text-ink-soft hover:bg-paper-alt'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-md border border-line bg-surface p-8 text-center text-sm text-ink-soft">
          No lessons match your filter. Try clearing the search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}
