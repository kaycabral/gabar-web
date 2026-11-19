import { render } from '@testing-library/react'
import type React from 'react'
import { describe, it, vi } from 'vitest'
import { LandingPage } from './LandingPage'

vi.mock('@/app/actions/waitlist', () => ({
  joinWaitlist: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

describe('LandingPage', () => {
  it('renderiza sem erros', () => {
    render(<LandingPage stats={{ totalExams: 1600, activeExams: 354 }} />)
  })
})
