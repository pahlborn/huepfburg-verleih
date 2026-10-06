import { ArrowRight, MapPin, Truck } from 'lucide-react'
import { LinkButton } from '@/components/common/link-button'
import { formatEuro } from '@/lib/format'
import { pricingConfig } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

export function ServiceAreaTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="liefergebiet-titel">
      <div className="grid gap-8 rounded-[2rem] border-2 bg-card p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary uppercase">
            <MapPin className="size-4" aria-hidden="true" />
            Liefergebiet
          </p>
          <h2 id="liefergebiet-titel" className="mt-2 text-3xl font-semibold text-balance sm:text-4xl">
            {siteConfig.serviceArea.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Standard ist die Selbstabholung. Wenn Sie lieber nichts schleppen möchten, bringen wir die Burg, bauen sie auf und
            holen sie nach der Feier wieder ab. Termin nach Absprache, gegen Kostenerstattung nach Zone.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Regionen">
            {siteConfig.serviceArea.regions.map((region) => (
              <li key={region} className="rounded-full bg-secondary px-4 py-1.5 font-semibold text-primary">
                {region}
              </li>
            ))}
          </ul>
          <LinkButton href="/preise-und-liefergebiet" variant="outline" className="mt-6">
            Preise und Zonen ansehen
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>

        <ul className="flex flex-col gap-3">
          {pricingConfig.deliveryZones.map((zone) => (
            <li key={zone.id} className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/60 px-5 py-4">
              <span className="flex items-center gap-3">
                <Truck className="size-5 text-primary" aria-hidden="true" />
                <span>
                  <span className="block font-heading font-semibold">{zone.label}</span>
                  <span className="text-sm text-muted-foreground">bis {zone.maxKm} km</span>
                </span>
              </span>
              <span className="font-heading text-xl font-semibold">{formatEuro(zone.fee)}</span>
            </li>
          ))}
          <li className="rounded-2xl border border-dashed px-5 py-4 text-muted-foreground">{pricingConfig.beyondZonesLabel}</li>
        </ul>
      </div>
    </section>
  )
}
