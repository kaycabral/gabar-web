import { getGabarDb } from '../pool'
import { waitlist } from '../schema'

export type JoinWaitlistResult = 'joined' | 'already-joined'

/**
 * Add an email to the waitlist. Idempotent and race-free: the UNIQUE(email)
 * constraint decides, `ON CONFLICT DO NOTHING` returns no row for a duplicate.
 * The caller must pass an already-normalized (trimmed, lowercased) email — the
 * table's CHECK constraint rejects anything else.
 */
export async function joinWaitlist(normalizedEmail: string): Promise<JoinWaitlistResult> {
  const now = new Date()
  const inserted = await getGabarDb()
    .insert(waitlist)
    .values({ email: normalizedEmail, createdAt: now, consentedAt: now })
    .onConflictDoNothing({ target: waitlist.email })
    .returning({ id: waitlist.id })
  return inserted.length > 0 ? 'joined' : 'already-joined'
}
