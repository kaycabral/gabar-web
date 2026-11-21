import Link from 'next/link'

type FooterLinkBase = {
  label: string
}

type FooterLinkNav = FooterLinkBase & {
  href: string
  external?: boolean
  onClick?: never
}

type FooterLinkAction = FooterLinkBase & {
  onClick: () => void
  href?: never
  external?: never
}

export type FooterLink = FooterLinkNav | FooterLinkAction

interface FooterLinkColumnProps {
  title: string
  links: FooterLink[]
}

const linkClass = 'text-foreground hover:text-muted-foreground text-[0.875rem] transition-colors'

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-meta text-muted-foreground">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => {
          const content = (() => {
            if ('onClick' in link && link.onClick) {
              return (
                <button type="button" onClick={link.onClick} className={`${linkClass} text-left`}>
                  {link.label}
                </button>
              )
            }
            if (link.external) {
              return (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              )
            }
            return (
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          })()
          return <li key={link.label}>{content}</li>
        })}
      </ul>
    </div>
  )
}
