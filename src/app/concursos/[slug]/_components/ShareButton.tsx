'use client'

import { whatsappShareUrl } from '@cbrl/br/phone'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  WhatsappIcon,
} from '@cbrl/design'
import { Check, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

import { DialogCloseButton } from '@/components/DialogCloseButton'

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function buildSocialLinks(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  return [
    {
      name: 'WhatsApp',
      icon: WhatsappIcon,
      href: whatsappShareUrl(`${text}\n\n${url}`),
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'X',
      icon: XIcon,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]
}

interface ShareButtonProps {
  examName: string
}

export default function ShareButton({ examName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  function handleOpenChange(open: boolean) {
    if (open) {
      setUrl(window.location.href)
    } else {
      setCopied(false)
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="Compartilhar link desta página">
          <Share2 />
          <span className="sr-only sm:not-sr-only">Compartilhar</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-6 border p-6 text-base shadow-lg ring-0 sm:max-w-md sm:rounded-2xl"
      >
        <DialogCloseButton />
        <DialogHeader className="gap-1.5">
          <DialogTitle className="font-sans font-semibold tracking-tight">Compartilhar</DialogTitle>
          <DialogDescription>Compartilhe este concurso com outras pessoas.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4">
          {buildSocialLinks(url, `Veja este concurso: ${examName} no Gabar`).map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compartilhar no ${social.name}`}
              className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1.5 transition-colors"
            >
              <span className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border">
                <social.icon className="h-4 w-4" />
              </span>
              <span className="text-[0.7rem]">{social.name}</span>
            </a>
          ))}
        </div>
        <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-lg border py-2 pr-2 pl-3">
          <span className="text-muted-foreground min-w-0 flex-1 truncate text-sm">{url}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleCopyLink}
            aria-label="Copiar link"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
