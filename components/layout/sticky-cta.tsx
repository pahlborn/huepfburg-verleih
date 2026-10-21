'use client'

import { AvailabilityLink, normalizePath } from '@/components/layout/availability-button'
import { usePathname } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'

const hiddenOn = ['/buchung', '/kontakt']

/** Auf Mobilgeräten dauerhaft sichtbarer Button, gleiche Funktion wie im Header (siehe availability-button.tsx). */
export function StickyCta() {
  const pathname = normalizePath(usePathname())
  if (hiddenOn.some((path) => pathname.startsWith(path))) return null

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
        <AvailabilityLink className={className}>{content}</AvailabilityLink>
      </div>
    </div>
  )
}
