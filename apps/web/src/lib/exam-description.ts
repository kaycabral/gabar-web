import type { Exam } from '@gabar/shared'

/** Meta description of an exam page; fields without data are left out instead of shown as "?". */
export function examDescription(exam: Pick<Exam, 'positions' | 'vacancies' | 'examiningBoard'>) {
  const positions = exam.positions?.map((p) => p.title).join(', ')
  const vacancies =
    exam.vacancies == null ? null : `${exam.vacancies} ${exam.vacancies === 1 ? 'vaga' : 'vagas'}`
  return [positions || 'Concurso público', vacancies, exam.examiningBoard]
    .filter(Boolean)
    .join(' | ')
}
