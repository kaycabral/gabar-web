import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Features } from './Features'

describe('Features', () => {
  it('a seção tem id "produto" para anchor navigation', () => {
    const { container } = render(<Features />)
    expect(container.querySelector('#produto')).toBeInTheDocument()
  })

  it('renderiza todas as 7 funcionalidades', () => {
    render(<Features />)
    expect(screen.getByText('Radar de concursos')).toBeInTheDocument()
    expect(screen.getByText('Match de perfil')).toBeInTheDocument()
    expect(screen.getByText('Plano de estudo vivo')).toBeInTheDocument()
    expect(screen.getByText('Mapa de conhecimento')).toBeInTheDocument()
    expect(screen.getByText('Questões e simulados')).toBeInTheDocument()
    expect(screen.getByText('Análise de banca')).toBeInTheDocument()
    expect(screen.getByText('Central de notícias')).toBeInTheDocument()
  })

  it('numera as funcionalidades de N.01 a N.07', () => {
    render(<Features />)
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(`N.0${i}`)).toBeInTheDocument()
    }
  })
})
