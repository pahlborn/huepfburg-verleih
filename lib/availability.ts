import 'server-only'

import { getCastle } from '@/lib/castles'
import { addDays, todayISO, weekdayOf, type ISODate } from '@/lib/dates'
import { getSelectability, type SelectabilityReason } from '@/lib/booking-rules'
import type { RentalType } from '@/lib/pricing'

/**
 * VERFÜGBARKEIT UND BUCHUNGEN
 *
 * Dies ist die einzige Datei, die später an eine Datenbank angebunden werden muss.
 * Die restliche Seite ruft nur diese drei Funktionen auf:
 *
 *   getBookedDates(slug)          -> welche Tage sind für eine Burg belegt?
 *   checkAvailability(...)        -> ist ein Zeitraum frei?
 *   createBooking(...)            -> Buchung speichern
 *
 * Aktuell liefern sie Mock-Daten. Stellen zum Austauschen sind mit "TODO(DB)" markiert.
 */

export interface BookingRecord {
  reference: string
  castleSlug: string
  /** Alle belegten Kalendertage (bei Wochenendpaket Fr, Sa, So). */
  dates: ISODate[]
  rentalType: RentalType
  fulfilment: 'pickup' | 'delivery'
  customer: {
    name: string
    email: string
    phone: string
  }
  location: {
    street: string
    postalCode: string
    city: string
    surface: string
    notes: string
  }
  timeSlot: string
  totalCents: number
  depositCents: number
  createdAt: string
}

// ---------------------------------------------------------------------------
// Mock-Daten (werden relativ zu "heute" erzeugt, damit immer Beispiele sichtbar sind)
// ---------------------------------------------------------------------------

/** Liefert den n-ten kommenden Tag mit dem gegebenen Wochentag (n = 0: nächster). */
function nthUpcoming(today: ISODate, weekday: number, n: number): ISODate {
  let day = addDays(today, 1)
  while (weekdayOf(day) !== weekday) day = addDays(day, 1)
  return addDays(day, n * 7)
}

function mockBookedDates(slug: string): ISODate[] {
  const today = todayISO()
  const weekendIndexes: Record<string, number[]> = {
    'burg-beispiel-1': [0, 2, 3, 6],
    'klatschender-clown': [1, 2, 4, 5],
    'burg-beispiel-3': [0, 3, 4, 7],
  }
  const weekdayBlocks: Record<string, { weekday: number; n: number }[]> = {
    'burg-beispiel-1': [{ weekday: 4, n: 1 }],
    'klatschender-clown': [{ weekday: 2, n: 2 }, { weekday: 3, n: 2 }],
    'burg-beispiel-3': [{ weekday: 1, n: 3 }],
  }

  const dates = new Set<ISODate>()
  for (const index of weekendIndexes[slug] ?? []) {
    const saturday = nthUpcoming(today, 6, index)
    dates.add(saturday)
    dates.add(addDays(saturday, 1))
  }
  for (const { weekday, n } of weekdayBlocks[slug] ?? []) {
    dates.add(nthUpcoming(today, weekday, n))
  }
  return [...dates].sort()
}

// Mock-Speicher, damit eine Buchung während der Entwicklung sichtbar bleibt.
// Geht bei einem Neustart des Servers verloren. Ersetzen durch Datenbank.
const mockBookings: BookingRecord[] = []

// ---------------------------------------------------------------------------
// Öffentliche Schnittstelle
// ---------------------------------------------------------------------------

/** Alle für diese Burg belegten Tage als ISO-Datum. */
export async function getBookedDates(slug: string): Promise<ISODate[]> {
  // TODO(DB): Belegte Tage aus der Datenbank lesen, z. B.
  //   SELECT day FROM booked_days WHERE castle_slug = $1 AND day >= current_date
  // Auch manuelle Sperrtage (Wartung, Eigenbedarf) hier mit zurückgeben.
  const fromBookings = mockBookings.filter((b) => b.castleSlug === slug).flatMap((b) => b.dates)
  return [...new Set([...mockBookedDates(slug), ...fromBookings])].sort()
}

export type AvailabilityResult = { available: true } | { available: false; reason: SelectabilityReason }

/** Prüft serverseitig, ob die Burg am gewünschten Datum (bzw. Wochenendpaket) frei ist. */
export async function checkAvailability(
  slug: string,
  date: ISODate,
  rentalType: RentalType,
): Promise<AvailabilityResult> {
  if (!getCastle(slug)) return { available: false, reason: 'booked' }
  const booked = new Set(await getBookedDates(slug))
  const reason = getSelectability(date, rentalType, booked, todayISO())
  return reason === 'ok' ? { available: true } : { available: false, reason }
}

/** Legt eine Buchung an und gibt die Buchungsnummer zurück. */
export async function createBooking(
  data: Omit<BookingRecord, 'reference' | 'createdAt'>,
): Promise<{ reference: string }> {
  const reference = `HB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const record: BookingRecord = { ...data, reference, createdAt: new Date().toISOString() }

  // TODO(DB): Buchung in der Datenbank speichern. Wichtig:
  //   - Verfügbarkeitsprüfung und INSERT in EINER Transaktion (oder mit Unique-Constraint auf
  //     castle_slug + day), damit zwei gleichzeitige Buchungen nicht denselben Tag erwischen.
  //   - Danach Bestätigungs-E-Mail an Kunde und Betreiber senden.
  mockBookings.push(record)

  return { reference }
}
