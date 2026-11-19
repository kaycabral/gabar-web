import { describe, expect, it } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes accents', () => {
    expect(slugify('Polícia Federal')).toBe('policia-federal')
  })

  it('replaces non-alphanumeric with hyphens', () => {
    expect(slugify('Edital nº 01/2016 - Abertura')).toBe('edital-n-01-2016-abertura')
  })

  it('collapses consecutive hyphens', () => {
    expect(slugify('a---b')).toBe('a-b')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello')
  })
})
