'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'

const hiddenOn = ['/buchung', '/kontakt']

/** Auf Mobilgeräten dauerhaft sichtbarer Button. Auf Detailseiten springt er zum Kalender. */
export function StickyCta() {
  const pathname = usePathname()
  if (hiddenOn.some((path) => pathname.startsWith(path))) return null

  const onDetailPage = pathname.startsWith('/huepfburgen/')
  const className =
    'flex h-13 w-full items-center justify-center gap-2 rounded-full bg-accent font-heading text-lg font-semibold text-accent-foreground shadow-lg shadow-foreground/20 ring-1 ring-foreground/10 transition-colors hover:bg-accent/85'
  const content = (
    <>
      <CalendarCheck className="size-5" aria-hidden="true" />
      Verfügbarkeit prüfen
    </>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" aria-hidden="true" />
      <div className="relative">
        {onDetailPage ? (
          <a href="#buchung" className={className}>
            {content}
          </a>
        ) : (
          <Link href="/huepfburgen" className={className}>
            {content}
          </Link>
        )}
      </div>
    </div>
  )
}
