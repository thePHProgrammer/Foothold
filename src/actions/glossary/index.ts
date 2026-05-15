'use server'

import { GLOSSARY, type GlossaryTerm } from '@/data/glossary'
import { decodeTextSchema } from '@/lib/validations/glossary'

export type DecodeResult = {
  plainEnglish: string
  matched: GlossaryTerm[]
}

const TERM_PATTERNS: { term: GlossaryTerm; pattern: RegExp }[] = GLOSSARY.map((t) => ({
  term: t,
  pattern: new RegExp(`\\b${escapeRegex(t.term)}\\b`, 'i'),
}))

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Substring-based decoder over the static GLOSSARY.
 * Intentionally local and deterministic — no external LLM call.
 */
export async function decodeText(input: unknown): Promise<DecodeResult> {
  const { text } = decodeTextSchema.parse(input)

  const matched: GlossaryTerm[] = []
  let plainEnglish = text

  for (const { term, pattern } of TERM_PATTERNS) {
    if (pattern.test(text)) {
      matched.push(term)
      plainEnglish = plainEnglish.replace(pattern, `${term.term} (${shorten(term.definition)})`)
    }
  }

  return { plainEnglish, matched }
}

function shorten(s: string, max = 80): string {
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`
}
