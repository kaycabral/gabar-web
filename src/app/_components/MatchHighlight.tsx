import { PageSection } from '@/components/PageSection'
import { PillButton } from '@/components/PillButton'
import { SectionHeader } from '@/components/SectionHeader'

interface MatchHighlightProps {
  onOpenWaitlist: () => void
}

const matches = [
  { name: 'TRT 10ª Região', role: 'Técnico · CESPE', score: 94, tone: 'high' as const },
  { name: 'INSS', role: 'Analista · CESGRANRIO', score: 87, tone: 'high' as const },
  { name: 'Receita Federal', role: 'Auditor · ESAF', score: 78, tone: 'high' as const },
  { name: 'PF — Escrivão', role: 'Nível superior · Cebraspe', score: 71, tone: 'mid' as const },
  { name: 'TJ-SP — Juiz', role: 'Nível superior · Vunesp', score: 43, tone: 'low' as const },
]

const barColor = {
  high: 'bg-accent-brand',
  mid: 'bg-[#C49340]',
  low: 'bg-[#A87B30]',
} as const

export function MatchHighlight({ onOpenWaitlist }: MatchHighlightProps) {
  return (
    <PageSection id="match" tone="accent" size="tall" className="overflow-clip">
      <SectionHeader label="Exclusivo" meta="Só no Gabar" tone="accent" />

      <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex flex-1 flex-col gap-10">
          <h2 className="text-display text-foreground max-w-xl">
            Não sabe em qual concurso apostar?
          </h2>
          <p className="text-foreground max-w-lg text-[1.25rem] leading-relaxed tracking-[-0.01em]">
            A IA lê seu perfil e devolve uma lista ordenada com os concursos onde você tem maior
            chance real de aprovação. Sem achismo.
          </p>
          <PillButton type="button" onClick={onOpenWaitlist} className="w-fit">
            Descobrir meu match
          </PillButton>
        </div>

        <aside className="bg-background text-foreground w-full max-w-md flex-shrink-0 rounded-lg p-8 shadow-[var(--lift-md)] lg:w-[30rem]">
          <div className="border-border flex items-center justify-between border-b pb-5">
            <span className="text-meta text-muted-foreground">Seu match</span>
            <span className="text-meta text-muted-foreground">Atualizado agora</span>
          </div>
          <ul className="mt-6 flex flex-col gap-5">
            {matches.map((m, i) => (
              <li
                key={m.name}
                className={
                  'flex flex-col gap-2 md:flex-row md:items-center md:gap-4 ' +
                  (i < matches.length - 1 ? 'border-muted border-b pb-4' : '')
                }
              >
                <div className="flex items-center justify-between gap-4 md:contents">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-foreground text-[0.9375rem] font-semibold">{m.name}</span>
                    <span className="text-meta text-muted-foreground">{m.role}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={
                        'font-display text-[2rem] leading-none font-extrabold tracking-[-0.02em] ' +
                        (m.tone === 'low' ? 'text-muted-foreground' : 'text-foreground')
                      }
                    >
                      {m.score}
                    </span>
                    <span className="text-meta text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="bg-muted h-1 w-full shrink-0 rounded-full md:w-24">
                  <div
                    className={'h-full rounded-full ' + barColor[m.tone]}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageSection>
  )
}
