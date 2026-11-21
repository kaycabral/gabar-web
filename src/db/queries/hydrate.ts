import type { Exam, ExamDocument, ExamPosition } from '@/shared'
import { asc, inArray, sql } from 'drizzle-orm'
import type { GabarDb } from '../client'
import { documentContents, examDocuments, examPositions, exams } from '../schema'

export type ExamRow = typeof exams.$inferSelect

function isoOrNull(value: Date | null): string | null {
  return value ? value.toISOString() : null
}

/** Row → domain `Exam` without children (positions/documents are hydrated separately). */
export function toExam(row: ExamRow): Exam {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    examiningBoard: row.examiningBoard,
    institution: row.institution,
    state: row.state,
    city: row.city,
    region: row.region,
    status: row.status ?? undefined,
    examDate: row.examDate,
    resultDate: row.resultDate,
    possessionDate: row.possessionDate,
    registrationStart: isoOrNull(row.registrationStart),
    registrationEnd: isoOrNull(row.registrationEnd),
    noticeUrl: row.noticeUrl,
    registrationUrl: row.registrationUrl,
    sourceUrl: row.sourceUrl,
    scrapedAt: isoOrNull(row.scrapedAt),
    enrichedAt: isoOrNull(row.enrichedAt),
    vacancies: row.vacancies,
    positions: null,
    documents: undefined,
  }
}

/**
 * Attach positions and documents (with `hasContent`) to a page of exams in two
 * queries total, instead of one query per exam. Documents: dated first (newest first), then insertion order.
 */
export async function hydrateExams(db: GabarDb, rows: ExamRow[]): Promise<Exam[]> {
  if (rows.length === 0) return []
  const ids = rows.map((r) => r.id)

  const [positionRows, documentRows] = await Promise.all([
    db
      .select()
      .from(examPositions)
      .where(inArray(examPositions.examId, ids))
      .orderBy(asc(examPositions.id)),
    db
      .select({
        examId: examDocuments.examId,
        slug: examDocuments.slug,
        title: examDocuments.title,
        date: examDocuments.date,
        url: examDocuments.url,
        type: examDocuments.type,
        format: examDocuments.format,
        hasContent: sql<boolean>`exists (select 1 from ${documentContents} where ${documentContents.documentId} = ${examDocuments.id} and ${hasText})`,
      })
      .from(examDocuments)
      .where(inArray(examDocuments.examId, ids))
      .orderBy(sql`${examDocuments.date} desc nulls last`, asc(examDocuments.id)),
  ])

  const positionsByExam = new Map<string, ExamPosition[]>()
  for (const p of positionRows) {
    const list = positionsByExam.get(p.examId) ?? []
    list.push({
      title: p.title,
      level: p.level,
      salary: p.salary,
      vacancies: p.vacancies,
      registrationFee: p.registrationFee,
      subjects: null,
    })
    positionsByExam.set(p.examId, list)
  }

  const documentsByExam = new Map<string, ExamDocument[]>()
  for (const d of documentRows) {
    const list = documentsByExam.get(d.examId) ?? []
    list.push({
      slug: d.slug,
      title: d.title,
      date: d.date,
      url: d.url,
      type: d.type,
      format: d.format,
      hasContent: d.hasContent,
    })
    documentsByExam.set(d.examId, list)
  }

  return rows.map((row) => ({
    ...toExam(row),
    positions: positionsByExam.get(row.id) ?? null,
    documents: documentsByExam.get(row.id),
  }))
}

/** `ORDER BY registration_end DESC NULLS LAST` — shared "most relevant first" order. */
export const byRegistrationEndDesc = sql`${exams.registrationEnd} desc nulls last`

/** A document content row with readable text: in Postgres or in Storage. */
export const hasText = sql`(${documentContents.markdown} is not null or ${documentContents.storagePath} is not null)`
