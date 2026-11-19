import type { FilterState } from '@/lib/filters'
import type { Exam } from '@gabar/shared'
import { describe, expect, it } from 'vitest'
import {
  applyFilters,
  filterByCity,
  filterByRegion,
  filterBySalaryMax,
  filterBySalaryMin,
  filterBySearch,
  filterByState,
  filterByStatus,
  normalizeText,
} from './filters'

const mockExams: Exam[] = [
  {
    id: 'trt-2025',
    slug: 'trt-2025',
    name: 'TRT 2ª Região 2025',
    examiningBoard: 'FCC',
    institution: 'TRT 2ª Região',
    positions: [{ title: 'Analista Judiciário', level: null, salary: 13994 }],
    vacancies: 42,
    registrationEnd: '2026-05-15',
    state: 'SP',
    city: 'São Paulo',
    region: 'Southeast',
    status: 'upcoming',
  },
  {
    id: 'pf-2025',
    slug: 'pf-2025',
    name: 'Polícia Federal 2025',
    examiningBoard: 'CESPE/CEBRASPE',
    institution: 'Polícia Federal',
    positions: [{ title: 'Delegado de Polícia', level: null, salary: 23692 }],
    vacancies: 192,
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
    status: 'upcoming',
  },
  {
    id: 'receita-federal-2025',
    slug: 'receita-federal-2025',
    name: 'Receita Federal 2025',
    examiningBoard: 'CESPE/CEBRASPE',
    institution: 'Receita Federal',
    positions: [{ title: 'Auditor-Fiscal da Receita Federal', level: null, salary: 21029 }],
    vacancies: 230,
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
    status: 'open',
  },
  {
    id: 'inss-2025',
    slug: 'inss-2025',
    name: 'INSS 2025',
    examiningBoard: 'CEBRASPE',
    institution: 'INSS',
    positions: [{ title: 'Técnico do Seguro Social', level: null, salary: null }],
    vacancies: 7893,
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
    status: 'closed',
  },
  {
    id: 'correios-2025',
    slug: 'correios-2025',
    name: 'Correios 2025',
    examiningBoard: 'IADES',
    institution: 'Correios',
    positions: [{ title: 'Carteiro', level: null, salary: 2429 }],
    vacancies: 3000,
    state: 'SP',
    city: 'São Paulo',
    region: 'Southeast',
    status: 'closed',
  },
  {
    id: 'banco-central-2025',
    slug: 'banco-central-2025',
    name: 'Banco Central do Brasil 2025',
    examiningBoard: 'CESPE/CEBRASPE',
    institution: 'Banco Central do Brasil',
    positions: [{ title: 'Analista Área 1', level: null, salary: 20924 }],
    vacancies: 35,
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
    status: 'upcoming',
  },
]

describe('normalizeText', () => {
  it('lowercases the text', () => {
    expect(normalizeText('FEDERAL')).toBe('federal')
  })

  it('removes diacritics', () => {
    expect(normalizeText('Polícia')).toBe('policia')
  })

  it('handles combined diacritics and casing', () => {
    expect(normalizeText('POLÍCIA')).toBe('policia')
  })

  it('leaves plain ASCII unchanged', () => {
    expect(normalizeText('federal')).toBe('federal')
  })
})

describe('filterBySearch', () => {
  it('returns all exams when search is empty', () => {
    expect(filterBySearch('', mockExams)).toHaveLength(6)
  })

  it('returns all exams when search is only whitespace', () => {
    expect(filterBySearch('   ', mockExams)).toHaveLength(6)
  })

  it('filters by exam name (case-insensitive)', () => {
    const result = filterBySearch('federal', mockExams)
    expect(result).toHaveLength(2)
    expect(result.map((e) => e.id)).toContain('pf-2025')
    expect(result.map((e) => e.id)).toContain('receita-federal-2025')
  })

  it('filters by role', () => {
    const result = filterBySearch('analista', mockExams)
    expect(result).toHaveLength(2)
    expect(result.map((e) => e.id)).toContain('trt-2025')
    expect(result.map((e) => e.id)).toContain('banco-central-2025')
  })

  it('matches accent-insensitively (policia matches Polícia)', () => {
    const result = filterBySearch('policia', mockExams)
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('pf-2025')
  })

  it('returns empty array when no exam matches', () => {
    expect(filterBySearch('xyz123nomatches', mockExams)).toHaveLength(0)
  })
})

describe('filterByStatus', () => {
  it('returns all exams when status is undefined', () => {
    expect(filterByStatus(undefined, mockExams)).toHaveLength(6)
  })

  it('filters by open status', () => {
    const result = filterByStatus('open', mockExams)
    expect(result.map((e) => e.id)).toEqual(['receita-federal-2025'])
  })

  it('filters by closed status', () => {
    const result = filterByStatus('closed', mockExams)
    expect(result.map((e) => e.id)).toContain('correios-2025')
    expect(result.map((e) => e.id)).toContain('inss-2025')
  })

  it('filters by upcoming status', () => {
    const result = filterByStatus('upcoming', mockExams)
    expect(result.map((e) => e.id)).toContain('trt-2025')
    expect(result.map((e) => e.id)).toContain('pf-2025')
    expect(result.map((e) => e.id)).toContain('banco-central-2025')
    expect(result.map((e) => e.id)).not.toContain('correios-2025')
    expect(result.map((e) => e.id)).not.toContain('receita-federal-2025')
  })
})

describe('filterBySalaryMin', () => {
  it('excludes exams with null salary', () => {
    const result = filterBySalaryMin(1, mockExams)
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
  })

  it('includes exams with salary above minimum', () => {
    const result = filterBySalaryMin(10000, mockExams)
    expect(result.map((e) => e.id)).toContain('trt-2025')
    expect(result.map((e) => e.id)).toContain('pf-2025')
  })

  it('excludes exams with salary below minimum', () => {
    const result = filterBySalaryMin(10000, mockExams)
    expect(result.map((e) => e.id)).not.toContain('correios-2025')
  })
})

