import { supabaseSsl } from '@cbrl/pg'
import { createDrizzleDatabase } from '@cbrl/pg/drizzle'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as schema from './schema'

/**
 * Postgres connection for gabar (Supabase in production, docker locally/CI).
 *
 * Password mode only: `GABAR_DATABASE_URL` is the Supabase pooler connection
 * string (transaction mode, port 6543) on Vercel and a plain local URL in
 * dev/tests. Pool policy (timeouts, idle-client error handler, process-wide
 * registry) and the Drizzle wiring come from `@cbrl/pg`; `supabaseSsl` verifies
 * Supabase hosts against the pinned root CA and strips any `ssl*` params from
 * the URL so they cannot override it. Nothing connects until the first call.
 */
const gabarDb = createDrizzleDatabase({
  connectionStringEnvVar: 'GABAR_DATABASE_URL',
  database: 'gabar',
  ssl: supabaseSsl,
  schema,
  migrationsFolder: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../drizzle'),
})

export type GabarDb = NodePgDatabase<typeof schema>

/** Drizzle client bound to the gabar schema. Lazily opens the pool. */
export const getGabarDb = (): GabarDb => gabarDb.db()

/** Round-trip `select 1` — health check, and the daily keep-alive for Supabase Free. */
export const pingGabarDb = (): Promise<void> => gabarDb.ping()

/** Close the pool (tests / graceful shutdown). No-op if never opened. */
export const closeGabarDb = (): Promise<void> => gabarDb.close()

/**
 * Apply the versioned migrations in `drizzle/` to the connected database.
 *
 * Used by the integration suite and the local seed. Never call this at app boot,
 * and never use `drizzle-kit push` against production.
 */
export const runGabarMigrations = (): Promise<void> => gabarDb.migrate()
