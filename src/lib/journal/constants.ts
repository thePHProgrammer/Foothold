/**
 * Journal domain constants. Pure values — safe to import anywhere.
 */

export const MOODS = ['calm', 'confident', 'anxious', 'fomo', 'frustrated'] as const
export type Mood = (typeof MOODS)[number]

export const MOOD_LABELS: Record<Mood, string> = {
  calm: '😌 Calm',
  confident: '💪 Confident',
  anxious: '😰 Anxious',
  fomo: '🏃 FOMO',
  frustrated: '😤 Frustrated',
}

export const TITLE_MAX = 120
export const BODY_MAX = 4000
export const TAG_MAX = 24
export const MAX_TAGS = 8

/** Typed journal failures → friendly copy (exhaustive). */
export type JournalErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'TRADE_NOT_OWNED'

const JOURNAL_ERROR_MESSAGES: Record<JournalErrorCode, string> = {
  VALIDATION: 'Please check the highlighted fields and try again.',
  NOT_FOUND: 'That entry no longer exists.',
  TRADE_NOT_OWNED: 'That trade could not be found in your practice account.',
}

export function messageForJournalError(code: JournalErrorCode): string {
  return JOURNAL_ERROR_MESSAGES[code]
}
