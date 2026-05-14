// Re-export the prisma singleton for server-layer usage.
// Import from here (not directly from @/lib/prisma) within src/server/
export { prisma } from '@/lib/prisma'
