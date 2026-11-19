'use client'

import type { ExamSort, FilterState } from '@/lib/filters'
import { DEFAULT_SORT } from '@/lib/filters'
import type { BrazilianRegion, Exam, ExamStatus } from '@gabar/shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const VALID_SORTS: readonly ExamSort[] = ['recent', 'salary', 'deadline'] as const

function parseSort(raw: string | null): ExamSort {
  if (raw && (VALID_SORTS as readonly string[]).includes(raw)) return raw as ExamSort
  return DEFAULT_SORT
}

export function makeDefaultFilters(salaryMax: number): FilterState {
  return {
    search: '',
    status: undefined,
    examiningBoard: undefined,
    salaryMin: 0,
    salaryMax,
    region: undefined,
    state: undefined,
    city: undefined,
    sort: DEFAULT_SORT,
  }
}

export function parseFiltersFromParams(params: URLSearchParams, salaryMax: number): FilterState {
  return {
    search: params.get('q') ?? '',
    status: (params.get('status') as ExamStatus) ?? undefined,
    examiningBoard: params.get('board') ?? undefined,
    salaryMin: Number(params.get('salaryMin') ?? 0),
    salaryMax: Number(params.get('salaryMax') ?? salaryMax) || salaryMax,
    region: (params.get('region') as BrazilianRegion) ?? undefined,
    state: params.get('state') ?? undefined,
    city: params.get('city') ?? undefined,
    sort: parseSort(params.get('sort')),
  }
}

export function filtersToParams(filters: FilterState, salaryMax: number): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.search) p.set('q', filters.search)
  if (filters.status) p.set('status', filters.status)
  if (filters.examiningBoard) p.set('board', filters.examiningBoard)
  if (filters.salaryMin > 0) p.set('salaryMin', String(filters.salaryMin))
  if (filters.salaryMax < salaryMax) p.set('salaryMax', String(filters.salaryMax))
  if (filters.region) p.set('region', filters.region)
  if (filters.state) p.set('state', filters.state)
  if (filters.city) p.set('city', filters.city)
  if (filters.sort !== DEFAULT_SORT) p.set('sort', filters.sort)
  return p
}

export function useFilters(exams: Exam[], salaryMax: number) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filters = parseFiltersFromParams(searchParams, salaryMax)

  const salaryActive = filters.salaryMin > 0 || filters.salaryMax < salaryMax
  const panelActiveCount =
    (filters.status !== undefined ? 1 : 0) +
    (filters.examiningBoard !== undefined ? 1 : 0) +
    (salaryActive ? 1 : 0) +
    (filters.region !== undefined ? 1 : 0) +
    (filters.state !== undefined ? 1 : 0) +
    (filters.city !== undefined ? 1 : 0)
  const hasActiveFilters = filters.search !== '' || panelActiveCount > 0

  const filteredExams = exams

  function navigate(params: URLSearchParams) {
    const qs = params.toString()
    router.push(qs ? `/concursos?${qs}` : '/concursos')
  }

  function setFilters(next: FilterState | ((prev: FilterState) => FilterState)) {
    const nextFilters = typeof next === 'function' ? next(filters) : next
    navigate(filtersToParams(nextFilters, salaryMax))
  }

  function setPage(page: number) {
    const params = filtersToParams(filters, salaryMax)
    if (page > 1) params.set('page', String(page))
    navigate(params)
  }

  function handleReset() {
    router.push('/concursos')
  }

  type ClearableKey = 'status' | 'examiningBoard' | 'region' | 'state' | 'city' | 'salary'
  function clearFilter(key: ClearableKey) {
    if (key === 'salary') {
      setFilters({ ...filters, salaryMin: 0, salaryMax })
    } else {
      setFilters({ ...filters, [key]: undefined })
    }
  }

  return {
    filters,
    setFilters,
    drawerOpen,
    setDrawerOpen,
    salaryMax,
    hasActiveFilters,
    panelActiveCount,
    filteredExams,
    setPage,
    handleReset,
    clearFilter,
  }
}
