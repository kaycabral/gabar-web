'use client'

import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faq = [
  {
    q: 'O Gabar substitui o cursinho?',
    a: 'Não substitui — complementa. O Gabar organiza seu estudo, identifica pontos fracos e adapta o plano continuamente. O cursinho dá a base; o Gabar garante que você estude o que importa.',
  },
  {
    q: 'A IA de match realmente funciona?',
    a: 'Sim. O Match analisa seu histórico, disponibilidade, região e perfil de cargo para identificar os concursos com maior probabilidade de aprovação pra você especificamente.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você pode sair da lista a qualquer momento. No lançamento, teremos um período gratuito para você conhecer antes de qualquer compromisso.',
  },
  {
    q: 'Quando o Gabar vai lançar?',
    a: 'Estamos em desenvolvimento. Quem entrar na lista de espera será avisado primeiro e terá acesso ao beta com condições especiais.',
  },
  {
    q: 'Para quais concursos funciona?',
    a: 'O radar cobre concursos federais, estaduais e municipais em todo o Brasil. O Match prioriza os que têm maior aderência ao seu perfil.',
  },
  {
    q: 'Preciso ter experiência com tecnologia?',
    a: 'Não. O Gabar foi pensado para quem quer focar no estudo, não em configurar ferramentas. A plataforma guia você do início ao fim.',
  },
  {
    q: 'Como o Gabar sabe o que eu já sei?',
    a: 'Através de um diagnóstico inicial e da análise contínua das suas respostas. Quanto mais você usa, mais preciso fica o mapa de conhecimento.',
  },
]

export function FAQ() {
  return (
    <PageSection id="faq" tone="sand" divide className="scroll-mt-20">
      <SectionHeader label="Dúvidas frequentes" meta="7 perguntas" />

      <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
        <h2 className="text-h1 text-foreground max-w-lg lg:w-[30rem] lg:flex-shrink-0">
          Tudo o que você precisa saber.
        </h2>
        <div className="border-foreground flex-1 border-t">
          <Accordion type="single" collapsible defaultValue="q-0">
            {faq.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`q-${i}`}
                className="border-border border-b last:border-b-0"
              >
                <AccordionTrigger className="text-foreground font-display py-7 text-left text-[1.25rem] font-semibold tracking-[-0.02em] hover:no-underline md:text-[1.375rem]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground max-w-2xl pb-6 text-[1rem] leading-[1.7]">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PageSection>
  )
}
