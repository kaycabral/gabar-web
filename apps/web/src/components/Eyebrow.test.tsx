import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  it('renders the label in accent color with the orange bar', () => {
    const { container } = render(<Eyebrow>Explorar · Concursos</Eyebrow>)
    const el = screen.getByText('Explorar · Concursos')
    expect(el.closest('p')).toHaveClass('text-accent-brand')
    expect(container.querySelector('span[aria-hidden]')).not.toBeNull()
  })

  it('renders the optional index prefix', () => {
    render(<Eyebrow index="01">Por região</Eyebrow>)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Por região')).toBeInTheDocument()
  })

  it('omits the index when not provided', () => {
    render(<Eyebrow>Explorar</Eyebrow>)
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
  })

  it('respects the `as` prop for the root tag', () => {
    render(<Eyebrow as="span">Inline</Eyebrow>)
    const el = screen.getByText('Inline')
    expect(el.closest('span[class*="text-accent-brand"]')).not.toBeNull()
  })
})
