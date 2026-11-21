import type { FilterState } from '@/lib/filters'
import { DEFAULT_SORT } from '@/lib/filters'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FilterDrawer from './FilterDrawer'

const salaryMax = 25000

const defaultFilters: FilterState = {
  search: '',
  status: undefined,
  examiningBoard: undefined,
  salaryMin: 0,
  salaryMax,
  region: undefined,
  state: undefined,
  city: undefined,
  sort: DEFAULT_SORT,
}

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  filters: defaultFilters,
  onFiltersChange: vi.fn(),
  cities: ['Brasília', 'São Paulo'],
  examiningBoards: ['FCC', 'CESPE/CEBRASPE'],
  salaryMax,
  resultCount: 128,
}

describe('FilterDrawer', () => {
  it('renders the drawer title', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Filtros' })).toBeInTheDocument()
  })

  it('renders status as segmented buttons', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Aberto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Em breve' })).toBeInTheDocument()
  })

  it('renders salary range label', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByText('Remuneração')).toBeInTheDocument()
  })

  it('renders region select', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByLabelText(/^região$/i)).toBeInTheDocument()
  })

  it('renders city select', () => {
    render(<FilterDrawer {...defaultProps} />)
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
  })

  it('renders Aplicar button with result count', () => {
    render(<FilterDrawer {...defaultProps} resultCount={128} />)
    expect(screen.getByRole('button', { name: /Aplicar · 128/ })).toBeInTheDocument()
  })

  it('commits draft to onFiltersChange when Aplicar is clicked', () => {
    const onFiltersChange = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <FilterDrawer
        {...defaultProps}
        onFiltersChange={onFiltersChange}
        onOpenChange={onOpenChange}
      />,
    )

    // Click a status chip to create a draft change
    fireEvent.click(screen.getByRole('button', { name: 'Aberto' }))

    // Then Aplicar commits
    fireEvent.click(screen.getByRole('button', { name: /Aplicar/ }))
    expect(onFiltersChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'open' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when open is false', () => {
    render(<FilterDrawer {...defaultProps} open={false} />)
    expect(screen.queryByRole('heading', { name: 'Filtros' })).not.toBeInTheDocument()
  })
})
