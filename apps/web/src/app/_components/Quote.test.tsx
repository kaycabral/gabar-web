import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Quote } from './Quote'

describe('Quote', () => {
  it('renderiza a citação e a atribuição', () => {
    render(<Quote />)
    expect(screen.getByText(/cansei de estudar no escuro/i)).toBeInTheDocument()
    expect(screen.getByText(/todo concurseiro, em algum momento/i)).toBeInTheDocument()
  })
})
