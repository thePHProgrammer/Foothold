'use client'

import { useRouter } from 'next/navigation'

import type { ChapterSummary } from '@/types/lessons'

export function ChapterMobileSelect({
  lessonSlug,
  chapters,
  completedSlugs,
  activeChapterSlug,
}: {
  lessonSlug: string
  chapters: ChapterSummary[]
  completedSlugs: string[]
  activeChapterSlug: string
}) {
  const router = useRouter()

  return (
    <div className="md:hidden">
      <label htmlFor="chapter-select" className="eyebrow mb-1 block">
        Chapter
      </label>
      <select
        id="chapter-select"
        value={activeChapterSlug}
        onChange={(e) => router.push(`/learn/${lessonSlug}/${e.target.value}`)}
        className="w-full rounded-sm border border-line-2 bg-surface px-3 py-2 text-sm font-semibold text-ink"
      >
        {chapters.map((c, i) => (
          <option key={c.slug} value={c.slug}>
            {i + 1}. {c.title} {completedSlugs.includes(c.slug) ? '✓' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
