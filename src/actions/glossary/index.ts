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
 * Step 2 MVP: dumb substring match against the glossary.
 * Step 3 will swap this body for an Ollama call without touching the client.
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
