import { Check } from 'lucide-react'
import { DateFilter } from '@/components/booking/date-filter'
import { PlaceholderImage } from '@/components/common/placeholder-image'
import type { ISODate } from '@/lib/dates'
import { siteConfig } from '@/lib/site-config'

const promises = ['Verfügbarkeit und Preis sofort sehen', 'Selbstabholung oder Lieferung mit Aufbau', 'Kaution transparent, getrennt ausgewiesen']

export function Hero({ today }: { today: ISODate }) {
  return (
    <section className="bg-secondary/60" aria-labelledby="hero-titel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="rise-in">
          <p className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">{siteConfig.serviceArea.headline}</p>
          <h1 id="hero-titel" className="text-5xl font-semibold text-balance sm:text-6xl">
            Hüpfburg in 2 Minuten buchen
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Für Kindergeburtstag, Vereinsfest und Firmenfeier. Datum wählen, Preis sehen, buchen. Ohne Anfrage und ohne
            Warten auf eine Antwort.
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2 font-medium">
                <Check className="size-5 shrink-0 text-primary" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
          <DateFilter today={today} inputId="hero-datum" className="mt-8 max-w-xl" />
        </div>

        <div className="rise-in aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-background shadow-lg [animation-delay:120ms]">
          <PlaceholderImage label="Hero-Foto: Hüpfburg mit Kindern im Garten" tone="sun" />
        </div>
      </div>
    </section>
  )
}
