import { CalendarSearch } from 'lucide-react'
import { earliestBookableDate, latestBookableDate } from '@/lib/booking-rules'
import type { ISODate } from '@/lib/dates'
import { cn } from '@/lib/utils'

interface DateFilterProps {
  today: ISODate
  defaultDate?: ISODate
  inputId: string
  className?: string
}

/** Kurzfilter: funktioniert ohne JavaScript als normales GET-Formular auf /huepfburgen. */
export function DateFilter({ today, defaultDate, inputId, className }: DateFilterProps) {
  return (
    <form
      action="/huepfburgen"
      method="get"
      className={cn('flex flex-col gap-3 rounded-3xl border-2 bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:p-5', className)}
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor={inputId} className="font-heading text-lg font-semibold">
          Wann brauchen Sie die Hüpfburg?
        </label>
        <input
          id={inputId}
          name="datum"
          type="date"
          required
          min={earliestBookableDate(today)}
          max={latestBookableDate(today)}
          defaultValue={defaultDate}
          className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
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
