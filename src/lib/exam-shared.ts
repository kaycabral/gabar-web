// Shared constants + types for the exams data-access layer, split out so
// exams-api.ts and exam-stats.ts stay under the module-size gate.

import type { DocumentPage, ExamListFilters } from '@/db'

export const PAGE_SIZE = 12

export type ExamFilters = ExamListFilters

/** A document page with its text already read (from Postgres or Storage). */
export type DocumentPageData = Omit<DocumentPage, 'markdown' | 'storagePath'> & { markdown: string }
