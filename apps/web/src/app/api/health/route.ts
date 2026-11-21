// Health endpoint: confirms the deploy serves the expected commit and that the
// database answers. Also the target of the daily Vercel Cron (vercel.json),
// which keeps the Supabase Free project from pausing after 7 idle days.
//
// `commit` is injected at build time (see next.config.ts). `healthRoute` awaits
// `connection()`, so every hit really reaches Postgres.

import { logger } from '@cbrl/log'
import { healthRoute } from '@cbrl/next/server'

import { pingGabarDb } from '@/lib/db'

export const GET = healthRoute({
  ping: pingGabarDb,
  onError: (err) => logger.error('health ping failed', { err }),
})
