'use client'

import { Suspense } from 'react'
import BackLink from './_components/BackLink'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ExamDetailError({ reset }: ErrorProps) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Navegação de volta" className="mb-6">
        <Suspense
          fallback={<span className="text-muted-foreground text-sm">← Voltar à listagem</span>}
        >
          <BackLink />
        </Suspense>
      </nav>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Erro ao carregar concurso</h2>
        <p className="text-muted-foreground text-sm">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="text-muted-foreground hover:text-foreground text-sm underline"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  )
}
