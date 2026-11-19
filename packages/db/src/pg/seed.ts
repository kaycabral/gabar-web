import { sql } from 'drizzle-orm'
import type { GabarDb } from './pool'
import { documentContents, examDocuments, examPositions, exams } from './schema'

type NewExam = typeof exams.$inferInsert
type NewPosition = Omit<typeof examPositions.$inferInsert, 'examId'>
type NewDocument = Omit<typeof examDocuments.$inferInsert, 'examId'> & {
  content?: Omit<typeof documentContents.$inferInsert, 'documentId'>
}

export interface SeedExamInput {
  exam: NewExam
  positions?: NewPosition[]
  documents?: NewDocument[]
}

/**
 * Insert one exam with its positions, documents and document contents. Fixture
 * builder for the integration suite, the web E2E and local dev — production
 * data is written by the pipeline, never by this.
 */
export async function seedExam(db: GabarDb, input: SeedExamInput): Promise<string> {
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(exams).values(input.exam).returning({ id: exams.id })
    if (!row) throw new Error('seedExam: exam insert returned no row')
    const examId = row.id
    if (input.positions?.length) {
      await tx.insert(examPositions).values(input.positions.map((p) => ({ ...p, examId })))
    }
    for (const { content, ...doc } of input.documents ?? []) {
      const [inserted] = await tx
        .insert(examDocuments)
        .values({ ...doc, examId })
        .returning({ id: examDocuments.id })
      if (content && inserted) {
        await tx.insert(documentContents).values({ ...content, documentId: inserted.id })
      }
    }
    return examId
  })
}

/** Empty every gabar table (tests / local reset only). */
export async function truncateGabarTables(db: GabarDb): Promise<void> {
  await db.execute(
    sql`truncate table exams, exam_positions, position_subjects, exam_documents, document_contents, articles, waitlist restart identity cascade`,
  )
}
