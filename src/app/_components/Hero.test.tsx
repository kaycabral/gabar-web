import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Hero } from './Hero'

const stats = { totalExams: 1600, activeExams: 354 }

describe('Hero', () => {
  it('renderiza o título principal', () => {
    render(<Hero onOpenWaitlist={vi.fn()} stats={stats} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Passar')
    expect(h1.textContent).toContain('método')
  })

  it('renderiza o lede', () => {
    render(<Hero onOpenWaitlist={vi.fn()} stats={stats} />)
    expect(screen.getByText(/aprovação deixou de ser questão de esforço/i)).toBeInTheDocument()
  })

  it('chama onOpenWaitlist ao clicar no CTA', async () => {
    const onOpenWaitlist = vi.fn()
    render(<Hero onOpenWaitlist={onOpenWaitlist} stats={stats} />)
    await userEvent.click(screen.getByRole('button', { name: /lista de espera/i }))
    expect(onOpenWaitlist).toHaveBeenCalledOnce()
  })

  it('renderiza os 4 stats do rodapé', () => {
    render(<Hero onOpenWaitlist={vi.fn()} stats={stats} />)
    expect(screen.getByText('1.600')).toBeInTheDocument()
    expect(screen.getByText('354')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
    expect(screen.getByText('4,2h')).toBeInTheDocument()
  })
})
