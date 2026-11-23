import { describe, expect, it } from 'vitest'
import { redactAnalyticsEvent, redactAnalyticsUrl } from './web-analytics'

const ORIGIN = 'https://gabar.example'

describe('redactAnalyticsUrl', () => {
  it('drops the query string and the fragment', () => {
    expect(redactAnalyticsUrl(`${ORIGIN}/concursos?status=aberto&uf=AM#lista`)).toBe(
      `${ORIGIN}/concursos`,
    )
  })

  it('keeps public exam and document slugs', () => {
    expect(redactAnalyticsUrl(`${ORIGIN}/concursos/tj-am-2026/documento/edital-1`)).toBe(
      `${ORIGIN}/concursos/tj-am-2026/documento/edital-1`,
    )
  })

  it('returns null for an unparseable url', () => {
    expect(redactAnalyticsUrl('not a url')).toBeNull()
  })
})

describe('redactAnalyticsEvent', () => {
  it('rewrites the url and keeps the event type', () => {
    expect(redactAnalyticsEvent({ type: 'pageview', url: `${ORIGIN}/?ref=x` })).toEqual({
      type: 'pageview',
      url: `${ORIGIN}/`,
    })
  })

  it('drops the event when the url cannot be parsed', () => {
    expect(redactAnalyticsEvent({ type: 'event', url: '::' })).toBeNull()
  })
})
