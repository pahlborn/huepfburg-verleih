import { addDays, type ISODate } from '@/lib/dates'
import { checkRange, getRentalDates } from '@/lib/pricing'

/**
 * Reine Regeln ohne Datenbankzugriff. Wird im Browser (Kalender) UND auf dem Server
 * (Prüfung beim Buchen) verwendet. Die Datenquelle für belegte Tage steht in lib/availability.ts.
 */
export const bookingRules = {
  /** Früheste Buchung: ab morgen. 0 = ab heute. */
  minAdvanceDays: 1,
  /** Späteste Buchung: so viele Tage im Voraus. */
  maxAdvanceDays: 540,
}

export function earliestBookableDate(today: ISODate): ISODate {
  return addDays(today, bookingRules.minAdvanceDays)
}

export function latestBookableDate(today: ISODate): ISODate {
  return addDays(today, bookingRules.maxAdvanceDays)
}

export type SelectabilityReason = 'ok' | 'past' | 'too-far' | 'booked' | 'end-before-start' | 'too-long'

/** Prüft, ob ein einzelner Tag frei und buchbar ist. */
export function getSelectability(date: ISODate, bookedDates: ReadonlySet<ISODate>, today: ISODate): SelectabilityReason {
  if (date < earliestBookableDate(today)) return 'past'
  if (date > latestBookableDate(today)) return 'too-far'
  if (bookedDates.has(date)) return 'booked'
  return 'ok'
}

/** Prüft einen ganzen Zeitraum: gültig, nicht zu lang, und jeder Tag frei. */
export function getRangeSelectability(
  start: ISODate,
  end: ISODate,
  bookedDates: ReadonlySet<ISODate>,
  today: ISODate,
): SelectabilityReason {
  const range = checkRange(start, end)
  if (range !== 'ok') return range
  for (const day of getRentalDates(start, end)) {
    const reason = getSelectability(day, bookedDates, today)
    if (reason !== 'ok') return reason
  }
  return 'ok'
}
