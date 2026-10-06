import type { ReactNode } from 'react'

interface LegalSectionProps {
  id: string
  title: string
  children: ReactNode
}

/** Abschnitt mit Anker für Rechtstexte. Fließtext, Listen und Platzhalter-Markierung sind einheitlich gestaltet. */
export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className="scroll-mt-24">
      <h2 id={`${id}-titel`} className="text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <div className="mt-3 flex max-w-3xl flex-col gap-3 leading-relaxed [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  )
}

/** Markiert einen Wert, der noch durch echte Angaben ersetzt werden muss. */
export function Placeholder({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-accent/60 px-1 text-accent-foreground">{children}</mark>
}
