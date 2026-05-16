import type { JournalEntry } from '@prisma/client'

import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/**
 * Persistence-only layer for journal entries. Every write is scoped by
 * `userId` in the WHERE clause so a user can never read/edit/delete another
 * user's row. Mirrors `quiz.repository.ts` (logger.error + rethrow).
 */

export type WritableEntry = {
  title: string
  rationale: string
  mood: string
  lesson: string | null
  tags: string[]
  tradeId: string | null
  tradeSnapshot: string | null
}

export async function list(userId: string): Promise<JournalEntry[]> {
  return prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function get(userId: string, id: string): Promise<JournalEntry | null> {
  return prisma.journalEntry.findFirst({ where: { id, userId } })
}

export async function create(userId: string, data: WritableEntry): Promise<JournalEntry> {
  try {
    return await prisma.journalEntry.create({ data: { userId, ...data } })
  } catch (error) {
    logger.error('Failed to create journal entry', { error, userId })
    throw error
  }
}

/** Ownership-safe: updates only when the row belongs to the user. */
export async function update(userId: string, id: string, data: WritableEntry): Promise<boolean> {
  try {
    const { count } = await prisma.journalEntry.updateMany({
      where: { id, userId },
      data,
    })
    return count > 0
  } catch (error) {
    logger.error('Failed to update journal entry', { error, userId, id })
    throw error
  }
}

/** Ownership-safe: deletes only when the row belongs to the user. */
export async function remove(userId: string, id: string): Promise<boolean> {
  try {
    const { count } = await prisma.journalEntry.deleteMany({ where: { id, userId } })
    return count > 0
  } catch (error) {
    logger.error('Failed to delete journal entry', { error, userId, id })
    throw error
  }
}
