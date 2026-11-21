import { sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

/**
 * Postgres (Supabase) schema for gabar, as read by this front end: child
 * tables hang off `exams` by FK, and invariants live in native constraints.
 *
 * Every table has RLS enabled with NO policies: the only reader/writer is the
 * server (Postgres role via the Supabase pooler, which bypasses RLS), so the
 * public PostgREST API exposed with the anon key returns nothing.
 */

export const examStatus = pgEnum('exam_status', ['open', 'upcoming', 'closed', 'ongoing'])

export const brazilianRegion = pgEnum('brazilian_region', [
  'North',
  'Northeast',
  'Central-West',
  'Southeast',
  'South',
])

export const documentType = pgEnum('document_type', [
  'notice',
  'result',
  'answer-key',
  'appeal',
  'enrollment',
  'other',
])

export const documentFormat = pgEnum('document_format', ['file', 'link'])

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

export const exams = pgTable(
  'exams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    legacyId: text('legacy_id'),
    slug: text('slug').unique(),
    name: text('name').notNull(),
    examiningBoard: text('examining_board').notNull(),
    institution: text('institution'),
    state: text('state').notNull(),
    city: text('city'),
    region: brazilianRegion('region').notNull(),
    status: examStatus('status'),
    examDate: date('exam_date'),
    resultDate: date('result_date'),
    possessionDate: date('possession_date'),
    registrationStart: timestamp('registration_start', { withTimezone: true }),
    registrationEnd: timestamp('registration_end', { withTimezone: true }),
    registrationUrl: text('registration_url'),
    noticeUrl: text('notice_url'),
    sourceUrl: text('source_url'),
    scrapedAt: timestamp('scraped_at', { withTimezone: true }),
    enrichedAt: timestamp('enriched_at', { withTimezone: true }),
    enrichmentLockedAt: timestamp('enrichment_locked_at', { withTimezone: true }),
    conversionLockedAt: timestamp('conversion_locked_at', { withTimezone: true }),
    published: boolean('published').notNull().default(false),
    vacancies: integer('vacancies'),
    salaryLowerBound: doublePrecision('salary_lower_bound'),
    levels: text('levels')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: createdAt(),
  },
  (t) => [
    check('exams_published_requires_slug', sql`NOT ${t.published} OR ${t.slug} IS NOT NULL`),
    index('exams_published_idx').on(t.published),
    index('exams_examining_board_idx').on(t.examiningBoard),
    index('exams_state_idx').on(t.state),
  ],
).enableRLS()

export const examPositions = pgTable(
  'exam_positions',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),
    legacyId: text('legacy_id'),
    title: text('title').notNull(),
    level: text('level'),
    salary: doublePrecision('salary'),
    vacancies: integer('vacancies'),
    registrationFee: doublePrecision('registration_fee'),
  },
  (t) => [index('exam_positions_exam_id_idx').on(t.examId)],
).enableRLS()

export const positionSubjects = pgTable(
  'position_subjects',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    positionId: bigint('position_id', { mode: 'number' })
      .notNull()
      .references(() => examPositions.id, { onDelete: 'cascade' }),
    legacyId: text('legacy_id'),
    name: text('name').notNull(),
    topics: text('topics')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
  },
  (t) => [index('position_subjects_position_id_idx').on(t.positionId)],
).enableRLS()

export const examDocuments = pgTable(
  'exam_documents',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),
    legacyId: text('legacy_id'),
    slug: text('slug'),
    title: text('title').notNull(),
    date: date('date'),
    url: text('url').notNull(),
    type: documentType('type'),
    format: documentFormat('format').notNull().default('file'),
    storedObjectUri: text('stored_object_uri'),
    storedAt: timestamp('stored_at', { withTimezone: true }),
    conversionError: jsonb('conversion_error'),
    createdAt: createdAt(),
  },
  (t) => [
    unique('exam_documents_exam_id_url_key').on(t.examId, t.url),
    unique('exam_documents_exam_id_slug_key').on(t.examId, t.slug),
  ],
).enableRLS()

export const documentContents = pgTable('document_contents', {
  documentId: bigint('document_id', { mode: 'number' })
    .primaryKey()
    .references(() => examDocuments.id, { onDelete: 'cascade' }),
  // Null once the text lives in Storage (`storagePath`).
  markdown: text('markdown'),
  // Path of the gzip text in the private document-texts bucket.
  storagePath: text('storage_path'),
  extractedAt: timestamp('extracted_at', { withTimezone: true }).notNull(),
  modelVersion: text('model_version').notNull(),
  tokenCount: integer('token_count'),
  truncated: boolean('truncated').notNull().default(false),
}).enableRLS()

export const articles = pgTable('articles', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'set null' }),
  legacyId: text('legacy_id'),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}).enableRLS()

export const waitlist = pgTable(
  'waitlist',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    email: text('email').notNull().unique(),
    createdAt: createdAt(),
    consentedAt: timestamp('consented_at', { withTimezone: true }).notNull(),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  },
  (t) => [check('waitlist_email_normalized', sql`${t.email} = lower(btrim(${t.email}))`)],
).enableRLS()
