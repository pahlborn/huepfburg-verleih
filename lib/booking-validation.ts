import { siteConfig } from '@/lib/site-config'

export interface BookingFormValues {
  name: string
  email: string
  phone: string
  street: string
  postalCode: string
  city: string
  timeSlot: string
  surface: string
  notes: string
  termsAccepted: boolean
  privacyAccepted: boolean
}

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>

export const emptyBookingForm: BookingFormValues = {
  name: '',
  email: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
  timeSlot: '',
  surface: '',
  notes: '',
  termsAccepted: false,
  privacyAccepted: false,
}

/** Reihenfolge, in der Fehler im Formular angezeigt und fokussiert werden. */
export const bookingFieldOrder: (keyof BookingFormValues)[] = [
  'name',
  'email',
  'phone',
  'street',
  'postalCode',
  'city',
  'timeSlot',
  'surface',
  'notes',
  'termsAccepted',
  'privacyAccepted',
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Wird im Browser (sofortiges Feedback) und auf dem Server (verbindlich) verwendet. */
export function validateBookingForm(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {}
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

  if (text(values.name).length < 2) errors.name = 'Bitte geben Sie Ihren Namen an.'
  if (!emailPattern.test(text(values.email))) errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  if (text(values.phone).replace(/\D/g, '').length < 6) errors.phone = 'Bitte geben Sie eine Telefonnummer an.'
  if (text(values.street).length < 3) errors.street = 'Bitte geben Sie Straße und Hausnummer des Aufstellorts an.'
  if (!/^\d{5}$/.test(text(values.postalCode))) errors.postalCode = 'Bitte geben Sie eine 5-stellige Postleitzahl an.'
  if (text(values.city).length < 2) errors.city = 'Bitte geben Sie den Ort an.'
  if (!siteConfig.timeSlots.some((slot) => slot.value === values.timeSlot)) {
    errors.timeSlot = 'Bitte wählen Sie eine Wunschzeit.'
  }
  if (!siteConfig.surfaces.some((surface) => surface.value === values.surface)) {
    errors.surface = 'Bitte geben Sie den Untergrund am Aufstellort an.'
  }
  if (text(values.notes).length > 1000) errors.notes = 'Bitte fassen Sie sich kürzer (maximal 1000 Zeichen).'
  if (!values.termsAccepted) errors.termsAccepted = 'Bitte bestätigen Sie, dass Sie die Mietbedingungen gelesen haben.'
  if (!values.privacyAccepted) errors.privacyAccepted = 'Bitte bestätigen Sie die Datenschutzerklärung.'

  return errors
}
