import type { Exam } from '@/shared'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Info from './Info'

const baseExam: Exam = {
  id: 'test-001',
  slug: 'test-001',
  name: 'Correios 2025',
  examiningBoard: 'IADES',
  institution: 'Correios',
  positions: [{ title: 'Carteiro', level: null, salary: 2429 }],
  vacancies: 3000,
  registrationEnd: '2026-06-15',
  state: 'SP',
  city: 'São Paulo',
  region: 'Southeast',
}

describe('Info', () => {
  it('renders the vacancy count', () => {
    render(<Info exam={baseExam} />)
    expect(screen.getByText('3.000')).toBeInTheDocument()
  })

  it('renders the salary from positions', () => {
    render(<Info exam={baseExam} />)
    expect(screen.getByText(/R\$\s*2\.429/)).toBeInTheDocument()
  })

  it("renders '–' when all positions have null salary", () => {
    render(
      <Info
        exam={{ ...baseExam, positions: [{ title: 'Carteiro', level: null, salary: null }] }}
      />,
    )
    expect(screen.getByText('–')).toBeInTheDocument()
  })

  it('renders the city and state', () => {
    render(<Info exam={baseExam} />)
    expect(screen.getByText('São Paulo – SP')).toBeInTheDocument()
  })

  it('renders the formatted registration period (end only)', () => {
    render(<Info exam={baseExam} />)
    expect(screen.getByText('até 15/06/26')).toBeInTheDocument()
  })

  it('renders the formatted registration period (start and end)', () => {
    render(
      <Info
        exam={{
          ...baseExam,
          registrationStart: '2026-05-01',
          registrationEnd: '2026-06-15',
        }}
      />,
    )
    expect(screen.getByText('01/05/26 – 15/06/26')).toBeInTheDocument()
  })

  it('renders the registration fee when all positions have the same fee', () => {
    render(
      <Info
        exam={{
          ...baseExam,
          positions: [{ title: 'Carteiro', level: null, salary: 2429, registrationFee: 80 }],
        }}
      />,
    )
    expect(screen.getByText(/R\$\s*80/)).toBeInTheDocument()
  })

  it('renders a fee range when positions have different fees', () => {
    render(
      <Info
        exam={{
          ...baseExam,
          positions: [
            { title: 'Carteiro', level: null, salary: 2429, registrationFee: 80 },
            { title: 'Analista', level: null, salary: 8000, registrationFee: 120 },
          ],
        }}
      />,
    )
    expect(screen.getByText(/R\$\s*80.*R\$\s*120/)).toBeInTheDocument()
  })

  it('does not render the registration fee when no position has one', () => {
    render(<Info exam={baseExam} />)
    expect(screen.queryByText('Taxa de inscrição')).not.toBeInTheDocument()
  })
})
