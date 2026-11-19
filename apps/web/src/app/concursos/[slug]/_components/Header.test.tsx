import type { Exam } from '@gabar/shared'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header'

const baseExam: Exam = {
  id: 'test-001',
  slug: 'test-001',
  name: 'Polícia Federal 2025',
  examiningBoard: 'CESPE/CEBRASPE',
  institution: 'Polícia Federal',
  positions: [{ title: 'Delegado de Polícia Federal', level: null, salary: 23692 }],
  vacancies: 192,
  state: 'DF',
  city: 'Brasília',
  region: 'Central-West',
  status: 'upcoming',
}

describe('Header', () => {
  it('renders the exam name as a heading', () => {
    render(<Header exam={baseExam} />)
    expect(screen.getByRole('heading', { name: 'Polícia Federal 2025' })).toBeInTheDocument()
  })

  it('renders the organizing body', () => {
    render(<Header exam={baseExam} />)
    expect(screen.getByText('CESPE/CEBRASPE')).toBeInTheDocument()
  })

  it('renders a status badge', () => {
    render(<Header exam={baseExam} />)
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('renders the share button', () => {
    render(<Header exam={baseExam} />)
    expect(screen.getByRole('button', { name: /compartilhar/i })).toBeInTheDocument()
  })
})
