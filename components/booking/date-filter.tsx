'use client'

import { useState } from 'react'
import { CalendarSearch } from 'lucide-react'
import { earliestBookableDate, latestBookableDate } from '@/lib/booking-rules'
import { addDays, type ISODate } from '@/lib/dates'
import { pricingConfig } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { withBasePath } from '@/lib/base-path'

interface DateFilterProps {
  today: ISODate
  defaultDate?: ISODate
  defaultEndDate?: ISODate
  inputId: string
  className?: string
}

const inputClass =
  'h-12 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

/**
 * Kurzfilter mit Zeitraum. Funktioniert ohne JavaScript als normales GET-Formular auf /huepfburgen.
 * "Bis" ist optional: leer gelassen bedeutet ein einzelner Tag.
 */
export function DateFilter({ today, defaultDate, defaultEndDate, inputId, className }: DateFilterProps) {
  const [from, setFrom] = useState<string>(defaultDate ?? '')
  const [to, setTo] = useState<string>(defaultEndDate && defaultEndDate !== defaultDate ? defaultEndDate : '')
  const minTo = from || earliestBookableDate(today)
  const maxTo = from ? addDays(from, pricingConfig.maxRentalDays - 1) : latestBookableDate(today)

  return (
    <form
      action={withBasePath(process.env.NEXT_PUBLIC_BASE_PATH ? '/huepfburgen/' : '/huepfburgen')}
      method="get"
      className={cn('flex flex-col gap-3 rounded-3xl border-2 bg-card p-4 shadow-sm sm:p-5', className)}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-heading text-lg font-semibold">Wann brauchen Sie die Hüpfburg?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${inputId}-von`} className="text-sm font-semibold">
              Von
            </label>
            <input
              id={`${inputId}-von`}
              name="datum"
              type="date"
              required
              min={earliestBookableDate(today)}
              max={latestBookableDate(today)}
              value={from}
              onChange={(event) => {
                const next = event.target.value
                setFrom(next)
                if (to && next && (to < next || to > addDays(next, pricingConfig.maxRentalDays - 1))) setTo('')
              }}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${inputId}-bis`} className="text-sm font-semibold">
              Bis <span className="font-normal text-muted-foreground">(leer = ein Tag)</span>
            </label>
            <input
              id={`${inputId}-bis`}
              name={to ? 'bis' : undefined}
              type="date"
              min={minTo}
              max={maxTo}
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-heading text-base font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <CalendarSearch className="size-5" aria-hidden="true" />
        Freie Burgen anzeigen
      </button>
    </form>
  )
}
