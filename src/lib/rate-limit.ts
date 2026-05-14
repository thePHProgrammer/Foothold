/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a sliding window per IP address.
 *
 * For production at scale, replace with Upstash Redis:
 * https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number
  /** Window duration in milliseconds. */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    const window: Window = { count: 1, resetAt: now + options.windowMs }
    store.set(key, window)
    return { success: true, remaining: options.limit - 1, resetAt: window.resetAt }
  }

  if (existing.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return {
    success: true,
    remaining: options.limit - existing.count,
    resetAt: existing.resetAt,
  }
}

/** Extract the real IP from a Next.js request, respecting Vercel proxy headers. */
export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

/** Pre-configured limiters for common use cases. */
export const limiters = {
  auth: (ip: string) => rateLimit(`auth:${ip}`, { limit: 10, windowMs: 60_000 }),
  api: (ip: string) => rateLimit(`api:${ip}`, { limit: 60, windowMs: 60_000 }),
  chat: (ip: string) => rateLimit(`chat:${ip}`, { limit: 20, windowMs: 60_000 }),
}
