import { beforeEach, describe, expect, it, vi } from 'vitest'
import { joinWaitlist } from './waitlist'

const insert = vi.fn<(email: string) => Promise<'joined' | 'already-joined'>>()

vi.mock('@/lib/db', () => ({
  joinWaitlist: (email: string) => insert(email),
}))

function makeFormData(email?: string): FormData {
  const fd = new FormData()
  if (email !== undefined) fd.append('email', email)
  return fd
}

const idle = { status: 'idle' as const }

describe('joinWaitlist — validação de email', () => {
  it('rejeita email ausente', async () => {
    const result = await joinWaitlist(idle, makeFormData())
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })

  it('rejeita string vazia', async () => {
    const result = await joinWaitlist(idle, makeFormData(''))
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })

  it('rejeita "@" isolado', async () => {
    const result = await joinWaitlist(idle, makeFormData('@'))
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })

  it('rejeita "a@" sem domínio', async () => {
    const result = await joinWaitlist(idle, makeFormData('a@'))
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })

  it('rejeita "@@" duplo arroba', async () => {
    const result = await joinWaitlist(idle, makeFormData('@@'))
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })

  it('rejeita email sem arroba', async () => {
    const result = await joinWaitlist(idle, makeFormData('semarroba'))
    expect(result).toEqual({ status: 'error', message: 'Insira um e-mail válido.' })
  })
})

describe('joinWaitlist — escrita no Postgres', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna success para email válido inserido', async () => {
    insert.mockResolvedValue('joined')
    const result = await joinWaitlist(idle, makeFormData('valido@email.com'))
    expect(result).toEqual({ status: 'success' })
    expect(insert).toHaveBeenCalledWith('valido@email.com')
  })

  it('aceita email com espaços (trim)', async () => {
    insert.mockResolvedValue('joined')
    const result = await joinWaitlist(idle, makeFormData('  valido@email.com  '))
    expect(result).toEqual({ status: 'success' })
    expect(insert).toHaveBeenCalledWith('valido@email.com')
  })

  it('normaliza email para lowercase antes de inserir', async () => {
    insert.mockResolvedValue('joined')
    await joinWaitlist(idle, makeFormData('Usuario@Email.COM'))
    expect(insert).toHaveBeenCalledWith('usuario@email.com')
  })

  it('retorna erro de duplicado quando o email já está na lista', async () => {
    insert.mockResolvedValue('already-joined')
    const result = await joinWaitlist(idle, makeFormData('ja@cadastrado.com'))
    expect(result).toEqual({ status: 'error', message: 'Este e-mail já está na lista.' })
  })

  it('retorna erro genérico quando o banco falha', async () => {
    insert.mockRejectedValue(new Error('connection refused'))
    const result = await joinWaitlist(idle, makeFormData('teste@email.com'))
    expect(result).toEqual({ status: 'error', message: 'Algo deu errado. Tente novamente.' })
  })
})
