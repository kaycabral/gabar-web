'use client'

import { PageContainer } from '@/components/PageContainer'
import { REGION_LABELS, STATUS_LABELS } from '@/lib/constants'
import type { ExamSort, FilterState } from '@/lib/filters'
import { SORT_LABELS } from '@/lib/filters'
import { formatSalary } from '@/lib/salary'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@cbrl/design'
import { X } from 'lucide-react'

interface ResultsToolbarProps {
  total: number
  filters: FilterState
  salaryMax: number
  hasActiveFilters: boolean
  onClearFilter: (key: 'status' | 'examiningBoard' | 'region' | 'state' | 'city' | 'salary') => void
  onClearAll: () => void
  onSortChange: (sort: ExamSort) => void
}

interface Chip {
  key: 'status' | 'examiningBoard' | 'region' | 'state' | 'city' | 'salary'
  label: string
}

export default function ResultsToolbar({
  total,
  filters,
  salaryMax,
  hasActiveFilters,
  onClearFilter,
  onClearAll,
  onSortChange,
}: ResultsToolbarProps) {
  const chips: Chip[] = []
  if (filters.examiningBoard) chips.push({ key: 'examiningBoard', label: filters.examiningBoard })
  if (filters.status) chips.push({ key: 'status', label: STATUS_LABELS[filters.status] })
  if (filters.region) chips.push({ key: 'region', label: REGION_LABELS[filters.region] })
  if (filters.state) chips.push({ key: 'state', label: filters.state })
  if (filters.city) chips.push({ key: 'city', label: filters.city })
  const salaryActive = filters.salaryMin > 0 || filters.salaryMax < salaryMax
  if (salaryActive) {
    const label =
      filters.salaryMax < salaryMax
        ? `${formatSalary(filters.salaryMin)} – ${formatSalary(filters.salaryMax)}`
        : `${formatSalary(filters.salaryMin)}+`
    chips.push({ key: 'salary', label })
  }

  const chipsRow = (
    <>
      {chips.length > 0 && (
        <span className="text-muted-foreground shrink-0 text-[10.5px] font-medium tracking-[0.14em] uppercase sm:text-[11px]">
          Filtros ativos
        </span>
      )}
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onClearFilter(chip.key)}
          className="group bg-card border-border text-foreground hover:border-foreground/30 inline-flex shrink-0 items-center gap-2 rounded-full border py-1.5 pr-2 pl-3 text-[13px] font-medium transition-colors"
          aria-label={`Remover filtro ${chip.label}`}
        >
          {chip.label}
          <X
            className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors"
            strokeWidth={2.5}
            aria-hidden
          />
        </button>
      ))}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground shrink-0 text-[13px] underline underline-offset-[3px] transition-colors"
        >
          Limpar
        </button>
      )}
    </>
  )

  const sortSelect = (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground hidden shrink-0 text-[13px] md:inline">
        Ordenar por
      </span>
      <Select value={filters.sort} onValueChange={(v) => onSortChange(v as ExamSort)}>
        <SelectTrigger
          className="bg-card border-border dark:bg-card hover:bg-muted dark:hover:bg-muted gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium shadow-none data-[size=default]:h-auto sm:text-[13px]"
          aria-label="Ordenar por"
        >
          <SelectValue>{SORT_LABELS[filters.sort]}</SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {(Object.entries(SORT_LABELS) as [ExamSort, string][]).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <PageContainer className="border-border border-b pt-2 pb-4 sm:pb-5">
      <div className="flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground font-display text-xl leading-none font-bold tracking-tight tabular-nums">
            {total.toLocaleString('pt-BR')}
          </span>
          <span className="text-muted-foreground text-[13px] sm:text-sm">
            <span className="sm:hidden">concursos</span>
            <span className="hidden sm:inline">concursos encontrados</span>
          </span>
        </div>

        <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-2 md:flex">
          {chipsRow}
        </div>

        {sortSelect}
      </div>

      {chips.length > 0 && (
        <div className="-mx-6 mt-3 flex scrollbar-none items-center gap-2 overflow-x-auto px-6 sm:-mx-10 sm:px-10 md:hidden">
          {chipsRow}
        </div>
      )}
    </PageContainer>
  )
}
