/**
 * HÜPFBURGEN PFLEGEN
 *
 * Jede Burg ist ein Eintrag in `castles`. Alle Werte hier sind Platzhalter.
 * - Preise (in Euro) stehen pro Burg unter `pricing`.
 * - Echte Fotos: Dateien nach /public/castles/<slug>/ legen und unter `images` eintragen,
 *   z. B. images: [{ src: '/castles/burg-1/1.jpg', alt: 'Burg von vorn' }].
 *   Solange `images` leer ist, werden Bildplatzhalter angezeigt.
 */

export type CastleSize = 'klein' | 'mittel' | 'groß'

export interface CastleImage {
  src: string
  alt: string
  /** Bildnachweis, wird als kleine Zeile im Bild angezeigt, z. B. "Bild: Hersteller". */
  credit?: string
}

export interface Castle {
  slug: string
  name: string
  size: CastleSize
  /** Solange true, wird die Burg sichtbar als Platzhalter gekennzeichnet. */
  isPlaceholder: boolean
  teaser: string
  description: string
  highlights: string[]
  dimensionsMeters: { length: number; width: number; height: number }
  ageRange: string
  maxPersons: number
  /** Benötigte Stellfläche inklusive Sicherheitsabstand. */
  spaceRequired: string
  power: string
  weightKg: number
  /** Platzbedarf im Fahrzeug bei Selbstabholung. */
  transport: string
  setupMinutes: number
  pricing: {
    /** Euro pro Miettag, Montag bis Donnerstag. */
    weekday: number
    /** Euro pro Miettag, Freitag bis Sonntag und an Feiertagen. */
    weekend: number
    /** Euro für das Wochenendpaket (Freitag bis Sonntag). */
    weekendPackage: number
    /** Euro Kaution, bei Übernahme fällig, getrennt vom Mietpreis. */
    deposit: number
  }
  images: CastleImage[]
}

export const castles: Castle[] = [
  {
    slug: 'burg-beispiel-1',
    name: 'Burg Beispiel 1',
    size: 'klein',
    isPlaceholder: true,
    teaser: 'Kompakt und ideal für kleine Gärten und die Jüngsten.',
    description:
      'Platzhaltertext: Die kleine Burg passt in fast jeden Garten und ist perfekt für Kindergeburtstage mit wenigen, jüngeren Gästen. Hier beschreiben wir später Farben, Motive und Besonderheiten der echten Burg.',
    highlights: ['Passt in kleine Gärten', 'Niedrige Einstiegshöhe', 'Transport im Kombi möglich'],
    dimensionsMeters: { length: 3.5, width: 3.5, height: 2.5 },
    ageRange: '2 bis 6 Jahre',
    maxPersons: 5,
    spaceRequired: 'ca. 6 × 6 m inkl. Sicherheitsabstand',
    power: '230 V, 1 Gebläse (ca. 0,7 kW)',
    weightKg: 35,
    transport: 'Kombi genügt, ca. 100 × 60 × 60 cm',
    setupMinutes: 20,
    pricing: { weekday: 49, weekend: 69, weekendPackage: 119, deposit: 100 },
    images: [],
  },
  {
    slug: 'klatschender-clown',
    name: 'Klatschender Clown',
    size: 'mittel',
    // Technische Daten laut Händlerseite (JB Inflatables, Modell "klatschender Clown Standard").
    // Alles mit [PRÜFEN] ist noch nicht belegt und wird vor dem Livegang ergänzt.
    isPlaceholder: false,
    teaser: 'Der fröhliche Clown für Kindergeburtstage und Gartenfeste.',
    description:
      'Platzhaltertext: Der klatschende Clown ist eine Hüpfburg aus robuster PVC-Plane, geprüft nach EN 14960 (laut Hersteller, Prüfbuch und Zertifikat bei Kauf bestätigen). Hier beschreiben wir später Farben, Motive und Besonderheiten aus eigener Anschauung.',
    highlights: ['Aufbau in ca. 10 Minuten', 'Bis zu 10 Kinder gleichzeitig', 'Transport im Kombi oder Transporter'],
    // Händler nennt "5,2 x 4 x 5,2 m" ohne Beschriftung der Achsen [PRÜFEN: Länge, Breite, Höhe].
    dimensionsMeters: { length: 5.2, width: 4, height: 5.2 },
    ageRange: '[PRÜFEN: Altersempfehlung laut Bedienungsanleitung]',
    maxPersons: 10,
    spaceRequired: '[PRÜFEN: Stellfläche inkl. Sicherheitsabstand laut Bedienungsanleitung]',
    power: '230 V, 1 Gebläse (1,1 kW)',
    weightKg: 95,
    transport: 'Packmaß ca. 70 × 100 cm, 95 kg: Kombi oder Transporter, zwei Personen zum Tragen',
    setupMinutes: 10,
    // Preise sind Platzhalter, bis die Kalkulation steht.
    pricing: { weekday: 69, weekend: 99, weekendPackage: 169, deposit: 100 },
    // ÜBERGANGSLÖSUNG bis zur Veröffentlichung: Herstellerbild mit Bildnachweis.
    // Vor dem Livegang durch eigene Fotos ersetzen oder schriftliche Freigabe des Herstellers einholen.
    images: [
      {
        src: '/castles/klatschender-clown/1.jpg',
        alt: 'Bunte Hüpfburg mit Clown in Zylinder und Ringelshirt auf dem Dach',
        credit: 'Bild: JB Inflatables',
      },
    ],
  },
  {
    slug: 'burg-beispiel-3',
    name: 'Burg Beispiel 3',
    size: 'groß',
    isPlaceholder: true,
    teaser: 'Die große Burg für Vereins-, Firmen- und Gemeindefeste.',
    description:
      'Platzhaltertext: Die große Burg ist für Feste mit vielen Kindern gedacht, etwa Vereins-, Firmen- oder Gemeindefeste. Hier beschreiben wir später die echte Burg.',
    highlights: ['Für größere Gruppen', 'Ideal für Feste und Events', 'Transporter nötig'],
    dimensionsMeters: { length: 7, width: 5, height: 4 },
    ageRange: '4 bis 12 Jahre',
    maxPersons: 12,
    spaceRequired: 'ca. 10 × 8 m inkl. Sicherheitsabstand',
    power: '230 V, 1 Gebläse (ca. 1,5 kW)',
    weightKg: 110,
    transport: 'Transporter nötig, ca. 150 × 80 × 80 cm',
    setupMinutes: 45,
    pricing: { weekday: 99, weekend: 139, weekendPackage: 239, deposit: 150 },
    images: [],
  },
]

export function getCastle(slug: string): Castle | undefined {
  return castles.find((castle) => castle.slug === slug)
}

export function getLowestPrice(castle: Castle): number {
  return Math.min(castle.pricing.weekday, castle.pricing.weekend)
}

export function formatDimensions(castle: Castle): string {
  const { length, width, height } = castle.dimensionsMeters
  const format = (value: number) => String(value).replace('.', ',')
  return `${format(length)} × ${format(width)} × ${format(height)} m (L × B × H)`
}
