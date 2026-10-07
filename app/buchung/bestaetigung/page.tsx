import type { Metadata } from 'next'
import { ConfirmationView } from '@/components/booking/confirmation-view'

export const metadata: Metadata = {
  title: 'Buchung bestätigt',
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  return <ConfirmationView />
}
