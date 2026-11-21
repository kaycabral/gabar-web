// Post-deploy smoke tests against the deployed URL in SMOKE_BASE_URL. Starts no
// server; only makes HTTP requests.

import { defineSmokeConfig } from '@cbrl/testing/playwright'

export default defineSmokeConfig()
