import type { Castle } from '@/lib/castles'
import { addDays, weekdayOf, type ISODate } from '@/lib/dates'
import { getHolidayName } from '@/lib/holidays'

/**
 * PREISLOGIK
 *
 * Die Preise je Burg stehen in lib/castles.ts. Hier stehen die Regeln:
 * - welche Wochentage als "Wochentag" bzw. "Wochenende" gelten,
 * - das Wochenendpaket,
 * - die Liefer-Zonen inklusive Zuordnung der Postleitzahlen.
 *
 * Alle Zahlen und Zuordnungen sind Platzhalter.
 */

export type RentalType = 'day' | 'weekendPackage'
export type Fulfilment = 'pickup' | 'delivery'
export type RateType = 'weekday' | 'weekend'

export interface DeliveryZone {
  id: string
  label: string
  maxKm: number
  /** Lieferpauschale in Euro inkl. Aufbau und Abbau (Kostenerstattung). */
  fee: number
  /** Exakte Postleitzahlen dieser Zone. */
  postalCodes: string[]
  /** Postleitzahl-Anfänge (z. B. "80" für große Teile Münchens). Exakte Treffer haben Vorrang. */
  postalPrefixes: string[]
}

export const pricingConfig = {
  /** Wochentage, die zum günstigeren Wochentag-Preis zählen (0 = So, 1 = Mo, ..., 6 = Sa). Mo bis Do. */
  weekdayRateDays: [1, 2, 3, 4],
  /** Feiertage werden wie Wochenenden berechnet. */
  holidaysUseWeekendRate: true,

  weekendPackage: {
    enabled: true,
    label: 'Wochenendpaket',
    /** Startwochentag des Pakets: Freitag. */
    startWeekday: 5,
    /** Anzahl Kalendertage, die die Burg belegt ist: Freitag, Samstag, Sonntag. */
    days: 3,
    description: 'Abholung am Freitag, Rückgabe am Sonntagabend oder Montagfrüh.',
  },

  /**
   * Zonen für die Lieferung mit Aufbau und Abbau, gemessen ab Haimhausen.
   * PLATZHALTER: Die Zuordnung der Postleitzahlen ist ein Beispiel und muss anhand echter
   * Entfernungen geprüft werden.
   */
  deliveryZones: [
    {
      id: 'zone-1',
      label: 'Zone 1',
      maxKm: 10,
      fee: 25,
      postalCodes: ['85778', '85777', '85241', '85716', '85764'],
      postalPrefixes: [],
    },
    {
      id: 'zone-2',
      label: 'Zone 2',
      maxKm: 25,
      fee: 45,
      postalCodes: ['85221', '85229', '85244', '85757', '85748', '85737', '85354', '85356', '85609', '85391'],
      postalPrefixes: ['8093'],
    },
    {
      id: 'zone-3',
      label: 'Zone 3',
      maxKm: 40,
      fee: 65,
      postalCodes: ['85435', '85551', '85591', '82110', '82140', '82256', '85276'],
      postalPrefixes: ['80', '81'],
    },
  ] satisfies DeliveryZone[],

  /** Hinweis für alles außerhalb der Zonen. */
  beyondZonesLabel: 'Auf Anfrage (über 40 km)',
}

// ---------------------------------------------------------------------------
// Zonen
// ---------------------------------------------------------------------------

export type ZoneLookup =
  | { status: 'ok'; zone: DeliveryZone }
  | { status: 'on-request' }
  | { status: 'invalid' }

export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode)
}

export function lookupDeliveryZone(postalCode: string): ZoneLookup {
  const code = postalCode.trim()
  if (!isValidPostalCode(code)) return { status: 'invalid' }

  const zones = pricingConfig.deliveryZones as DeliveryZone[]

  const exact = zones.find((zone) => zone.postalCodes.includes(code))
  if (exact) return { status: 'ok', zone: exact }

  let best: { zone: DeliveryZone; length: number } | undefined
  for (const zone of zones) {
    for (const prefix of zone.postalPrefixes) {
      if (code.startsWith(prefix) && (!best || prefix.length > best.length)) {
        best = { zone, length: prefix.length }
      }
    }
  }
  if (best) return { status: 'ok', zone: best.zone }

  return { status: 'on-request' }
}

