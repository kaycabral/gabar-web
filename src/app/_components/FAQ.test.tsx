import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FAQ } from './FAQ'

describe('FAQ', () => {
  it('renderiza o título da seção', () => {
    render(<FAQ />)
    expect(
      screen.getByRole('heading', { level: 2, name: /tudo o que você precisa saber/i }),
    ).toBeInTheDocument()
  })

  it('renderiza as 7 perguntas', () => {
    render(<FAQ />)
    expect(screen.getByText('O Gabar substitui o cursinho?')).toBeInTheDocument()
    expect(screen.getByText('A IA de match realmente funciona?')).toBeInTheDocument()
    expect(screen.getByText('E se eu não gostar?')).toBeInTheDocument()
    expect(screen.getByText('Quando o Gabar vai lançar?')).toBeInTheDocument()
    expect(screen.getByText('Para quais concursos funciona?')).toBeInTheDocument()
    expect(screen.getByText('Preciso ter experiência com tecnologia?')).toBeInTheDocument()
    expect(screen.getByText('Como o Gabar sabe o que eu já sei?')).toBeInTheDocument()
  })

  it('expande outra pergunta ao clicar', async () => {
    render(<FAQ />)
    const trigger = screen.getByRole('button', { name: /A IA de match realmente funciona/i })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
