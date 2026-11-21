'use client'

import { PageContainer } from '@/components/PageContainer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (page > 3) pages.push('...')
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (page < totalPages - 2) pages.push('...')
  pages.push(totalPages)
  return pages
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  function go(p: number) {
    if (p < 1 || p > totalPages || p === page) return
    onPageChange(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = totalPages > 1 ? getPageNumbers(page, totalPages) : []
  const btnBase =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl text-[14px] transition-colors'
  const btnIdle = 'bg-card border-border hover:border-foreground/30 border text-foreground'
  const btnActive = 'bg-primary text-primary-foreground'
  const btnDisabled = 'bg-card/50 border-border text-muted-foreground/50 border cursor-not-allowed'

  return (
    <PageContainer className="flex flex-col-reverse items-center justify-between gap-4 pt-8 pb-10 sm:flex-row sm:items-center sm:pt-12 sm:pb-16">
      <p className="text-muted-foreground text-[13px]">
        {total === 0
          ? 'Nenhum resultado'
          : `Mostrando ${rangeStart}–${rangeEnd} de ${total.toLocaleString('pt-BR')}`}
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Paginação">
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
            className={`${btnBase} ${page === 1 ? btnDisabled : btnIdle}`}
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className="text-muted-foreground inline-flex h-10 w-10 items-center justify-center text-sm select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => go(p)}
                aria-label={`Página ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={`${btnBase} ${p === page ? btnActive : btnIdle} ${p === page ? 'font-medium' : ''}`}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            aria-label="Próxima página"
            className={`${btnBase} ${page === totalPages ? btnDisabled : btnIdle}`}
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </nav>
      )}
    </PageContainer>
  )
}
