import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ShareButton from './ShareButton'

describe('ShareButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost/concursos/test-001' },
      writable: true,
    })
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders with label 'Compartilhar'", () => {
    render(<ShareButton examName="TRT 2025" />)
    expect(screen.getByRole('button', { name: /compartilhar/i })).toBeInTheDocument()
  })

  it('opens dialog when clicked', async () => {
    render(<ShareButton examName="TRT 2025" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /compartilhar/i }))
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copiar link/i })).toBeInTheDocument()
  })

  it('copies link and shows confirmation', async () => {
    render(<ShareButton examName="TRT 2025" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /compartilhar/i }))
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copiar link/i }))
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'http://localhost/concursos/test-001',
    )
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'http://localhost/concursos/test-001',
    )
  })
})
