import { Nav } from '@/app/_components/Nav'

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav minimal />
      {children}
    </>
  )
}
