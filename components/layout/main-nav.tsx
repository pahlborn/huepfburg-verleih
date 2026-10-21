'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { normalizePath } from '@/components/layout/availability-button'
import { navigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/** Hauptnavigation am Desktop. Die aktuelle Seite ist hervorgehoben. */
export function MainNav() {
  const path = normalizePath(usePathname())
  return (
    <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 lg:flex">
      {navigation.map((item) => {
        const active = path === item.href || path.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-full px-4 py-2 font-semibold transition-colors hover:bg-secondary hover:text-foreground',
              active ? 'bg-secondary text-primary' : 'text-foreground/85',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
