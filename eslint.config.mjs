import baseConfig from '@cbrl/eslint-config'

export default [
  ...baseConfig,
  {
    // Agent worktrees live under .claude/ in a local checkout.
    ignores: ['.husky/**', '.claude/**'],
  },
  // Production code logs through `@cbrl/log` (structured, PII-redacted), never
  // raw `console.*`.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },
]
