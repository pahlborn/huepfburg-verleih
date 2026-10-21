'use client'

import { useEffect, useState } from 'react'
import { BookingPanel } from '@/components/booking/booking-panel'
import { getBookedDates } from '@/lib/availability'
import type { Castle } from '@/lib/castles'
import { parseRange } from '@/lib/booking-selection'
import { todayISO, type ISODate } from '@/lib/dates'

interface LoadedState {
  today: ISODate
  bookedDates: ISODate[]
  initialDate?: ISODate
  initialEndDate?: ISODate
}

/**
 * Ermittelt "heute", die belegten Tage und einen vorgewählten Zeitraum (?datum=&bis=) im Browser,
 * damit die Seite auch als statische Datei (GitHub Pages) aktuell bleibt.
 */
export function BookingPanelLoader({ castle }: { castle: Castle }) {
  const [state, setState] = useState<LoadedState | null>(null)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams(window.location.search)
    const range = parseRange({ datum: params.get('datum'), bis: params.get('bis') })
    getBookedDates(castle.slug).then((bookedDates) => {
      if (cancelled) return
      setState({ today: todayISO(), bookedDates, initialDate: range?.date, initialEndDate: range?.endDate })
    })
    return () => {
      cancelled = true
    }
  }, [castle.slug])

  if (!state) {
    return <p className="py-10 text-center text-muted-foreground">Kalender wird geladen …</p>
  }
  return <BookingPanel castle={castle} bookedDates={state.bookedDates} today={state.today} initialDate={state.initialDate} initialEndDate={state.initialEndDate} />
}
