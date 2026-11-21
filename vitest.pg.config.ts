import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Postgres integration suite: runs against a REAL database from
// `GABAR_DATABASE_URL` (docker/postgres.compose.yaml locally, `services:` in CI)
// so constraints are proven natively. Files share one database and truncate
// between tests, hence no file parallelism.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/db/**/*.pg.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
