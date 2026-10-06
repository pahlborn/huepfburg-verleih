import type { Metadata } from 'next'
import { HandCoins, Package, Truck } from 'lucide-react'
import { LinkButton } from '@/components/common/link-button'
import { PageHero } from '@/components/common/page-hero'
import { castles } from '@/lib/castles'
import { formatEuro } from '@/lib/format'
import { pricingConfig } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Preise und Liefergebiet',
  description: `Preise für Hüpfburgen und Lieferzonen im ${siteConfig.serviceArea.headline}: Selbstabholung als Standard, Lieferung mit Aufbau und Abbau gegen Kostenerstattung.`,
  alternates: { canonical: '/preise-und-liefergebiet' },
}

const cell = 'px-4 py-3 text-left align-top'
const headCell = `${cell} font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase`

export default function PricesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparent kalkuliert"
        title="Preise und Liefergebiet"
        intro="Alle Preise sind Platzhalter-Beispiele und werden vor dem Start durch die echten Werte ersetzt. Den genauen Preis für Ihren Termin sehen Sie sofort auf der Seite der jeweiligen Hüpfburg."
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6">
        <section aria-labelledby="mietpreise" className="flex flex-col gap-4">
          <h2 id="mietpreise" className="text-3xl font-semibold">
            Mietpreise
          </h2>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            Montag bis Donnerstag gilt der Wochentag-Preis. Freitag bis Sonntag und an gesetzlichen Feiertagen gilt der
            Wochenend-Preis. Das {pricingConfig.weekendPackage.label} ({pricingConfig.weekendPackage.description}) ist die
            günstigere Wahl, wenn Sie die Burg über das ganze Wochenende brauchen.
          </p>
          <div
            className="overflow-x-auto rounded-3xl border bg-card"
            role="region"
            aria-label="Preistabelle, horizontal scrollbar"
            tabIndex={0}
          >
            <table className="w-full min-w-[40rem] border-collapse">
              <caption className="sr-only">Mietpreise je Hüpfburg in Euro</caption>
              <thead>
                <tr className="border-b bg-secondary/60">
                  <th scope="col" className={headCell}>
                    Hüpfburg
                  </th>
                  <th scope="col" className={headCell}>
                    Mo bis Do
                  </th>
                  <th scope="col" className={headCell}>
                    Fr bis So / Feiertag
                  </th>
                  <th scope="col" className={headCell}>
                    {pricingConfig.weekendPackage.label}
                  </th>
                  <th scope="col" className={headCell}>
                    Kaution
                  </th>
                </tr>
              </thead>
              <tbody>
                {castles.map((castle) => (
                  <tr key={castle.slug} className="border-b last:border-b-0">
                    <th scope="row" className={`${cell} font-heading font-semibold`}>
                      {castle.name}
                      <span className="block text-sm font-normal text-muted-foreground">Größe: {castle.size}</span>
                    </th>
                    <td className={cell}>{formatEuro(castle.pricing.weekday)}</td>
                    <td className={cell}>{formatEuro(castle.pricing.weekend)}</td>
                    <td className={cell}>{formatEuro(castle.pricing.weekendPackage)}</td>
                    <td className={cell}>{formatEuro(castle.pricing.deposit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <HandCoins className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Die Kaution wird bei Übernahme fällig und nach ordnungsgemäßer Rückgabe zurückerstattet. Sie ist nicht Teil des
            Mietpreises und wird immer getrennt ausgewiesen.
          </p>
        </section>

        <section aria-labelledby="selbstabholung" className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-3xl bg-secondary/60 p-6 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <h2 id="selbstabholung" className="text-3xl font-semibold">
              Selbstabholung (Standard)
            </h2>
            <p className="leading-relaxed">
              Sie holen die Burg ab und bringen sie zurück. Das ist die günstigste Variante und ohne Lieferpauschale. Sie
              brauchen einen Kombi oder größeren Transporter und mindestens {siteConfig.rentalTerms.minPersonsForSetup}{' '}
              Personen für Auf- und Abbau. Den Platzbedarf im Fahrzeug nennen wir bei jeder Burg.
            </p>
            <p className="text-muted-foreground">{siteConfig.pickup.handoverNote}</p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl bg-secondary/60 p-6 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Truck className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-3xl font-semibold">Lieferung mit Aufbau und Abbau</h2>
            <p className="leading-relaxed">
              Optional bringen wir die Burg zu Ihnen, bauen sie auf und holen sie nach Ihrer Feier wieder ab. Der Termin wird
              abgesprochen, die Kosten werden nach Zone erstattet. Die Pauschale gilt inklusive Aufbau und Abbau.
            </p>
            <p className="text-muted-foreground">Liefergebiet: {siteConfig.serviceArea.headline}.</p>
          </div>
        </section>

        <section aria-labelledby="zonen" className="flex flex-col gap-4">
          <h2 id="zonen" className="text-3xl font-semibold">
            Lieferzonen
          </h2>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            Die Zonen richten sich nach der Entfernung vom Standort in {siteConfig.address.city}. Auf der Seite jeder Burg
            geben Sie einfach Ihre Postleitzahl ein und sehen die Pauschale sofort.
          </p>
          <div className="overflow-x-auto rounded-3xl border bg-card" role="region" aria-label="Lieferzonen, horizontal scrollbar" tabIndex={0}>
            <table className="w-full min-w-[28rem] border-collapse">
              <caption className="sr-only">Lieferzonen mit Entfernung und Pauschale</caption>
              <thead>
                <tr className="border-b bg-secondary/60">
                  <th scope="col" className={headCell}>
                    Zone
                  </th>
                  <th scope="col" className={headCell}>
                    Entfernung
                  </th>
                  <th scope="col" className={headCell}>
                    Lieferpauschale
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingConfig.deliveryZones.map((zone) => (
                  <tr key={zone.id} className="border-b">
                    <th scope="row" className={`${cell} font-heading font-semibold`}>
                      {zone.label}
                    </th>
                    <td className={cell}>bis {zone.maxKm} km</td>
                    <td className={cell}>{formatEuro(zone.fee)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className={`${cell} font-heading font-semibold`}>
                    Darüber
                  </th>
                  <td className={cell}>über {pricingConfig.deliveryZones.at(-1)?.maxKm} km</td>
                  <td className={cell}>{pricingConfig.beyondZonesLabel}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Die Zuordnung der Postleitzahlen ist ein Entwurf und wird vor der Veröffentlichung anhand echter Entfernungen
            geprüft.
          </p>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-primary p-8 text-primary-foreground">
          <h2 className="text-3xl font-semibold text-balance">Termin und Preis in wenigen Sekunden</h2>
          <p className="max-w-2xl text-lg leading-relaxed">Wählen Sie eine Hüpfburg und tippen Sie im Kalender Ihren Wunschtag an.</p>
          <LinkButton href="/huepfburgen" variant="sun" size="lg">
            Verfügbarkeit prüfen
          </LinkButton>
        </section>
      </div>
    </>
  )
}
