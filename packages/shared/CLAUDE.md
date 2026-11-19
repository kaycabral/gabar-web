# packages/shared — Shared Package (@gabar/shared)

## Escopo

Compartilhado por todos os workspaces. Mudanças aqui afetam `apps/web`, `apps/scraper`,
`apps/converter` e `apps/enricher` — verifique compatibilidade antes de alterar exports existentes.

## Regras

- Tipos novos aqui somente quando usados em 2+ workspaces
- Exportar apenas via `src/index.ts` — sem re-exports entre módulos (`types.ts` ou similar)
- Sem lógica de negócio específica de workspace; sem dependências externas

## ⚠️ Mudança de tipo → rules/indexes podem precisar redeploy

Os tipos em `src/types/exam.ts` definem a forma dos documentos do Firestore
(`exams`, `exams/{id}/positions`, `exams/{id}/documents`, etc.). Adicionar
campo só pode quebrar consumers; mudar nullability ou query patterns pode
exigir índice composto novo em `firestore.indexes.json` e/ou regras
atualizadas em `firestore.rules`. Re-deploy via `firebase deploy --only firestore`.

Modelo de dados completo: `docs/firestore-data-model.md`.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
