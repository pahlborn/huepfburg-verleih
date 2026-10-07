import Link from 'next/link'
import { formatCents } from '@/lib/format'
import { formatDateLong, addDays, type ISODate } from '@/lib/dates'
import { pricingConfig, type PriceResult, type RentalType } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'
import { WeatherBadge, WeatherFootnote } from '@/components/common/weather-note'

interface PriceSummaryProps {
  price: PriceResult | null
  date?: ISODate
  rentalType: RentalType
}

const incompleteMessages = {
  'needs-postal-code': 'Geben Sie die Postleitzahl des Aufstellorts ein, dann berechnen wir die Lieferpauschale.',
  'invalid-postal-code': 'Bitte geben Sie eine gültige, 5-stellige Postleitzahl ein.',
  'invalid-package-date': 'Das Wochenendpaket startet immer an einem Freitag. Bitte wählen Sie einen freien Freitag.',
} as const

/** Live-Preis: Miete und Lieferpauschale zusammen, die Kaution getrennt davon. */
export function PriceSummary({ price, date, rentalType }: PriceSummaryProps) {
  if (!date || !price) {
    return (
      <p className="text-muted-foreground">
        Wählen Sie ein Datum im Kalender. Der Preis erscheint dann sofort hier.
      </p>
    )
  }

  const dateText =
    rentalType === 'weekendPackage'
      ? `${formatDateLong(date)} bis ${formatDateLong(addDays(date, pricingConfig.weekendPackage.days - 1))}`
      : formatDateLong(date)

  if (price.status === 'delivery-on-request') {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">{dateText}</p>
        <p className="rounded-xl bg-accent/30 p-3 text-accent-foreground">
          Für diese Postleitzahl liefern wir nur auf Anfrage ({pricingConfig.beyondZonesLabel}). Wählen Sie
          Selbstabholung oder{' '}
          <Link href="/kontakt" className="font-semibold underline underline-offset-4">
            fragen Sie uns direkt
          </Link>
          .
        </p>
      </div>
    )
  }

  if (price.status !== 'ok') {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">{dateText}</p>
        <p className="text-muted-foreground">{incompleteMessages[price.status]}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold">{dateText}</p>

      <dl className="flex flex-col gap-3">
        {price.lines.map((line) => (
          <div key={line.id} className="flex items-start justify-between gap-4">
            <dt>
              {line.label}
              {line.detail ? <span className="block text-sm text-muted-foreground">{line.detail}</span> : null}
            </dt>
            <dd className="font-semibold whitespace-nowrap">{formatCents(line.cents)}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t-2 pt-3">
          <dt className="font-heading text-lg font-semibold">Mietpreis gesamt</dt>
          <dd className="font-heading text-3xl font-semibold text-primary">{formatCents(price.totalCents)}</dd>
        </div>
      </dl>

      <div className="rounded-2xl bg-secondary p-4">
        <dl className="flex items-baseline justify-between gap-4">
          <dt className="font-semibold">Kaution (zusätzlich)</dt>
          <dd className="font-heading text-xl font-semibold">{formatCents(price.depositCents)}</dd>
        </dl>
        <p className="mt-1 text-sm text-muted-foreground">
          Die Kaution ist nicht im Mietpreis enthalten. Sie wird bei Übernahme fällig und nach ordnungsgemäßer Rückgabe
          zurückgegeben.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <WeatherBadge className="self-start" />
        <WeatherFootnote />
      </div>

      <p className="text-xs text-muted-foreground">
        Alle Preise sind Platzhalter. [Hinweis zu MwSt. bzw. § 19 UStG ergänzen] Kontakt: {siteConfig.contact.phone}
      </p>
    </div>
  )
}
