import { describe, expect, it } from 'vitest'
import { filtersToParams, makeDefaultFilters, parseFiltersFromParams } from './useFilters'

describe('makeDefaultFilters', () => {
  it('returns default filter state with given salaryMax', () => {
    const filters = makeDefaultFilters(25000)
    expect(filters).toEqual({
      search: '',
      status: undefined,
      examiningBoard: undefined,
      salaryMin: 0,
      salaryMax: 25000,
      region: undefined,
      state: undefined,
      city: undefined,
      sort: 'recent',
    })
  })
})

describe('parseFiltersFromParams', () => {
  it('returns defaults when params are empty', () => {
    const result = parseFiltersFromParams(new URLSearchParams(), 25000)
    expect(result).toEqual(makeDefaultFilters(25000))
  })

  it('parses search from q param', () => {
    const result = parseFiltersFromParams(new URLSearchParams('q=Federal'), 0)
    expect(result.search).toBe('Federal')
  })

  it('parses status', () => {
    const result = parseFiltersFromParams(new URLSearchParams('status=open'), 0)
    expect(result.status).toBe('open')
  })

  it('parses state', () => {
    const result = parseFiltersFromParams(new URLSearchParams('state=SP'), 0)
    expect(result.state).toBe('SP')
  })

  it('parses region', () => {
    const result = parseFiltersFromParams(new URLSearchParams('region=Southeast'), 0)
    expect(result.region).toBe('Southeast')
  })

  it('parses city', () => {
    const result = parseFiltersFromParams(new URLSearchParams('city=São Paulo'), 0)
    expect(result.city).toBe('São Paulo')
  })

  it('parses salary range', () => {
    const result = parseFiltersFromParams(
      new URLSearchParams('salaryMin=5000&salaryMax=15000'),
      25000,
    )
    expect(result.salaryMin).toBe(5000)
    expect(result.salaryMax).toBe(15000)
  })
})

describe('filtersToParams', () => {
  it('returns empty params for default filters', () => {
    const params = filtersToParams(makeDefaultFilters(25000), 25000)
    expect(params.toString()).toBe('')
  })

  it('serializes search to q', () => {
    const params = filtersToParams({ ...makeDefaultFilters(0), search: 'Federal' }, 0)
    expect(params.get('q')).toBe('Federal')
  })

  it('serializes status', () => {
    const params = filtersToParams({ ...makeDefaultFilters(0), status: 'open' }, 0)
    expect(params.get('status')).toBe('open')
  })

  it('serializes state', () => {
    const params = filtersToParams({ ...makeDefaultFilters(0), state: 'SP' }, 0)
    expect(params.get('state')).toBe('SP')
  })

  it('does not include salaryMin when 0', () => {
    const params = filtersToParams(makeDefaultFilters(25000), 25000)
    expect(params.has('salaryMin')).toBe(false)
  })

  it('does not include salaryMax when at max', () => {
    const params = filtersToParams(makeDefaultFilters(25000), 25000)
    expect(params.has('salaryMax')).toBe(false)
  })

  it('includes salaryMin when above 0', () => {
    const params = filtersToParams({ ...makeDefaultFilters(25000), salaryMin: 5000 }, 25000)
    expect(params.get('salaryMin')).toBe('5000')
  })
})
