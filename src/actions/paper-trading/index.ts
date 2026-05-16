'use server'

import { revalidatePath } from 'next/cache'

import { logger } from '@/lib/logger'
import { createPortfolioSchema, placeOrderSchema } from '@/lib/validations/paper-trading'
import { requireAuth } from '@/server/auth'
import * as paperTradingService from '@/server/services/paper-trading.service'

export type ActionResult = { ok: true } | { ok: false; error: string }

const firstIssue = (messages: string[]): string => messages[0] ?? 'Invalid input.'

export async function createPaperPortfolio(input: unknown): Promise<ActionResult> {
  const session = await requireAuth()

  const parsed = createPortfolioSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error.issues.map((i) => i.message)) }
  }

  await paperTradingService.setupPortfolio(session.user.id, parsed.data.startingCash)
  revalidatePath('/practice')
  logger.info('Paper portfolio created', { userId: session.user.id })
  return { ok: true }
}

export async function placePaperOrder(input: unknown): Promise<ActionResult> {
  const session = await requireAuth()

  const parsed = placeOrderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error.issues.map((i) => i.message)) }
  }

  const result = await paperTradingService.executeOrder(session.user.id, parsed.data)
  if (!result.ok) return result

  revalidatePath('/practice')
  logger.info('Paper trade executed', {
    userId: session.user.id,
    symbol: parsed.data.symbol,
    side: parsed.data.side,
  })
  return { ok: true }
}

export async function resetPaperPortfolio(): Promise<ActionResult> {
  const session = await requireAuth()

  await paperTradingService.resetPortfolio(session.user.id)
  revalidatePath('/practice')
  logger.info('Paper portfolio reset', { userId: session.user.id })
  return { ok: true }
}
