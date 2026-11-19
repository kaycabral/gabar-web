# packages/db — Postgres do Gabar (@gabar/db)

## Escopo

Leitura do Postgres (Supabase) pelo front: schema Drizzle, pool e queries usadas pelas páginas (`@gabar/db/pg`).

## Regras

- O front **só lê** concursos publicados; quem escreve é o pipeline, fora deste repositório.
- Schema e migrations têm dono no pipeline. A cópia aqui (`src/pg/schema.ts`, `drizzle/`) tipa as queries e sobe o banco de testes — mudança de schema nasce lá e é espelhada aqui.
- Testes de query rodam contra Postgres real: `pnpm --filter @gabar/db test:integration:pg` com `GABAR_DATABASE_URL` apontando pro banco local (`pnpm --filter @gabar/web db:start`).

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
