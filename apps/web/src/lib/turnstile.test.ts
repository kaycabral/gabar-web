import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstile } from './turnstile'

const originalSecret = process.env.TURNSTILE_SECRET

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET
  else process.env.TURNSTILE_SECRET = originalSecret
})

describe('verifyTurnstile', () => {
  it('skipa quando TURNSTILE_SECRET não está setada (dev local)', async () => {
    delete process.env.TURNSTILE_SECRET
    const result = await verifyTurnstile('any-token')
    expect(result).toEqual({ ok: true, skipped: true })
  })

  it('rejeita quando token ausente e secret presente', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    const result = await verifyTurnstile(null)
    expect(result).toEqual({ ok: false, reason: 'no-token' })
  })

  it('rejeita string vazia como ausente', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    const result = await verifyTurnstile('')
    expect(result).toEqual({ ok: false, reason: 'no-token' })
  })

  it('aceita quando CF responde success=true', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    )
    const result = await verifyTurnstile('token-abc')
    expect(result).toEqual({ ok: true })
  })

  it('rejeita quando CF responde success=false', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), {
        status: 200,
      }),
    )
    const result = await verifyTurnstile('token-abc')
    expect(result).toEqual({ ok: false, reason: 'invalid' })
  })

  it('rejeita com network-error quando CF retorna 5xx', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('upstream', { status: 503 }))
    const result = await verifyTurnstile('token-abc')
    expect(result).toEqual({ ok: false, reason: 'network-error' })
  })

  it('rejeita com network-error em fetch failure (timeout/dns)', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('aborted'))
    const result = await verifyTurnstile('token-abc')
    expect(result).toEqual({ ok: false, reason: 'network-error' })
  })

  it('passa remoteip pro CF quando informado', async () => {
    process.env.TURNSTILE_SECRET = 'secret-xyz'
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
    await verifyTurnstile('token-abc', '203.0.113.42')
    const call = fetchSpy.mock.calls[0]
    const body = call?.[1]?.body
    expect(body).toBeInstanceOf(URLSearchParams)
    expect((body as URLSearchParams).get('remoteip')).toBe('203.0.113.42')
  })
})
