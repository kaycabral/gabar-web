import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de uso',
  description: 'Termos de uso do Gabar.',
}

const LAST_UPDATED = '2026-05-07'
const CONTACT_EMAIL = 'contato@cbrl.dev'

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-10 lg:px-14">
      <h1 className="font-display text-foreground text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.028em]">
        Termos de uso
      </h1>
      <p className="text-muted-foreground mt-4 text-sm">Última atualização: {LAST_UPDATED}</p>

      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        <h2>1. Aceitação</h2>
        <p>Ao acessar o Gabar você concorda com estes termos. Se discordar, não use o serviço.</p>

        <h2>2. Sobre o serviço</h2>
        <p>
          Gabar é uma plataforma de busca de concursos públicos brasileiros. Os dados de editais,
          vagas, datas e conteúdo programático são informações públicas dos órgãos e bancas.
          Atualmente em fase pré-lançamento via lista de espera.
        </p>

        <h2>3. Uso da lista de espera</h2>
        <p>
          Ao entrar na lista, você nos autoriza a enviar atualizações sobre o lançamento do produto.
          Você pode sair a qualquer momento via{' '}
          <a href="/privacidade" className="text-foreground underline">
            política de privacidade
          </a>
          .
        </p>

        <h2>4. Conduta proibida</h2>
        <ul>
          <li>Tentar abusar da plataforma (scraping massivo, bypass de controles, injection);</li>
          <li>Inscrever na lista emails que não são seus.</li>
        </ul>

        <h2>5. Propriedade intelectual</h2>
        <p>
          O código, design e marca do Gabar são nossos. Conteúdo de editais e gabaritos é dos órgãos
          públicos / bancas — apenas indexamos.
        </p>

        <h2>6. Limitação de responsabilidade</h2>
        <p>
          Gabar agrega e organiza informação pública. Sempre verifique informações oficiais no site
          da banca antes de tomar decisões (data de prova, data de inscrição, edital vigente). Não
          somos responsáveis por divergência entre nosso índice e a fonte oficial.
        </p>

        <h2>7. Mudanças</h2>
        <p>Atualizações nestes termos são publicadas aqui com nova data de última atualização.</p>

        <h2>8. Foro e legislação</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. Foro da comarca de Manaus/AM, salvo
          quando lei do consumidor determinar foro do domicílio do consumidor.
        </p>

        <h2>9. Contato</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">
            {CONTACT_EMAIL}
          </a>
        </p>

        <h2>Histórico de versões</h2>
        <ul>
          <li>
            <strong>{LAST_UPDATED}</strong>: versão inicial.
          </li>
        </ul>
      </div>
    </main>
  )
}
