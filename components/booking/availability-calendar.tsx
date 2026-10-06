'use client'

import { useMemo } from 'react'
import { de } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'
import { getSelectability, latestBookableDate, earliestBookableDate } from '@/lib/booking-rules'
import { dateToISO, isoToLocalDate, type ISODate } from '@/lib/dates'
import { getRentalDates, type RentalType } from '@/lib/pricing'

interface AvailabilityCalendarProps {
  rentalType: RentalType
  selected?: ISODate
  onSelect: (date: ISODate) => void
  bookedDates: ISODate[]
  today: ISODate
}

export function AvailabilityCalendar({ rentalType, selected, onSelect, bookedDates, today }: AvailabilityCalendarProps) {
  const booked = useMemo(() => new Set(bookedDates), [bookedDates])
  const bookedAsDates = useMemo(() => bookedDates.map(isoToLocalDate), [bookedDates])
  const rangeAsDates = useMemo(
    () => (selected ? getRentalDates(selected, rentalType).map(isoToLocalDate) : []),
    [selected, rentalType],
  )

  return (
    <div>
      <Calendar
        mode="single"
        required
        locale={de}
        weekStartsOn={1}
        selected={selected ? isoToLocalDate(selected) : undefined}
        onSelect={(date) => onSelect(dateToISO(date))}
        disabled={(date) => getSelectability(dateToISO(date), rentalType, booked, today) !== 'ok'}
        startMonth={isoToLocalDate(today)}
        endMonth={isoToLocalDate(latestBookableDate(today))}
        defaultMonth={isoToLocalDate(selected ?? earliestBookableDate(today))}
        modifiers={{ booked: bookedAsDates, rentalRange: rangeAsDates }}
        modifiersClassNames={{
          booked: 'rounded-(--cell-radius) bg-destructive/10 opacity-100! [&>button]:text-destructive [&>button]:line-through',
          rentalRange: 'rounded-(--cell-radius) bg-primary/15',
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
