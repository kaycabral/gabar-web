import { gzipSync } from 'node:zlib'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readDocumentText } from './document-text'

vi.mock('server-only', () => ({}))

const ENV = ['GABAR_SUPABASE_URL', 'GABAR_SUPABASE_PUBLISHABLE_KEY'] as const
const original = Object.fromEntries(ENV.map((name) => [name, process.env[name]]))

beforeEach(() => {
  vi.restoreAllMocks()
  process.env.GABAR_SUPABASE_URL = 'https://project.example.co/'
  process.env.GABAR_SUPABASE_PUBLISHABLE_KEY = 'publishable-key'
})

afterEach(() => {
  for (const name of ENV) {
    if (original[name] === undefined) delete process.env[name]
    else process.env[name] = original[name]
  }
})

describe('readDocumentText', () => {
  it('returns the text kept in Postgres without reading Storage', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    expect(await readDocumentText({ markdown: '# Edital', storagePath: null })).toBe('# Edital')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns null when the document has no text', async () => {
    expect(await readDocumentText({ markdown: null, storagePath: null })).toBeNull()
  })

  it('reads and unzips the text from Storage with the publishable key', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(gzipSync('Edital nº 1 — Abertura'), { status: 200 }))

    const text = await readDocumentText({ markdown: null, storagePath: 'documents/42.txt.gz' })

    expect(text).toBe('Edital nº 1 — Abertura')
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://project.example.co/storage/v1/object/authenticated/document-texts/documents/42.txt.gz',
      { headers: { apikey: 'publishable-key' } },
    )
  })

  it('throws when Storage refuses, instead of treating the text as missing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not found', { status: 400 }))

    await expect(
      readDocumentText({ markdown: null, storagePath: 'documents/42.txt.gz' }),
    ).rejects.toThrow('HTTP 400')
  })

  it('throws when the Storage configuration is missing', async () => {
    delete process.env.GABAR_SUPABASE_PUBLISHABLE_KEY

    await expect(
      readDocumentText({ markdown: null, storagePath: 'documents/42.txt.gz' }),
    ).rejects.toThrow('GABAR_SUPABASE_PUBLISHABLE_KEY')
  })
})
