import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders the empty state message', () => {
    render(<EmptyState />)
    expect(screen.getByText('Nenhum concurso encontrado')).toBeInTheDocument()
    expect(screen.getByText(/tente ajustar os filtros ou ampliar a busca/i)).toBeInTheDocument()
  })

  it('shows reset button when showReset and onReset are provided', () => {
    render(<EmptyState showReset onReset={() => {}} />)
    expect(screen.getByRole('button', { name: 'Redefinir filtros' })).toBeInTheDocument()
  })

  it('hides reset button when showReset is false', () => {
    render(<EmptyState showReset={false} onReset={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Redefinir filtros' })).not.toBeInTheDocument()
  })

  it('hides reset button when onReset is not provided', () => {
    render(<EmptyState showReset />)
    expect(screen.queryByRole('button', { name: 'Redefinir filtros' })).not.toBeInTheDocument()
  })

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn()
    render(<EmptyState showReset onReset={onReset} />)

    fireEvent.click(screen.getByRole('button', { name: 'Redefinir filtros' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
