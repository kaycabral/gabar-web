# gabar-web

Front do [Gabar](https://gabar.com.br) — plataforma de concursos públicos: listagem, busca, filtros e detalhe dos concursos e seus documentos.

## Estrutura

| Caminho           | O que é                                                  |
| ----------------- | -------------------------------------------------------- |
| `apps/web`        | App Next.js (deploy na Vercel)                           |
| `packages/db`     | Leitura do Postgres (Supabase): contrato `web` + queries |
| `packages/shared` | Tipos e utilitários do domínio (concurso, região, slug)  |

Os dados são publicados por um pipeline privado; este repositório só lê concursos já publicados.

## Começando

```bash
pnpm install
pnpm --filter @gabar/web db:start   # Postgres local em Docker (porta 55432)
pnpm --filter @gabar/web db:seed    # dados de exemplo
pnpm --filter @gabar/web dev        # http://localhost:3004
```

## Gates

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @gabar/db test:integration:pg   # queries contra Postgres real
pnpm test:e2e
```

## Licença

Código-fonte disponível para leitura; todos os direitos reservados — ver [LICENSE](LICENSE).
