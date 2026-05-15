import { LESSONS_META, LESSONS_META_BY_SLUG } from '@/data/lessons/lessons.meta'
import { LESSON_LOADERS } from '@/data/lessons'
import * as lessonsRepo from '@/server/repositories/lessons.repository'
import type { LessonMetaWithProgress, LessonWithProgress, Topic } from '@/types/lessons'

function buildProgress(completedSlugs: Set<string>, chapterSlugs: string[]) {
  const completedChapters = chapterSlugs.filter((s) => completedSlugs.has(s))
  const total = chapterSlugs.length
  const done = completedChapters.length
  return {
    completedChapters,
    isStarted: done > 0,
    isCompleted: total > 0 && done === total,
    progressPercent: total === 0 ? 0 : Math.round((done / total) * 100),
  }
}

export async function getCatalogWithProgress(userId: string): Promise<LessonMetaWithProgress[]> {
  const allProgress = await lessonsRepo.getUserProgress(userId)

  return LESSONS_META.map((meta) => {
    const lessonCompletions = new Set(
      allProgress.filter((p) => p.lessonSlug === meta.slug).map((p) => p.chapterSlug)
    )
    const chapterSlugs = meta.chapterSummaries.map((c) => c.slug)
    return {
      ...meta,
      ...buildProgress(lessonCompletions, chapterSlugs),
    }
  })
}

export async function getLessonWithProgress(
  userId: string,
  slug: string
): Promise<LessonWithProgress | null> {
  const meta = LESSONS_META_BY_SLUG[slug]
  if (!meta) return null

  const loader = LESSON_LOADERS[slug]
  if (!loader) return null

  const [lesson, completedSlugs] = await Promise.all([
    loader(),
    lessonsRepo.getCompletedChapters(userId, slug),
  ])

  const chapterSlugs = lesson.chapters.map((c) => c.slug)
  return {
    ...lesson,
    ...buildProgress(new Set(completedSlugs), chapterSlugs),
  }
}

export type ProgressStats = {
  lessonsStarted: number
  lessonsCompleted: number
  chaptersCompleted: number
  totalChapters: number
  estimatedHours: number
  streakDays: number
  topicBreakdown: Record<Topic, number>
  recentActivity: { lessonSlug: string; chapterSlug: string; completedAt: Date }[]
}

export async function computeProgressStats(userId: string): Promise<ProgressStats> {
  const progress = await lessonsRepo.getUserProgress(userId)
  const totalChapters = LESSONS_META.reduce((sum, l) => sum + l.chapterSummaries.length, 0)

  const lessonsStarted = new Set(progress.map((p) => p.lessonSlug)).size

  let lessonsCompleted = 0
  for (const lesson of LESSONS_META) {
    const lessonCompletions = progress.filter((p) => p.lessonSlug === lesson.slug)
    if (lessonCompletions.length === lesson.chapterSummaries.length) {
      lessonsCompleted += 1
    }
  }

  const topicBreakdown: Record<Topic, number> = { crypto: 0, stocks: 0, forex: 0 }
  for (const p of progress) {
    const meta = LESSONS_META_BY_SLUG[p.lessonSlug]
    if (meta) topicBreakdown[meta.topic] += 1
  }

  const minutesPerChapter = 6
  const estimatedHours = Math.round((progress.length * minutesPerChapter) / 60)

  const streakDays = computeStreak(progress.map((p) => p.completedAt))

  return {
    lessonsStarted,
    lessonsCompleted,
    chaptersCompleted: progress.length,
    totalChapters,
    estimatedHours,
    streakDays,
    topicBreakdown,
    recentActivity: progress.slice(0, 10).map((p) => ({
      lessonSlug: p.lessonSlug,
      chapterSlug: p.chapterSlug,
      completedAt: p.completedAt,
    })),
  }
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const days = new Set(dates.map((d) => toDayKey(d)))

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  if (!days.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(toDayKey(cursor))) return 0
  }

  while (days.has(toDayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export type ActivityBucket = { date: string; count: number }

/**
 * Step 2 MVP: derives daily activity counts from already-loaded progress rows.
 * Step 3 will replace with a SQL `date_trunc` group-by for larger datasets.
 */
export async function getActivityBuckets(userId: string, days = 154): Promise<ActivityBucket[]> {
  const progress = await lessonsRepo.getUserProgress(userId)
  const counts = new Map<string, number>()
  for (const p of progress) {
    const key = toIsoDay(p.completedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const buckets: ActivityBucket[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = toIsoDay(d)
    buckets.push({ date: key, count: counts.get(key) ?? 0 })
  }
  return buckets
}

function toIsoDay(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
