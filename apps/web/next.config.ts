import { execSync } from 'node:child_process'

import type { NextConfig } from 'next'

// Build-time git SHA, served by `/api/health` to confirm which commit is live.
// Vercel exposes it as VERCEL_GIT_COMMIT_SHA; falls back to local git, then
// 'unknown' (local dev without an accessible .git does not break).
const commitSha = (() => {
  if (process.env.NEXT_PUBLIC_COMMIT_SHA) return process.env.NEXT_PUBLIC_COMMIT_SHA
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return 'unknown'
  }
})()

// Defense in depth. The site is public and read-only: no analytics and no auth.
// The browser only talks to same-origin routes and Cloudflare Turnstile.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com",
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ['ideapad.local'],
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
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

export default nextConfig
