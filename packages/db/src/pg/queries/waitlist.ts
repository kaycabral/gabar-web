import { sql } from 'drizzle-orm'
import { getGabarDb } from '../client'

export type JoinWaitlistResult = 'joined' | 'already-joined'

/**
 * Add an email to the waitlist through `web.join_waitlist`, the only write the
 * site can do. Idempotent and race-free: the function inserts with
 * `ON CONFLICT DO NOTHING` and returns whether a row was added. The caller must
 * pass an already-normalized (trimmed, lowercased) email — the table's CHECK
 * constraint rejects anything else.
 */
export async function joinWaitlist(normalizedEmail: string): Promise<JoinWaitlistResult> {
  const result = await getGabarDb().execute<{ joined: boolean }>(
    sql`select web.join_waitlist(${normalizedEmail}) as joined`,
  )
  return result.rows[0]?.joined ? 'joined' : 'already-joined'
}
