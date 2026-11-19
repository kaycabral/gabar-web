import { STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Exam, ExamStatus } from '@gabar/shared'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface CardProps {
  exam: Exam
  from?: string
  linked?: boolean
}

const statusToneClass: Record<ExamStatus, string> = {
  open: 'bg-[oklch(0.92_0.07_145)] text-[oklch(0.32_0.12_145)]',
  upcoming: 'bg-[oklch(0.92_0.08_75)] text-[oklch(0.36_0.13_75)]',
  ongoing: 'bg-[oklch(0.92_0.05_235)] text-[oklch(0.34_0.1_235)]',
  closed: 'bg-[oklch(0.92_0.005_85)] text-[oklch(0.42_0.005_85)]',
}

const statusDotClass: Record<ExamStatus, string> = {
  open: 'bg-[oklch(0.55_0.16_145)]',
  upcoming: 'bg-[oklch(0.62_0.15_75)]',
  ongoing: 'bg-[oklch(0.6_0.13_235)]',
  closed: 'bg-[oklch(0.55_0.005_85)]',
}

function formatVacancies(value: number | null | undefined): string {
  if (value == null) return '–'
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace('.', ',').replace(',0', '')}k`
  return value.toLocaleString('pt-BR')
}

function formatPriceFromSalaries(positions: Exam['positions']): string {
  const salaries = (positions ?? [])
    .map((p) => p.salary)
    .filter((s): s is number => s !== null && s > 0)
  if (salaries.length === 0) return '–'
  const max = Math.max(...salaries)
  return `R$ ${Math.round(max).toLocaleString('pt-BR')}`
}

function formatSubtitle(exam: Exam): string {
  const singlePosition = exam.positions?.length === 1 ? (exam.positions[0]?.title ?? null) : null
  const hasMultiple = exam.positions != null && exam.positions.length > 1
  const cargo = singlePosition ?? (hasMultiple ? 'Vários cargos' : null)
  const place = exam.city ?? exam.state
  return [cargo, place].filter(Boolean).join(' · ')
}

export default function Card({ exam, from, linked = true }: CardProps) {
  const href = from
    ? `/concursos/${exam.slug}?from=${encodeURIComponent(from)}`
    : `/concursos/${exam.slug}`
  const status = exam.status
  const vacancies = formatVacancies(exam.vacancies)
  const price = formatPriceFromSalaries(exam.positions)
  const subtitle = formatSubtitle(exam)

  const inner = (
    <article
      className={cn(
        'group bg-card border-border ring-foreground/5 hover:border-foreground/15 hover:shadow-(--lift-sm)',
        'relative flex h-full w-full flex-col gap-7 rounded-2xl border p-6 sm:p-7',
        'transition-[box-shadow,border-color,transform] duration-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {status ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
              'font-mono text-[11px] tracking-[0.04em] uppercase',
              statusToneClass[status],
            )}
          >
            <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', statusDotClass[status])} />
            {STATUS_LABELS[status]}
          </span>
        ) : (
          <span />
        )}
        <span className="text-accent-brand font-mono text-[11px] tracking-[0.14em] uppercase">
          {exam.examiningBoard}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h2
          className="font-display line-clamp-2 text-xl leading-[1.15] font-bold tracking-[-0.02em] sm:text-[24px]"
          title={exam.name}
        >
          {exam.name}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug" title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="border-border flex items-end justify-between gap-3 border-t pt-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground font-mono text-[11px] tracking-[0.08em] uppercase">
            {vacancies === '–' ? 'Vagas a confirmar' : `${vacancies} vagas`}
          </span>
          <span className="font-display text-foreground text-lg font-bold tracking-[-0.015em] sm:text-xl">
            {price}
          </span>
        </div>
        <span
          aria-hidden
          className={cn(
            'bg-foreground text-background flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            'transition-transform group-hover:scale-105',
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  )

  if (linked) {
    return (
      <Link
        href={href}
        aria-label={`${exam.name} – ver detalhes`}
        className="focus-visible:ring-ring block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {inner}
      </Link>
    )
  }
  return inner
}
