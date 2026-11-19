'use client'

import { PageContainer } from '@/components/PageContainer'
import { PageShell } from '@/components/PageShell'
import type { Exam } from '@gabar/shared'
import { useSearchParams } from 'next/navigation'
import { useFilters } from '../_hooks/useFilters'
import FilterDrawer from './FilterDrawer'
import Hero from './Hero'
import List from './List'
import Pagination from './Pagination'
import ResultsToolbar from './ResultsToolbar'

// Mirror of PAGE_SIZE in lib/exams-api.ts. Duplicated locally to avoid pulling
// Supabase-coupled module into this client shell.
const PAGE_SIZE = 12

interface ExamsShellProps {
  exams: Exam[]
  cities: string[]
  examiningBoards: string[]
  page: number
  totalPages: number
  total: number
  salaryMax: number
}

export default function ExamsShell({
  exams,
  cities,
  examiningBoards,
  page,
  totalPages,
  total,
  salaryMax,
}: ExamsShellProps) {
  const searchParams = useSearchParams()
  const listingSearch = searchParams.toString()

  const {
    filters,
    setFilters,
    drawerOpen,
    setDrawerOpen,
    hasActiveFilters,
    panelActiveCount,
    filteredExams,
    setPage,
    handleReset,
    clearFilter,
  } = useFilters(exams, salaryMax)

  return (
    <PageShell>
      <Hero
        search={filters.search}
        onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        onFilterOpen={() => setDrawerOpen(true)}
        activeFilterCount={panelActiveCount}
        total={total}
      />

      <ResultsToolbar
        total={total}
        filters={filters}
        salaryMax={salaryMax}
        hasActiveFilters={hasActiveFilters}
        onClearFilter={clearFilter}
        onClearAll={handleReset}
        onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
      />

      <PageContainer className="flex-1 pt-5 pb-4 sm:pt-10">
        <List
          exams={filteredExams}
          listingSearch={listingSearch}
          showReset={hasActiveFilters}
          onReset={handleReset}
        />
      </PageContainer>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <FilterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        filters={filters}
        onFiltersChange={setFilters}
        cities={cities}
        examiningBoards={examiningBoards}
        salaryMax={salaryMax}
        resultCount={total}
      />
    </PageShell>
  )
}
