import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Comparison } from './Comparison'

describe('Comparison', () => {
  it('renderiza o cabeçalho da coluna Gabar', () => {
    render(<Comparison />)
    expect(screen.getByText('Gabar')).toBeInTheDocument()
  })

  it('renderiza as 7 funcionalidades da tabela', () => {
    render(<Comparison />)
    expect(screen.getByText('Radar de concursos')).toBeInTheDocument()
    expect(screen.getByText('Match de perfil com IA')).toBeInTheDocument()
    expect(screen.getByText('Plano de estudo adaptativo')).toBeInTheDocument()
    expect(screen.getByText('Banco de questões')).toBeInTheDocument()
    expect(screen.getByText('Análise de banca')).toBeInTheDocument()
    expect(screen.getByText('Acompanhamento real')).toBeInTheDocument()
    expect(screen.getByText('Central de notícias filtrada')).toBeInTheDocument()
  })

  it('renderiza as colunas alternativas', () => {
    render(<Comparison />)
    expect(screen.getByText('App de questões')).toBeInTheDocument()
    expect(screen.getByText('Cursinho')).toBeInTheDocument()
    expect(screen.getByText('Planilha')).toBeInTheDocument()
  })
})
