import Link from 'next/link'
import { CalendarCheck, Castle, MapPin } from 'lucide-react'
import { AvailabilityLink } from '@/components/layout/availability-button'
import { MainNav } from '@/components/layout/main-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { siteConfig } from '@/lib/site-config'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Castle className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="font-heading text-base leading-tight font-semibold sm:text-xl">{siteConfig.name}</span>
        <span className="flex items-center gap-1 text-xs leading-tight font-semibold text-primary sm:text-sm">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {siteConfig.serviceArea.short}
        </span>
      </span>
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

        <MainNav />

        <div className="flex items-center gap-2">
          <AvailabilityLink className="hidden h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 font-heading text-base font-medium whitespace-nowrap text-accent-foreground transition-colors hover:bg-accent/85 sm:inline-flex">
            <CalendarCheck className="size-5" aria-hidden="true" />
            Verfügbarkeit prüfen
          </AvailabilityLink>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
