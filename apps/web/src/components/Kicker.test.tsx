import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Kicker } from './Kicker'

describe('Kicker', () => {
  it('renders the main label', () => {
    render(<Kicker>plataforma all-in-one</Kicker>)
    expect(screen.getByText('plataforma all-in-one')).toBeInTheDocument()
  })

  it('renders a trailing badge when provided', () => {
    render(<Kicker badge="Em breve">plataforma</Kicker>)
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('omits the badge slot when not provided', () => {
    const { container } = render(<Kicker>sem badge</Kicker>)
    expect(container.querySelectorAll('span').length).toBe(1)
  })
})
