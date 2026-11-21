import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CTA } from './CTA'

describe('CTA', () => {
  it('renderiza o título', () => {
    render(<CTA onOpenWaitlist={vi.fn()} />)
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toContain('A vaga é sua.')
    expect(h2.textContent).toContain('até ela.')
  })

  it('chama onOpenWaitlist ao clicar no CTA', async () => {
    const onOpenWaitlist = vi.fn()
    render(<CTA onOpenWaitlist={onOpenWaitlist} />)
    await userEvent.click(screen.getByRole('button', { name: /lista de espera/i }))
    expect(onOpenWaitlist).toHaveBeenCalledOnce()
  })

  it('mostra contagem social', () => {
    render(<CTA onOpenWaitlist={vi.fn()} />)
    expect(screen.getByText(/100 pessoas já entraram/i)).toBeInTheDocument()
  })
})
