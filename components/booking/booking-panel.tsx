'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { AvailabilityCalendar } from '@/components/booking/availability-calendar'
import { BookingForm } from '@/components/booking/booking-form'
import { FormField } from '@/components/booking/form-field'
import { OptionCard } from '@/components/booking/option-card'
import { PriceSummary } from '@/components/booking/price-summary'
import { Input } from '@/components/ui/input'
import type { BookingSelection } from '@/lib/booking-selection'
import { getSelectability } from '@/lib/booking-rules'
import type { Castle } from '@/lib/castles'
import type { ISODate } from '@/lib/dates'
import { availableExtras, sanitizeExtras } from '@/lib/extras'
import { formatCents } from '@/lib/format'
import {
  calculatePrice,
  isValidPostalCode,
  lookupDeliveryZone,
  pricingConfig,
  type Fulfilment,
  type RentalType,
} from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

interface BookingPanelProps {
  castle: Castle
  bookedDates: ISODate[]
  today: ISODate
  initialDate?: ISODate
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby={`step-${number}`}>
      <h3 id={`step-${number}`} className="flex items-center gap-3 font-heading text-xl font-semibold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-base text-primary-foreground" aria-hidden="true">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

export function BookingPanel({ castle, bookedDates, today, initialDate }: BookingPanelProps) {
  const booked = useMemo(() => new Set(bookedDates), [bookedDates])
  const [rentalType, setRentalType] = useState<RentalType>('day')
  const [date, setDate] = useState<ISODate | undefined>(
    initialDate && getSelectability(initialDate, 'day', booked, today) === 'ok' ? initialDate : undefined,
  )
  const [fulfilment, setFulfilment] = useState<Fulfilment>('pickup')
  const [postalCode, setPostalCode] = useState('')
  const [chosenExtras, setChosenExtras] = useState<string[]>([])
  const extrasForFulfilment = availableExtras(fulfilment)
  const activeExtras = sanitizeExtras(chosenExtras, fulfilment)

  const price = useMemo(
    () => (date ? calculatePrice({ castle, date, rentalType, fulfilment, postalCode, extras: activeExtras }) : null),
    // activeExtras ist aus chosenExtras und fulfilment abgeleitet
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [castle, date, rentalType, fulfilment, postalCode, chosenExtras],
  )

  function toggleExtra(id: string, on: boolean) {
    setChosenExtras((current) => (on ? [...new Set([...current, id])] : current.filter((entry) => entry !== id)))
  }

  const selection: BookingSelection | null =
    date && price?.status === 'ok'
      ? {
          slug: castle.slug,
          date,
          rentalType,
          fulfilment,
          postalCode: fulfilment === 'delivery' ? postalCode.trim() : undefined,
          extras: activeExtras,
        }
      : null

  function handleRentalType(next: string) {
    const nextType = next as RentalType
    setRentalType(nextType)
    setDate((current) => (current && getSelectability(current, nextType, booked, today) === 'ok' ? current : undefined))
  }

  const zoneLookup = fulfilment === 'delivery' && isValidPostalCode(postalCode) ? lookupDeliveryZone(postalCode) : null
  const postalCodeError =
    fulfilment === 'delivery' && postalCode.length > 0 && postalCode.length === 5 && zoneLookup?.status === 'on-request'
      ? `Für diese PLZ liefern wir nur auf Anfrage (${pricingConfig.beyondZonesLabel}).`
      : undefined
  const postalCodeHint =
    zoneLookup?.status === 'ok'
      ? `${zoneLookup.zone.label}: bis ${zoneLookup.zone.maxKm} km, Lieferpauschale ${formatCents(zoneLookup.zone.fee * 100)}`
      : 'Wir berechnen die Lieferpauschale nach Zone.'

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-12">
      <div className="flex flex-col gap-10">
        <Step number={1} title="Mietart und Datum wählen">
          <div className="grid gap-3" role="radiogroup" aria-label="Mietart">
            <OptionCard
              name="rentalType"
              value="day"
              checked={rentalType === 'day'}
              onChange={handleRentalType}
              title="Einzelner Tag"
              description="Jeder freie Tag. Mo bis Do günstiger, Fr bis So und an Feiertagen Wochenendpreis."
            />
            {pricingConfig.weekendPackage.enabled ? (
              <OptionCard
                name="rentalType"
                value="weekendPackage"
                checked={rentalType === 'weekendPackage'}
                onChange={handleRentalType}
                title={`${pricingConfig.weekendPackage.label} (Fr bis So)`}
                description={`${pricingConfig.weekendPackage.description} Pauschalpreis ${formatCents(castle.pricing.weekendPackage * 100)}.`}
              />
            ) : null}
          </div>
          <AvailabilityCalendar
            rentalType={rentalType}
            selected={date}
            onSelect={setDate}
            bookedDates={bookedDates}
            today={today}
          />
          <p className="text-sm text-muted-foreground">
            {rentalType === 'weekendPackage'
              ? 'Wählen Sie den Freitag, an dem das Wochenendpaket startet. Es muss das ganze Wochenende frei sein.'
              : 'Belegte Tage sind rot markiert und lassen sich nicht auswählen.'}
          </p>
        </Step>

        <Step number={2} title="Selbstabholung oder Lieferung">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Übergabe">
            <OptionCard
              name="fulfilment"
              value="pickup"
              checked={fulfilment === 'pickup'}
              onChange={(value) => setFulfilment(value as Fulfilment)}
              title="Selbstabholung"
              description="Ohne Lieferpauschale. Sie holen die Burg ab und bauen sie nach Anleitung auf."
            />
            <OptionCard
              name="fulfilment"
              value="delivery"
              checked={fulfilment === 'delivery'}
              onChange={(value) => setFulfilment(value as Fulfilment)}
              title="Lieferung mit Aufbau und Abbau"
              description="Wir liefern, bauen auf und wieder ab. Kostenerstattung nach Zone, Termin nach Absprache."
            />
          </div>

          {fulfilment === 'delivery' ? (
            <FormField name="delivery-postal-code" label="PLZ des Aufstellorts" error={postalCodeError} hint={postalCodeHint} className="max-w-xs">
              {(a11y) => (
                <Input
                  {...a11y}
                  name="deliveryPostalCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  placeholder="z. B. 85778"
                  className="h-11 text-base md:text-base"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, ''))}
                />
              )}
            </FormField>
          ) : null}
          {fulfilment === 'delivery' ? (
            <p className="text-sm text-muted-foreground">
              Hinweis zur Lieferung: Bitte halten Sie {siteConfig.rentalTerms.deliveryHelpers === 1 ? 'eine erwachsene Person' : `${siteConfig.rentalTerms.deliveryHelpers} erwachsene Personen`} bereit,
              die beim Tragen vom Fahrzeug zum Aufstellort hilft. Die Burg wiegt {castle.weightKg} kg.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Hinweis zur Selbstabholung: Sie brauchen mindestens {siteConfig.rentalTerms.minPersonsForSetup} Personen und ein Fahrzeug passender Größe (
              {castle.transport}). Bitte bringen Sie Ihren Personalausweis mit und räumen Sie das Fahrzeug vorher leer.
            </p>
          )}
        </Step>

        {extrasForFulfilment.length > 0 ? (
          <Step number={3} title="Zubehör dazubuchen (optional)">
            <div className="grid gap-3 sm:grid-cols-2">
              {extrasForFulfilment.map((extra) => (
                <label
                  key={extra.id}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-card p-4 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-secondary"
                >
                  <input
                    type="checkbox"
                    name="extras"
                    value={extra.id}
                    checked={activeExtras.includes(extra.id)}
                    onChange={(event) => toggleExtra(extra.id, event.target.checked)}
                    className="mt-1 size-5 shrink-0 accent-primary"
                  />
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-heading text-lg leading-snug font-semibold">{extra.name}</span>
                      <span className="font-semibold whitespace-nowrap">+ {formatCents(extra.price * 100)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{extra.description}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Preise gelten pro Miete, auch für das Wochenendpaket. Gebläse, Erdnägel, Unterlegplane und Anleitung sind immer dabei.
            </p>
          </Step>
        ) : null}
      </div>

      <aside
        aria-label="Preis"
        className="self-start rounded-3xl border-2 bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <h3 className="mb-4 font-heading text-xl font-semibold">Ihr Preis</h3>
        <div aria-live="polite">
          <PriceSummary price={price} date={date} rentalType={rentalType} />
        </div>
      </aside>

      <div className="lg:col-start-1 lg:row-start-2">
        <Step number={extrasForFulfilment.length > 0 ? 4 : 3} title="Ihre Daten und verbindlich buchen">
          <BookingForm castle={castle} selection={selection} price={price} />
        </Step>
      </div>
    </div>
  )
}
