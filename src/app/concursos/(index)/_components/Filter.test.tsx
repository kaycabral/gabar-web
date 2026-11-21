import type { Exam } from '@/shared'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Filter from './ExamsShell'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const mockExams: Exam[] = [
  {
    id: 'trt-2025',
    slug: 'trt-2025',
    name: 'TRT 2ª Região 2025',
    examiningBoard: 'FCC',
    institution: 'TRT 2ª Região',
    positions: [{ title: 'Analista Judiciário', level: null, salary: 13994 }],
    vacancies: 42,
    state: 'SP',
    city: 'São Paulo',
    region: 'Southeast',
  },
  {
    id: 'pf-2025',
    slug: 'pf-2025',
    name: 'Polícia Federal 2025',
    examiningBoard: 'CESPE/CEBRASPE',
    institution: 'Polícia Federal',
    positions: [{ title: 'Delegado de Polícia', level: null, salary: 23692 }],
    vacancies: 192,
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
  },
]

const defaultProps = {
  exams: mockExams,
  cities: ['Brasília', 'São Paulo'],
  examiningBoards: ['FCC', 'CESPE/CEBRASPE'],
  page: 1,
  totalPages: 1,
  total: mockExams.length,
  salaryMax: 25000,
}

describe('ExamsShell', () => {
  it('renders the search input', () => {
    render(<Filter {...defaultProps} />)
    expect(screen.getByPlaceholderText(/buscar por nome ou cargo/i)).toBeInTheDocument()
  })

  it('renders the Filters button', () => {
    render(<Filter {...defaultProps} />)
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument()
  })

  it('renders all exams passed in via List', () => {
    render(<Filter {...defaultProps} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('opens the FilterDrawer when Filters button is clicked', () => {
    render(<Filter {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /filtros/i }))
    expect(screen.getByRole('dialog')).toBeVisible()
  })
})
