/**
 * Mapa de extensões de arquivo → MIME type para documentos legíveis.
 *
 * Fonte de verdade compartilhada entre scraper e enricher:
 * - Scraper: usa as chaves para filtrar links que entram em `documents`
 * - Enricher: usa os valores para informar o MIME type ao Vertex AI / Gemini
 */
export const SUPPORTED_MIME_TYPES: Readonly<Record<string, string>> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.htm': 'text/html',
}
