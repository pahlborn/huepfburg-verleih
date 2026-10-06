/**
 * Datumshilfen. Alle Kalendertage werden als ISO-String "JJJJ-MM-TT" geführt,
 * damit Zeitzonen und Sommerzeit nirgends eine Rolle spielen.
 */

const MS_PER_DAY = 86_400_000

export type ISODate = string

export function isValidISODate(value: unknown): value is ISODate {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = isoToUTC(value)
  return !Number.isNaN(date.getTime()) && utcToISO(date) === value
}

export function isoToUTC(iso: ISODate): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function utcToISO(date: Date): ISODate {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso: ISODate, days: number): ISODate {
  return utcToISO(new Date(isoToUTC(iso).getTime() + days * MS_PER_DAY))
}

/** 0 = Sonntag, 1 = Montag, ..., 6 = Samstag */
export function weekdayOf(iso: ISODate): number {
  return isoToUTC(iso).getUTCDay()
}

/** Heutiges Datum in Deutschland. */
export function todayISO(): ISODate {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Konvertiert ein lokales Date (z. B. aus dem Kalender) in einen ISO-String. */
export function dateToISO(date: Date): ISODate {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Konvertiert einen ISO-String in ein lokales Date um 12:00 Uhr (für den Kalender). */
export function isoToLocalDate(iso: ISODate): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

const longFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDateLong(iso: ISODate): string {
  return longFormatter.format(isoToUTC(iso))
}

export function formatDateShort(iso: ISODate): string {
  return shortFormatter.format(isoToUTC(iso))
}
