'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'

/** Ohne abschließenden Schrägstrich, damit "/huepfburgen/" und "/huepfburgen" gleich behandelt werden. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

/**
 * Wohin "Verfügbarkeit prüfen" führt:
 * - auf der Seite einer Burg zu deren Kalender,
 * - auf Start- und Übersichtsseite zum Feld "Wann brauchen Sie die Hüpfburg?",
 * - überall sonst zur Übersicht mit diesem Feld.
 */
export function useAvailabilityTarget(): { href: string; samePage: boolean; anchor: string } {
  const path = normalizePath(usePathname())
  if (path.startsWith('/huepfburgen/')) return { href: '#buchung', samePage: true, anchor: 'buchung' }
  if (path === '/' || path === '/huepfburgen') return { href: '#zeitraum', samePage: true, anchor: 'zeitraum' }
  return { href: '/huepfburgen#zeitraum', samePage: false, anchor: 'zeitraum' }
}

/** Springt weich zum Ziel und setzt den Cursor ins erste Datumsfeld. */
function jumpTo(anchor: string, event: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById(anchor)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${anchor}`)
  const input = target.querySelector<HTMLInputElement>('input[type="date"]')
  input?.focus({ preventScroll: true })
}

export function AvailabilityLink({ className, children }: { className?: string; children: ReactNode }) {
  const { href, samePage, anchor } = useAvailabilityTarget()
  if (samePage) {
    return (
      <a href={href} className={className} onClick={(event) => jumpTo(anchor, event)}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
