/**
 * ZUBEHÖR ZUM DAZUBUCHEN
 *
 * Preise in Euro pro Miete (Tagesmiete oder Wochenendpaket), alle Werte sind Platzhalter.
 * Orientierung: hüpfburg.de (Berlin) verlangt 10 € für die Fallschutzmatte, 60 € für vier Wassersäcke,
 * 25 € für den Gebläse-Schallschutz und 75 € für einen Anhänger (Stand 08.10.2026).
 *
 * `enabled: false` blendet einen Artikel aus, bis er wirklich angeboten wird.
 */

export interface Extra {
  id: string
  name: string
  description: string
  /** Euro pro Miete. */
  price: number
  enabled: boolean
  /** Nur bei Selbstabholung buchbar (z. B. Anhänger). */
  pickupOnly?: boolean
}

export const extras: Extra[] = [
  {
    id: 'fallschutzmatte',
    name: 'Fallschutzmatte',
    description: 'Weiche, rutschfeste Matte vor dem Eingang. Empfohlen auf Pflaster, Beton oder Asphalt.',
    price: 10,
    enabled: true,
  },
  {
    id: 'beschwerung',
    name: 'Beschwerung für harten Boden',
    description: '4 Wassersäcke zum Befestigen, wo keine Erdnägel halten, z. B. auf Pflaster oder in der Halle.',
    price: 20,
    enabled: true,
  },
  {
    id: 'schallschutz',
    name: 'Gebläse-Schallschutz',
    description: 'Haube, die das Gebläse leiser macht. Angenehm für Nachbarn und in Innenräumen.',
    price: 15,
    enabled: true,
  },
  {
    // Erst freischalten, wenn Versicherung und Zulassung als Mietfahrzeug geklärt sind.
    id: 'anhaenger',
    name: 'Anhänger für den Transport',
    description: 'PKW-Anhänger, passend für die Burg. Nur zusammen mit einer Hüpfburg und bei Selbstabholung.',
    price: 40,
    enabled: false,
    pickupOnly: true,
  },
]

export function getExtra(id: string): Extra | undefined {
  return extras.find((extra) => extra.id === id)
}

/** Alle Artikel, die für die gewählte Übergabe buchbar sind. */
export function availableExtras(fulfilment: 'pickup' | 'delivery'): Extra[] {
  return extras.filter((extra) => extra.enabled && (!extra.pickupOnly || fulfilment === 'pickup'))
}

/** Bereinigt eine Liste von IDs: nur bekannte, freigeschaltete, zur Übergabe passende, ohne Doppelte. */
export function sanitizeExtras(ids: readonly string[] | undefined, fulfilment: 'pickup' | 'delivery'): string[] {
  if (!ids) return []
  const allowed = new Set(availableExtras(fulfilment).map((extra) => extra.id))
  return extras.map((extra) => extra.id).filter((id) => ids.includes(id) && allowed.has(id))
}
