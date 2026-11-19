import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/**/_e2e/**', 'node_modules'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // `server-only` (Next.js) bloqueia imports em client components no
      // build do Next, mas não tem semântica em vitest. Alias pro shim noop
      // canônico permite testar módulos que importam server-only diretamente.
      'server-only': path.resolve(__dirname, './vitest.server-only-shim.ts'),
    },
  },
})
