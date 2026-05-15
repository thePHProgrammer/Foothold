export type Topic = 'crypto' | 'stocks' | 'forex'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'callout'; tone: 'info' | 'warn' | 'sources'; text: string }
  | { kind: 'image'; src: string; alt: string; caption?: string }

export type QuickCheck = {
  question: string
  options: string[]
  correct: number
}

export type ChapterSummary = {
  slug: string
  title: string
  readingTimeMin: number
}

export type Chapter = ChapterSummary & {
  content: Block[]
  keyIdea?: string
  finSays?: string
  quickCheck?: QuickCheck
}

export type LessonMeta = {
  slug: string
  title: string
  description: string
  topic: Topic
  difficulty: Difficulty
  estimatedMins: number
  accentColor?: string
  chapterSummaries: ChapterSummary[]
}

export type Lesson = LessonMeta & {
  chapters: Chapter[]
}

export type LessonProgress = {
  completedChapters: string[]
  isStarted: boolean
  isCompleted: boolean
  progressPercent: number
}

export type LessonMetaWithProgress = LessonMeta & LessonProgress
export type LessonWithProgress = Lesson & LessonProgress
