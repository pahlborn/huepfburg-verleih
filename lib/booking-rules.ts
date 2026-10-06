import { addDays, type ISODate } from '@/lib/dates'
import { getRentalDates, isValidPackageStart, type RentalType } from '@/lib/pricing'

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

export type SelectabilityReason = 'ok' | 'past' | 'too-far' | 'booked' | 'not-package-start'

/**
 * Prüft, ob ein Datum als Mietbeginn wählbar ist. Beim Wochenendpaket müssen alle
 * belegten Tage (Fr, Sa, So) frei sein und der Start muss ein Freitag sein.
 */
export function getSelectability(
  date: ISODate,
  rentalType: RentalType,
  bookedDates: ReadonlySet<ISODate>,
  today: ISODate,
): SelectabilityReason {
  if (date < earliestBookableDate(today)) return 'past'
  if (date > latestBookableDate(today)) return 'too-far'
  if (rentalType === 'weekendPackage' && !isValidPackageStart(date)) return 'not-package-start'
  if (getRentalDates(date, rentalType).some((day) => bookedDates.has(day))) return 'booked'
  return 'ok'
}
