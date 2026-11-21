'use server'

import { joinWaitlist as insertWaitlistEmail } from '@/lib/db'
import { verifyTurnstile } from '@/lib/turnstile'

export type WaitlistState =
  { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string }

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = formData.get('email')
  const turnstileToken = formData.get('cf-turnstile-response')

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return { status: 'error', message: 'Insira um e-mail válido.' }
  }

  // Anti-bot: skipa em dev local (sem TURNSTILE_SECRET) ou quando widget
  // sinalizou skipped (token === 'skipped'). Ver lib/turnstile.ts.
  const tokenValue =
    typeof turnstileToken === 'string' && turnstileToken !== 'skipped' ? turnstileToken : null
  const verify = await verifyTurnstile(tokenValue)
  if (!verify.ok) {
    return { status: 'error', message: 'Verificação anti-bot falhou. Recarregue a página.' }
  }

  try {
    // LGPD: the row records `consented_at` (affirmative submit with a visible
    // link to /privacidade); `unsubscribed_at` is reserved for opt-out.
    const result = await insertWaitlistEmail(email.toLowerCase().trim())
    if (result === 'already-joined') {
      return { status: 'error', message: 'Este e-mail já está na lista.' }
    }
    return { status: 'success' }
  } catch {
    return { status: 'error', message: 'Algo deu errado. Tente novamente.' }
  }
}
