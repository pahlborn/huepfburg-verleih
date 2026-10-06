import { CalendarSearch, PartyPopper, Receipt } from 'lucide-react'

const steps = [
  {
    icon: CalendarSearch,
    title: 'Burg und Datum wählen',
    text: 'Suchen Sie sich eine Hüpfburg aus und tippen Sie im Kalender Ihren Wunschtag an. Belegte Tage sind sofort erkennbar.',
  },
  {
    icon: Receipt,
    title: 'Preis sofort sehen',
    text: 'Selbstabholung oder Lieferung? Mit Ihrer PLZ sehen Sie Miete, Lieferpauschale und Kaution getrennt, ohne Überraschung.',
  },
  {
    icon: PartyPopper,
    title: 'Buchen und feiern',
    text: 'Angaben eintragen, Zusammenfassung prüfen, buchen. Alles Weitere stimmen wir kurz mit Ihnen ab.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-16" aria-labelledby="ablauf-titel">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="ablauf-titel" className="text-3xl font-semibold sm:text-4xl">
          So funktioniert&apos;s
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col gap-3 rounded-3xl bg-background p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-bold tracking-wide text-primary uppercase">Schritt {index + 1}</span>
              </div>
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
