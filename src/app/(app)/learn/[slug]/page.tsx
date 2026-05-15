import { notFound, redirect } from 'next/navigation'

import { getCurrentUser } from '@/server/auth'
import { getLessonWithProgress } from '@/server/services/lessons.service'

interface Props {
  params: { slug: string }
}

/**
 * Redirect helper: send the user to the first incomplete chapter,
 * or the first chapter if everything is complete.
 */
export default async function LessonRootPage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const lesson = await getLessonWithProgress(user.id, params.slug)
  if (!lesson) notFound()

  const next =
    lesson.chapters.find((c) => !lesson.completedChapters.includes(c.slug)) ?? lesson.chapters[0]

  if (!next) notFound()

  redirect(`/learn/${lesson.slug}/${next.slug}`)
}
