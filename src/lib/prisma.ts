import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient singleton — prevents connection exhaustion in
 * Next.js dev (hot-reload creates new instances on every save).
 * In production this runs once per serverless function cold start.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
