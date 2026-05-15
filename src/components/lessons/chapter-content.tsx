import { ChapterRenderer } from '@/components/lessons/chapter-renderer'
import { FinSays } from '@/components/lessons/fin-says'
import { KeyIdea } from '@/components/lessons/key-idea'
import { QuickCheck } from '@/components/lessons/quick-check'
import type { Chapter } from '@/types/lessons'

export function ChapterContent({ chapter }: { chapter: Chapter }) {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <p className="eyebrow">Chapter</p>
        <h1 className="text-h1 text-ink">{chapter.title}</h1>
        <p className="font-mono text-xs text-ink-faint">{chapter.readingTimeMin} min read</p>
      </div>

      <ChapterRenderer blocks={chapter.content} />

      {chapter.keyIdea && <KeyIdea text={chapter.keyIdea} />}
      {chapter.finSays && <FinSays text={chapter.finSays} />}
      {chapter.quickCheck && <QuickCheck data={chapter.quickCheck} />}
    </article>
  )
}
