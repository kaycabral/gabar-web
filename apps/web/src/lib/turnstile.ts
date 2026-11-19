// Cloudflare Turnstile server-side verification.
//
// Comportamento opcional:
// - TURNSTILE_SECRET ausente → verificação skipada (retorna true). Permite dev
//   local sem conta Cloudflare. Em prod a env var é setada via Secret Manager.
// - TURNSTILE_SECRET presente → token obrigatório, validado via API CF.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type CloudflareSiteverifyResponse = {
  success: boolean
  'error-codes'?: string[]
  hostname?: string
  challenge_ts?: string
  action?: string
  cdata?: string
}

export type VerifyResult =
  { ok: true; skipped?: boolean } | { ok: false; reason: 'no-token' | 'invalid' | 'network-error' }

export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string,
): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET
  if (!secret) {
    // Dev sem CF: skipa silenciosamente. Server logs podem registrar isso pra debug
    return { ok: true, skipped: true }
  }

  if (!token) return { ok: false, reason: 'no-token' }

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.append('remoteip', remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      // Timeout curto: Turnstile responde em < 200ms; >5s é falha CF
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) return { ok: false, reason: 'network-error' }

    const data = (await res.json()) as CloudflareSiteverifyResponse
    return data.success ? { ok: true } : { ok: false, reason: 'invalid' }
  } catch {
    return { ok: false, reason: 'network-error' }
  }
}
