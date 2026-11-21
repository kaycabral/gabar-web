import type { Exam } from '@/shared'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Card from '../../_components/Card'

const baseExam: Exam = {
  id: 'test-001',
  slug: 'federal-police-officer-2026',
  name: 'Federal Police Officer 2026',
  examiningBoard: 'CESPE/CEBRASPE',
  institution: 'Polícia Federal',
  positions: [{ title: 'Delegado de Polícia Federal', level: null, salary: 23692 }],
  vacancies: 500,
  registrationEnd: '2026-12-31',
  state: 'DF',
  city: 'Brasília',
  region: 'Central-West',
  status: 'upcoming',
}

describe('Card', () => {
  it('renders the exam name', () => {
    render(<Card exam={baseExam} />)
    expect(screen.getByText('Federal Police Officer 2026')).toBeInTheDocument()
  })

  it('renders the examining board in the header', () => {
    render(<Card exam={baseExam} />)
    expect(screen.getByText('CESPE/CEBRASPE')).toBeInTheDocument()
  })

  it('renders position title and city in the subtitle', () => {
    render(<Card exam={baseExam} />)
    expect(screen.getByText('Delegado de Polícia Federal · Brasília')).toBeInTheDocument()
  })

  it("renders 'Vários cargos' when more than one position", () => {
    render(
      <Card
        exam={{
          ...baseExam,
          positions: [
            { title: 'A', level: null, salary: 1000 },
            { title: 'B', level: null, salary: 2000 },
          ],
        }}
      />,
    )
    expect(screen.getByText(/Vários cargos/)).toBeInTheDocument()
  })

  it('renders the max salary from positions', () => {
    render(<Card exam={baseExam} />)
    expect(screen.getByText(/R\$\s*23\.692/)).toBeInTheDocument()
  })

  it("renders '–' when all positions have null salary", () => {
    render(
      <Card
        exam={{ ...baseExam, positions: [{ title: 'Delegado', level: null, salary: null }] }}
      />,
    )
    expect(screen.getByText('–')).toBeInTheDocument()
  })

  it('renders a status badge', () => {
    render(<Card exam={baseExam} />)
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('renders the exam name heading with title attribute equal to exam name', () => {
    render(<Card exam={baseExam} />)
    const heading = screen.getByRole('heading', { name: baseExam.name })
    expect(heading).toHaveAttribute('title', baseExam.name)
  })

  it('renders the exam name heading with line-clamp-2 class', () => {
    render(<Card exam={baseExam} />)
    const heading = screen.getByRole('heading', { name: baseExam.name })
    expect(heading.className).toContain('line-clamp-2')
  })

  it('renders a link to the exam detail page', () => {
    render(<Card exam={baseExam} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/concursos/${baseExam.slug}`)
  })

  it('link navigates to exam detail in same tab', () => {
    render(<Card exam={baseExam} />)
    const link = screen.getByRole('link')
    expect(link).not.toHaveAttribute('target', '_blank')
  })

  it('appends encoded from param when from is provided', () => {
    render(<Card exam={baseExam} from="/concursos?status=open&region=sudeste" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute(
      'href',
      `/concursos/${baseExam.slug}?from=${encodeURIComponent('/concursos?status=open&region=sudeste')}`,
    )
  })

  it('omits from param when from is not provided', () => {
    render(<Card exam={baseExam} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/concursos/${baseExam.slug}`)
  })
})
