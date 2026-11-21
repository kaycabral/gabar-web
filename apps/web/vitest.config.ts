import { coverageBase } from '@cbrl/testing/vitest'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/**/_e2e/**', 'node_modules'],
    coverage: coverageBase(),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // `server-only` guards client bundles at Next build time but throws under
      // jsdom; tests resolve it to the shared no-op shim instead.
      'server-only': createRequire(import.meta.url).resolve(
        '@cbrl/testing/vitest/server-only-shim',
      ),
    },
  },
})
