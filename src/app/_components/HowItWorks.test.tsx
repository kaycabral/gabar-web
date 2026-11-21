import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('a seção tem id "metodo" para anchor navigation', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelector('#metodo')).toBeInTheDocument()
  })

  it('renderiza o título da seção', () => {
    render(<HowItWorks />)
    expect(
      screen.getByRole('heading', { level: 2, name: /você foca no estudo. a ia cuida do resto/i }),
    ).toBeInTheDocument()
  })

  it('renderiza os 4 passos', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Escolha seu concurso')).toBeInTheDocument()
    expect(screen.getByText('Receba o plano')).toBeInTheDocument()
    expect(screen.getByText('Estude e pratique')).toBeInTheDocument()
    expect(screen.getByText('Acompanhe e ajuste')).toBeInTheDocument()
  })
})
