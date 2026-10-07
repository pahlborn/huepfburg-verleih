'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CastleCard } from '@/components/castles/castle-card'
import { DateFilter } from '@/components/booking/date-filter'
import { LinkButton } from '@/components/common/link-button'
import { getBookedDates } from '@/lib/availability'
import { getSelectability } from '@/lib/booking-rules'
import { castles } from '@/lib/castles'
import { formatDateLong, isValidISODate, todayISO, type ISODate } from '@/lib/dates'

/** Liest ?datum= im Browser, damit die Seite auch als statische Datei funktioniert. */
function useDateFromUrl() {
  const params = useSearchParams()
  const raw = params.get('datum') ?? undefined
  const date = isValidISODate(raw) ? raw : undefined
  const [today, setToday] = useState<ISODate>(() => todayISO())
  useEffect(() => setToday(todayISO()), [])
  return { today, date }
}

export function CastleDateFilter({ className }: { className?: string }) {
  const { today, date } = useDateFromUrl()
  return <DateFilter key={date ?? 'leer'} today={today} defaultDate={date} inputId="burgen-datum" className={className} />
}

export function CastleGrid() {
  const { today, date } = useDateFromUrl()
  const [freeBySlug, setFreeBySlug] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    if (!date) {
      setFreeBySlug(new Map())
      return
    }
    let cancelled = false
    Promise.all(
      castles.map(async (castle) => {
        const booked = new Set(await getBookedDates(castle.slug))
        return [castle.slug, getSelectability(date, 'day', booked, today) === 'ok'] as const
      }),
    ).then((entries) => {
      if (!cancelled) setFreeBySlug(new Map(entries))
    })
    return () => {
      cancelled = true
    }
  }, [date, today])

  const freeCount = [...freeBySlug.values()].filter(Boolean).length

  return (
    <>
      {date ? (
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="status">
          <p className="text-lg">
            {freeCount > 0 ? (
              <>
                <strong>{freeCount === 1 ? '1 Burg ist' : `${freeCount} Burgen sind`}</strong> am {formatDateLong(date)} frei.
              </>
            ) : (
              <>
                Am <strong>{formatDateLong(date)}</strong> ist leider keine Burg frei. Probieren Sie einen anderen Tag.
              </>
            )}
          </p>
          <LinkButton href="/huepfburgen" variant="ghost">
            Datum zurücksetzen
          </LinkButton>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {castles.map((castle) => (
          <CastleCard key={castle.slug} castle={castle} date={date} isFreeOnDate={date ? freeBySlug.get(castle.slug) : undefined} />
        ))}
      </div>
    </>
  )
}
