# packages/shared

Pacote interno com os tipos de domínio do Gabar, compartilhados entre `apps/web` e `packages/db`.

```typescript
import type { Exam, ExamStatus, BrazilianRegion } from '@gabar/shared'
import { BRAZIL_REGIONS } from '@gabar/shared'
```

Resolvido via pnpm workspaces, sem build step: os arquivos `.ts` são importados diretamente. Tipos em [`src/types/exam.ts`](src/types/exam.ts).
