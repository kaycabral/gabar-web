# gabar-web

Front público do Gabar. Visão geral e comandos em @README.md.

Cada workspace (`apps/web`, `packages/*`) tem `CLAUDE.md` próprio — abra antes de editar arquivos dentro dele.

## Regras invioláveis

1. **Next.js: leia a doc local antes de codar.** `node_modules/next/dist/docs/` é a fonte de verdade; o conhecimento de treino está defasado.
2. **pnpm apenas.** Versões compartilhadas vivem no `catalog` do `pnpm-workspace.yaml`.
3. **Aliases.** `@/...` dentro do workspace, `@gabar/<pkg>` entre workspaces. Nunca `../../`.
4. **Codebase em inglês.** Identificadores, mensagens de erro, logs.
5. **ESLint: nunca desabilitar.** Dívida antiga vive no `eslint-suppressions.json` do workspace.
6. **Sem merge sem evidência de execução real** (spec E2E, `pnpm test` cobrindo o caminho, ou smoke descrito no PR).
7. **Repositório público.** Nada de segredo, URL interna, detalhe do pipeline de dados ou dado pessoal em código, commit, issue ou PR.

## Não-óbvio

- **Só leitura de dados**: o front lê concursos publicados do Postgres; escrita, schema e migrations têm dono no pipeline privado. `packages/db` mantém uma cópia do schema pra tipar as queries.
- **Deploy**: Vercel (Root Directory `apps/web`). Env nova de build/runtime precisa entrar em `apps/web/turbo.json`.
