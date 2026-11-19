import {
  closeManagedPool,
  getOrCreateManagedPoolSync,
  supabaseSsl,
  type PoolEnvConfig,
} from '@cbrl/pg'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { Pool } from 'pg'
import * as schema from './schema'

/**
 * Postgres connection for gabar (Supabase in production, docker locally/CI).
 *
 * Password mode only: `GABAR_DATABASE_URL` is the Supabase pooler connection
 * string (transaction mode, port 6543) on Vercel and a plain local URL in
 * dev/tests. Pool policy (timeouts, idle-client error handler, process-wide
 * registry) comes from `@cbrl/pg`; `supabaseSsl` verifies Supabase hosts against
 * the pinned root CA and strips any `ssl*` params from the URL so they cannot
 * override it.
 */
const POOL_CONFIG: PoolEnvConfig = {
  connectionStringEnvVar: 'GABAR_DATABASE_URL',
  database: 'gabar',
  passwordModeSsl: supabaseSsl,
}

function getPool(): Pool {
  return getOrCreateManagedPoolSync(POOL_CONFIG).pool
}

export type GabarDb = NodePgDatabase<typeof schema>

const drizzleByPool = new WeakMap<Pool, GabarDb>()

/** Drizzle client bound to the gabar schema. Lazily opens the pool. */
export function getGabarDb(): GabarDb {
  const pool = getPool()
  const cached = drizzleByPool.get(pool)
  if (cached) return cached
  const built = drizzle(pool, { schema })
  drizzleByPool.set(pool, built)
  return built
}

/** Round-trip `select 1` — health check, and the daily keep-alive for Supabase Free. */
export async function pingGabarDb(): Promise<void> {
  await getPool().query('select 1')
}

/** Close the pool (tests / graceful shutdown). No-op if never opened. */
export async function closeGabarDb(): Promise<void> {
  await closeManagedPool(POOL_CONFIG)
}
