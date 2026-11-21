import type { Exam } from '@gabar/shared'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Positions from './Positions'

function makeExam(positions: Exam['positions']): Exam {
  return {
    id: 'test-001',
    slug: 'test-001',
    name: 'Concurso Teste',
    examiningBoard: 'FCC',
    institution: null,
    positions,
    vacancies: null,
    state: 'SP',
    city: null,
    region: 'Southeast',
  }
}

function makePositions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    title: `Cargo ${i + 1}`,
    level: i % 2 === 0 ? 'superior' : null,
    salary: null as number | null,
  }))
}

function makePositionWithSubjects() {
  return {
    title: 'Analista Judiciário',
    level: 'Superior',
    salary: null as number | null,
    subjects: [
      { name: 'Língua Portuguesa', topics: ['Ortografia', 'Crase', 'Interpretação de textos'] },
      { name: 'Raciocínio Lógico', topics: ['Sequências', 'Proposições'] },
    ],
  }
}

describe('Positions', () => {
  it('renders nothing when positions is empty', () => {
    const { container } = render(<Positions exam={makeExam([])} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the section heading', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: null }])} />)
    expect(screen.getByRole('heading', { name: 'Cargos' })).toBeInTheDocument()
  })

  it('renders position titles', () => {
    render(
      <Positions
        exam={makeExam([
          { title: 'Analista Judiciário', level: null, salary: null },
          { title: 'Técnico Judiciário', level: null, salary: null },
        ])}
      />,
    )
    expect(screen.getByText('Analista Judiciário')).toBeInTheDocument()
    expect(screen.getByText('Técnico Judiciário')).toBeInTheDocument()
  })

  it('renders level badge when level is set', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: 'superior', salary: null }])} />)
    expect(screen.getByText('superior')).toBeInTheDocument()
  })

  it('does not render a badge when level is null', () => {
    render(<Positions exam={makeExam([{ title: 'Auxiliar', level: null, salary: null }])} />)
    expect(screen.getByText('Auxiliar')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="badge"]')).toBeNull()
  })

  it('renders salary when position has a salary', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: 13994 }])} />)
    expect(screen.getByText(/R\$\s*13\.994/)).toBeInTheDocument()
  })

  it('does not render salary when position salary is null', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: null }])} />)
    expect(screen.queryByText(/R\$\s*[\d]/)).not.toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: null }])} />)
    expect(screen.getByRole('searchbox', { name: /buscar cargo/i })).toBeInTheDocument()
  })

  it('filters positions by search query (case-insensitive)', () => {
    render(
      <Positions
        exam={makeExam([
          { title: 'Analista Judiciário', level: null, salary: null },
          { title: 'Técnico Administrativo', level: null, salary: null },
        ])}
      />,
    )

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'analista' } })

    expect(screen.getByText('Analista Judiciário')).toBeInTheDocument()
    expect(screen.queryByText('Técnico Administrativo')).not.toBeInTheDocument()
  })

  it('shows empty state when search matches nothing', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: null }])} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xxxxx' } })

    expect(screen.getByText('Nenhum cargo encontrado.')).toBeInTheDocument()
  })

  it('resets to page 1 when search query changes', () => {
    // 10 positions to get 2 pages (PAGE_SIZE = 8)
    render(<Positions exam={makeExam(makePositions(10))} />)

    // Navigate to page 2
    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))
    expect(screen.getByText('Cargo 9')).toBeInTheDocument()

    // Typing in search should reset to page 1
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Cargo' } })
    expect(screen.getByText('Cargo 1')).toBeInTheDocument()
  })

  it('does not render pagination when positions fit in one page', () => {
    render(<Positions exam={makeExam(makePositions(8))} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders pagination when there are more than 8 positions', () => {
    render(<Positions exam={makeExam(makePositions(9))} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument()
  })

  it('renders subject names when position has subjects', () => {
    render(<Positions exam={makeExam([makePositionWithSubjects()])} />)
    // Expand the position accordion to reveal subjects
    fireEvent.click(screen.getByRole('button', { name: /Analista Judiciário/i }))
    expect(screen.getByText('Língua Portuguesa')).toBeInTheDocument()
    expect(screen.getByText('Raciocínio Lógico')).toBeInTheDocument()
  })

  it('renders topics inside each subject when expanded', () => {
    render(<Positions exam={makeExam([makePositionWithSubjects()])} />)
    // Expand position, then expand the subject
    fireEvent.click(screen.getByRole('button', { name: /Analista Judiciário/i }))
    fireEvent.click(screen.getByText('Língua Portuguesa'))
    expect(screen.getByText(/Ortografia/)).toBeInTheDocument()
    expect(screen.getByText(/Crase/)).toBeInTheDocument()
  })

  it('does not render subjects section when position has no subjects', () => {
    render(<Positions exam={makeExam([{ title: 'Analista', level: null, salary: null }])} />)
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('clicking a pagination button shows the correct page of positions', () => {
    render(<Positions exam={makeExam(makePositions(10))} />)

    // Page 1: Cargo 1–8 visible
    expect(screen.getByText('Cargo 1')).toBeInTheDocument()
    expect(screen.queryByText('Cargo 9')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))

    // Page 2: Cargo 9–10 visible
    expect(screen.getByText('Cargo 9')).toBeInTheDocument()
    expect(screen.queryByText('Cargo 1')).not.toBeInTheDocument()
  })
})