// ---------------------------------------------------------------------------
// Tarif
// ---------------------------------------------------------------------------

export interface RateInfo {
  type: RateType
  /** Name des Feiertags, falls der Tag wegen eines Feiertags als Wochenende zählt. */
  holiday?: string
}

export function getRateInfo(date: ISODate): RateInfo {
  const holiday = pricingConfig.holidaysUseWeekendRate ? getHolidayName(date) : undefined
  if (holiday) return { type: 'weekend', holiday }
  const isWeekday = pricingConfig.weekdayRateDays.includes(weekdayOf(date))
  return { type: isWeekday ? 'weekday' : 'weekend' }
}

/** Alle Kalendertage, die durch die Miete belegt sind. */
export function getRentalDates(date: ISODate, rentalType: RentalType): ISODate[] {
  const length = rentalType === 'weekendPackage' ? pricingConfig.weekendPackage.days : 1
  return Array.from({ length }, (_, index) => addDays(date, index))
}

/** Das Wochenendpaket kann nur am vorgesehenen Startwochentag (Freitag) beginnen. */
export function isValidPackageStart(date: ISODate): boolean {
  return weekdayOf(date) === pricingConfig.weekendPackage.startWeekday
}

// ---------------------------------------------------------------------------
// Preisberechnung
// ---------------------------------------------------------------------------

export interface PriceInput {
  castle: Castle
  date: ISODate
  rentalType: RentalType
  fulfilment: Fulfilment
  postalCode?: string
}

export interface PriceLine {
  id: 'rental' | 'delivery'
  label: string
  detail?: string
  cents: number
}

export type PriceResult =
  | {
      status: 'ok'
      rateType: RateType | 'package'
      lines: PriceLine[]
      /** Mietpreis + Lieferpauschale, ohne Kaution. */
      totalCents: number
      /** Kaution, wird getrennt von der Miete bei Übernahme fällig. */
      depositCents: number
      zone?: DeliveryZone
    }
  | { status: 'invalid-package-date' }
  | { status: 'needs-postal-code' }
  | { status: 'invalid-postal-code' }
  | { status: 'delivery-on-request' }

const toCents = (euros: number) => Math.round(euros * 100)

export function calculatePrice(input: PriceInput): PriceResult {
  const { castle, date, rentalType, fulfilment } = input
  const lines: PriceLine[] = []
  let rateType: RateType | 'package'

  if (rentalType === 'weekendPackage') {
    if (!pricingConfig.weekendPackage.enabled || !isValidPackageStart(date)) {
      return { status: 'invalid-package-date' }
    }
    rateType = 'package'
    lines.push({
      id: 'rental',
      label: `Miete: ${pricingConfig.weekendPackage.label}`,
      detail: 'Freitag bis Sonntag',
      cents: toCents(castle.pricing.weekendPackage),
    })
  } else {
    const rate = getRateInfo(date)
    rateType = rate.type
    lines.push({
      id: 'rental',
      label: rate.type === 'weekday' ? 'Miete: Wochentag (Mo bis Do)' : 'Miete: Wochenende / Feiertag',
      detail: rate.holiday ? `Feiertag: ${rate.holiday}` : undefined,
      cents: toCents(rate.type === 'weekday' ? castle.pricing.weekday : castle.pricing.weekend),
    })
  }

  let zone: DeliveryZone | undefined
  if (fulfilment === 'delivery') {
    const postalCode = input.postalCode?.trim() ?? ''
    if (!postalCode) return { status: 'needs-postal-code' }
    const lookup = lookupDeliveryZone(postalCode)
    if (lookup.status === 'invalid') return { status: 'invalid-postal-code' }
    if (lookup.status === 'on-request') return { status: 'delivery-on-request' }

    zone = lookup.zone
    lines.push({
      id: 'delivery',
      label: `Lieferung mit Aufbau und Abbau: ${zone.label}`,
      detail: `bis ${zone.maxKm} km, Kostenerstattung`,
      cents: toCents(zone.fee),
    })
  }

  return {
    status: 'ok',
    rateType,
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    depositCents: toCents(castle.pricing.deposit),
    zone,
  }
}
