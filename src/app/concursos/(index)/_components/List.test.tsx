import type { Exam } from '@/shared'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import List from './List'

const makeExam = (id: string, name: string): Exam => ({
  id,
  slug: id,
  name,
  examiningBoard: 'Test Body',
  institution: 'Test Institution',
  positions: [{ title: 'Test Role', level: null, salary: 5000 }],
  vacancies: 10,
  state: 'SP',
  city: 'São Paulo',
  region: 'Southeast',
})

describe('List', () => {
  it('renders all exam cards when list is non-empty', () => {
    const exams = [makeExam('1', 'Exam Alpha'), makeExam('2', 'Exam Beta')]
    render(<List exams={exams} />)
    expect(screen.getByText('Exam Alpha')).toBeInTheDocument()
    expect(screen.getByText('Exam Beta')).toBeInTheDocument()
  })

  it('renders the empty state when list is empty', () => {
    render(<List exams={[]} />)
    expect(screen.getByText(/nenhum concurso encontrado/i)).toBeInTheDocument()
  })

  it('renders a list element for each exam', () => {
    const exams = [makeExam('1', 'Exam Alpha'), makeExam('2', 'Exam Beta')]
    const { container } = render(<List exams={exams} />)
    expect(container.querySelectorAll('li')).toHaveLength(2)
  })
})
