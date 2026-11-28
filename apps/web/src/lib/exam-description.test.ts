import { describe, expect, it } from 'vitest'
import { examDescription } from './exam-description'

const position = (title: string) => ({
  title,
  level: null,
  salary: null,
  vacancies: null,
  registrationFee: null,
  subjects: null,
})

describe('examDescription', () => {
  it('joins positions, vacancies and board', () => {
    expect(
      examDescription({
        positions: [position('Escrevente'), position('Oficial')],
        vacancies: 120,
        examiningBoard: 'FGV',
      }),
    ).toBe('Escrevente, Oficial | 120 vagas | FGV')
  })

  it('leaves out missing vacancies instead of printing "?"', () => {
    expect(examDescription({ positions: null, vacancies: null, examiningBoard: 'FGV' })).toBe(
      'Concurso público | FGV',
    )
  })

  it('uses the singular for one vacancy', () => {
    expect(examDescription({ positions: [], vacancies: 1, examiningBoard: 'FGV' })).toBe(
      'Concurso público | 1 vaga | FGV',
    )
  })
})
