'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CastleCard } from '@/components/castles/castle-card'
import { DateFilter } from '@/components/booking/date-filter'
import { LinkButton } from '@/components/common/link-button'
import { getBookedDates } from '@/lib/availability'
import { getRangeSelectability } from '@/lib/booking-rules'
import { parseRange } from '@/lib/booking-selection'
import { castles } from '@/lib/castles'
import { pricingConfig } from '@/lib/pricing'
import { formatRange, todayISO, type ISODate } from '@/lib/dates'

/** Liest ?datum= und ?bis= im Browser, damit die Seite auch als statische Datei funktioniert. */
function useDateFromUrl() {
  const params = useSearchParams()
  const range = parseRange({ datum: params.get('datum'), bis: params.get('bis') })
  const invalid = params.has('datum') && !range
  const [today, setToday] = useState<ISODate>(() => todayISO())
  useEffect(() => setToday(todayISO()), [])
  return { today, date: range?.date, endDate: range?.endDate, invalid }
}

export function CastleDateFilter({ className }: { className?: string }) {
  const { today, date, endDate } = useDateFromUrl()
  return (
    <DateFilter
      key={`${date ?? 'leer'}-${endDate ?? ''}`}
      today={today}
      defaultDate={date}
      defaultEndDate={endDate}
      inputId="burgen-datum"
      anchorId="zeitraum"
      className={className}
    />
  )
}

export function CastleGrid() {
  const { today, date, endDate, invalid } = useDateFromUrl()
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
        return [castle.slug, getRangeSelectability(date, endDate ?? date, booked, today) === 'ok'] as const
      }),
    ).then((entries) => {
      if (!cancelled) setFreeBySlug(new Map(entries))
    })
    return () => {
      cancelled = true
    }
  }, [date, endDate, today])

  const freeCount = [...freeBySlug.values()].filter(Boolean).length
  const rangeText = date ? formatRange(date, endDate ?? date) : ''

  return (
    <>
      {invalid ? (
        <p className="mb-8 rounded-xl bg-accent/30 p-4 text-accent-foreground" role="status">
          Der Zeitraum ist ungültig. „Bis“ muss nach „Von“ liegen, höchstens {pricingConfig.maxRentalDays} Tage.
        </p>
      ) : null}
      {date ? (
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="status">
          <p className="text-lg">
            {freeCount > 0 ? (
              <>
                <strong>{freeCount === 1 ? '1 Burg ist' : `${freeCount} Burgen sind`}</strong>{' '}
                {endDate && endDate !== date ? `im ganzen Zeitraum ${rangeText}` : `am ${rangeText}`} frei.
              </>
            ) : (
              <>
                {endDate && endDate !== date ? 'Im Zeitraum' : 'Am'} <strong>{rangeText}</strong> ist leider keine Burg frei.
                Probieren Sie andere Tage.
              </>
            )}
          </p>
          <LinkButton href="/huepfburgen" variant="ghost">
            Zeitraum zurücksetzen
          </LinkButton>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {castles.map((castle) => (
          <CastleCard
            key={castle.slug}
            castle={castle}
            date={date}
            endDate={endDate}
            isFreeOnDate={date ? freeBySlug.get(castle.slug) : undefined}
          />
        ))}
      </div>
    </>
  )
}
