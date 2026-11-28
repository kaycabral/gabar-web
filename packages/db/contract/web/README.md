# Contrato `web`

Gerado pelo pipeline de dados e entregue aqui por PR automático. **Não editar à mão** — mudança nasce no pipeline.

- `schema.ts` — schema Drizzle do schema `web` (tudo que o site pode ler), usado pelas queries de `src/pg`.
- `web.schema.sql` — DDL equivalente, só para montar o banco de testes/local (`resetWebContract`).
