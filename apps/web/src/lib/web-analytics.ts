import type { BeforeSendEvent } from '@vercel/analytics/next'

/** Origin + path: query string and fragment never leave the browser. */
export function redactAnalyticsUrl(url: string): string | null {
  if (!URL.canParse(url)) return null
  const parsed = new URL(url)
  return `${parsed.origin}${parsed.pathname}`
}

/** `beforeSend` for `<Analytics />`: drops the event when the URL is unparseable. */
export function redactAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = redactAnalyticsUrl(event.url)
  return url === null ? null : { ...event, url }
}
