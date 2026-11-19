// Postgres (Supabase) entrypoint for the web app — `@gabar/db/pg`.
export { runGabarMigrations } from './migrate'
export { closeGabarDb, getGabarDb, pingGabarDb, type GabarDb } from './pool'
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
