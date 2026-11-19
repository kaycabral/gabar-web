import { ThemeProvider, themeInitScript } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Footer } from './_components/Footer'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans', preload: false })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  preload: false,
})
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  axes: ['opsz'],
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gabar.com.br'),
  title: {
    template: '%s | Gabar',
    default: 'Concursos Públicos',
  },
  description: 'Explore concursos abertos, futuros e encerrados.',
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gabar' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={cn(
        'h-full',
        'antialiased',
        geist.variable,
        geistMono.variable,
        bricolage.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider defaultTheme="system">
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
