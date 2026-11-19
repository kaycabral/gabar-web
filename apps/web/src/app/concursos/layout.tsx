import { Nav } from '@/app/_components/Nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav minimal />
      {children}
    </>
  )
}
