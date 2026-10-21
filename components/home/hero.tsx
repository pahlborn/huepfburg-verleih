import { Check, Package, Truck } from 'lucide-react'
import { formatEuro } from '@/lib/format'
import { pricingConfig } from '@/lib/pricing'
import { DateFilter } from '@/components/booking/date-filter'
import { PlaceholderImage } from '@/components/common/placeholder-image'
import type { ISODate } from '@/lib/dates'
import { siteConfig } from '@/lib/site-config'
import { WeatherFootnote } from '@/components/common/weather-note'

const promises = [
  'Verfügbarkeit und Preis sofort sehen',
  `${siteConfig.rentalTerms.weatherBadge}*`,
  'Kaution transparent, getrennt ausgewiesen',
]

export function Hero({ today }: { today: ISODate }) {
  return (
    <section className="bg-secondary/60" aria-labelledby="hero-titel">
      {/* Raster: auf dem Handy Titel, Abholung/Lieferung, Termin, Bild untereinander;
          am Desktop links Titel und Termin, rechts oben Abholung/Lieferung, darunter das Bild. */}
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="rise-in lg:col-start-1 lg:row-start-1">
          <p className="mb-3 text-sm font-bold tracking-wide text-primary uppercase">{siteConfig.serviceArea.headline}</p>
          <h1 id="hero-titel" className="text-5xl font-semibold text-balance sm:text-6xl">
            Hüpfburg in 2 Minuten buchen
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Für Kindergeburtstag, Vereinsfest und Firmenfeier. Datum wählen, Preis sehen, buchen. Ohne Anfrage und ohne
            Warten auf eine Antwort.
          </p>
        </div>

        <ul
          className="rise-in grid gap-3 self-end sm:grid-cols-2 lg:col-start-2 lg:row-start-1 [animation-delay:80ms]"
          aria-label="Abholen oder liefern lassen"
        >
          <li className="flex items-start gap-3 rounded-2xl border-2 bg-card p-4 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Package className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg leading-tight font-semibold">Selbst abholen</span>
              <span className="text-sm text-muted-foreground">Ohne Aufpreis in {siteConfig.address.city}. Aufbau nach Anleitung.</span>
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border-2 bg-card p-4 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Truck className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg leading-tight font-semibold">Liefern lassen</span>
              <span className="text-sm text-muted-foreground">
                Wir bringen, bauen auf und ab. Ab {formatEuro(pricingConfig.deliveryZones[0].fee)} je nach Entfernung.
              </span>
            </span>
          </li>
        </ul>

        <div className="rise-in lg:col-start-1 lg:row-start-2">
          <ul className="flex flex-col gap-2">
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2 font-medium">
                <Check className="size-5 shrink-0 text-primary" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
          <DateFilter today={today} inputId="hero-datum" anchorId="zeitraum" className="mt-6 max-w-xl" />
          <WeatherFootnote className="mt-3 max-w-xl" />
        </div>

        <div className="rise-in aspect-[4/3] self-start overflow-hidden rounded-[2rem] border-4 border-background shadow-lg lg:col-start-2 lg:row-start-2 [animation-delay:120ms]">
          <PlaceholderImage label="Hero-Foto: Hüpfburg mit Kindern im Garten" tone="sun" />
        </div>
      </div>
    </section>
  )
}
