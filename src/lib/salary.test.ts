import type { Exam, ExamPosition } from '@/shared'
import { describe, expect, it } from 'vitest'
import { computeSalaryMax, formatSalary, formatSalaryFromPositions, getMinSalary } from './salary'

function makePositions(salaries: (number | null)[]): ExamPosition[] {
  return salaries.map((salary, i) => ({ title: `Cargo ${i + 1}`, level: null, salary }))
}

function makeExam(salaries: (number | null)[]): Exam {
  return {
    id: 'test',
    slug: 'test',
    name: 'Test',
    examiningBoard: 'Test',
    institution: 'Test',
    positions: makePositions(salaries),
    vacancies: 1,
    state: 'SP',
    city: 'São Paulo',
    region: 'Southeast',
  }
}

describe('getMinSalary', () => {
  it('returns 0 for empty positions', () => {
    expect(getMinSalary([])).toBe(0)
  })

  it('returns 0 when all salaries are null', () => {
    expect(getMinSalary(makePositions([null, null]))).toBe(0)
  })

  it('returns the single salary when only one position has salary', () => {
    expect(getMinSalary(makePositions([5000]))).toBe(5000)
  })

  it('returns the minimum when multiple positions have different salaries', () => {
    expect(getMinSalary(makePositions([5000, 8000, 3000]))).toBe(3000)
  })

  it('ignores null salaries when computing minimum', () => {
    expect(getMinSalary(makePositions([null, 8000, 3000]))).toBe(3000)
  })
})

describe('formatSalaryFromPositions', () => {
  it('returns "–" for empty positions', () => {
    expect(formatSalaryFromPositions([])).toBe('–')
  })

  it('returns "–" when all salaries are null', () => {
    expect(formatSalaryFromPositions(makePositions([null]))).toBe('–')
  })

  it('formats a single salary', () => {
    expect(formatSalaryFromPositions(makePositions([5000]))).toBe('R$\u00a05.000,00')
  })

  it('formats a single value when min equals max', () => {
    expect(formatSalaryFromPositions(makePositions([8000, 8000]))).toBe('R$\u00a08.000,00')
  })

  it('formats a range when min and max differ', () => {
    expect(formatSalaryFromPositions(makePositions([5000, 15000]))).toBe(
      'R$\u00a05.000,00 – R$\u00a015.000,00',
    )
  })

  it('ignores null salaries when computing range', () => {
    expect(formatSalaryFromPositions(makePositions([null, 5000, 15000]))).toBe(
      'R$\u00a05.000,00 – R$\u00a015.000,00',
    )
  })
})

describe('computeSalaryMax', () => {
  it('returns 0 for empty array', () => {
    expect(computeSalaryMax([])).toBe(0)
  })

  it('returns 0 when all exams have no salary in positions', () => {
    expect(computeSalaryMax([makeExam([null]), makeExam([null])])).toBe(0)
  })

  it('rounds up to nearest 5000', () => {
    expect(computeSalaryMax([makeExam([2429])])).toBe(5000)
  })

  it('rounds up exact multiple of 5000', () => {
    expect(computeSalaryMax([makeExam([10000])])).toBe(10000)
  })

  it('picks the highest min salary across exams', () => {
    const exams = [makeExam([2429]), makeExam([23692, 29025])]
    expect(computeSalaryMax(exams)).toBe(25000)
  })

  it('ignores null salary exams when computing max', () => {
    const exams = [makeExam([null]), makeExam([13994, 16947])]
    expect(computeSalaryMax(exams)).toBe(15000)
  })
})

describe('formatSalary', () => {
  it('formats zero', () => {
    expect(formatSalary(0)).toBe('R$\u00a00,00')
  })

  it('formats thousands with dot separator', () => {
    expect(formatSalary(5000)).toBe('R$\u00a05.000,00')
  })

  it('formats large values', () => {
    expect(formatSalary(25000)).toBe('R$\u00a025.000,00')
  })
})
