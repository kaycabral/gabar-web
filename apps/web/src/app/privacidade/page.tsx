import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacidade',
  description: 'Política de privacidade do Gabar.',
}

const LAST_UPDATED = '2026-05-07'
const CONTACT_EMAIL = 'privacidade@cbrl.dev'

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-10 lg:px-14">
      <h1 className="font-display text-foreground text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.028em]">
        Política de privacidade
      </h1>
      <p className="text-muted-foreground mt-4 text-sm">Última atualização: {LAST_UPDATED}</p>

      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        <p>
          Esta política descreve como o Gabar coleta, usa e protege seus dados pessoais. Adotamos
          como princípio a postura rigorosa em relação à LGPD (Lei 13.709/2018) — segurança e
          minimização de dados são pilares do produto desde o dia 1.
        </p>

        <h2>Quais dados coletamos</h2>
        <p>Hoje o Gabar coleta apenas:</p>
        <ul>
          <li>
            <strong>E-mail</strong>, quando você entra na lista de espera. Base legal: consentimento
            (LGPD Art. 7º, I).
          </li>
        </ul>
        <p>
          Não coletamos CPF, telefone, endereço ou qualquer outro dado pessoal nesta fase. Quando o
          produto ganhar contas e funcionalidades autenticadas, esta política será atualizada e
          comunicada.
        </p>

        <h2>Por que coletamos</h2>
        <ul>
          <li>
            <strong>Lista de espera</strong>: para avisar você quando o produto estiver disponível.
            Não enviamos marketing de terceiros e não compartilhamos sua lista com ninguém.
          </li>
        </ul>

        <h2>Quanto tempo guardamos</h2>
        <p>
          Mantemos seu e-mail na lista de espera enquanto o produto estiver em fase de
          pré-lançamento ou até você solicitar a remoção. Após o lançamento, e-mails de pessoas que
          não converterem em conta serão eliminados em até 12 meses.
        </p>

        <h2>Com quem compartilhamos</h2>
        <p>Apenas com operadores estritamente necessários para a operação do serviço:</p>
        <ul>
          <li>
            <strong>Google / Firebase</strong>: hospedagem e armazenamento dos seus dados.
          </li>
          <li>
            <strong>Cloudflare</strong>: verificação anti-bot no formulário de lista de espera.
          </li>
        </ul>
        <p>
          Não vendemos, alugamos ou transferimos seus dados para terceiros com finalidade
          publicitária.
        </p>

        <h2>Seus direitos (LGPD Art. 18)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados;</li>
          <li>Acessar seus dados;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>
            Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou
            tratados em desconformidade com a LGPD;
          </li>
          <li>Solicitar a portabilidade dos dados;</li>
          <li>Solicitar a eliminação dos dados tratados com base em consentimento;</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, escreva para{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">
            {CONTACT_EMAIL}
          </a>
          . Respondemos em até 15 dias.
        </p>

        <h2>Cookies e tecnologias similares</h2>
        <p>
          Hoje o Gabar não usa cookies de rastreamento ou ferramentas de analytics. Quando isso
          mudar, você verá um aviso de consentimento na primeira visita e esta política será
          atualizada.
        </p>

        <h2>Encarregado de dados (DPO)</h2>
        <p>
          O encarregado pelo tratamento dos dados pessoais é Kayron Cabral. Contato:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        <h2>Histórico de versões</h2>
        <ul>
          <li>
            <strong>{LAST_UPDATED}</strong>: versão inicial publicada com o lançamento da lista de
            espera.
          </li>
        </ul>
      </div>
    </main>
  )
}
