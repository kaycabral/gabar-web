# packages/shared — Shared Package (@gabar/shared)

## Escopo

Tipos de domínio (`Exam`, `ExamStatus`, `BrazilianRegion`, …) usados por `apps/web` e `packages/db`.

## Regras

- Só tipos e constantes usados em 2+ workspaces; sem lógica de negócio e sem dependências externas.
- Exportar apenas via `src/index.ts`.
- O schema do banco tem dono fora deste repo (ver CLAUDE.md da raiz): mudança de tipo aqui acompanha uma mudança já feita lá, nunca o contrário.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
