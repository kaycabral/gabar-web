import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { closeGabarDb, getGabarDb, runGabarMigrations } from './client'
import {
  findDocumentPage,
  findExamBySlug,
  listCities,
  listExaminingBoards,
  listPublishedExams,
  listPublishedSlugs,
  listSitemapEntries,
} from './queries/exams'
import {
  countActiveByBoard,
  countActiveByRegion,
  getExamTotals,
  getMaxSalaryLowerBound,
  listActiveByBoard,
  listActiveByRegion,
} from './queries/stats'
import { joinWaitlist } from './queries/waitlist'
import { exams, waitlist } from './schema'
import { seedExam, truncateGabarTables } from './seed'

function pgCode(error: unknown): string | undefined {
  const cause = error instanceof Error && 'cause' in error ? error.cause : error
  if (typeof cause !== 'object' || cause === null || !('code' in cause)) return undefined
  return typeof cause.code === 'string' ? cause.code : undefined
}

const base = {
  examiningBoard: 'FGV',
  institution: 'TJ-SP',
  state: 'SP',
  city: 'São Paulo',
  region: 'Southeast' as const,
}

async function seedFixtures() {
  const db = getGabarDb()
  await seedExam(db, {
    exam: {
      ...base,
      name: 'Concurso TJ-SP Escrevente',
      slug: 'tj-sp-escrevente',
      status: 'open',
      published: true,
      vacancies: 120,
      salaryLowerBound: 6000,
      scrapedAt: new Date('2026-11-10T12:00:00Z'),
      registrationEnd: new Date('2026-12-01T03:00:00Z'),
    },
    positions: [{ title: 'Escrevente', level: 'medio', salary: 6000, vacancies: 120 }],
    documents: [
      { title: 'Edital antigo', url: 'https://x/a.pdf', slug: 'edital-a', date: '2026-10-01' },
      {
        title: 'Edital',
        url: 'https://x/b.pdf',
        slug: 'edital',
        date: '2026-11-01',
        content: {
          markdown: '# Edital',
          extractedAt: new Date('2026-11-02T00:00:00Z'),
          modelVersion: 'gemini-test',
        },
      },
      { title: 'Sem data', url: 'https://x/c.pdf', slug: 'sem-data' },
      {
        title: 'Anexo',
        url: 'https://x/d.pdf',
        slug: 'anexo',
        date: '2026-10-15',
        content: {
          storagePath: 'documents/4.txt.gz',
          extractedAt: new Date('2026-11-03T00:00:00Z'),
          modelVersion: 'unpdf-test',
        },
      },
    ],
  })
  await seedExam(db, {
    exam: {
      examiningBoard: 'CEBRASPE',
      institution: null,
      state: 'BA',
      city: 'Salvador',
      region: 'Northeast',
      name: 'Concurso PF Agente',
      slug: 'pf-agente',
      status: 'closed',
      published: true,
      vacancies: 50,
      salaryLowerBound: 12000,
      scrapedAt: new Date('2026-11-12T12:00:00Z'),
    },
  })
  await seedExam(db, {
    exam: { ...base, name: 'Rascunho não publicado', slug: 'rascunho', salaryLowerBound: 99000 },
    documents: [
      {
        title: 'Edital',
        url: 'https://x/r.pdf',
        slug: 'edital',
        content: {
          markdown: '# Rascunho',
          extractedAt: new Date('2026-11-02T00:00:00Z'),
          modelVersion: 'gemini-test',
        },
      },
    ],
  })
}

beforeAll(async () => {
  await runGabarMigrations()
})

beforeEach(async () => {
  await truncateGabarTables(getGabarDb())
  await seedFixtures()
})

afterAll(async () => {
  await closeGabarDb()
})

describe('listing', () => {
  it('returns only published exams, sorted by most recent scrape, with total', async () => {
    const { exams: page, total } = await listPublishedExams({}, 1, 12)
    expect(total).toBe(2)
    expect(page.map((e) => e.slug)).toEqual(['pf-agente', 'tj-sp-escrevente'])
  })

  it('filters by search (case-insensitive, LIKE wildcards escaped), region and salary', async () => {
    expect((await listPublishedExams({ search: 'tj-sp' }, 1, 12)).total).toBe(1)
    expect((await listPublishedExams({ search: '%' }, 1, 12)).total).toBe(0)
    expect((await listPublishedExams({ region: 'Northeast' }, 1, 12)).exams[0]?.slug).toBe(
      'pf-agente',
    )
    expect((await listPublishedExams({ salaryMin: 7000 }, 1, 12)).total).toBe(1)
    expect((await listPublishedExams({ salaryMax: 7000 }, 1, 12)).total).toBe(1)
  })

  it('paginates', async () => {
    const second = await listPublishedExams({}, 2, 1)
    expect(second.total).toBe(2)
    expect(second.exams.map((e) => e.slug)).toEqual(['tj-sp-escrevente'])
  })

  it('lists distinct boards, cities and slugs of published exams only', async () => {
    expect(await listExaminingBoards()).toEqual(['CEBRASPE', 'FGV'])
    expect(await listCities()).toEqual(['Salvador', 'São Paulo'])
    expect((await listPublishedSlugs()).sort()).toEqual(['pf-agente', 'tj-sp-escrevente'])
  })
})

