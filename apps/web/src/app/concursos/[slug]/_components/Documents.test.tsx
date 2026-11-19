import type { Exam } from '@gabar/shared'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Documents from './Documents'

const examWithDocuments: Exam = {
  id: 'correios-2025',
  slug: 'correios-2025',
  name: 'Correios 2025',
  examiningBoard: 'IADES',
  institution: 'Correios',
  positions: [{ title: 'Carteiro', level: null, salary: 2429 }],
  vacancies: 3000,
  state: 'SP',
  city: 'São Paulo',
  region: 'Southeast',
  documents: [
    {
      slug: 'edital-correios-2025-carteiro',
      title: 'Edital Correios 2025 – Carteiro',
      date: '2025-01-15',
      url: 'https://example.com/edital.pdf',
    },
    {
      slug: 'gabarito-preliminar',
      title: 'Gabarito Preliminar',
      date: '2025-03-10',
      url: 'https://example.com/gabarito.pdf',
    },
  ],
}

const examWithTypedDocuments: Exam = {
  ...examWithDocuments,
  documents: [
    {
      slug: 'edital-de-abertura',
      title: 'Edital de Abertura',
      date: '2025-01-15',
      url: 'https://example.com/edital.pdf',
      type: 'notice',
    },
    {
      slug: 'retificacao-n-01',
      title: 'Retificação nº 01',
      date: '2025-01-20',
      url: 'https://example.com/retificacao.pdf',
      type: 'notice',
    },
    {
      slug: 'gabarito-preliminar',
      title: 'Gabarito Preliminar',
      date: '2025-03-10',
      url: 'https://example.com/gabarito.pdf',
      type: 'answer-key',
    },
    {
      slug: 'resultado-final',
      title: 'Resultado Final',
      date: '2025-04-01',
      url: 'https://example.com/resultado.pdf',
      type: 'result',
    },
  ],
}

const examWithoutDocuments: Exam = {
  ...examWithDocuments,
  documents: undefined,
}

describe('Documents', () => {
  it('renders document titles', () => {
    render(<Documents examSlug="correios-2025" exam={examWithDocuments} />)
    expect(screen.getByText('Edital Correios 2025 – Carteiro')).toBeInTheDocument()
    expect(screen.getByText('Gabarito Preliminar')).toBeInTheDocument()
  })

  it('renders the section heading', () => {
    render(<Documents examSlug="correios-2025" exam={examWithDocuments} />)
    expect(screen.getByRole('heading', { name: 'Arquivos e links' })).toBeInTheDocument()
  })

  it('renders document links with correct href', () => {
    render(<Documents examSlug="correios-2025" exam={examWithDocuments} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://example.com/edital.pdf')
    expect(links[1]).toHaveAttribute('href', 'https://example.com/gabarito.pdf')
  })

  it('renders nothing when documents is undefined', () => {
    const { container } = render(<Documents examSlug="correios-2025" exam={examWithoutDocuments} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when documents array is empty', () => {
    const { container } = render(
      <Documents examSlug="correios-2025" exam={{ ...examWithDocuments, documents: [] }} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders tabs when documents have multiple types', () => {
    render(<Documents examSlug="correios-2025" exam={examWithTypedDocuments} />)
    expect(screen.getByRole('tab', { name: 'Editais' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Provas e Gabaritos' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Resultados' })).toBeInTheDocument()
  })

  it('shows documents of the default (first) tab', () => {
    render(<Documents examSlug="correios-2025" exam={examWithTypedDocuments} />)
    expect(screen.getByText('Edital de Abertura')).toBeInTheDocument()
    expect(screen.getByText('Retificação nº 01')).toBeInTheDocument()
  })

  it('renders flat list when all documents have the same type', () => {
    const exam: Exam = {
      ...examWithDocuments,
      documents: [
        {
          slug: 'edital-1',
          title: 'Edital 1',
          date: null,
          url: 'https://example.com/1.pdf',
          type: 'notice',
        },
        {
          slug: 'edital-2',
          title: 'Edital 2',
          date: null,
          url: 'https://example.com/2.pdf',
          type: 'notice',
        },
      ],
    }
    render(<Documents examSlug="correios-2025" exam={exam} />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByText('Edital 1')).toBeInTheDocument()
    expect(screen.getByText('Edital 2')).toBeInTheDocument()
  })

  it('groups documents without type under "Outros"', () => {
    const exam: Exam = {
      ...examWithDocuments,
      documents: [
        {
          slug: 'edital',
          title: 'Edital',
          date: null,
          url: 'https://example.com/1.pdf',
          type: 'notice',
        },
        { slug: 'comunicado', title: 'Comunicado', date: null, url: 'https://example.com/2.pdf' },
      ],
    }
    render(<Documents examSlug="correios-2025" exam={exam} />)
    expect(screen.getByRole('tab', { name: 'Editais' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Outros' })).toBeInTheDocument()
  })

  it('renders "Ver" link when document has content', () => {
    const exam: Exam = {
      ...examWithDocuments,
      documents: [
        {
          slug: 'edital-correios-2025',
          title: 'Edital Correios 2025',
          date: '2025-01-15',
          url: 'https://example.com/edital.pdf',
          hasContent: true,
        },
      ],
    }
    render(<Documents examSlug="correios-2025" exam={exam} />)
    const verLink = screen.getByLabelText('Ver conteúdo de Edital Correios 2025')
    expect(verLink).toHaveAttribute(
      'href',
      '/concursos/correios-2025/documento/edital-correios-2025',
    )
  })

  it('does not render "Ver" link when document has no content', () => {
    render(<Documents examSlug="correios-2025" exam={examWithDocuments} />)
    expect(screen.queryByText('Ver')).not.toBeInTheDocument()
  })
})
