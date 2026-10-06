import Link from 'next/link'
import { Castle } from 'lucide-react'
import { LinkButton } from '@/components/common/link-button'
import { MobileNav } from '@/components/layout/mobile-nav'
import { navigation, siteConfig } from '@/lib/site-config'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Castle className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="font-heading text-lg leading-tight font-semibold text-balance sm:text-xl">{siteConfig.name}</span>
    </span>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${siteConfig.name}, zur Startseite`} className="rounded-lg">
          <BrandMark />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-semibold text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href="/huepfburgen" variant="sun" className="hidden sm:inline-flex">
            Verfügbarkeit prüfen
          </LinkButton>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
