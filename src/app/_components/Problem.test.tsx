import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Problem } from './Problem'

describe('Problem', () => {
  it('renderiza o cabeçalho da seção', () => {
    render(<Problem />)
    expect(screen.getByText('O problema')).toBeInTheDocument()
  })

  it('renderiza o título e a frase de fecho', () => {
    render(<Problem />)
    expect(screen.getByRole('heading', { level: 2, name: /caos logístico/i })).toBeInTheDocument()
    expect(screen.getByText(/tirar essa carga das suas costas/i)).toBeInTheDocument()
  })

  it('renderiza os 3 itens de dor', () => {
    render(<Problem />)
    expect(screen.getByText('Editais espalhados')).toBeInTheDocument()
    expect(screen.getByText('Plano abandonado')).toBeInTheDocument()
    expect(screen.getByText('Estudo no escuro')).toBeInTheDocument()
  })
})
