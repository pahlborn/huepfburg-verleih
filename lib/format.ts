const euroWhole = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const euroFraction = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formatiert einen Betrag in Cent, z. B. 4900 -> "49 €", 4950 -> "49,50 €". */
export function formatCents(cents: number): string {
  return cents % 100 === 0 ? euroWhole.format(cents / 100) : euroFraction.format(cents / 100)
}

/** Formatiert einen Betrag in Euro, z. B. 49 -> "49 €". */
export function formatEuro(euros: number): string {
  return formatCents(Math.round(euros * 100))
}
