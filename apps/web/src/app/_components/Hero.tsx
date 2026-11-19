import { PillButton } from '@/components/PillButton'
import { StatPair } from '@/components/landing/StatPair'
import type { LandingStats } from '@/lib/exams-api'

interface HeroProps {
  onOpenWaitlist: () => void
  stats: LandingStats
}

export function Hero({ onOpenWaitlist, stats }: HeroProps) {
  const statRows = [
    { value: stats.totalExams.toLocaleString('pt-BR'), label: 'Editais monitorados' },
    { value: stats.activeExams.toLocaleString('pt-BR'), label: 'Concursos ativos' },
    { value: '94%', label: 'Match médio do usuário', accent: true },
    { value: '4,2h', label: 'Leitura poupada / semana' },
  ]

  return (
    <section className="bg-background text-foreground relative w-full px-6 pt-28 pb-16 sm:px-10 lg:px-14 lg:pt-32">
      <div className="flex flex-col items-stretch gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
        <h1 className="text-display-xl text-foreground flex-1">
          Passar
          <br />
          em concurso
          <br />é método.
        </h1>

        <aside className="flex max-w-sm flex-col gap-10 pt-2 lg:w-[22rem] lg:pt-8">
          <p className="text-lede text-foreground">
            A aprovação deixou de ser questão de esforço. Hoje é um problema de informação, método e
            disciplina — e é exatamente nisso que a IA entra.
          </p>

          <div className="flex flex-col gap-2.5">
            <PillButton type="button" onClick={onOpenWaitlist}>
              Entrar na lista de espera
            </PillButton>
            <span className="text-meta text-muted-foreground pl-1">Acesso antecipado</span>
          </div>
        </aside>
      </div>

      <dl className="border-border mt-16 grid grid-cols-2 gap-x-4 gap-y-8 border-t pt-10 md:grid-cols-4 md:gap-x-8">
        {statRows.map((stat) => (
          <StatPair key={stat.label} value={stat.value} label={stat.label} accent={stat.accent} />
        ))}
      </dl>
    </section>
  )
}
