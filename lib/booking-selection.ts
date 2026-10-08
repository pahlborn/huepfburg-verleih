import { isValidISODate, type ISODate } from '@/lib/dates'
import { sanitizeExtras } from '@/lib/extras'
import { isValidPostalCode, type Fulfilment, type RentalType } from '@/lib/pricing'

/** Was der Besucher im Kalender und Preisrechner gewählt hat. */
export interface BookingSelection {
  slug: string
  date: ISODate
  rentalType: RentalType
  fulfilment: Fulfilment
  /** Nur bei Lieferung. */
  postalCode?: string
  /** Gebuchtes Zubehör (IDs aus lib/extras.ts). */
  extras: string[]
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
  if (selection.extras.length > 0) params.set('zubehoer', selection.extras.join(','))
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
  const extrasRaw = first(params.zubehoer)

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
    extras: sanitizeExtras(extrasRaw ? extrasRaw.split(',') : [], fulfilment),
  }
}
