# apps/web — Frontend (@gabar/web)

## Escopo

Modifique `apps/web/`; `packages/shared/` e `packages/db/` só quando o front precisar de tipo ou query nova.

## Aliases (cross-workspace)

`@gabar/<pkg>` (resolvido via pnpm workspaces). Ex.: `import type { Exam } from '@gabar/shared'`.

## Design system (`@cbrl/design`)

`@cbrl/design` é a base: primitivos (`Button`, `Dialog`, `Select`, `Sheet`, `Tabs`…) vêm de lá, nunca de cópia local. A identidade do Gabar é extensão, não fork:

- **Tokens e tipografia** em `src/app/globals.css`, sobre `@import '@cbrl/design/globals.css'`: cores (`--accent-brand`, `--badge-*`), fontes e a escala `text-display`/`text-h1`…`text-meta`.
- **Variações de marca** via `className` no uso (ex.: `StatusBadge`), ou componente do app que compõe o primitivo (ex.: `DialogCloseButton`).
- **Componentes só do Gabar** (`components/ui/accordion.tsx`, `slider.tsx`) usam o pacote unificado `radix-ui` e o `cn` de `@/lib/utils` — que estende o tailwind-merge com a escala tipográfica.

Componente genérico que faltar no pacote nasce no `@cbrl/design`, não aqui.

## Logging

Código de produção loga via `@cbrl/log` (estruturado, com redação de PII); `no-console` é erro em `src/` (testes fora).
