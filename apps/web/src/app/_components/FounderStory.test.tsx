import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FounderStory } from './FounderStory'

describe('FounderStory', () => {
  it('renderiza o título da carta', () => {
    render(<FounderStory />)
    expect(
      screen.getByRole('heading', { level: 2, name: /por que eu criei o gabar/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o fundador e papel', () => {
    render(<FounderStory />)
    expect(screen.getByText('Kayron Cabral')).toBeInTheDocument()
    expect(screen.getByText(/fundador · eng\. de software/i)).toBeInTheDocument()
  })

  it('renderiza o fecho da carta', () => {
    render(<FounderStory />)
    expect(screen.getByText(/tecnologia pode mudar vidas de verdade/i)).toBeInTheDocument()
  })
})
