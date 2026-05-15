import type { LessonMeta } from '@/types/lessons'

export const LESSONS_META: LessonMeta[] = [
  {
    slug: 'crypto-basics',
    title: 'Crypto Basics',
    description:
      'Start here if blockchain feels like jargon. Learn what cryptocurrencies are, how trading works 24/7, and how to stay safe.',
    topic: 'crypto',
    difficulty: 'beginner',
    estimatedMins: 18,
    accentColor: 'var(--brand-crypto)',
    chapterSummaries: [
      { slug: 'what-is-crypto', title: 'What is cryptocurrency?', readingTimeMin: 5 },
      { slug: 'how-trading-works', title: 'How crypto trading works', readingTimeMin: 7 },
      {
        slug: 'staying-safe',
        title: 'Staying safe: wallets, scams, volatility',
        readingTimeMin: 6,
      },
    ],
  },
  {
    slug: 'stock-fundamentals',
    title: 'Stock Fundamentals',
    description:
      'Understand what a share really is, how exchanges set prices, and the chart-reading basics every stock trader needs.',
    topic: 'stocks',
    difficulty: 'beginner',
    estimatedMins: 20,
    accentColor: 'var(--brand-stocks)',
    chapterSummaries: [
      { slug: 'what-are-stocks', title: 'What are stocks?', readingTimeMin: 6 },
      { slug: 'reading-a-chart', title: 'Reading a chart', readingTimeMin: 7 },
      { slug: 'valuation-basics', title: 'Valuation basics: P/E and earnings', readingTimeMin: 7 },
    ],
  },
  {
    slug: 'forex-intro',
    title: 'Forex Intro',
    description:
      "The world's biggest market trades $7.5 trillion a day. Learn what forex is, how pairs are quoted, and where the risks live.",
    topic: 'forex',
    difficulty: 'beginner',
    estimatedMins: 22,
    accentColor: 'var(--brand-forex)',
    chapterSummaries: [
      { slug: 'what-is-forex', title: 'What is forex?', readingTimeMin: 7 },
      { slug: 'currency-pairs', title: 'Currency pairs and pips', readingTimeMin: 8 },
      { slug: 'majors-and-leverage', title: 'Majors, minors, and leverage', readingTimeMin: 7 },
    ],
  },
]

export const LESSONS_META_BY_SLUG: Record<string, LessonMeta> = Object.fromEntries(
  LESSONS_META.map((l) => [l.slug, l])
)

export function isValidLessonChapter(lessonSlug: string, chapterSlug: string): boolean {
  const lesson = LESSONS_META_BY_SLUG[lessonSlug]
  if (!lesson) return false
  return lesson.chapterSummaries.some((c) => c.slug === chapterSlug)
}
