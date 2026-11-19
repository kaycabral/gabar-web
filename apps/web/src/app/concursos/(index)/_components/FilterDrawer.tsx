'use client'

import { makeDefaultFilters } from '@/app/concursos/(index)/_hooks/useFilters'
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { REGION_LABELS, STATUS_LABELS } from '@/lib/constants'
import type { FilterState } from '@/lib/filters'
import { formatSalary } from '@/lib/salary'
import type { BrazilianRegion, ExamStatus } from '@gabar/shared'
import { BRAZIL_REGIONS } from '@gabar/shared'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  cities: string[]
  examiningBoards: string[]
  salaryMax: number
  resultCount: number
}

const ALL_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

const REGIONS = Object.keys(BRAZIL_REGIONS) as BrazilianRegion[]
const STATUS_ORDER: ExamStatus[] = ['open', 'upcoming', 'closed']

const labelCls = 'text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase'

interface FieldSelectProps {
  id: string
  label: string
  value: string | undefined
  onChange: (value: string | undefined) => void
  placeholder: string
  options: { value: string; label: string }[]
}

function FieldSelect({ id, label, value, onChange, placeholder, options }: FieldSelectProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <SelectRoot
        value={value ?? '_none'}
        onValueChange={(val) => onChange(val === '_none' ? undefined : val)}
      >
        <SelectTrigger
          id={id}
          className="bg-card border-border h-auto w-full min-w-0 rounded-xl px-4 py-3.5 text-[14px] font-medium"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_none">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  )
}

export default function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  cities,
  examiningBoards,
  salaryMax,
  resultCount,
}: FilterDrawerProps) {
  // Draft state: filters are only committed on "Aplicar"
  const [draft, setDraft] = useState<FilterState>(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  const salaryActive = draft.salaryMin > 0 || draft.salaryMax < salaryMax
  const hasActive =
    draft.status !== undefined ||
    draft.examiningBoard !== undefined ||
    salaryActive ||
    draft.region !== undefined ||
    draft.state !== undefined ||
    draft.city !== undefined

  function apply() {
    onFiltersChange(draft)
    onOpenChange(false)
  }

  function reset() {
    setDraft({
      ...makeDefaultFilters(salaryMax),
      search: draft.search,
      sort: draft.sort,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-background border-border flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[440px]"
      >
        <div className="flex-1 overflow-y-auto px-6 pt-7 pb-6 sm:px-9 sm:pt-9">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-accent-brand h-px w-6 shrink-0" aria-hidden />
                <span className="text-accent-brand text-[11px] font-semibold tracking-[0.14em] uppercase">
                  Refinar busca
                </span>
              </div>
              <SheetTitle className="font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
                Filtros
              </SheetTitle>
              <SheetDescription className="sr-only">
                Filtrar concursos por banca, status, remuneração, região, estado e cidade.
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar filtros"
              className="bg-card border-border hover:border-foreground/30 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-7">
            <FieldSelect
              id="board"
              label="Banca organizadora"
              value={draft.examiningBoard}
              onChange={(val) => setDraft((d) => ({ ...d, examiningBoard: val }))}
              placeholder="Todas as bancas"
              options={examiningBoards.map((b) => ({ value: b, label: b }))}
            />

            {/* Segmented status */}
            <div className="flex flex-col gap-2.5">
              <span className={labelCls}>Status</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((s) => {
                  const active = draft.status === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, status: active ? undefined : s }))}
                      aria-pressed={active}
                      className={`rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'bg-card border-border text-foreground hover:border-foreground/30 border'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Salary */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span id="salary-range-label" className={labelCls}>
                  Remuneração
                </span>
                <span
                  className="text-foreground text-[13px] font-medium tabular-nums"
                  aria-live="polite"
                >
                  {formatSalary(draft.salaryMin)} – {formatSalary(draft.salaryMax)}
                </span>
              </div>
              <Slider
                aria-labelledby="salary-range-label"
                min={0}
                max={salaryMax}
                step={500}
                value={[draft.salaryMin, draft.salaryMax]}
                onValueChange={(v) => {
                  const [min, max] = v as [number, number]
                  setDraft((d) => ({ ...d, salaryMin: min, salaryMax: max }))
                }}
              />
            </div>

            {/* Region + State */}
            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                id="region"
                label="Região"
                value={draft.region}
                onChange={(val) =>
                  setDraft((d) => ({ ...d, region: val as BrazilianRegion | undefined }))
                }
                placeholder="Todas"
                options={REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] }))}
              />
              <FieldSelect
                id="state"
                label="Estado"
                value={draft.state}
                onChange={(val) => setDraft((d) => ({ ...d, state: val }))}
                placeholder="Todos"
                options={ALL_STATES.map((s) => ({ value: s, label: s }))}
              />
            </div>

            <FieldSelect
              id="city"
              label="Cidade"
              value={draft.city}
              onChange={(val) => setDraft((d) => ({ ...d, city: val }))}
              placeholder="Todas as cidades"
              options={cities.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-border bg-background flex flex-col gap-2 border-t px-6 py-5 sm:px-9 sm:py-6">
          <button
            type="button"
            onClick={apply}
            className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-[14px] font-medium transition-[filter] hover:brightness-110"
          >
            Aplicar · {resultCount.toLocaleString('pt-BR')} concursos
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!hasActive}
            className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center py-2 text-[14px] underline underline-offset-[3px] transition-colors disabled:opacity-40"
          >
            Redefinir filtros
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
