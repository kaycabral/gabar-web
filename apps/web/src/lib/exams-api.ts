import type { Exam } from '@gabar/shared'
import { cacheLife } from 'next/cache'
import {
  findDocumentPage,
  findExamBySlug,
  listCities,
  listExaminingBoards,
  listPublishedExams,
  listPublishedSlugs,
} from './db'
import { readDocumentText } from './document-text'
import { PAGE_SIZE, type DocumentPageData, type ExamFilters } from './exam-shared'

// Stats/aggregation queries live in ./exam-stats; re-exported so callers keep
// importing everything from '@/lib/exams-api'.
export { PAGE_SIZE, type ExamFilters } from './exam-shared'
export * from './exam-stats'

export async function getExamsPaginated(
  filters: ExamFilters,
  page: number,
): Promise<{ exams: Exam[]; total: number }> {
  'use cache'
  cacheLife('minutes')
  if (!Number.isInteger(page) || page < 1) throw new Error('Invalid page number')
  if (filters.search && filters.search.length > 200) throw new Error('Search query too long')
  return listPublishedExams(filters, page, PAGE_SIZE)
}

export async function getExaminingBoards(): Promise<string[]> {
  'use cache'
  cacheLife('days')
  return listExaminingBoards()
}

export async function getCities(): Promise<string[]> {
  'use cache'
  cacheLife('days')
  return listCities()
}

export async function getAllExamSlugs(): Promise<string[]> {
  'use cache'
  cacheLife('days')
  return listPublishedSlugs()
}

export async function getExamBySlug(slug: string): Promise<Exam | undefined> {
  'use cache'
  cacheLife('hours')
  if (!slug) return undefined
  return findExamBySlug(slug)
}

export async function getDocumentBySlug(
  examSlug: string,
  documentSlug: string,
): Promise<DocumentPageData | null> {
  'use cache'
  cacheLife('hours')
  if (!examSlug || !documentSlug) return null
  const page = await findDocumentPage(examSlug, documentSlug)
  if (!page) return null
  const text = await readDocumentText(page)
  if (text === null) return null
  const { storagePath: _, ...rest } = page
  return { ...rest, markdown: text }
}
