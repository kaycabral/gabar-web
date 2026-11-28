import { sql } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import type { GabarDb } from './client'
import { documentContents, examDocuments, examPositions, exams } from './web'

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type NewExam = Optional<typeof exams.$inferInsert, 'id' | 'createdAt'>
type NewPosition = Omit<typeof examPositions.$inferInsert, 'id' | 'examId'>
type NewDocument = Optional<Omit<typeof examDocuments.$inferInsert, 'id' | 'examId'>, 'format'> & {
  content?: Optional<Omit<typeof documentContents.$inferInsert, 'documentId'>, 'truncated'>
}

export interface SeedExamInput {
  exam: NewExam
  positions?: NewPosition[]
  documents?: NewDocument[]
}

// The `web` test tables carry no identity defaults (production `web` is views
// over the pipeline tables), so fixtures number their own child rows.
let nextId = 1

/**
 * Insert one published exam with its positions, documents and document
 * contents into the `web` test tables built from `contract/web/web.schema.sql`.
 * Fixture builder for the integration suite, the web E2E and local dev —
 * production data is written by the pipeline, never by this.
 */
export async function seedExam(db: GabarDb, input: SeedExamInput): Promise<string> {
  return db.transaction(async (tx) => {
    const examId = input.exam.id ?? randomUUID()
    await tx.insert(exams).values({ createdAt: new Date(), ...input.exam, id: examId })
    if (input.positions?.length) {
      await tx
        .insert(examPositions)
        .values(input.positions.map((p) => ({ ...p, id: nextId++, examId })))
    }
    for (const { content, ...doc } of input.documents ?? []) {
      const id = nextId++
      await tx.insert(examDocuments).values({ format: 'file', ...doc, id, examId })
      if (content) {
        await tx.insert(documentContents).values({ truncated: false, ...content, documentId: id })
      }
    }
    return examId
  })
}

/** Empty every `web` test table and the waitlist (tests / local reset only). */
export async function truncateGabarTables(db: GabarDb): Promise<void> {
  await db.execute(
    sql`truncate table web.exams, web.exam_positions, web.exam_documents, web.document_contents, public.waitlist restart identity`,
  )
}
