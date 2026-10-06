import { addDays, type ISODate } from '@/lib/dates'

/**
 * Gesetzliche Feiertage in Bayern. Für die Preisberechnung gelten sie wie ein Wochenende.
 * Zum Anpassen: Einträge in `fixedHolidays` bzw. `easterRelativeHolidays` ändern.
 */

const fixedHolidays: { month: number; day: number; name: string }[] = [
  { month: 1, day: 1, name: 'Neujahr' },
  { month: 1, day: 6, name: 'Heilige Drei Könige' },
  { month: 5, day: 1, name: 'Tag der Arbeit' },
  { month: 8, day: 15, name: 'Mariä Himmelfahrt' },
  { month: 10, day: 3, name: 'Tag der Deutschen Einheit' },
  { month: 11, day: 1, name: 'Allerheiligen' },
  { month: 12, day: 25, name: '1. Weihnachtsfeiertag' },
  { month: 12, day: 26, name: '2. Weihnachtsfeiertag' },
]

const easterRelativeHolidays: { offset: number; name: string }[] = [
  { offset: -2, name: 'Karfreitag' },
  { offset: 1, name: 'Ostermontag' },
  { offset: 39, name: 'Christi Himmelfahrt' },
  { offset: 50, name: 'Pfingstmontag' },
  { offset: 60, name: 'Fronleichnam' },
]

/** Ostersonntag nach der Gaußschen Osterformel (gregorianischer Kalender). */
function easterSunday(year: number): ISODate {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const cache = new Map<number, Map<ISODate, string>>()

function holidaysOfYear(year: number): Map<ISODate, string> {
  const cached = cache.get(year)
  if (cached) return cached

  const map = new Map<ISODate, string>()
  for (const { month, day, name } of fixedHolidays) {
    map.set(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, name)
  }
  const easter = easterSunday(year)
  for (const { offset, name } of easterRelativeHolidays) {
    map.set(addDays(easter, offset), name)
  }
  cache.set(year, map)
  return map
}

/** Gibt den Namen des Feiertags zurück oder undefined, wenn der Tag kein Feiertag ist. */
export function getHolidayName(iso: ISODate): string | undefined {
  return holidaysOfYear(Number(iso.slice(0, 4))).get(iso)
}
