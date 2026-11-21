import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Nav } from './Nav'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

describe('Nav', () => {
  it('renderiza o nome da marca e marca beta', () => {
    render(<Nav />)
    expect(screen.getByText('gabar')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('logo aponta para a raiz', () => {
    render(<Nav />)
    const logo = screen.getByRole('link', { name: /página inicial/i })
    expect(logo).toHaveAttribute('href', '/')
  })

  describe('minimal', () => {
    it('logo aponta para /concursos/categorias', () => {
      render(<Nav minimal />)
      expect(screen.getByRole('link', { name: /categorias/i })).toHaveAttribute(
        'href',
        '/concursos/categorias',
      )
    })

    it('não renderiza botão hambúrguer', () => {
      render(<Nav minimal />)
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument()
    })

    it('não renderiza links de navegação', () => {
      render(<Nav minimal />)
      expect(screen.queryByRole('link', { name: 'Produto' })).not.toBeInTheDocument()
    })
  })

  it('renderiza os links de seção', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Produto' })).toHaveAttribute('href', '#produto')
    expect(screen.getByRole('link', { name: 'Método' })).toHaveAttribute('href', '#metodo')
    expect(screen.getByRole('link', { name: 'Comparativo' })).toHaveAttribute(
      'href',
      '#comparativo',
    )
    expect(screen.getByRole('link', { name: 'História' })).toHaveAttribute('href', '#historia')
  })

  it('renderiza o CTA "Concursos" apontando para /concursos/categorias', () => {
    render(<Nav />)
    const ctas = screen.getAllByRole('link', { name: 'Concursos' })
    expect(ctas.length).toBeGreaterThan(0)
    expect(ctas[ctas.length - 1]).toHaveAttribute('href', '/concursos/categorias')
  })

  it('botão de menu mobile começa fechado', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
  })

  it('abre e fecha o menu mobile', async () => {
    render(<Nav />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: 'História' })
    const lastLink = links[links.length - 1]
    if (!lastLink) throw new Error('expected at least one link')
    await userEvent.click(lastLink)
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
  })
})
