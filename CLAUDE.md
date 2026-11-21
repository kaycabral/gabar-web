# gabar-web

Front público do Gabar: um app Next.js na raiz do repo. Visão geral, estrutura e comandos em @README.md.

## Regras invioláveis

1. **Next.js: leia a doc local antes de codar.** `node_modules/next/dist/docs/` é a fonte de verdade; o conhecimento de treino está defasado.
2. **pnpm apenas.** `pnpm-workspace.yaml` só guarda as configurações do pnpm (quarentena de versões).
3. **Aliases.** Sempre `@/...` (`@/db`, `@/shared`, `@/lib/...`). Nunca `../../`.
4. **Codebase em inglês.** Identificadores, mensagens de erro, logs.
5. **ESLint: nunca desabilitar.** Dívida antiga vive no `eslint-suppressions.json`.
6. **Sem merge sem evidência de execução real** (spec E2E, `pnpm test` cobrindo o caminho, ou smoke descrito no PR).
7. **Repositório público.** Nada de segredo, URL interna, detalhe do pipeline de dados ou dado pessoal em código, commit, issue ou PR.

## Não-óbvio

- **Só leitura de dados**: o front lê concursos publicados do Postgres; escrita, schema e migrations têm dono no pipeline privado. `src/db/schema.ts` e `drizzle/` são cópia pra tipar as queries e subir o banco de testes — mudança de schema (e de tipo em `src/shared`) nasce lá e é espelhada aqui, nunca o contrário.
- **Acesso ao banco**: código do app importa via `@/lib/db` (guarda `server-only`); `@/db` direto só pra tipos, scripts e testes.
- **Testes de query** rodam contra Postgres real: `pnpm test:integration:pg` (arquivos `*.pg.test.ts`, fora do `pnpm test`) com `GABAR_DATABASE_URL` apontando pro banco local (`pnpm db:start`).
- **Design system**: primitivos vêm do `@cbrl/design`, nunca de cópia local; a identidade do Gabar é extensão — tokens e tipografia em `src/app/globals.css`, variações via `className` ou componente do app que compõe o primitivo. Componentes só do Gabar (`components/ui/accordion.tsx`, `slider.tsx`) usam `radix-ui` e o `cn` de `@/lib/utils`. Componente genérico que faltar nasce no `@cbrl/design`.
- **Logging**: código de produção loga via `@cbrl/log`; `no-console` é erro em `src/` (testes fora).
- **Deploy**: Vercel, Root Directory na raiz do repo; `vercel.json` (região, cron) também na raiz.
