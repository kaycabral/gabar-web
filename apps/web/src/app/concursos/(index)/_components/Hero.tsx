'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Eyebrow } from '@/components/Eyebrow'
import { PageContainer } from '@/components/PageContainer'
import { PageTitle } from '@/components/PageTitle'
import { Search, SlidersHorizontal } from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
  onFilterOpen: () => void
  activeFilterCount: number
  total: number
}

const Hero = forwardRef<HTMLInputElement, HeroProps>(function Hero(
  { search, onSearchChange, onFilterOpen, activeFilterCount, total },
  ref,
) {
  const [inputValue, setInputValue] = useState(search)
  const onSearchChangeRef = useRef(onSearchChange)
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange
  })

  useEffect(() => {
    setInputValue(search)
  }, [search])

  useEffect(() => {
    const t = setTimeout(() => {
      if (inputValue !== search) onSearchChangeRef.current(inputValue)
    }, 500)
    return () => clearTimeout(t)
  }, [inputValue, search])

  // ⌘K / Ctrl+K focus
  const localRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        localRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const setRef = (el: HTMLInputElement | null) => {
    localRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  return (
    <PageContainer as="header" className="pt-4 pb-6 sm:pt-10 sm:pb-8 md:pt-12">
      <div className="pt-2 pb-4 sm:pb-6">
        <Breadcrumbs items={[{ label: 'Concursos', href: '/' }, { label: 'Explorar' }]} />
      </div>

      <div className="flex max-w-[780px] flex-col gap-3.5 sm:gap-5">
        <Eyebrow>Explorar · Concursos</Eyebrow>
        <PageTitle>Todos os concursos, um único lugar.</PageTitle>
        <p className="text-muted-foreground max-w-[620px] text-[15px] leading-[1.5] sm:text-[17px] sm:leading-[1.6]">
          <span className="sm:hidden">
            Busque entre {total.toLocaleString('pt-BR')} concursos e filtre por banca, região, faixa
            salarial e status.
          </span>
          <span className="hidden sm:inline">
            Busque entre {total.toLocaleString('pt-BR')} concursos publicados e filtre por banca,
            região, faixa salarial e status. Atualizados automaticamente a cada retificação.
          </span>
        </p>
      </div>

      <div className="mt-6 flex items-stretch gap-2 sm:mt-10 sm:gap-3">
        <label htmlFor="exam-search" className="sr-only">
          Buscar concurso por nome ou cargo
        </label>
        <div className="bg-card border-border focus-within:border-foreground/30 focus-within:ring-foreground/10 flex min-w-0 flex-1 items-center gap-3 rounded-[14px] border px-4 transition-shadow focus-within:ring-4 sm:gap-3.5 sm:rounded-2xl sm:px-5">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden />
          <input
            id="exam-search"
            ref={setRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar por nome ou cargo..."
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent py-3.5 text-[15px] outline-none sm:py-[18px] sm:text-[16px]"
          />
          <kbd className="border-border text-muted-foreground hidden shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] tracking-wider sm:inline-flex">
            ⌘&nbsp;K
          </kbd>
        </div>
        <button
          type="button"
          onClick={onFilterOpen}
          aria-label={activeFilterCount > 0 ? `Filtros (${activeFilterCount} ativo(s))` : 'Filtros'}
          className="bg-primary text-primary-foreground relative inline-flex shrink-0 items-center gap-2 rounded-[14px] px-4 text-sm font-medium transition-[filter] hover:brightness-110 sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-[18px]"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-accent-brand text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </PageContainer>
  )
})

export default Hero
