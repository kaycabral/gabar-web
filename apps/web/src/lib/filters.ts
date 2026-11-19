import type { BrazilianRegion, Exam, ExamStatus } from '@gabar/shared'
import { BRAZIL_REGIONS } from '@gabar/shared'
import { getMinSalary } from './salary'

export type ExamSort = 'recent' | 'salary' | 'deadline'

export const SORT_LABELS: Record<ExamSort, string> = {
  recent: 'Mais recentes',
  salary: 'Maior remuneração',
  deadline: 'Prazo próximo',
}

export const DEFAULT_SORT: ExamSort = 'recent'

export interface FilterState {
  search: string
  status: ExamStatus | undefined
  examiningBoard: string | undefined
  salaryMin: number
  salaryMax: number
  region: BrazilianRegion | undefined
  state: string | undefined
  city: string | undefined
  sort: ExamSort
}

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
}

export function filterBySearch(search: string, exams: Exam[]): Exam[] {
  if (!search.trim()) return exams
  const normalized = normalizeText(search)
  return exams.filter(
    (exam) =>
      normalizeText(exam.name).includes(normalized) ||
      exam.positions?.some((p) => normalizeText(p.title).includes(normalized)),
  )
}

export function filterByBoard(board: string, exams: Exam[]): Exam[] {
  return exams.filter((exam) => exam.examiningBoard === board)
}

export function filterByStatus(status: ExamStatus | undefined, exams: Exam[]): Exam[] {
  if (status === undefined) return exams
  return exams.filter((exam) => exam.status === status)
}

export function filterBySalaryMin(salaryMin: number, exams: Exam[]): Exam[] {
  return exams.filter((exam) => {
    const min = getMinSalary(exam.positions)
    if (min === 0) return false
    return min >= salaryMin
  })
}

export function filterBySalaryMax(salaryMax: number, exams: Exam[]): Exam[] {
  return exams.filter((exam) => {
    const min = getMinSalary(exam.positions)
    if (min === 0) return false
    return min <= salaryMax
  })
}

export function filterByRegion(region: BrazilianRegion, exams: Exam[]): Exam[] {
  const states = BRAZIL_REGIONS[region]
  return exams.filter((exam) => states.includes(exam.state))
}

export function filterByState(state: string, exams: Exam[]): Exam[] {
  return exams.filter((exam) => exam.state === state)
}

export function filterByCity(city: string, exams: Exam[]): Exam[] {
  return exams.filter((exam) => exam.city === city)
}

export function applyFilters(filters: FilterState, exams: Exam[], salaryMax: number): Exam[] {
  let result = exams

  if (filters.search) {
    result = filterBySearch(filters.search, result)
  }

  if (filters.status !== undefined) {
    result = filterByStatus(filters.status, result)
  }

  if (filters.examiningBoard !== undefined) {
    result = filterByBoard(filters.examiningBoard, result)
  }

  // Salary: filter is active when slider has been moved from the full-range default
  const salaryActive = filters.salaryMin > 0 || filters.salaryMax < salaryMax
  if (salaryActive) {
    result = filterBySalaryMin(filters.salaryMin, result)
    result = filterBySalaryMax(filters.salaryMax, result)
  }

  // State takes precedence over region when both are set
  if (filters.state) {
    result = filterByState(filters.state, result)
  } else if (filters.region) {
    result = filterByRegion(filters.region, result)
  }

  if (filters.city) {
    result = filterByCity(filters.city, result)
  }

  return result
}
