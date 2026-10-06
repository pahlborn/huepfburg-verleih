'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { footerLinks, navigation, siteConfig } from '@/lib/site-config'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menü öffnen"
        className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="p-6">
        <SheetTitle className="font-heading text-xl">{siteConfig.name}</SheetTitle>
        <SheetDescription className="sr-only">Navigation der Website</SheetDescription>
        <nav aria-label="Mobile Navigation" className="mt-2 flex flex-col">
          {[{ href: '/', label: 'Startseite' }, ...navigation, { href: '/mietbedingungen', label: 'Mietbedingungen' }].map(
            (item) => (
              <SheetClose
                key={item.href}
                render={<Link href={item.href} />}
                className="rounded-xl px-3 py-3 text-lg font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </SheetClose>
            ),
          )}
        </nav>
        <div className="mt-auto flex flex-col gap-1 text-sm text-muted-foreground">
          {footerLinks.legal
            .filter((link) => link.href !== '/mietbedingungen')
            .map((link) => (
              <SheetClose key={link.href} render={<Link href={link.href} />} className="rounded-lg px-3 py-2 hover:bg-secondary">
                {link.label}
              </SheetClose>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
