import { isValidISODate, type ISODate } from '@/lib/dates'
import { isValidPostalCode, type Fulfilment, type RentalType } from '@/lib/pricing'

/** Was der Besucher im Kalender und Preisrechner gewählt hat. */
export interface BookingSelection {
  slug: string
  date: ISODate
  rentalType: RentalType
  fulfilment: Fulfilment
  /** Nur bei Lieferung. */
  postalCode?: string
}

export function selectionToSearchParams(selection: BookingSelection, reference: string): URLSearchParams {
  const params = new URLSearchParams({
    ref: reference,
    burg: selection.slug,
    datum: selection.date,
    typ: selection.rentalType,
    uebergabe: selection.fulfilment,
  })
  if (selection.fulfilment === 'delivery' && selection.postalCode) {
    params.set('plz', selection.postalCode)
  }
  return params
}

type RawParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/** Liest die Auswahl aus URL-Parametern und verwirft ungültige Werte. */
export function parseSelection(params: RawParams): BookingSelection | null {
  const slug = first(params.burg)
  const date = first(params.datum)
  const rentalType = first(params.typ)
  const fulfilment = first(params.uebergabe)
  const postalCode = first(params.plz)

  if (!slug || !isValidISODate(date)) return null
  if (rentalType !== 'day' && rentalType !== 'weekendPackage') return null
  if (fulfilment !== 'pickup' && fulfilment !== 'delivery') return null
  if (fulfilment === 'delivery' && (!postalCode || !isValidPostalCode(postalCode))) return null

  return {
    slug,
    date,
    rentalType,
    fulfilment,
    postalCode: fulfilment === 'delivery' ? postalCode : undefined,
  }
}
