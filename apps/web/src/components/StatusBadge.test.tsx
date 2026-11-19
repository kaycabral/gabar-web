import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it("renders 'Aberto' label for open status", () => {
    render(<StatusBadge status="open" />)
    expect(screen.getByText('Aberto')).toBeInTheDocument()
  })

  it("renders 'Em breve' label for upcoming status", () => {
    render(<StatusBadge status="upcoming" />)
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it("renders 'Encerrado' label for closed status", () => {
    render(<StatusBadge status="closed" />)
    expect(screen.getByText('Encerrado')).toBeInTheDocument()
  })
})
