// Läuft im Browser, solange es kein Backend gibt (statische Vorschau).
// Mit echter Datenbank wieder als Server-Action ('use server') ausführen.

import { checkAvailability, createBooking } from '@/lib/availability'
import { validateBookingForm, type BookingFormErrors, type BookingFormValues } from '@/lib/booking-validation'
import { selectionToSearchParams, type BookingSelection } from '@/lib/booking-selection'
import { getCastle } from '@/lib/castles'
import { isValidISODate } from '@/lib/dates'
import { calculatePrice, getRentalDates } from '@/lib/pricing'

export type SubmitBookingResult =
  | { ok: true; reference: string; confirmationQuery: string }
  | { ok: false; code: 'validation'; errors: BookingFormErrors }
  | { ok: false; code: 'unavailable' | 'price' | 'invalid'; message: string }

/**
 * Nimmt eine Buchung entgegen. Es wird bewusst nichts aus dem Browser übernommen, was sich
 * berechnen lässt: Verfügbarkeit und Preis werden hier serverseitig neu ermittelt.
 *
 * Es findet KEINE echte Zahlung statt. Die Buchung wird über lib/availability.ts gespeichert
 * (aktuell Mock).
 */
export async function submitBooking(
  selection: BookingSelection,
  form: BookingFormValues,
): Promise<SubmitBookingResult> {
  const castle = getCastle(selection?.slug)
  if (!castle || !isValidISODate(selection.date)) {
    return { ok: false, code: 'invalid', message: 'Die Auswahl ist ungültig. Bitte laden Sie die Seite neu.' }
  }

  const errors = validateBookingForm(form)
  if (Object.keys(errors).length > 0) return { ok: false, code: 'validation', errors }

  const availability = await checkAvailability(castle.slug, selection.date, selection.rentalType)
  if (!availability.available) {
    return {
      ok: false,
      code: 'unavailable',
      message: 'Dieser Termin ist leider nicht mehr frei. Bitte wählen Sie ein anderes Datum.',
    }
  }

  const price = calculatePrice({
    castle,
    date: selection.date,
    rentalType: selection.rentalType,
    fulfilment: selection.fulfilment,
    postalCode: selection.postalCode,
  })
  if (price.status !== 'ok') {
    return {
      ok: false,
      code: 'price',
      message: 'Für diese Auswahl können wir den Preis nicht berechnen. Bitte kontaktieren Sie uns.',
    }
  }

  const { reference } = await createBooking({
    castleSlug: castle.slug,
    dates: getRentalDates(selection.date, selection.rentalType),
    rentalType: selection.rentalType,
    fulfilment: selection.fulfilment,
    customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
    location: {
      street: form.street.trim(),
      postalCode: form.postalCode.trim(),
      city: form.city.trim(),
      surface: form.surface,
      notes: form.notes.trim(),
    },
    timeSlot: form.timeSlot,
    totalCents: price.totalCents,
    depositCents: price.depositCents,
  })

  return {
    ok: true,
    reference,
    confirmationQuery: selectionToSearchParams(selection, reference).toString(),
  }
}
