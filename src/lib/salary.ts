import type { Exam, ExamPosition } from '@/shared'

export function getMinSalary(positions: ExamPosition[] | null | undefined): number {
  const salaries = (positions ?? []).map((p) => p.salary).filter((s): s is number => s !== null)
  return salaries.length > 0 ? Math.min(...salaries) : 0
}

export function formatSalaryFromPositions(positions: ExamPosition[] | null | undefined): string {
  const salaries = (positions ?? []).map((p) => p.salary).filter((s): s is number => s !== null)
  if (salaries.length === 0) return '–'
  const min = Math.min(...salaries)
  const max = Math.max(...salaries)
  if (min === max) return formatSalary(min)
  return `${formatSalary(min)} – ${formatSalary(max)}`
}

export function formatRegistrationFeeFromPositions(
  positions: ExamPosition[] | null | undefined,
): string {
  const fees = (positions ?? []).map((p) => p.registrationFee).filter((f): f is number => f != null)
  if (fees.length === 0) return '–'
  const min = Math.min(...fees)
  const max = Math.max(...fees)
  if (min === max) return formatSalary(min)
  return `${formatSalary(min)} – ${formatSalary(max)}`
}

/** Returns the ceiling of the highest min salary across all exams, rounded up to nearest R$ 5.000. */
export function computeSalaryMax(exams: Exam[]): number {
  const values = exams.map((e) => getMinSalary(e.positions))
  const max = values.length > 0 ? Math.max(...values) : 0
  if (max === 0) return 0
  return Math.ceil(max / 5000) * 5000
}

export function formatSalary(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
