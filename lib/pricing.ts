import type { Castle } from '@/lib/castles'
import { addDays, weekdayOf, type ISODate } from '@/lib/dates'
import { getExtra, sanitizeExtras } from '@/lib/extras'
import { getHolidayName } from '@/lib/holidays'

/**
 * PREISLOGIK
 *
 * Die Preise je Burg stehen in lib/castles.ts. Hier stehen die Regeln:
 * - welche Wochentage als "Wochentag" bzw. "Wochenende" gelten,
 * - Folgetage und Wochenendpreis,
 * - die Liefer-Zonen inklusive Zuordnung der Postleitzahlen.
 *
 * Lieferpauschalen: Vorschlag vom 21.10.2026. Sie decken zwei Fahrten hin und zurück (Liefern und Abholen)
 * plus Auf- und Abbau. Zum Vergleich im Raum München: Münchner Hüpfer 65 € Aufbau + 90 € Abbau (bis 15 km),
 * Lorenz 50 € Grundpreis ohne Aufbau, Gaudihüpfer 59 € Lieferung, Aufbau ab 79 €.
 */

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

  /**
   * Folgetage: Jeder weitere Miettag kostet diesen Anteil seines Tagespreises.
   * Zum Vergleich: Gaudihüpfer Folgetag 100 € bei 200 € (50 %), Kispa 75 € bei 159 € (47 %),
   * Schake 80 € bei 200 € (40 %), Stand Okt. 2026.
   */
  extraDayFactor: 0.5,
  /** Längster buchbarer Zeitraum in Tagen. */
  maxRentalDays: 14,

  /**
   * Wochenendpreis: Liegt der Zeitraum innerhalb eines Wochenendes (Fr bis So), kostet er höchstens
   * den Wochenendpreis der Burg (castle.pricing.weekendPackage).
   */
  weekendCap: {
    enabled: true,
    label: 'Wochenendpreis',
    description: 'Freitag bis Sonntag zum Pauschalpreis: Abholung am Freitag, Rückgabe am Sonntagabend oder Montagfrüh.',
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
      fee: 79,
      postalCodes: ['85778', '85777', '85241', '85716', '85764'],
      postalPrefixes: [],
    },
    {
      id: 'zone-2',
      label: 'Zone 2',
      maxKm: 25,
      fee: 109,
      postalCodes: ['85221', '85229', '85244', '85757', '85748', '85737', '85354', '85356', '85609', '85391'],
      postalPrefixes: ['8093'],
    },
    {
      id: 'zone-3',
      label: 'Zone 3',
      maxKm: 40,
      fee: 139,
      postalCodes: ['85435', '85445', '85452', '85551', '85591', '82110', '82140', '82256', '85276'],
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

/** Alle Kalendertage von Mietbeginn bis Mietende (jeweils einschließlich). */
export function getRentalDates(start: ISODate, end: ISODate = start): ISODate[] {
  const dates: ISODate[] = []
  for (let day = start; day <= end && dates.length <= pricingConfig.maxRentalDays; day = addDays(day, 1)) dates.push(day)
  return dates
}

/** Freitag des Wochenendes, zu dem der Tag gehört (nur für Fr, Sa, So). */
function weekendFriday(date: ISODate): ISODate | undefined {
  const weekday = weekdayOf(date)
  if (weekday === 5) return date
  if (weekday === 6) return addDays(date, -1)
  if (weekday === 0) return addDays(date, -2)
  return undefined
}

/** Liegt der ganze Zeitraum innerhalb eines Wochenendes (Fr bis So)? */
export function isWithinOneWeekend(start: ISODate, end: ISODate): boolean {
  const friday = weekendFriday(start)
  return friday !== undefined && end <= addDays(friday, 2)
}

/** Ist der Zeitraum genau Freitag bis Sonntag? */
export function isFullWeekend(start: ISODate, end: ISODate): boolean {
  return weekdayOf(start) === 5 && end === addDays(start, 2)
}

export type RangeCheck = 'ok' | 'end-before-start' | 'too-long'

export function checkRange(start: ISODate, end: ISODate): RangeCheck {
  if (end < start) return 'end-before-start'
  if (getRentalDates(start, end).length > pricingConfig.maxRentalDays) return 'too-long'
  return 'ok'
}

// ---------------------------------------------------------------------------
// Preisberechnung
// ---------------------------------------------------------------------------

export interface PriceInput {
  castle: Castle
  /** Mietbeginn. */
  date: ISODate
  /** Mietende (einschließlich). Fehlt es, ist es eine Tagesmiete. */
  endDate?: ISODate
  fulfilment: Fulfilment
  postalCode?: string
  /** IDs aus lib/extras.ts. Unbekannte oder nicht buchbare werden ignoriert. */
  extras?: readonly string[]
}

export interface PriceLine {
  /** 'rental', 'rental-extra', 'delivery' oder 'extra-<id>'. */
  id: string
  label: string
  detail?: string
  cents: number
}

export type PriceResult =
  | {
      status: 'ok'
      /** Anzahl Miettage. */
      days: number
      /** true, wenn der Wochenendpreis statt der Einzeltage berechnet wurde. */
      weekendRateApplied: boolean
      lines: PriceLine[]
      /** Mietpreis + Lieferpauschale + Zubehör, ohne Kaution. */
      totalCents: number
      /** Kaution, wird getrennt von der Miete bei Übernahme fällig. */
      depositCents: number
      zone?: DeliveryZone
    }
  | { status: 'invalid-range' }
  | { status: 'needs-postal-code' }
  | { status: 'invalid-postal-code' }
  | { status: 'delivery-on-request' }

const toCents = (euros: number) => Math.round(euros * 100)
const formatEuroPlain = (euros: number) => `${euros} €`

function dayRate(castle: Castle, date: ISODate): number {
  return getRateInfo(date).type === 'weekday' ? castle.pricing.weekday : castle.pricing.weekend
}

/** Preis eines Folgetags in Euro (auf ganze Euro gerundet). */
export function extraDayPrice(castle: Castle, date: ISODate): number {
  return Math.round(dayRate(castle, date) * pricingConfig.extraDayFactor)
}

export function calculatePrice(input: PriceInput): PriceResult {
  const { castle, date, fulfilment } = input
  const endDate = input.endDate ?? date
  if (checkRange(date, endDate) !== 'ok') return { status: 'invalid-range' }

  const days = getRentalDates(date, endDate)
  const lines: PriceLine[] = []
  const first = getRateInfo(date)
  const firstLine: PriceLine = {
    id: 'rental',
    label: first.type === 'weekday' ? 'Miete: Wochentag (Mo bis Do)' : 'Miete: Wochenende / Feiertag',
    detail: first.holiday ? `Feiertag: ${first.holiday}` : days.length > 1 ? '1. Tag' : undefined,
    cents: toCents(dayRate(castle, date)),
  }
  const extraDays = days.slice(1)
  const extraLine: PriceLine | undefined = extraDays.length
    ? {
        id: 'rental-extra',
        label: extraDays.length === 1 ? 'Miete: 1 Folgetag' : `Miete: ${extraDays.length} Folgetage`,
        detail: `je ${Math.round(pricingConfig.extraDayFactor * 100)} % des Tagespreises`,
        cents: toCents(extraDays.reduce((sum, day) => sum + extraDayPrice(castle, day), 0)),
      }
    : undefined
  const dayTotal = firstLine.cents + (extraLine?.cents ?? 0)
  const weekendCents = toCents(castle.pricing.weekendPackage)

  // Wochenendpreis als Obergrenze: Die Tage eines Wochenendes (Fr bis So) im Zeitraum kosten zusammen höchstens
  // den Wochenendpreis. Gilt auch, wenn der Zeitraum über das Wochenende hinausgeht.
  let weekendDiscount = 0
  if (pricingConfig.weekendCap.enabled) {
    const blocks = new Map<ISODate, number>()
    days.forEach((day, index) => {
      const friday = weekendFriday(day)
      if (!friday) return
      const cents = index === 0 ? firstLine.cents : toCents(extraDayPrice(castle, day))
      blocks.set(friday, (blocks.get(friday) ?? 0) + cents)
    })
    for (const [friday, cents] of blocks) {
      const blockDays = days.filter((day) => weekendFriday(day) === friday).length
      if (blockDays > 1 && cents > weekendCents) weekendDiscount += cents - weekendCents
    }
  }
  const weekendRateApplied = weekendDiscount > 0

  if (weekendRateApplied && isWithinOneWeekend(date, endDate)) {
    lines.push({
      id: 'rental',
      label: `Miete: ${pricingConfig.weekendCap.label}`,
      detail: isFullWeekend(date, endDate) ? 'Freitag bis Sonntag' : 'günstiger als die einzelnen Tage',
      cents: dayTotal - weekendDiscount,
    })
  } else {
    lines.push(firstLine)
    if (extraLine) lines.push(extraLine)
    if (weekendRateApplied) {
      lines.push({
        id: 'rental-weekend',
        label: 'Abzug Wochenendpreis',
        detail: `Fr bis So höchstens ${formatEuroPlain(castle.pricing.weekendPackage)}`,
        cents: -weekendDiscount,
      })
    }
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

  for (const id of sanitizeExtras(input.extras, fulfilment)) {
    const extra = getExtra(id)
    if (!extra) continue
    lines.push({ id: `extra-${extra.id}`, label: `Zubehör: ${extra.name}`, detail: 'pro Miete', cents: toCents(extra.price) })
  }

  return {
    status: 'ok',
    days: days.length,
    weekendRateApplied,
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    depositCents: toCents(castle.pricing.deposit),
    zone,
  }
}
