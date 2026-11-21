// CSP violation reports (report-uri / report-to), wired in next.config.ts.
// Public by design: browsers send reports without credentials. URLs arrive
// stripped of query strings and fragments, so no personal data reaches the logs.

import { logger } from '@cbrl/log'
import { cspReportRoute } from '@cbrl/next/server'

export const POST = cspReportRoute({
  onReport: (violation) => logger.warn('csp violation', { ...violation }),
})
