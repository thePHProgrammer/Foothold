import { describe, expect, it } from 'vitest'

import { MAX_TAGS } from '@/lib/journal/constants'
import { normalizeTags } from '@/lib/journal/tags'

describe('normalizeTags', () => {
  it('trims, lowercases and drops empties', () => {
    expect(normalizeTags(['  Crypto ', '', '   ', 'RISK'])).toEqual(['crypto', 'risk'])
  })

  it('dedupes case-insensitively, keeping first order', () => {
    expect(normalizeTags(['btc', 'BTC', 'eth', 'btc'])).toEqual(['btc', 'eth'])
  })

  it('caps the list to MAX_TAGS', () => {
    const many = Array.from({ length: MAX_TAGS + 5 }, (_, i) => `t${i}`)
    expect(normalizeTags(many)).toHaveLength(MAX_TAGS)
  })

  it('clips an over-long tag to TAG_MAX characters', () => {
    const [tag] = normalizeTags(['x'.repeat(100)])
    expect(tag).toHaveLength(24)
  })

  it('returns an empty array for no usable tags', () => {
    expect(normalizeTags(['', '   '])).toEqual([])
  })
})
