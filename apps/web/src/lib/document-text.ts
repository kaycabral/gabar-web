// Reads the extracted text of a document. Older texts are still in Postgres
// (`markdown`); newer ones are gzip files in a private Storage bucket, which
// the site reads with the publishable key: a Storage policy only lets it read
// texts of documents of published exams.

import { gunzipSync } from 'node:zlib'
import 'server-only'

const TEXT_BUCKET = 'document-texts'

export interface DocumentTextSource {
  markdown: string | null
  storagePath: string | null
}

function storageConfig(): { url: string; key: string } {
  const url = process.env.GABAR_SUPABASE_URL
  const key = process.env.GABAR_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error('GABAR_SUPABASE_URL and GABAR_SUPABASE_PUBLISHABLE_KEY are required')
  }
  return { url: url.replace(/\/+$/, ''), key }
}

/**
 * Text of a document, from Postgres or from Storage.
 *
 * @returns the text, or null when the document has none.
 * @throws when the Storage read fails, so a transient error is not cached as missing text.
 */
export async function readDocumentText(source: DocumentTextSource): Promise<string | null> {
  if (source.markdown !== null) return source.markdown
  if (source.storagePath === null) return null

  const { url, key } = storageConfig()
  const path = source.storagePath.split('/').map(encodeURIComponent).join('/')
  const response = await fetch(`${url}/storage/v1/object/authenticated/${TEXT_BUCKET}/${path}`, {
    headers: { apikey: key },
  })
  if (!response.ok) {
    throw new Error(`document text read failed: HTTP ${response.status}`)
  }
  return gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8')
}
