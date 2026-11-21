import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from './Footer'

vi.mock('@/app/actions/waitlist', () => ({
  joinWaitlist: vi.fn(),
}))

describe('Footer', () => {
  it('renderiza o texto de copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Gabar/)).toBeInTheDocument()
  })

  it('renderiza como elemento footer', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renderiza seções do mapa do site', () => {
    render(<Footer />)
    expect(screen.getByText('Concursos')).toBeInTheDocument()
    expect(screen.getByText('Institucional')).toBeInTheDocument()
    expect(screen.getByText('Sobre')).toBeInTheDocument()
  })

  it('renderiza Como funciona como link interno', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/#metodo')
  })

  it('renderiza links de concursos como botões que abrem a waitlist', async () => {
    render(<Footer />)
    const button = screen.getByRole('button', { name: 'Categorias' })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})
