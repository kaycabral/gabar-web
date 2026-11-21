# apps/web

Aplicação Next.js que serve a interface pública do Gabar — listagem, busca, filtros e detalhe de concursos públicos.

## Stack

- **Next.js 16** (App Router, cache components, partial prerendering)
- **React 19** + TypeScript
- **Tailwind CSS 4** + `@cbrl/design` (Radix via `radix-ui`)
- **Postgres** (Supabase) via `@gabar/db/pg` — só leitura de concursos publicados
- **Vitest** (unitários) + **Playwright** (E2E)

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
└── lib/
    ├── db.ts                 # Conexão com o Postgres (server-only)
    ├── exams-api.ts          # Consultas de concursos
    ├── filters.ts, exam-stats.ts, date.ts, salary.ts, turnstile.ts
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

## Configuração

`GABAR_DATABASE_URL` aponta pro Postgres (pooler de transação do Supabase em produção). Pra dev local: `pnpm --filter @gabar/web db:start` sobe um Postgres em Docker na porta 55432 e `pnpm --filter @gabar/web db:seed` popula dados de exemplo.

## Comandos

```bash
pnpm run dev          # Dev em http://localhost:3004
pnpm run build        # Build de produção
pnpm run test         # Vitest
pnpm run test:e2e     # Playwright
pnpm run test:smoke   # Smoke contra uma URL publicada
```

## Deploy

Vercel (Root Directory `apps/web`): preview a cada PR e produção no merge em `main`.
