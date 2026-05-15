'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { markChapterComplete } from '@/actions/lessons'

export function MarkCompleteButton({
  lessonSlug,
  chapterSlug,
  isCompleted,
}: {
  lessonSlug: string
  chapterSlug: string
  isCompleted: boolean
}) {
  const [isPending, startTransition] = useTransition()

  function onClick() {
    if (isCompleted) return
    startTransition(async () => {
      try {
        await markChapterComplete({ lessonSlug, chapterSlug })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not save progress'
        if (!msg.includes('NEXT_REDIRECT')) {
          // eslint-disable-next-line no-console
          console.error(msg)
        }
      }
    })
  }

  if (isCompleted) {
    return (
      <Button variant="success" disabled>
        ✓ Completed
      </Button>
    )
  }

  return (
    <Button variant="primary" onClick={onClick} disabled={isPending}>
      {isPending ? 'Saving…' : 'Mark complete'}
    </Button>
  )
}
