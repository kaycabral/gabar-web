import { describe, expect, it } from 'vitest'
import { formatDeadline, formatFullDate, formatRegistrationPeriod, formatShortDate } from './date'

describe('formatDeadline', () => {
  it('formats a date in May correctly', () => {
    expect(formatDeadline('2026-05-15')).toBe('15 mai. 2026')
  })

  it('formats January (first month)', () => {
    expect(formatDeadline('2026-01-03')).toBe('3 jan. 2026')
  })

  it('formats December (last month)', () => {
    expect(formatDeadline('2026-12-25')).toBe('25 dez. 2026')
  })

  it('strips leading zero from day', () => {
    expect(formatDeadline('2026-03-01')).toBe('1 mar. 2026')
  })

  it('handles double-digit day without leading zero', () => {
    expect(formatDeadline('2026-11-30')).toBe('30 nov. 2026')
  })

  it('ignores time portion in datetime string', () => {
    expect(formatDeadline('2026-05-15T23:59:00-03:00')).toBe('15 mai. 2026')
  })
})

describe('formatShortDate', () => {
  it('formats date as DD/MM/YYYY', () => {
    expect(formatShortDate('2026-05-15')).toBe('15/05/2026')
  })

  it('ignores time portion in datetime string', () => {
    expect(formatShortDate('2026-05-15T09:00:00-03:00')).toBe('15/05/2026')
  })
})

describe('formatFullDate', () => {
  it('formats a date in long Portuguese format', () => {
    expect(formatFullDate('2026-05-15')).toBe('15 de maio de 2026')
  })

  it('formats January in long format', () => {
    expect(formatFullDate('2026-01-03')).toBe('03 de janeiro de 2026')
  })

  it('formats December in long format', () => {
    expect(formatFullDate('2026-12-25')).toBe('25 de dezembro de 2026')
  })

  it('appends time when datetime string has explicit time', () => {
    expect(formatFullDate('2026-05-15T09:00:00-03:00')).toBe('15 de maio de 2026, às 09:00')
  })

  it('appends time with Z timezone', () => {
    expect(formatFullDate('2026-05-15T23:59:00Z')).toBe('15 de maio de 2026, às 23:59')
  })
})

describe('formatRegistrationPeriod', () => {
  it('formats date range without time by default', () => {
    expect(formatRegistrationPeriod('2026-03-23T10:00:00', '2026-04-22T23:00:00')).toBe(
      '23/03/26 – 22/04/26',
    )
  })

  it('includes time when includeTime is true', () => {
    expect(
      formatRegistrationPeriod('2026-03-23T10:00:00', '2026-04-22T23:00:00', { includeTime: true }),
    ).toBe('23/03/26, 10:00 – 22/04/26, 23:00')
  })

  it('formats plain dates without time regardless of includeTime', () => {
    expect(formatRegistrationPeriod('2026-03-23', '2026-04-22', { includeTime: true })).toBe(
      '23/03/26 – 22/04/26',
    )
  })

  it('handles end-only with até', () => {
    expect(formatRegistrationPeriod(null, '2026-04-22')).toBe('até 22/04/26')
  })

  it('handles start-only with a partir de', () => {
    expect(formatRegistrationPeriod('2026-03-23', null)).toBe('a partir de 23/03/26')
  })

  it('returns dash when both are null', () => {
    expect(formatRegistrationPeriod(null, null)).toBe('–')
  })
})
