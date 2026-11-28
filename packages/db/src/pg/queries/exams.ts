import type { BrazilianRegion, Exam, ExamStatus } from '@gabar/shared'
import { BRAZIL_REGIONS } from '@gabar/shared'
import {
  and,
  asc,
  count,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  sql,
  type SQL,
} from 'drizzle-orm'
import { getGabarDb } from '../client'
import { documentContents, examDocuments, exams } from '../schema'
import { byRegistrationEndDesc, hasText, hydrateExams } from './hydrate'

export type ExamListSort = 'recent' | 'salary' | 'deadline'

export interface ExamListFilters {
  search?: string
  status?: ExamStatus
  examiningBoard?: string
  salaryMin?: number
  salaryMax?: number
  region?: BrazilianRegion
  state?: string
  city?: string
  sort?: ExamListSort
}

export interface DocumentPage {
  title: string
  url: string
  /** Text kept in Postgres; null once it lives in Storage (`storagePath`). */
  markdown: string | null
  /** Path of the gzip text in Storage, read by the app. */
  storagePath: string | null
  truncated: boolean
  extractedAt: string
  modelVersion: string
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`)
}

function listConditions(filters: ExamListFilters): SQL[] {
  const conditions: SQL[] = [eq(exams.published, true)]
  if (filters.search) conditions.push(ilike(exams.name, `%${escapeLike(filters.search)}%`))
  if (filters.status) conditions.push(eq(exams.status, filters.status))
  if (filters.examiningBoard) conditions.push(eq(exams.examiningBoard, filters.examiningBoard))
  if (filters.state) {
    conditions.push(eq(exams.state, filters.state))
  } else if (filters.region) {
    conditions.push(inArray(exams.state, BRAZIL_REGIONS[filters.region]))
  }
  if (filters.city) conditions.push(eq(exams.city, filters.city))
  if (filters.salaryMin !== undefined && filters.salaryMin > 0) {
    conditions.push(gte(exams.salaryLowerBound, filters.salaryMin))
  }
  if (filters.salaryMax !== undefined) {
    conditions.push(lte(exams.salaryLowerBound, filters.salaryMax))
  }
  return conditions
}

function listOrder(sort: ExamListSort): SQL[] {
  if (sort === 'salary') return [sql`${exams.salaryLowerBound} desc nulls last`]
  if (sort === 'deadline') return [sql`${exams.registrationEnd} asc nulls last`]
  return [sql`${exams.scrapedAt} desc nulls last`, byRegistrationEndDesc]
}

/** Published exams matching `filters`, one page at a time, children hydrated. */
export async function listPublishedExams(
  filters: ExamListFilters,
  page: number,
  pageSize: number,
): Promise<{ exams: Exam[]; total: number }> {
  const db = getGabarDb()
  const where = and(...listConditions(filters))
  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(exams)
      .where(where)
      .orderBy(...listOrder(filters.sort ?? 'recent'), asc(exams.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(exams).where(where),
  ])
  return { exams: await hydrateExams(db, rows), total: totals[0]?.total ?? 0 }
}

async function distinctPublished(column: typeof exams.examiningBoard | typeof exams.city) {
  const rows = await getGabarDb()
    .selectDistinct({ value: column })
    .from(exams)
    .where(and(eq(exams.published, true), isNotNull(column)))
    .orderBy(asc(column))
  return rows.flatMap((r) => (r.value ? [r.value] : []))
}

export function listExaminingBoards(): Promise<string[]> {
  return distinctPublished(exams.examiningBoard)
}

export function listCities(): Promise<string[]> {
  return distinctPublished(exams.city)
}

export async function listPublishedSlugs(): Promise<string[]> {
  const rows = await getGabarDb()
    .select({ slug: exams.slug })
    .from(exams)
    .where(and(eq(exams.published, true), isNotNull(exams.slug)))
  return rows.flatMap((r) => (r.slug ? [r.slug] : []))
}

/** A published exam by slug; unpublished exams are not found. */
export async function findExamBySlug(slug: string): Promise<Exam | undefined> {
  const db = getGabarDb()
  const rows = await db
    .select()
    .from(exams)
    .where(and(eq(exams.slug, slug), eq(exams.published, true)))
    .limit(1)
  const [exam] = await hydrateExams(db, rows)
  return exam
}

export async function findDocumentPage(
  examSlug: string,
  documentSlug: string,
): Promise<DocumentPage | null> {
  const rows = await getGabarDb()
    .select({
      title: examDocuments.title,
      url: examDocuments.url,
      markdown: documentContents.markdown,
      storagePath: documentContents.storagePath,
      truncated: documentContents.truncated,
      extractedAt: documentContents.extractedAt,
      modelVersion: documentContents.modelVersion,
    })
    .from(examDocuments)
    .innerJoin(exams, eq(exams.id, examDocuments.examId))
    .innerJoin(documentContents, eq(documentContents.documentId, examDocuments.id))
    .where(
      and(
        eq(exams.slug, examSlug),
        eq(exams.published, true),
        eq(examDocuments.slug, documentSlug),
        hasText,
      ),
    )
    .limit(1)
  const row = rows[0]
  if (!row) return null
  return { ...row, extractedAt: row.extractedAt.toISOString() }
}

export interface SitemapEntries {
  exams: { slug: string; lastModified: Date }[]
  documents: { examSlug: string; slug: string; lastModified: Date }[]
}

/**
 * URLs worth indexing: every published exam, and each of its documents that
 * has text to render (the document page 404s otherwise).
 */
export async function listSitemapEntries(): Promise<SitemapEntries> {
  const db = getGabarDb()
  const examLastModified = sql<string>`coalesce(greatest(${exams.scrapedAt}, ${exams.enrichedAt}), ${exams.createdAt})`
  const [examRows, documentRows] = await Promise.all([
    db
      .select({ slug: exams.slug, lastModified: examLastModified })
      .from(exams)
      .where(and(eq(exams.published, true), isNotNull(exams.slug)))
      .orderBy(asc(exams.slug)),
    db
      .select({
        examSlug: exams.slug,
        slug: examDocuments.slug,
        lastModified: documentContents.extractedAt,
      })
      .from(examDocuments)
      .innerJoin(exams, eq(exams.id, examDocuments.examId))
      .innerJoin(documentContents, eq(documentContents.documentId, examDocuments.id))
      .where(
        and(
          eq(exams.published, true),
          isNotNull(exams.slug),
          isNotNull(examDocuments.slug),
          hasText,
        ),
      )
      .orderBy(asc(exams.slug), asc(examDocuments.slug)),
  ])
  return {
    exams: examRows.flatMap((r) =>
      r.slug ? [{ slug: r.slug, lastModified: new Date(r.lastModified) }] : [],
    ),
    documents: documentRows.flatMap((r) =>
      r.examSlug && r.slug
        ? [{ examSlug: r.examSlug, slug: r.slug, lastModified: r.lastModified }]
        : [],
    ),
  }
}
