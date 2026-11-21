# apps/web — Frontend (@gabar/web)

## Escopo

Modifique `apps/web/`; `packages/shared/` e `packages/db/` só quando o front precisar de tipo ou query nova.

## Aliases (cross-workspace)

`@gabar/<pkg>` (resolvido via pnpm workspaces). Ex.: `import type { Exam } from '@gabar/shared'`.

## shadcn (stile `base-nova`)

gabar/web usa o pacote unificado `radix-ui` (não os granulares `@radix-ui/react-*`). Após `npx shadcn add <comp>`, confira que os imports vão pra `radix-ui`, mesmo padrão de `dialog.tsx` e `select.tsx`. Base UI segue proibido (regra canônica).
