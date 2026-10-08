'use client'

import { useState, useTransition, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import { submitBooking } from '@/app/buchung/actions'
import { FormField } from '@/components/booking/form-field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  bookingFieldOrder,
  emptyBookingForm,
  validateBookingForm,
  type BookingFormErrors,
  type BookingFormValues,
} from '@/lib/booking-validation'
import type { BookingSelection } from '@/lib/booking-selection'
import type { Castle } from '@/lib/castles'
import { addDays, formatDateLong } from '@/lib/dates'
import { formatCents } from '@/lib/format'
import { pricingConfig, type PriceResult } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

interface BookingFormProps {
  castle: Castle
  selection: BookingSelection | null
  price: PriceResult | null
}

const inputClass = 'h-11 text-base md:text-base'
const selectClass = 'w-full [&_select]:h-11 [&_select]:text-base'
const textareaClass =
  'min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20'

export function BookingForm({ castle, selection, price }: BookingFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<BookingFormValues>(emptyBookingForm)
  const [errors, setErrors] = useState<BookingFormErrors>({})
  const [serverError, setServerError] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const readySelection = selection && price?.status === 'ok' ? selection : null
  const readyPrice = price?.status === 'ok' ? price : null
  const busy = isPending || submitted

  function update<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!readySelection || busy) return

    const foundErrors = validateBookingForm(values)
    setErrors(foundErrors)
    setServerError(undefined)

    const firstInvalid = bookingFieldOrder.find((key) => foundErrors[key])
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    startTransition(async () => {
      const result = await submitBooking(readySelection, values)
      if (result.ok) {
        setSubmitted(true)
        router.push(`/buchung/bestaetigung?${result.confirmationQuery}`)
        return
      }
      if (result.code === 'validation') {
        setErrors(result.errors)
        return
      }
      setServerError(result.message)
      router.refresh()
    })
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const timeSlotLabel = siteConfig.timeSlots.find((slot) => slot.value === values.timeSlot)?.label
  const surfaceLabel = siteConfig.surfaces.find((surface) => surface.value === values.surface)?.label

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {!readySelection ? (
        <p className="rounded-2xl border-2 border-dashed p-4 text-muted-foreground" role="status">
          Wählen Sie zuerst oben Datum und Übergabe. Danach können Sie hier Ihre Daten eintragen und buchen.
        </p>
      ) : null}

      <fieldset disabled={!readySelection} className="flex flex-col gap-8 disabled:opacity-50">
        <div className="grid gap-5 sm:grid-cols-2">
          <legend className="sr-only">Ihre Daten</legend>
          <FormField name="name" label="Name" error={errors.name} className="sm:col-span-2">
            {(a11y) => (
              <Input {...a11y} name="name" autoComplete="name" className={inputClass} value={values.name} onChange={(e) => update('name', e.target.value)} />
            )}
          </FormField>
          <FormField name="email" label="E-Mail" error={errors.email}>
            {(a11y) => (
              <Input {...a11y} name="email" type="email" autoComplete="email" className={inputClass} value={values.email} onChange={(e) => update('email', e.target.value)} />
            )}
          </FormField>
          <FormField name="phone" label="Telefon" error={errors.phone} hint="Für Rückfragen zum Termin.">
            {(a11y) => (
              <Input {...a11y} name="phone" type="tel" autoComplete="tel" className={inputClass} value={values.phone} onChange={(e) => update('phone', e.target.value)} />
            )}
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-6">
          <h3 className="font-heading text-xl font-semibold sm:col-span-6">Aufstellort</h3>
          <FormField name="street" label="Straße und Hausnummer" error={errors.street} className="sm:col-span-6">
            {(a11y) => (
              <Input {...a11y} name="street" autoComplete="street-address" className={inputClass} value={values.street} onChange={(e) => update('street', e.target.value)} />
            )}
          </FormField>
          <FormField name="postalCode" label="PLZ" error={errors.postalCode} className="sm:col-span-2">
            {(a11y) => (
              <Input {...a11y} name="postalCode" inputMode="numeric" autoComplete="postal-code" maxLength={5} className={inputClass} value={values.postalCode} onChange={(e) => update('postalCode', e.target.value.replace(/\D/g, ''))} />
            )}
          </FormField>
          <FormField name="city" label="Ort" error={errors.city} className="sm:col-span-4">
            {(a11y) => (
              <Input {...a11y} name="city" autoComplete="address-level2" className={inputClass} value={values.city} onChange={(e) => update('city', e.target.value)} />
            )}
          </FormField>
          <FormField name="surface" label="Untergrund am Aufstellort" error={errors.surface} className="sm:col-span-3" hint="Ebener Rasen oder Hartfläche ohne Steine ist ideal.">
            {(a11y) => (
              <NativeSelect {...a11y} name="surface" className={selectClass} value={values.surface} onChange={(e) => update('surface', e.target.value)}>
                <NativeSelectOption value="">Bitte wählen</NativeSelectOption>
                {siteConfig.surfaces.map((surface) => (
                  <NativeSelectOption key={surface.value} value={surface.value}>
                    {surface.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          </FormField>
          <FormField name="timeSlot" label="Wunschzeit" error={errors.timeSlot} className="sm:col-span-3" hint="Für Übergabe bzw. Lieferung. Wir bestätigen die genaue Uhrzeit.">
            {(a11y) => (
              <NativeSelect {...a11y} name="timeSlot" className={selectClass} value={values.timeSlot} onChange={(e) => update('timeSlot', e.target.value)}>
                <NativeSelectOption value="">Bitte wählen</NativeSelectOption>
                {siteConfig.timeSlots.map((slot) => (
                  <NativeSelectOption key={slot.value} value={slot.value}>
                    {slot.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          </FormField>
          <FormField name="notes" label="Hinweise zum Aufstellort" required={false} error={errors.notes} className="sm:col-span-6" hint="Zum Beispiel: Zugang über Seitentor, Steckdose in der Garage, leichtes Gefälle.">
            {(a11y) => (
              <textarea {...a11y} name="notes" rows={3} className={textareaClass} value={values.notes} onChange={(e) => update('notes', e.target.value)} />
            )}
          </FormField>
        </div>

        <div className="flex flex-col gap-4">
          {(
            [
              {
                key: 'termsAccepted',
                label: (
                  <>
                    Ich habe die{' '}
                    <Link href="/mietbedingungen" target="_blank" className="font-semibold underline underline-offset-4">
                      Mietbedingungen
                    </Link>{' '}
                    gelesen und akzeptiere sie.
                  </>
                ),
              },
              {
                key: 'privacyAccepted',
                label: (
                  <>
                    Ich habe die{' '}
                    <Link href="/datenschutz" target="_blank" className="font-semibold underline underline-offset-4">
                      Datenschutzerklärung
                    </Link>{' '}
                    zur Kenntnis genommen.
                  </>
                ),
              },
            ] as const
          ).map(({ key, label }) => {
            const error = errors[key]
            return (
              <div key={key}>
                <div className="flex items-start gap-3">
                  <input
                    id={`field-${key}`}
                    type="checkbox"
                    checked={values[key]}
                    onChange={(e) => update(key, e.target.checked)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `field-${key}-error` : undefined}
                    className="mt-0.5 size-5 shrink-0 accent-primary"
                  />
                  <label htmlFor={`field-${key}`} className="leading-snug">
                    {label}
                  </label>
                </div>
                {error ? (
                  <p id={`field-${key}-error`} className="mt-1.5 pl-8 text-sm font-semibold text-destructive">
                    {error}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </fieldset>

      {readySelection && readyPrice ? (
        <section aria-labelledby="booking-summary-title" className="rounded-3xl border-2 border-primary/30 bg-secondary p-5 sm:p-6">
          <h3 id="booking-summary-title" className="font-heading text-xl font-semibold">
            Ihre Buchung im Überblick
          </h3>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            <SummaryRow label="Hüpfburg" value={castle.name} />
            <SummaryRow
              label="Termin"
              value={
                readySelection.rentalType === 'weekendPackage'
                  ? `${formatDateLong(readySelection.date)} bis ${formatDateLong(addDays(readySelection.date, pricingConfig.weekendPackage.days - 1))}`
                  : formatDateLong(readySelection.date)
              }
            />
            <SummaryRow
              label="Übergabe"
              value={
                readySelection.fulfilment === 'delivery'
                  ? `Lieferung mit Aufbau und Abbau (${readyPrice.zone?.label ?? ''}, PLZ ${readySelection.postalCode})`
                  : 'Selbstabholung'
              }
            />
            <SummaryRow
              label="Aufstellort"
              value={values.street || values.city ? `${values.street}, ${values.postalCode} ${values.city}` : 'noch nicht angegeben'}
            />
            <SummaryRow label="Wunschzeit" value={timeSlotLabel ?? 'noch nicht gewählt'} />
            <SummaryRow label="Untergrund" value={surfaceLabel ?? 'noch nicht gewählt'} />
            {readyPrice.lines.map((line) => (
              <SummaryRow
                key={line.id}
                label={line.id === 'rental' ? 'Miete' : line.id === 'delivery' ? 'Lieferpauschale' : line.label}
                value={formatCents(line.cents)}
              />
            ))}
            <SummaryRow label="Gesamtpreis" value={formatCents(readyPrice.totalCents)} strong />
            <SummaryRow label="Kaution (bei Übernahme, zusätzlich)" value={formatCents(readyPrice.depositCents)} />
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Mit dem Klick auf „Zahlungspflichtig buchen“ buchen Sie verbindlich und verpflichten sich, den Gesamtpreis von{' '}
            {formatCents(readyPrice.totalCents)} zu zahlen. Die Kaution von {formatCents(readyPrice.depositCents)} wird
            getrennt bei Übernahme fällig.
          </p>
          <p className="mt-2 rounded-xl bg-accent/30 px-3 py-2 text-sm text-accent-foreground">
            Entwurf: In dieser Vorschau wird keine echte Buchung angelegt und keine Zahlung ausgelöst.
          </p>
        </section>
      ) : null}

      {hasErrors ? (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 font-semibold text-destructive">
          Bitte prüfen Sie die markierten Felder.
        </p>
      ) : null}
      {serverError ? (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 font-semibold text-destructive">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!readySelection || busy}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 font-heading text-lg font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
        Zahlungspflichtig buchen
      </button>
    </form>
  )
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? 'font-heading text-lg font-semibold' : 'font-semibold'}>{value}</dd>
    </>
  )
}
