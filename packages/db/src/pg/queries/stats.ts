import type { BrazilianRegion, Exam } from '@gabar/shared'
import { BRAZIL_REGIONS } from '@gabar/shared'
import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  max,
  ne,
  or,
  sql,
  type SQL,
} from 'drizzle-orm'
import { getGabarDb } from '../client'
import { exams } from '../schema'
import { byRegistrationEndDesc, hydrateExams } from './hydrate'

const REGIONS = [
  'North',
  'Northeast',
  'Central-West',
  'Southeast',
  'South',
] as const satisfies readonly BrazilianRegion[]

function emptyByRegion<T>(make: () => T): Record<BrazilianRegion, T> {
  return {
    North: make(),
    Northeast: make(),
    'Central-West': make(),
    Southeast: make(),
    South: make(),
  }
}

/** Published and not closed. A NULL status counts as active. */
const isActive = and(
  eq(exams.published, true),
  or(isNull(exams.status), ne(exams.status, 'closed')),
)

export async function countActiveByRegion(): Promise<Record<BrazilianRegion, number>> {
  const rows = await getGabarDb()
    .select({ state: exams.state, n: count() })
    .from(exams)
    .where(isActive)
    .groupBy(exams.state)
  const counts = emptyByRegion(() => 0)
  for (const region of REGIONS) {
    const states = new Set(BRAZIL_REGIONS[region])
    for (const row of rows) if (states.has(row.state)) counts[region] += row.n
  }
  return counts
}

export async function countActiveByBoard(boards: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(boards.map((b) => [b, 0]))
  if (boards.length === 0) return counts
  const rows = await getGabarDb()
    .select({ board: exams.examiningBoard, n: count() })
    .from(exams)
    .where(and(isActive, inArray(exams.examiningBoard, boards)))
    .groupBy(exams.examiningBoard)
  for (const row of rows) counts[row.board] = row.n
  return counts
}

async function topActive(where: SQL, limit: number): Promise<Exam[]> {
  const db = getGabarDb()
  const rows = await db
    .select()
    .from(exams)
    .where(and(isActive, where))
    .orderBy(byRegistrationEndDesc, exams.id)
    .limit(limit)
  return hydrateExams(db, rows)
}

export async function listActiveByRegion(limit: number): Promise<Record<BrazilianRegion, Exam[]>> {
  const result = emptyByRegion((): Exam[] => [])
  await Promise.all(
    REGIONS.map(async (region) => {
      result[region] = await topActive(inArray(exams.state, BRAZIL_REGIONS[region]), limit)
    }),
  )
  return result
}

export async function listActiveByBoard(
  boards: string[],
  limit: number,
): Promise<Record<string, Exam[]>> {
  const entries = await Promise.all(
    boards.map(
      async (board) => [board, await topActive(eq(exams.examiningBoard, board), limit)] as const,
    ),
  )
  return Object.fromEntries(entries)
}

export interface ExamTotals {
  totalExams: number
  activeExams: number
  totalVacancies: number
  lastSyncAt: string | null
}

/** Landing + categories counters in a single aggregate query. */
export async function getExamTotals(): Promise<ExamTotals> {
  const notClosed = sql`(${exams.status} is null or ${exams.status} <> 'closed')`
  const rows = await getGabarDb()
    .select({
      totalExams: count(),
      activeExams: sql<number>`count(*) filter (where ${notClosed})`.mapWith(Number),
      totalVacancies:
        sql<number>`coalesce(sum(${exams.vacancies}) filter (where ${notClosed}), 0)`.mapWith(
          Number,
        ),
      lastSyncAt: max(exams.scrapedAt),
    })
    .from(exams)
    .where(eq(exams.published, true))
  const row = rows[0]
  return {
    totalExams: row?.totalExams ?? 0,
    activeExams: row?.activeExams ?? 0,
    totalVacancies: row?.totalVacancies ?? 0,
    lastSyncAt: row?.lastSyncAt ? row.lastSyncAt.toISOString() : null,
  }
}

/** Highest `salary_lower_bound` among published exams, or null when there is none. */
export async function getMaxSalaryLowerBound(): Promise<number | null> {
  const rows = await getGabarDb()
    .select({ salary: exams.salaryLowerBound })
    .from(exams)
    .where(and(eq(exams.published, true), isNotNull(exams.salaryLowerBound)))
    .orderBy(desc(exams.salaryLowerBound))
    .limit(1)
  return rows[0]?.salary ?? null
}
