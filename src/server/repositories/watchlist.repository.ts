import { Prisma } from '@prisma/client'

import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/**
 * Persistence-only layer for watchlist items. Every query is scoped by
 * `userId`. `add` is idempotent (P2002 = already watching) — mirrors
 * `lessons.repository.markChapterComplete`.
 */

export async function listSymbols(userId: string): Promise<string[]> {
  const rows = await prisma.watchlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { symbol: true },
  })
  return rows.map((r) => r.symbol)
}

export async function count(userId: string): Promise<number> {
  return prisma.watchlistItem.count({ where: { userId } })
}

export async function add(userId: string, symbol: string): Promise<void> {
  try {
    await prisma.watchlistItem.create({ data: { userId, symbol } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return // already on the watchlist — idempotent success
    }
    logger.error('Failed to add watchlist item', { error, userId, symbol })
    throw error
  }
}

export async function remove(userId: string, symbol: string): Promise<void> {
  try {
    await prisma.watchlistItem.deleteMany({ where: { userId, symbol } })
  } catch (error) {
    logger.error('Failed to remove watchlist item', { error, userId, symbol })
    throw error
  }
}
