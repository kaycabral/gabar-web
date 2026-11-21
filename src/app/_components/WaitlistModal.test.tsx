import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WaitlistModal } from './WaitlistModal'

vi.mock('@/app/actions/waitlist', () => ({
  joinWaitlist: vi.fn(),
}))

// useActionState: [state, action, isPending]
const mockAction = vi.fn()

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof React>()
  return {
    ...actual,
    useActionState: vi.fn((_, initialState) => [initialState, mockAction, false]),
  }
})

import { useActionState } from 'react'

describe('WaitlistModal — fechado', () => {
  it('não renderiza conteúdo quando open=false', () => {
    render(<WaitlistModal open={false} onOpenChange={vi.fn()} />)
    expect(screen.queryByText('Lista de espera')).not.toBeInTheDocument()
  })
})

describe('WaitlistModal — formulário (estado idle)', () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{ status: 'idle' }, mockAction, false] as never)
  })

  it('renderiza o título do dialog', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByText('Lista de espera')).toBeInTheDocument()
  })

  it('renderiza o input de email', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
  })

  it('renderiza o botão de submit', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Entrar na lista' })).toBeInTheDocument()
  })

  it('não exibe mensagem de erro no estado idle', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('WaitlistModal — estado de erro', () => {
  it('exibe a mensagem de erro retornada pela action', () => {
    vi.mocked(useActionState).mockReturnValue([
      { status: 'error', message: 'Insira um e-mail válido.' },
      mockAction,
      false,
    ] as never)

    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByText('Insira um e-mail válido.')).toBeInTheDocument()
  })

  it('exibe mensagem de email duplicado', () => {
    vi.mocked(useActionState).mockReturnValue([
      { status: 'error', message: 'Este e-mail já está na lista.' },
      mockAction,
      false,
    ] as never)

    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByText('Este e-mail já está na lista.')).toBeInTheDocument()
  })
})

describe('WaitlistModal — estado de sucesso', () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{ status: 'success' }, mockAction, false] as never)
  })

  it('exibe a tela de confirmação', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Você está na lista!' }),
    ).toBeInTheDocument()
  })

  it('não exibe o formulário no estado de sucesso', () => {
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.queryByPlaceholderText('seu@email.com')).not.toBeInTheDocument()
  })

  it('fecha automaticamente após 2 segundos', async () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    render(<WaitlistModal open={true} onOpenChange={onOpenChange} />)
    await vi.advanceTimersByTimeAsync(2000)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    vi.useRealTimers()
  })
})

describe('WaitlistModal — estado pendente', () => {
  it('desabilita o botão enquanto está pendente', () => {
    vi.mocked(useActionState).mockReturnValue([{ status: 'idle' }, mockAction, true] as never)
    render(<WaitlistModal open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()
  })
})
