// Shared constants + types for the exams data-access layer, split out so
// exams-api.ts and exam-stats.ts stay under the module-size gate.

import type { DocumentPage, ExamListFilters } from '@gabar/db/pg'

export const PAGE_SIZE = 12

export type ExamFilters = ExamListFilters

export type DocumentPageData = DocumentPage
