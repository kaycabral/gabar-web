import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MatchHighlight } from './MatchHighlight'

describe('MatchHighlight', () => {
  it('renderiza o título', () => {
    render(<MatchHighlight onOpenWaitlist={vi.fn()} />)
    expect(
      screen.getByRole('heading', { level: 2, name: /não sabe em qual concurso apostar/i }),
    ).toBeInTheDocument()
  })

  it('renderiza os match cards com nomes e scores', () => {
    render(<MatchHighlight onOpenWaitlist={vi.fn()} />)
    expect(screen.getByText('TRT 10ª Região')).toBeInTheDocument()
    expect(screen.getByText('94')).toBeInTheDocument()
    expect(screen.getByText('INSS')).toBeInTheDocument()
    expect(screen.getByText('87')).toBeInTheDocument()
    expect(screen.getByText('Receita Federal')).toBeInTheDocument()
  })

  it('chama onOpenWaitlist ao clicar no CTA', async () => {
    const onOpenWaitlist = vi.fn()
    render(<MatchHighlight onOpenWaitlist={onOpenWaitlist} />)
    await userEvent.click(screen.getByRole('button', { name: /descobrir meu match/i }))
    expect(onOpenWaitlist).toHaveBeenCalledOnce()
  })
})
