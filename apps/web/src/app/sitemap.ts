import { SITE_URL } from '@/lib/constants'
import { getSitemapEntries } from '@/lib/exams-api'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { exams, documents } = await getSitemapEntries()
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/concursos` },
    { url: `${SITE_URL}/concursos/categorias` },
    ...exams.map((exam) => ({
      url: `${SITE_URL}/concursos/${exam.slug}`,
      lastModified: exam.lastModified,
    })),
    ...documents.map((doc) => ({
      url: `${SITE_URL}/concursos/${doc.examSlug}/documento/${doc.slug}`,
      lastModified: doc.lastModified,
    })),
  ]
}
