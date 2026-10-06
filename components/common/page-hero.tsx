import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  title: string
  intro?: ReactNode
  eyebrow?: string
  children?: ReactNode
  className?: string
}

/** Einheitlicher Seitenkopf für Unterseiten. */
export function PageHero({ title, intro, eyebrow, children, className }: PageHeroProps) {
  return (
    <section className={cn('bg-secondary/60', className)}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {eyebrow ? <p className="mb-2 text-sm font-bold tracking-wide text-primary uppercase">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        {intro ? <div className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</div> : null}
        {children}
      </div>
    </section>
  )
}
