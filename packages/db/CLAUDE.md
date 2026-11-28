# packages/db — Postgres do Gabar (@gabar/db)

## Escopo

Leitura do Postgres (Supabase) pelo front: contrato `web`, pool e queries usadas pelas páginas (`@gabar/db/pg`).

## Regras

- O front **só lê** concursos publicados; quem escreve é o pipeline, fora deste repositório.
- Schema e migrations têm dono no pipeline. Aqui só existe o contrato gerado `contract/web/` (`schema.ts` tipa as queries, `web.schema.sql` monta o banco de testes), atualizado por PR automático — **não editar à mão**.
- Queries só tocam o schema `web` (tabelas via `src/pg/web.ts`; waitlist via `web.join_waitlist`): em produção a role do site não enxerga mais nada.
- Testes de query rodam contra Postgres real: `pnpm --filter @gabar/db test:integration:pg` com `GABAR_DATABASE_URL` apontando pro banco local (`pnpm --filter @gabar/web db:start`).

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
