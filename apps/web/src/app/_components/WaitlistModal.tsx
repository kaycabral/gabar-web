'use client'

import { joinWaitlist, type WaitlistState } from '@/app/actions/waitlist'
import { Turnstile } from '@/components/Turnstile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useCallback, useEffect, useState } from 'react'

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY

interface WaitlistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialState: WaitlistState = { status: 'idle' }

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [state, action, isPending] = useActionState(joinWaitlist, initialState)
  const [turnstileToken, setTurnstileToken] = useState<string>('')

  const handleVerify = useCallback((token: string) => setTurnstileToken(token), [])

  useEffect(() => {
    if (state.status === 'success') {
      const timer = setTimeout(() => onOpenChange(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [state.status, onOpenChange])

  const showSuccess = state.status === 'success'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded-[24px] p-8 sm:max-w-md">
        {showSuccess ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Você está na lista!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="bg-accent-brand text-accent-brand-foreground mb-2 flex size-14 items-center justify-center rounded-full">
                <Check className="size-7" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-[1.375rem] leading-tight font-black tracking-tight">
                Você está na lista!
              </h3>
              <p className="text-muted-foreground max-w-[20rem] text-sm">
                Avisaremos quando o Gabar estiver pronto.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="gap-2">
              <DialogTitle className="font-display text-[1.375rem] leading-tight font-black tracking-tight">
                Lista de espera
              </DialogTitle>
              <DialogDescription>
                Entre na lista e seja um dos primeiros a testar o Gabar.
              </DialogDescription>
            </DialogHeader>

            <form action={action} className="mt-2 flex flex-col gap-3">
              <Input
                type="email"
                name="email"
                placeholder="seu@email.com"
                required
                className="h-11 rounded-xl"
                autoFocus
                autoComplete="email"
              />
              <Turnstile sitekey={TURNSTILE_SITEKEY} onVerify={handleVerify} />
              <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />
              {state.status === 'error' && (
                <p className="text-destructive text-sm">{state.message}</p>
              )}
              <Button
                type="submit"
                disabled={isPending || !turnstileToken}
                className="h-11 rounded-full font-semibold"
              >
                {isPending ? 'Entrando...' : 'Entrar na lista'}
              </Button>
              <p className="text-muted-foreground text-center text-xs leading-relaxed">
                Ao entrar na lista, você concorda em receber atualizações sobre o lançamento do
                Gabar e aceita nossa{' '}
                <Link
                  href="/privacidade"
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  política de privacidade
                </Link>
                . Você pode sair a qualquer momento.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
