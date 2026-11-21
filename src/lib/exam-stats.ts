import type { BrazilianRegion, Exam } from '@/shared'
import { cacheLife } from 'next/cache'
import {
  countActiveByBoard,
  countActiveByRegion,
  getExamTotals,
  getMaxSalaryLowerBound,
  listActiveByBoard,
  listActiveByRegion,
} from './db'

const DEFAULT_SALARY_MAX = 30000
const SALARY_STEP = 5000

export async function getExamCountsByRegion(): Promise<Record<BrazilianRegion, number>> {
  'use cache'
  cacheLife('minutes')
  return countActiveByRegion()
}

export async function getExamCountsByBoard(boards: string[]): Promise<Record<string, number>> {
  'use cache'
  cacheLife('minutes')
  return countActiveByBoard(boards)
}

export async function getExamsByRegion(limit = 6): Promise<Record<BrazilianRegion, Exam[]>> {
  'use cache'
  cacheLife('minutes')
  return listActiveByRegion(limit)
}

export async function getExamsByBoard(
  boards: string[],
  limit = 6,
): Promise<Record<string, Exam[]>> {
  'use cache'
  cacheLife('minutes')
  return listActiveByBoard(boards, limit)
}

export interface LandingStats {
  totalExams: number
  activeExams: number
}

export async function getLandingStats(): Promise<LandingStats> {
  'use cache'
  cacheLife('days')
  const { totalExams, activeExams } = await getExamTotals()
  return { totalExams, activeExams }
}

export interface CategoriesStats {
  activeExams: number
  totalVacancies: number
  lastSyncAt: string | null
}

export async function getCategoriesStats(): Promise<CategoriesStats> {
  'use cache'
  cacheLife('minutes')
  const { activeExams, totalVacancies, lastSyncAt } = await getExamTotals()
  return { activeExams, totalVacancies, lastSyncAt }
}

/** Upper bound for the salary slider: highest published salary, rounded up to 5k. */
export async function getGlobalSalaryMax(): Promise<number> {
  'use cache'
  cacheLife('hours')
  const top = await getMaxSalaryLowerBound()
  if (top == null) return DEFAULT_SALARY_MAX
  return Math.ceil(top / SALARY_STEP) * SALARY_STEP
}
