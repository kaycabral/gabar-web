import baseConfig from '@cbrl/eslint-config'

export default [
  ...baseConfig,
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
