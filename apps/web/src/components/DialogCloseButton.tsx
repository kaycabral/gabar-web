import { Button, DialogClose } from '@cbrl/design'
import { XIcon } from 'lucide-react'

/**
 * Close control for `DialogContent` rendered with `showCloseButton={false}`:
 * same placement as the design system's own button, with a pt-BR label.
 */
export function DialogCloseButton() {
  return (
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2 opacity-70 hover:opacity-100"
      >
        <XIcon />
        <span className="sr-only">Fechar</span>
      </Button>
    </DialogClose>
  )
}
