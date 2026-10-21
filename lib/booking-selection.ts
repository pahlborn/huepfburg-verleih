import { isValidISODate, type ISODate } from '@/lib/dates'
import { sanitizeExtras } from '@/lib/extras'
import { checkRange, isValidPostalCode, type Fulfilment } from '@/lib/pricing'

/** Was der Besucher im Kalender und Preisrechner gewählt hat. */
export interface BookingSelection {
  slug: string
  /** Mietbeginn. */
  date: ISODate
  /** Mietende (einschließlich), bei einer Tagesmiete gleich `date`. */
  endDate: ISODate
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
    bis: selection.endDate,
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

/** Liest einen Zeitraum aus ?datum= und ?bis=. Fehlt "bis", ist es ein einzelner Tag. */
export function parseRange(params: { datum?: string | null; bis?: string | null }): { date: ISODate; endDate: ISODate } | null {
  const date = params.datum ?? undefined
  if (!isValidISODate(date)) return null
  const rawEnd = params.bis ?? undefined
  const endDate = isValidISODate(rawEnd) ? rawEnd : date
  if (checkRange(date, endDate) !== 'ok') return null
  return { date, endDate }
}

/** Liest die Auswahl aus URL-Parametern und verwirft ungültige Werte. */
export function parseSelection(params: RawParams): BookingSelection | null {
  const slug = first(params.burg)
  const range = parseRange({ datum: first(params.datum), bis: first(params.bis) })
  const fulfilment = first(params.uebergabe)
  const postalCode = first(params.plz)
  const extrasRaw = first(params.zubehoer)

  if (!slug || !range) return null
  if (fulfilment !== 'pickup' && fulfilment !== 'delivery') return null
  if (fulfilment === 'delivery' && (!postalCode || !isValidPostalCode(postalCode))) return null

  return {
    slug,
    ...range,
    fulfilment,
    postalCode: fulfilment === 'delivery' ? postalCode : undefined,
    extras: sanitizeExtras(extrasRaw ? extrasRaw.split(',') : [], fulfilment),
  }
}
