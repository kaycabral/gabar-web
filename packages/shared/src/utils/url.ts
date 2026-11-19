/**
 * Normaliza uma URL garantindo que tenha protocolo.
 *
 * - `https://...` / `http://...` → retorna como está
 * - `//example.com` (protocol-relative) → `https://example.com`
 * - `www.example.com` / `domain.com/path` → `https://domain.com/path`
 * - `/path/relativo` (sem domínio) → null
 * - null / undefined / vazio → null
 */
export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const s = url.trim()
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) return null
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[\w-]+)+/i.test(s)) return `https://${s}`
  return null
}
