import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getGabarDb } from './pool'

/**
 * Apply the versioned migrations in `drizzle/` to the connected database.
 *
 * Used by the integration suite and by `pnpm --filter @gabar/db db:migrate`
 * against Supabase (session/direct URL, not the transaction pooler). Never call
 * this at app boot, and never use `drizzle-kit push` against production.
 */
export async function runGabarMigrations(): Promise<void> {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const migrationsFolder = path.resolve(here, '../../drizzle')
  await migrate(getGabarDb(), { migrationsFolder })
}
