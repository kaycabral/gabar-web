'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Algo deu errado</h2>
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
