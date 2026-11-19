import { describe, expect, it } from 'vitest'
import {
  inferStatusFromDates,
  isMutableStatus,
  isStableStatus,
  shouldFetchDetail,
} from './mutability'

describe('isStableStatus', () => {
  it('closed é stable', () => {
    expect(isStableStatus('closed')).toBe(true)
  })

  it('open/upcoming/ongoing são mutable (não stable)', () => {
    expect(isStableStatus('open')).toBe(false)
    expect(isStableStatus('upcoming')).toBe(false)
    expect(isStableStatus('ongoing')).toBe(false)
  })

  it('null/undefined são mutable (não stable) — exam novo', () => {
    expect(isStableStatus(null)).toBe(false)
    expect(isStableStatus(undefined)).toBe(false)
  })
})

describe('isMutableStatus', () => {
  it('inverso de isStableStatus', () => {
    expect(isMutableStatus('closed')).toBe(false)
    expect(isMutableStatus('open')).toBe(true)
    expect(isMutableStatus(null)).toBe(true)
  })
})

describe('shouldFetchDetail', () => {
  it('exam novo (sem firestoreStatus) → fetch', () => {
    expect(shouldFetchDetail('open', null)).toBe(true)
    expect(shouldFetchDetail('closed', undefined)).toBe(true)
  })

  it('status diff entre listing e firestore → fetch (captura transição)', () => {
    expect(shouldFetchDetail('closed', 'open')).toBe(true)
    expect(shouldFetchDetail('ongoing', 'upcoming')).toBe(true)
  })

  it('ambos stable e iguais → skip (frozen)', () => {
    expect(shouldFetchDetail('closed', 'closed')).toBe(false)
  })

  it('ambos mutable e iguais → fetch (continua mexendo)', () => {
    expect(shouldFetchDetail('open', 'open')).toBe(true)
    expect(shouldFetchDetail('ongoing', 'ongoing')).toBe(true)
  })

  it('listing null mas firestore stable → skip (assume listing perdeu o campo)', () => {
    // Cenário: banca removeu o status do listing mas exam estava encerrado.
    // Não vale refetch — failsafe semanal cobre.
    expect(shouldFetchDetail(null, 'closed')).toBe(false)
  })

  it('listing null mas firestore mutable → fetch (mantém atualização)', () => {
    expect(shouldFetchDetail(null, 'open')).toBe(true)
  })
})

describe('inferStatusFromDates', () => {
  const now = new Date('2026-05-06T00:00:00Z')

  it('resultDate há mais de 30 dias → closed', () => {
    const resultDate = new Date('2026-04-01T00:00:00Z')
    expect(inferStatusFromDates(null, resultDate, now)).toBe('closed')
  })

  it('resultDate recente (<30d) → null', () => {
    const resultDate = new Date('2026-04-20T00:00:00Z')
    expect(inferStatusFromDates(null, resultDate, now)).toBe(null)
  })

  it('examDate há >90 dias sem resultDate → closed', () => {
    const examDate = new Date('2026-02-01T00:00:00Z')
    expect(inferStatusFromDates(examDate, null, now)).toBe('closed')
  })

  it('examDate <90 dias → null (mutable)', () => {
    const examDate = new Date('2026-03-01T00:00:00Z')
    expect(inferStatusFromDates(examDate, null, now)).toBe(null)
  })

  it('examDate >90 dias COM resultDate (recent) → null (resultDate manda)', () => {
    const examDate = new Date('2026-01-01T00:00:00Z')
    const resultDate = new Date('2026-04-25T00:00:00Z')
    expect(inferStatusFromDates(examDate, resultDate, now)).toBe(null)
  })

  it('sem datas → null (não dá pra inferir)', () => {
    expect(inferStatusFromDates(null, null, now)).toBe(null)
  })
})
