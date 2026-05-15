import Link from 'next/link'

import { ChapterMobileSelect } from '@/components/lessons/chapter-mobile-select'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/lib/utils'
import type { ChapterSummary } from '@/types/lessons'

export interface ChapterRailProps {
  lessonSlug: string
  lessonTitle: string
  chapters: ChapterSummary[]
  completedSlugs: string[]
  activeChapterSlug: string
}

export function ChapterRail({
  lessonSlug,
  lessonTitle,
  chapters,
  completedSlugs,
  activeChapterSlug,
}: ChapterRailProps) {
  const completed = chapters.filter((c) => completedSlugs.includes(c.slug)).length
  const pct = chapters.length === 0 ? 0 : Math.round((completed / chapters.length) * 100)

  return (
    <>
      <ChapterMobileSelect
        lessonSlug={lessonSlug}
        chapters={chapters}
        completedSlugs={completedSlugs}
        activeChapterSlug={activeChapterSlug}
      />

      {/* Desktop: rail */}
      <Card padding="md" className="sticky top-24 hidden md:block">
        <div className="mb-3">
          <p className="eyebrow mb-1">Lesson</p>
          <p className="text-sm font-bold leading-tight text-ink">{lessonTitle}</p>
        </div>
        <ProgressBar value={pct} className="mb-1 h-1" />
        <p className="mb-4 font-mono text-[10px] text-ink-faint">
          {completed} / {chapters.length} chapters · {pct}%
        </p>

        <ol className="space-y-1">
          {chapters.map((c, i) => {
            const isActive = c.slug === activeChapterSlug
            const isDone = completedSlugs.includes(c.slug)
            return (
              <li key={c.slug}>
                <Link
                  href={`/learn/${lessonSlug}/${c.slug}`}
                  className={cn(
                    'flex items-start gap-2 rounded-sm border-l-2 px-3 py-2 text-sm no-underline transition-colors',
                    isActive
                      ? 'border-brand bg-brand-tint/40 font-semibold text-ink'
                      : 'border-transparent text-ink-soft hover:bg-paper-alt hover:text-ink'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                      isDone
                        ? 'bg-success text-white'
                        : isActive
                          ? 'bg-brand text-white'
                          : 'bg-paper-alt text-ink-soft'
                    )}
                  >
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span className="flex-1 leading-tight">
                    {c.title}
                    <span className="block font-mono text-[10px] text-ink-faint">
                      {c.readingTimeMin} min
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </Card>
    </>
  )
}
