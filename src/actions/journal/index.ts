'use server'

import { revalidatePath } from 'next/cache'

import { type JournalErrorCode } from '@/lib/journal/constants'
import { logger } from '@/lib/logger'
import {
  createJournalSchema,
  deleteJournalSchema,
  updateJournalSchema,
} from '@/lib/validations/journal'
import { requireAuth } from '@/server/auth'
import * as journalService from '@/server/services/journal.service'

export type JournalActionResult = { ok: true } | { ok: false; code: JournalErrorCode }

export async function createJournalEntry(input: unknown): Promise<JournalActionResult> {
  const session = await requireAuth()

  const parsed = createJournalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await journalService.createEntry(session.user.id, parsed.data)
  if (!result.ok) return result

  revalidatePath('/journal')
  logger.info('Journal entry created', { userId: session.user.id })
  return { ok: true }
}

export async function updateJournalEntry(input: unknown): Promise<JournalActionResult> {
  const session = await requireAuth()

  const parsed = updateJournalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await journalService.updateEntry(session.user.id, parsed.data)
  if (!result.ok) return result

  revalidatePath('/journal')
  logger.info('Journal entry updated', { userId: session.user.id, id: parsed.data.id })
  return { ok: true }
}

export async function deleteJournalEntry(input: unknown): Promise<JournalActionResult> {
  const session = await requireAuth()

  const parsed = deleteJournalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await journalService.deleteEntry(session.user.id, parsed.data.id)
  if (!result.ok) return result

  revalidatePath('/journal')
  logger.info('Journal entry deleted', { userId: session.user.id, id: parsed.data.id })
  return { ok: true }
}
