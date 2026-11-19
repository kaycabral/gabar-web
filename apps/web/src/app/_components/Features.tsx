import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'
import { FeatureRow } from '@/components/landing/FeatureRow'

type FeatureStatus = 'available' | 'soon'

interface Feature {
  n: string
  title: string
  description: string
  tags: string[]
  status: FeatureStatus
  href?: string
}

const features: Feature[] = [
  {
    n: 'N.01',
    title: 'Radar de concursos',
    description:
      'Todos os editais abertos no país — com vagas, salários, datas e nível de concorrência — em uma interface única.',
    tags: ['+ 12.430 editais', 'Atualização diária'],
    status: 'available',
    href: '/concursos/categorias',
  },
  {
    n: 'N.02',
    title: 'Match de perfil',
    description:
      'Responda três perguntas sobre seu perfil. A IA devolve os concursos com maior chance de aprovação pra você, ordenados por match.',
    tags: ['Score 0 – 100', 'Explicação por eixo'],
    status: 'soon',
  },
  {
    n: 'N.03',
    title: 'Plano de estudo vivo',
    description:
      'Cronograma baseado no edital, no tempo disponível e no que você já sabe. Se atrasar, o plano se adapta — sem culpa.',
    tags: ['Replaneja sozinho', 'Integra com calendário'],
    status: 'soon',
  },
  {
    n: 'N.04',
    title: 'Mapa de conhecimento',
    description:
      'Visualize matéria por matéria onde você está forte e onde precisa reforçar. Cada questão respondida alimenta o mapa.',
    tags: ['Heatmap por tema', 'Sem autoengano'],
    status: 'soon',
  },
  {
    n: 'N.05',
    title: 'Questões e simulados',
    description:
      'Banco filtrado por banca, disciplina e assunto. Simulados que replicam a prova real com correção instantânea.',
    tags: ['+ 280 mil questões', 'Correção com IA'],
    status: 'soon',
  },
  {
    n: 'N.06',
    title: 'Análise de banca',
    description:
      'Descubra quais assuntos cada banca mais cobra, quais padrões se repetem e onde estão os pontos mais reviravoltas da prova.',
    tags: ['Por banca · 20 anos', 'Tendências por edital'],
    status: 'soon',
  },
  {
    n: 'N.07',
    title: 'Central de notícias',
    description:
      'Atualizações em tempo real sobre editais, retificações, suspensões e novidades do mundo dos concursos — filtradas pelo seu perfil.',
    tags: ['Sem ruído', 'Push opcional'],
    status: 'soon',
  },
]

export function Features() {
  return (
    <PageSection id="produto" tone="sand" divide className="scroll-mt-20">
      <SectionHeader label="Funcionalidades" meta="Sete ferramentas · um lugar" />

      <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2 className="text-display text-foreground max-w-4xl">
          Tudo que você precisa. Nada além.
        </h2>
        <p className="text-muted-foreground max-w-sm pb-3 text-[1.0625rem] leading-relaxed">
          Sete ferramentas integradas que substituem dez abas, três planilhas e um grupo de
          WhatsApp.
        </p>
      </div>

      <ul className="border-border mt-20 flex flex-col border-t">
        {features.map((feat, i) => (
          <FeatureRow
            key={feat.n}
            index={feat.n}
            title={feat.title}
            description={feat.description}
            tags={feat.tags}
            status={feat.status}
            href={feat.href}
            className={i === features.length - 1 ? 'border-b' : ''}
          />
        ))}
      </ul>
    </PageSection>
  )
}
