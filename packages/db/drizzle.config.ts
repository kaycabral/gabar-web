import { requireEnv } from '@cbrl/env'
import { stripSslParams, supabaseSsl } from '@cbrl/pg'
import { defineConfig } from 'drizzle-kit'

/**
 * drizzle-kit config for gabar's Postgres (Supabase).
 *
 * `generate` writes versioned SQL migrations into `drizzle/` (reviewed in the
 * MR); `migrate` applies them. Point `GABAR_DATABASE_URL` at the Supabase
 * session/direct URL when migrating — the transaction pooler does not support
 * the migrator's session-level advisory lock.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/pg/schema.ts',
  out: './drizzle',
  dbCredentials: (() => {
    const rawUrl = requireEnv('GABAR_DATABASE_URL')
    const ssl = supabaseSsl(rawUrl)
    return ssl ? { url: stripSslParams(rawUrl), ssl } : { url: rawUrl }
  })(),
  strict: true,
  verbose: true,
})
