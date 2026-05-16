import { describe, expect, it } from 'vitest'

import { gradeQuiz, PASS_THRESHOLD, type RawQuestion } from '@/lib/quiz/scoring'

const Q = (id: string, correct: number): RawQuestion => ({
  id,
  question: `Q ${id}`,
  options: ['a', 'b', 'c', 'd'],
  correct,
})

describe('gradeQuiz', () => {
  it('scores an all-correct submission as 100% and passed', () => {
    const raw = [Q('l:c1', 0), Q('l:c2', 1), Q('l:c3', 2)]
    const r = gradeQuiz(raw, { 'l:c1': 0, 'l:c2': 1, 'l:c3': 2 })
    expect(r).toMatchObject({ correct: 3, total: 3, scorePct: 100, passed: true })
    expect(r.questions.every((q) => q.isCorrect)).toBe(true)
  })

  it('keys answers by id, not array position', () => {
    const raw = [Q('l:c1', 0), Q('l:c2', 3)]
    // Provided out of order — must still match by id.
    const r = gradeQuiz(raw, { 'l:c2': 3, 'l:c1': 0 })
    expect(r.correct).toBe(2)
  })

  it('treats null / missing answers as incorrect', () => {
    const raw = [Q('l:c1', 0), Q('l:c2', 1), Q('l:c3', 2)]
    const r = gradeQuiz(raw, { 'l:c1': 0, 'l:c2': null })
    expect(r.correct).toBe(1)
    expect(r.scorePct).toBe(33)
    expect(r.passed).toBe(false)
    expect(r.questions[1]?.chosen).toBeNull()
    expect(r.questions[2]?.chosen).toBeNull()
  })

  it('scores a none-correct submission as 0% and not passed', () => {
    const raw = [Q('l:c1', 0), Q('l:c2', 1)]
    const r = gradeQuiz(raw, { 'l:c1': 2, 'l:c2': 2 })
    expect(r).toMatchObject({ correct: 0, scorePct: 0, passed: false })
  })

  it('passes exactly at the threshold boundary (7/10 = 70%)', () => {
    const raw = Array.from({ length: 10 }, (_, i) => Q(`l:c${i}`, 0))
    const answers: Record<string, number> = {}
    raw.forEach((q, i) => (answers[q.id] = i < 7 ? 0 : 9))
    const r = gradeQuiz(raw, answers)
    expect(r.correct).toBe(7)
    expect(r.scorePct).toBe(70)
    expect(7 / 10).toBeGreaterThanOrEqual(PASS_THRESHOLD)
    expect(r.passed).toBe(true)
  })

  it('fails just below the threshold (2/3 = 67%)', () => {
    const raw = [Q('l:c1', 0), Q('l:c2', 0), Q('l:c3', 0)]
    const r = gradeQuiz(raw, { 'l:c1': 0, 'l:c2': 0, 'l:c3': 1 })
    expect(r.scorePct).toBe(67)
    expect(r.passed).toBe(false)
  })

  it('handles an empty quiz without dividing by zero', () => {
    expect(gradeQuiz([], {})).toEqual({
      correct: 0,
      total: 0,
      scorePct: 0,
      passed: false,
      questions: [],
    })
  })

  it('ignores answer ids that are not part of the quiz', () => {
    const raw = [Q('l:c1', 1)]
    const r = gradeQuiz(raw, { 'l:c1': 1, 'l:ghost': 0 })
    expect(r).toMatchObject({ correct: 1, total: 1, passed: true })
  })
})
