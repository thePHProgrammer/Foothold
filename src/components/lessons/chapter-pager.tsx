import Link from 'next/link'

import { MarkCompleteButton } from '@/components/lessons/mark-complete-button'
import type { ChapterSummary } from '@/types/lessons'

export function ChapterPager({
  lessonSlug,
  chapterSlug,
  isCompleted,
  prev,
  next,
}: {
  lessonSlug: string
  chapterSlug: string
  isCompleted: boolean
  prev: ChapterSummary | null
  next: ChapterSummary | null
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      {prev ? (
        <Link
          href={`/learn/${lessonSlug}/${prev.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft no-underline hover:text-ink"
        >
          <span aria-hidden>←</span> {prev.title}
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        <MarkCompleteButton
          lessonSlug={lessonSlug}
          chapterSlug={chapterSlug}
          isCompleted={isCompleted}
        />
        {next && (
          <Link
            href={`/learn/${lessonSlug}/${next.slug}`}
            className="inline-flex items-center gap-2 rounded-sm border border-line-2 bg-surface px-4 py-2 text-sm font-semibold text-ink no-underline hover:bg-paper-alt"
          >
            Next: {next.title} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
