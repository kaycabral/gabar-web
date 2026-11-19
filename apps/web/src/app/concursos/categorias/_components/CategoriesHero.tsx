import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Eyebrow } from '@/components/Eyebrow'
import { PageTitle } from '@/components/PageTitle'
import type { CategoriesStats } from '@/lib/exams-api'
import { cn } from '@/lib/utils'
import { SyncIndicator } from './SyncIndicator'

interface CategoriesHeroProps {
  stats: CategoriesStats
  boardsCount: number
}

function formatVacancies(value: number): string {
  if (value >= 1000) {
    const k = (value / 1000).toFixed(1).replace('.', ',')
    return `${k.endsWith(',0') ? k.slice(0, -2) : k}k`
  }
  return value.toLocaleString('pt-BR')
}

interface StatCellProps {
  label: string
  value: string
  hint: string
  accent?: boolean
  className?: string
}

function StatCell({ label, value, hint, accent = false, className }: StatCellProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-2 px-6 py-8 sm:px-8 sm:py-9',
        accent ? 'bg-accent-brand text-accent-brand-foreground' : '',
        className,
      )}
    >
      <span
        className={cn(
          'font-mono text-[11px] tracking-[0.14em] uppercase',
          accent ? 'text-accent-brand-foreground/65' : 'text-background/55',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-bold tracking-[-0.025em]',
          accent ? 'text-accent-brand-foreground' : 'text-background',
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          'text-[13px] leading-snug',
          accent ? 'text-accent-brand-foreground/75' : 'text-background/55',
        )}
      >
        {hint}
      </span>
    </div>
  )
}

export function CategoriesHero({ stats, boardsCount }: CategoriesHeroProps) {
  return (
    <header className="flex flex-col">
      <div className="pt-2 pb-4 sm:pb-6">
        <Breadcrumbs
          items={[{ label: 'Concursos', href: '/concursos' }, { label: 'Categorias' }]}
        />
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <div className="flex max-w-[640px] flex-col gap-5">
          <Eyebrow>Explore o catálogo</Eyebrow>
          <PageTitle>Categorias.</PageTitle>
          <p className="text-muted-foreground max-w-[520px] text-base leading-relaxed sm:text-[17px]">
            Concursos organizados por região do Brasil e por banca examinadora. Comece pelo recorte
            que faz mais sentido para você — e encontre o certame certo sem se perder em filtros.
          </p>
        </div>

        <SyncIndicator lastSyncAt={stats.lastSyncAt} />
      </div>

      <dl className="bg-foreground mt-12 grid grid-cols-2 overflow-hidden rounded-2xl sm:mt-14 lg:grid-cols-4">
        <StatCell
          label="Regiões"
          value="5"
          hint="Norte ao Sul"
          className="border-background/10 border-r border-b lg:border-b-0"
        />
        <StatCell
          label="Bancas"
          value={boardsCount.toString()}
          hint="Principais e regionais"
          className="border-background/10 border-b lg:border-r lg:border-b-0"
        />
        <StatCell
          label="Concursos"
          value={stats.activeExams.toLocaleString('pt-BR')}
          hint="Abertos ou em breve"
          className="border-background/10 border-r lg:border-r"
        />
        <StatCell
          label="Vagas totais"
          value={formatVacancies(stats.totalVacancies)}
          hint="Editais publicados"
          accent
        />
      </dl>
    </header>
  )
}
