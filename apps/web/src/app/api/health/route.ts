// Health endpoint: confirms the deploy serves the expected commit and that the
// database answers. Also the target of the daily Vercel Cron (vercel.json),
// which keeps the Supabase Free project from pausing after 7 idle days.
//
// `commit` is injected at build time (see next.config.ts). `connection()` keeps
// this handler out of the Cache Components prerender, so every hit really
// reaches Postgres.

import { NextResponse, connection } from 'next/server'

import { pingGabarDb } from '@/lib/db'

export async function GET() {
  await connection()
  const commit = process.env.NEXT_PUBLIC_COMMIT_SHA ?? null
  try {
    await pingGabarDb()
    return NextResponse.json({ status: 'ok', commit, database: 'ok' })
  } catch {
    return NextResponse.json({ status: 'error', commit, database: 'unreachable' }, { status: 503 })
  }
}
