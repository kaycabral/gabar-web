import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'

const steps = [
  {
    n: '01',
    eta: '5 min',
    title: 'Escolha seu concurso',
    description:
      'Navegue pelo radar, filtre pelo que importa e veja quais editais se encaixam no seu perfil.',
  },
  {
    n: '02',
    eta: '2 min',
    title: 'Receba o plano',
    description:
      'A IA monta um cronograma realista com base no edital, no seu tempo e no que já sabe.',
  },
  {
    n: '03',
    eta: 'diário',
    title: 'Estude e pratique',
    description:
      'Siga o plano, resolva questões e simulados. O sistema aprende com o que você acerta e erra.',
  },
  {
    n: '04',
    eta: 'contínuo',
    title: 'Acompanhe e ajuste',
    description:
      'Dashboards mostram evolução, pontos fracos e previsão de desempenho. Nada de achismo.',
  },
]

export function HowItWorks() {
  return (
    <PageSection id="metodo" tone="ink" size="tall" className="scroll-mt-20">
      <SectionHeader label="Método" meta="04 passos · ritmo diário" tone="dark" />

      <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2 className="text-display text-background max-w-4xl">
          Você foca no estudo. A IA cuida do resto.
        </h2>
        <p className="text-background/60 max-w-sm pb-3 text-[1.0625rem] leading-relaxed">
          O Gabar organiza a parte logística para você dedicar o tempo ao que importa: estudar de
          verdade.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 border-t border-white/10 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className={
              'flex flex-col gap-6 py-10 ' +
              (i < steps.length - 1 ? 'lg:border-r lg:border-white/10 ' : '') +
              (i > 0 ? 'lg:pl-8 ' : '') +
              (i < 3 ? 'lg:pr-8' : '')
            }
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-accent-brand text-[3.5rem] leading-none font-extrabold tracking-[-0.035em] md:text-[4rem]">
                {step.n}
              </span>
              <span className="text-meta text-background/55">{step.eta}</span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-background font-display text-[1.5rem] leading-[1.15] font-bold tracking-[-0.02em] md:text-[1.625rem]">
                {step.title}
              </h3>
              <p className="text-background/65 text-[0.9375rem] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  )
}
