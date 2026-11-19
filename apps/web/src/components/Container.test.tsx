import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders children inside a div by default', () => {
    render(<Container>content</Container>)
    const el = screen.getByText('content')
    expect(el.tagName).toBe('DIV')
    expect(el).toHaveClass('max-w-[1120px]')
  })

  it('applies narrow width when narrow prop is set', () => {
    render(<Container narrow>narrow</Container>)
    expect(screen.getByText('narrow')).toHaveClass('max-w-[840px]')
  })

  it('respects the as prop', () => {
    render(<Container as="section">sectioned</Container>)
    expect(screen.getByText('sectioned').tagName).toBe('SECTION')
  })
})
