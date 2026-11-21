// Postgres (Supabase) entrypoint for the web app — `@gabar/db/pg`.
export { closeGabarDb, getGabarDb, pingGabarDb, runGabarMigrations, type GabarDb } from './client'
export {
  findDocumentPage,
  findExamBySlug,
  listCities,
  listExaminingBoards,
  listPublishedExams,
  listPublishedSlugs,
  type DocumentPage,
  type ExamListFilters,
  type ExamListSort,
} from './queries/exams'
export {
  countActiveByBoard,
  countActiveByRegion,
  getExamTotals,
  getMaxSalaryLowerBound,
  listActiveByBoard,
  listActiveByRegion,
  type ExamTotals,
} from './queries/stats'
export { joinWaitlist, type JoinWaitlistResult } from './queries/waitlist'
export * as gabarSchema from './schema'
export { seedExam, truncateGabarTables, type SeedExamInput } from './seed'
