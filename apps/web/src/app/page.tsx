import { getLandingStats } from '@/lib/exams-api'
import type { Metadata } from 'next'
import { LandingPage } from './_components/LandingPage'

export const metadata: Metadata = {
  title: 'Gabar — Concursos com Inteligência',
  description:
    'A plataforma all-in-one de concursos públicos com IA. Plano de estudo, simulados e análise de banca. Do edital à posse.',
  openGraph: {
    title: 'Gabar — Concursos com Inteligência',
    description:
      'A plataforma all-in-one de concursos públicos com IA. Plano de estudo, simulados e análise de banca. Do edital à posse.',
    url: 'https://gabar.com.br',
    siteName: 'Gabar',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gabar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gabar — Concursos com Inteligência',
    description:
      'A plataforma all-in-one de concursos públicos com IA. Plano de estudo, simulados e análise de banca. Do edital à posse.',
    images: ['/og-image.png'],
  },
}

export default async function HomePage() {
  const stats = await getLandingStats()
  return <LandingPage stats={stats} />
}
