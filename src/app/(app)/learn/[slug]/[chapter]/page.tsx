import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { ChapterContent } from '@/components/lessons/chapter-content'
import { ChapterPager } from '@/components/lessons/chapter-pager'
import { ChapterRail } from '@/components/lessons/chapter-rail'
import { getCurrentUser } from '@/server/auth'
import { getLessonWithProgress } from '@/server/services/lessons.service'

interface Props {
  params: { slug: string; chapter: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `${params.chapter} — Foothold` }
}

export default async function ChapterPage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const lesson = await getLessonWithProgress(user.id, params.slug)
  if (!lesson) notFound()

  const idx = lesson.chapters.findIndex((c) => c.slug === params.chapter)
  if (idx === -1) notFound()

  const chapter = lesson.chapters[idx]
  if (!chapter) notFound()

  const prev = idx > 0 ? (lesson.chapters[idx - 1] ?? null) : null
  const next = idx < lesson.chapters.length - 1 ? (lesson.chapters[idx + 1] ?? null) : null
  const isCompleted = lesson.completedChapters.includes(chapter.slug)

  return (
    <div className="animate-fade-in">
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft no-underline hover:text-ink"
      >
        <span aria-hidden>←</span> All lessons
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="brand">{lesson.title}</Badge>
        <span className="font-mono text-[11px] text-ink-faint">
          Chapter {idx + 1} of {lesson.chapters.length}
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <ChapterRail
          lessonSlug={lesson.slug}
          lessonTitle={lesson.title}
          chapters={lesson.chapterSummaries}
          completedSlugs={lesson.completedChapters}
          activeChapterSlug={chapter.slug}
        />

        <div className="space-y-8">
          <ChapterContent chapter={chapter} />
          <ChapterPager
            lessonSlug={lesson.slug}
            chapterSlug={chapter.slug}
            isCompleted={isCompleted}
            prev={
              prev
                ? { slug: prev.slug, title: prev.title, readingTimeMin: prev.readingTimeMin }
                : null
            }
            next={
              next
                ? { slug: next.slug, title: next.title, readingTimeMin: next.readingTimeMin }
                : null
            }
          />
        </div>
      </div>
    </div>
  )
}
