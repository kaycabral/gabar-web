'use client'

import type { LandingStats } from '@/lib/exams-api'
import { useState } from 'react'
import { Comparison } from './Comparison'
import { CTA } from './CTA'
import { FAQ } from './FAQ'
import { Features } from './Features'
import { FounderStory } from './FounderStory'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { MatchHighlight } from './MatchHighlight'
import { Nav } from './Nav'
import { Problem } from './Problem'
import { Quote } from './Quote'
import { WaitlistModal } from './WaitlistModal'

interface LandingPageProps {
  stats: LandingStats
}

export function LandingPage({ stats }: LandingPageProps) {
  const [open, setOpen] = useState(false)
  const [modalKey, setModalKey] = useState(0)

  function handleOpen() {
    setModalKey((k) => k + 1)
    setOpen(true)
  }

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <a
        href="#main-content"
        className="focus-visible:bg-background focus-visible:ring-ring focus-visible:text-foreground sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:rounded-md focus-visible:px-4 focus-visible:py-2 focus-visible:ring-2"
      >
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="main-content">
        <Hero onOpenWaitlist={handleOpen} stats={stats} />
        <Problem />
        <Features />
        <MatchHighlight onOpenWaitlist={handleOpen} />
        <HowItWorks />
        <Comparison />
        <FounderStory />
        <Quote />
        <CTA onOpenWaitlist={handleOpen} />
        <FAQ />
      </main>
      <WaitlistModal key={modalKey} open={open} onOpenChange={setOpen} />
    </div>
  )
}
