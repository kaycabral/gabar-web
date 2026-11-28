import { commitSha, cspDirectives, devOrigins, withSecurityHeaders } from '@cbrl/next/config'
import type { NextConfig } from 'next'

const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind through Turbopack's loader, as create-next-app sets it up (no PostCSS).
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // 127.0.0.1, <hostname>.local and the machine's LAN IPv4s.
  allowedDevOrigins: devOrigins(),
  // Served by /api/health to confirm which commit is live.
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/exams', destination: '/concursos', permanent: true },
      { source: '/exams/categories', destination: '/concursos/categorias', permanent: true },
      { source: '/exams/:id', destination: '/concursos/:id', permanent: true },
    ]
  },
}

// Defense in depth. The site is public and read-only, with no auth.
// The browser only talks to same-origin routes and Cloudflare Turnstile.
export default withSecurityHeaders(nextConfig, {
  csp: cspDirectives({
    'script-src': [TURNSTILE_ORIGIN],
    'connect-src': [TURNSTILE_ORIGIN],
    'frame-src': [TURNSTILE_ORIGIN],
  }),
  cspMode: 'report-only',
  reportPath: '/api/csp-report',
})
