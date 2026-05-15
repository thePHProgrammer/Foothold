import type { Lesson } from '@/types/lessons'

/**
 * Per-slug dynamic loaders. Webpack code-splits these into separate chunks
 * because the import argument is a literal string. Do NOT change to a
 * variable-string `import(\`./${slug}\`)` form — Webpack will then bundle
 * every chapter file into the catalog route bundle.
 */
export const LESSON_LOADERS: Record<string, () => Promise<Lesson>> = {
  'crypto-basics': () => import('./crypto-basics').then((m) => m.cryptoBasics),
  'stock-fundamentals': () => import('./stock-fundamentals').then((m) => m.stockFundamentals),
  'forex-intro': () => import('./forex-intro').then((m) => m.forexIntro),
}

export { LESSONS_META, LESSONS_META_BY_SLUG, isValidLessonChapter } from './lessons.meta'
