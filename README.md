# gabar-web

Front do [Gabar](https://gabar.com.br) — plataforma de concursos públicos: listagem, busca, filtros e detalhe dos concursos e seus documentos.

Os dados são publicados por um pipeline privado; este repositório só lê concursos já publicados.

## Stack

- **Next.js 16** (App Router, cache components, partial prerendering)
- **React 19** + TypeScript
- **Tailwind CSS 4** + `@cbrl/design` (Radix via `radix-ui`)
- **Postgres** (Supabase) via Drizzle — só leitura de concursos publicados
- **Vitest** (unitários e integração com Postgres) + **Playwright** (E2E)

## Estrutura

```
src/
├── app/
│   ├── (index)/              # Landing
│   ├── concursos/            # Listagem, detalhe e documento
│   ├── privacidade/, termos/ # Páginas legais
│   ├── api/health/           # /api/health → { status, commit, database }
│   ├── api/csp-report/       # Recebe relatórios de violação de CSP
│   └── actions/waitlist.ts   # Server action — lista de espera
├── components/
├── db/                       # Schema Drizzle (cópia), pool e queries de leitura
├── shared/                   # Tipos de domínio (concurso, região, status)
└── lib/
    ├── db.ts                 # `@/db` com guarda server-only
    ├── exams-api.ts          # Consultas de concursos
    └── filters.ts, exam-stats.ts, date.ts, salary.ts, turnstile.ts
drizzle/                      # Migrations (só pra subir o banco local e o de CI)
scripts/seed-dev.ts           # Dados de exemplo num banco local
docker/postgres.compose.yaml  # Postgres local efêmero
```

## Rotas

| Rota                                         | Tipo              | Descrição              |
| -------------------------------------------- | ----------------- | ---------------------- |
| `/`                                          | Static + cache    | Landing                |
| `/concursos`                                 | Partial Prerender | Listagem c/ filtros    |
| `/concursos/[slug]`                          | Partial Prerender | Detalhe                |
| `/concursos/[slug]/documento/[documentSlug]` | PPR               | Texto do documento     |
| `/concursos/categorias`                      | Static + cache    | Stats por banca/região |
| `/api/health`                                | Dynamic route     | Smoke gate             |
| `/api/csp-report`                            | Dynamic route     | Relatórios de CSP      |

## Começando

Copie `.env.example` pra `.env.development.local`. `GABAR_DATABASE_URL` aponta pro Postgres (pooler de transação do Supabase em produção, Docker local em dev).

```bash
pnpm install
pnpm db:start     # Postgres local em Docker (porta 55432)
pnpm db:migrate   # com GABAR_DATABASE_URL apontando pro banco local
pnpm db:seed      # dados de exemplo
pnpm dev          # http://localhost:3004
```

## Gates

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration:pg   # queries contra Postgres real
pnpm build
pnpm test:e2e
pnpm test:smoke            # smoke contra uma URL publicada (SMOKE_BASE_URL)
```

## Deploy

Vercel: preview a cada PR e produção no merge em `main`.

## Licença

Código-fonte disponível para leitura; todos os direitos reservados — ver [LICENSE](LICENSE).
