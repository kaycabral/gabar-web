import { describe, expect, it, vi } from 'vitest'
import robots from './robots'
import sitemap from './sitemap'

vi.mock('@/lib/exams-api', () => ({
  getSitemapEntries: vi.fn(() => ({
    exams: [{ slug: 'tj-sp-escrevente', lastModified: new Date('2026-11-10T12:00:00Z') }],
    documents: [
      {
        examSlug: 'tj-sp-escrevente',
        slug: 'edital',
        lastModified: new Date('2026-11-02T00:00:00Z'),
      },
    ],
  })),
}))

describe('sitemap', () => {
  it('lists static pages, published exams and their documents', async () => {
    expect(await sitemap()).toEqual([
      { url: 'https://gabar.com.br' },
      { url: 'https://gabar.com.br/concursos' },
      { url: 'https://gabar.com.br/concursos/categorias' },
      {
        url: 'https://gabar.com.br/concursos/tj-sp-escrevente',
        lastModified: new Date('2026-11-10T12:00:00Z'),
      },
      {
        url: 'https://gabar.com.br/concursos/tj-sp-escrevente/documento/edital',
        lastModified: new Date('2026-11-02T00:00:00Z'),
      },
    ])
  })
})

describe('robots', () => {
  it('allows /concursos and points to the sitemap', () => {
    const result = robots()
    expect(result.rules).toEqual([{ userAgent: '*', allow: '/' }])
    expect(result.sitemap).toBe('https://gabar.com.br/sitemap.xml')
  })
})
