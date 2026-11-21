import Link from 'next/link'
import { Suspense } from 'react'
import BackLink from './_components/BackLink'

export default function ExamNotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Navegação de volta" className="mb-6">
        <Suspense fallback={<span className="text-muted-foreground text-sm">‹ Voltar</span>}>
          <BackLink />
        </Suspense>
      </nav>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Concurso não encontrado</h2>
        <p className="text-muted-foreground text-sm">Este concurso não existe ou foi removido.</p>
        <Link
          href="/concursos"
          className="text-muted-foreground hover:text-foreground text-sm underline"
        >
          Ver todos os concursos
        </Link>
      </div>
    </main>
  )
}