describe('filterBySalaryMax', () => {
  it('excludes exams with null salary', () => {
    const result = filterBySalaryMax(100000, mockExams)
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
  })

  it('includes exams with salary below maximum', () => {
    const result = filterBySalaryMax(5000, mockExams)
    expect(result.map((e) => e.id)).toContain('correios-2025')
  })

  it('excludes exams with salary above maximum', () => {
    const result = filterBySalaryMax(5000, mockExams)
    expect(result.map((e) => e.id)).not.toContain('pf-2025')
  })
})

describe('filterByRegion', () => {
  it('returns only Southeast exams', () => {
    const result = filterByRegion('Southeast', mockExams)
    expect(result).toHaveLength(2)
    expect(result.map((e) => e.id)).toContain('trt-2025')
    expect(result.map((e) => e.id)).toContain('correios-2025')
  })

  it('returns only Central-West exams', () => {
    const result = filterByRegion('Central-West', mockExams)
    expect(result).toHaveLength(4)
  })

  it('returns empty array for region with no exams', () => {
    expect(filterByRegion('North', mockExams)).toHaveLength(0)
  })
})

describe('filterByState', () => {
  it('returns only SP exams', () => {
    const result = filterByState('SP', mockExams)
    expect(result).toHaveLength(2)
    expect(result.map((e) => e.state)).toEqual(['SP', 'SP'])
  })

  it('returns only DF exams', () => {
    const result = filterByState('DF', mockExams)
    expect(result).toHaveLength(4)
  })

  it('returns empty array for state with no exams', () => {
    expect(filterByState('AM', mockExams)).toHaveLength(0)
  })
})

describe('filterByCity', () => {
  it('returns only Brasília exams', () => {
    const result = filterByCity('Brasília', mockExams)
    expect(result).toHaveLength(4)
    result.forEach((e) => expect(e.city).toBe('Brasília'))
  })

  it('returns only São Paulo exams', () => {
    const result = filterByCity('São Paulo', mockExams)
    expect(result).toHaveLength(2)
    result.forEach((e) => expect(e.city).toBe('São Paulo'))
  })
})

// SALARY_MAX for tests: highest salary in mockExams is PF at 23692 → rounded to 25000
const TEST_SALARY_MAX = 25000

function makeFilters(overrides: Partial<FilterState> = {}): FilterState {
  return {
    search: '',
    status: undefined,
    examiningBoard: undefined,
    salaryMin: 0,
    salaryMax: TEST_SALARY_MAX,
    region: undefined,
    state: undefined,
    city: undefined,
    sort: 'recent',
    ...overrides,
  }
}

describe('applyFilters', () => {
  it('returns all exams when slider is at full range (no filters active)', () => {
    expect(applyFilters(makeFilters(), mockExams, TEST_SALARY_MAX)).toHaveLength(6)
  })

  it('includes null-salary exams when slider is at full range', () => {
    const result = applyFilters(makeFilters(), mockExams, TEST_SALARY_MAX)
    expect(result.map((e) => e.id)).toContain('inss-2025')
  })

  it('excludes null-salary exams when lower slider handle is moved', () => {
    const result = applyFilters(makeFilters({ salaryMin: 1 }), mockExams, TEST_SALARY_MAX)
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
  })

  it('excludes null-salary exams when upper slider handle is moved', () => {
    const result = applyFilters(
      makeFilters({ salaryMax: TEST_SALARY_MAX - 1 }),
      mockExams,
      TEST_SALARY_MAX,
    )
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
  })

  it('filters by salary lower bound (lower handle at 10000)', () => {
    const result = applyFilters(makeFilters({ salaryMin: 10000 }), mockExams, TEST_SALARY_MAX)
    expect(result.map((e) => e.id)).not.toContain('correios-2025')
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
    expect(result.map((e) => e.id)).toContain('trt-2025')
    expect(result.map((e) => e.id)).toContain('pf-2025')
  })

  it('filters by salary upper bound (upper handle below PF salary)', () => {
    const result = applyFilters(makeFilters({ salaryMax: 20000 }), mockExams, TEST_SALARY_MAX)
    expect(result.map((e) => e.id)).not.toContain('pf-2025')
    expect(result.map((e) => e.id)).toContain('trt-2025')
  })

  it('applies search and status together (AND logic)', () => {
    const result = applyFilters(
      makeFilters({ search: 'federal', status: 'upcoming' }),
      mockExams,
      TEST_SALARY_MAX,
    )
    // "federal" matches PF (upcoming) and Receita (open) → only PF passes both
    expect(result.map((e) => e.id)).toContain('pf-2025')
    expect(result.map((e) => e.id)).not.toContain('receita-federal-2025')
  })

  it('applies salary slider and region together', () => {
    const result = applyFilters(
      makeFilters({ salaryMin: 10000, region: 'Central-West' }),
      mockExams,
      TEST_SALARY_MAX,
    )
    // Central-West: PF (23692✓), Receita (21029✓), INSS (null→excluded), BCB (20924✓)
    expect(result.map((e) => e.id)).not.toContain('inss-2025')
    expect(result.map((e) => e.id)).not.toContain('correios-2025')
    expect(result.map((e) => e.id)).toContain('pf-2025')
  })

  it('state takes precedence over region when both are set', () => {
    const result = applyFilters(
      makeFilters({ region: 'Central-West', state: 'DF' }),
      mockExams,
      TEST_SALARY_MAX,
    )
    result.forEach((e) => expect(e.state).toBe('DF'))
  })
})
