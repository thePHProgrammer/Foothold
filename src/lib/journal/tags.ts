import { MAX_TAGS, TAG_MAX } from '@/lib/journal/constants'

/**
 * Pure tag normaliser: trim, drop empties, lowercase, dedupe (order-stable),
 * clip each to TAG_MAX, cap the list to MAX_TAGS. Deterministic — unit-tested.
 */
export function normalizeTags(raw: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of raw) {
    const tag = item.trim().toLowerCase().slice(0, TAG_MAX)
    if (!tag || seen.has(tag)) continue
    seen.add(tag)
    out.push(tag)
    if (out.length >= MAX_TAGS) break
  }
  return out
}
