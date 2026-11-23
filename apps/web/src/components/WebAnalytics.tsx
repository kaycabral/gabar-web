'use client'

import { redactAnalyticsEvent } from '@/lib/web-analytics'
import { Analytics } from '@vercel/analytics/next'

export function WebAnalytics() {
  return <Analytics beforeSend={redactAnalyticsEvent} />
}
