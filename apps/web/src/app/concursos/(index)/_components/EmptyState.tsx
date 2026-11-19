import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  showReset?: boolean
  onReset?: () => void
}

export default function EmptyState({ showReset, onReset }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="text-foreground text-base font-medium">Nenhum concurso encontrado</p>
      <p className="text-muted-foreground text-sm">
        Tente ajustar os filtros ou ampliar a busca para ver mais resultados.
      </p>
      {showReset && onReset && (
        <Button variant="link" onClick={onReset} className="mt-2 h-auto p-0">
          Redefinir filtros
        </Button>
      )}
    </div>
  )
}