describe('sitemap', () => {
  it('lists published exams and their documents with text only', async () => {
    const { exams: examEntries, documents } = await listSitemapEntries()
    expect(examEntries.map((e) => e.slug)).toEqual(['pf-agente', 'tj-sp-escrevente'])
    expect(examEntries[0]?.lastModified).toEqual(new Date('2026-11-12T12:00:00Z'))
    expect(documents).toEqual([
      {
        examSlug: 'tj-sp-escrevente',
        slug: 'anexo',
        lastModified: new Date('2026-11-03T00:00:00Z'),
      },
      {
        examSlug: 'tj-sp-escrevente',
        slug: 'edital',
        lastModified: new Date('2026-11-02T00:00:00Z'),
      },
    ])
  })
})

describe('detail', () => {
  it('hydrates positions and documents ordered dated-first with hasContent', async () => {
    const exam = await findExamBySlug('tj-sp-escrevente')
    expect(exam?.positions).toEqual([
      {
        title: 'Escrevente',
        level: 'medio',
        salary: 6000,
        vacancies: 120,
        registrationFee: null,
        subjects: null,
      },
    ])
    expect(exam?.documents?.map((d) => [d.slug, d.hasContent])).toEqual([
      ['edital', true],
      ['anexo', true],
      ['edital-a', false],
      ['sem-data', false],
    ])
    expect(exam?.registrationEnd).toBe('2026-12-01T03:00:00.000Z')
  })

  it('returns undefined for an unknown slug', async () => {
    expect(await findExamBySlug('nope')).toBeUndefined()
  })

  it('does not find an unpublished exam by slug, nor its documents', async () => {
    expect(await findExamBySlug('rascunho')).toBeUndefined()
    expect(await findDocumentPage('rascunho', 'edital')).toBeNull()
  })

  it('finds a document whose text lives in Storage', async () => {
    expect(await findDocumentPage('tj-sp-escrevente', 'anexo')).toMatchObject({
      title: 'Anexo',
      markdown: null,
      storagePath: 'documents/4.txt.gz',
    })
  })

  it('finds a document page only when it has content', async () => {
    expect(await findDocumentPage('tj-sp-escrevente', 'edital')).toEqual({
      title: 'Edital',
      url: 'https://x/b.pdf',
      markdown: '# Edital',
      storagePath: null,
      truncated: false,
      extractedAt: '2026-11-02T00:00:00.000Z',
      modelVersion: 'gemini-test',
    })
    expect(await findDocumentPage('tj-sp-escrevente', 'edital-a')).toBeNull()
  })
})

describe('stats', () => {
  it('counts active (published, not closed) exams by region and board', async () => {
    const byRegion = await countActiveByRegion()
    expect(byRegion.Southeast).toBe(1)
    expect(byRegion.Northeast).toBe(0)
    expect(await countActiveByBoard(['FGV', 'CEBRASPE', 'VUNESP'])).toEqual({
      FGV: 1,
      CEBRASPE: 0,
      VUNESP: 0,
    })
  })

  it('lists top active exams per region and board', async () => {
    const byRegion = await listActiveByRegion(6)
    expect(byRegion.Southeast.map((e) => e.slug)).toEqual(['tj-sp-escrevente'])
    expect(byRegion.Northeast).toEqual([])
    expect((await listActiveByBoard(['FGV'], 6)).FGV?.[0]?.positions).toHaveLength(1)
  })

  it('aggregates totals and the published salary max', async () => {
    expect(await getExamTotals()).toEqual({
      totalExams: 2,
      activeExams: 1,
      totalVacancies: 120,
      lastSyncAt: '2026-11-12T12:00:00.000Z',
    })
    expect(await getMaxSalaryLowerBound()).toBe(12000)
  })
})

describe('constraints', () => {
  it('rejects publishing an exam without a slug', async () => {
    const insert = getGabarDb()
      .insert(exams)
      .values({ ...base, name: 'Sem slug', published: true })
    await expect(insert).rejects.toSatisfy((e) => pgCode(e) === '23514')
  })

  it('rejects a duplicate exam slug', async () => {
    const insert = getGabarDb()
      .insert(exams)
      .values({ ...base, name: 'Dup', slug: 'pf-agente' })
    await expect(insert).rejects.toSatisfy((e) => pgCode(e) === '23505')
  })
})

describe('waitlist', () => {
  it('joins once and reports duplicates', async () => {
    expect(await joinWaitlist('a@b.com')).toBe('joined')
    expect(await joinWaitlist('a@b.com')).toBe('already-joined')
    expect(await getGabarDb().select().from(waitlist)).toHaveLength(1)
  })

  it('rejects a non-normalized email at the database', async () => {
    await expect(joinWaitlist(' A@B.com')).rejects.toSatisfy((e) => pgCode(e) === '23514')
  })
})
