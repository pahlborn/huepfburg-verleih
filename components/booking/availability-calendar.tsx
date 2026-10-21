'use client'

import { useMemo } from 'react'
import { de } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'
import { getRangeSelectability, getSelectability, latestBookableDate, earliestBookableDate } from '@/lib/booking-rules'
import { dateToISO, isoToLocalDate, type ISODate } from '@/lib/dates'

interface AvailabilityCalendarProps {
  start?: ISODate
  end?: ISODate
  /** Neuer Zeitraum. Ein einzelner Tag hat start === end. */
  onChange: (start: ISODate, end: ISODate) => void
  bookedDates: ISODate[]
  today: ISODate
}

/**
 * Kalender für einen Zeitraum: Erster Klick wählt einen Tag (Tagesmiete). Ein zweiter Klick auf einen späteren Tag
 * verlängert bis dorthin, sofern alle Tage dazwischen frei sind. Danach beginnt ein Klick eine neue Auswahl.
 */
export function AvailabilityCalendar({ start, end, onChange, bookedDates, today }: AvailabilityCalendarProps) {
  const booked = useMemo(() => new Set(bookedDates), [bookedDates])
  const bookedAsDates = useMemo(() => bookedDates.map(isoToLocalDate), [bookedDates])

  function handleDay(day: ISODate) {
    if (start && end === start && day > start && getRangeSelectability(start, day, booked, today) === 'ok') {
      onChange(start, day)
      return
    }
    onChange(day, day)
  }

  return (
    <div>
      <Calendar
        mode="range"
        locale={de}
        weekStartsOn={1}
        selected={start ? { from: isoToLocalDate(start), to: isoToLocalDate(end ?? start) } : undefined}
        onSelect={(_range, triggerDate) => handleDay(dateToISO(triggerDate))}
        disabled={(date) => getSelectability(dateToISO(date), booked, today) !== 'ok'}
        startMonth={isoToLocalDate(today)}
        endMonth={isoToLocalDate(latestBookableDate(today))}
        defaultMonth={isoToLocalDate(start ?? earliestBookableDate(today))}
        modifiers={{ booked: bookedAsDates }}
        modifiersClassNames={{
          booked: 'rounded-(--cell-radius) bg-destructive/10 opacity-100! [&>button]:text-destructive [&>button]:line-through',
        }}
        showOutsideDays={false}
        classNames={{ root: 'w-full' }}
        className="rounded-2xl border bg-card p-3 [--cell-size:--spacing(11)] sm:p-4 sm:[--cell-size:--spacing(12)]"
      />

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Legende">
        <li className="flex items-center gap-2">
          <span className="size-4 rounded border-2 border-primary bg-card" aria-hidden="true" />
          Frei und wählbar
        </li>
        <li className="flex items-center gap-2">
          <span className="size-4 rounded bg-destructive/10 ring-1 ring-destructive/40" aria-hidden="true" />
          Belegt
        </li>
        <li className="flex items-center gap-2">
          <span className="size-4 rounded bg-primary" aria-hidden="true" />
          Ihre Auswahl
        </li>
      </ul>
    </div>
  )
}
