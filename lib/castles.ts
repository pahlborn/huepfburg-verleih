/**
 * HÜPFBURGEN PFLEGEN
 *
 * Jede Burg ist ein Eintrag in `castles`.
 * - Preise (in Euro) stehen pro Burg unter `pricing`.
 * - Fotos liegen unter /public/castles/<slug>/ und werden unter `images` eingetragen.
 *   Solange `images` leer ist, werden Bildplatzhalter angezeigt.
 * - Angaben, die der Händler nicht nennt, stehen auf `null` und erscheinen als "Angabe folgt".
 *   Nach dem Kauf aus Bedienungsanleitung und Prüfbuch ergänzen.
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
  /** Altersempfehlung laut Bedienungsanleitung, null solange unbekannt. */
  ageRange: string | null
  /** Für wie viele Kinder gleichzeitig die Burg gedacht ist (laut Hersteller), null solange unbekannt. */
  maxPersons: number | null
  /** Benötigte Stellfläche inklusive Sicherheitsabstand. */
  spaceRequired: string
  power: string
  /** Gewicht der Burg inkl. Tasche (für Transport bei Selbstabholung). */
  weightKg: number
  /** Packmaß der zusammengerollten Burg. */
  packSize: string
  /** Platzbedarf im Fahrzeug bei Selbstabholung. */
  transport: string
  setupTime: string
  material: string
  /** Sicherheitsnorm und Nachweis. */
  safety: string
  /** Was der Kunde bei der Übergabe bekommt. */
  included: string[]
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

/** Was bei jeder Miete dabei ist, unabhängig von der Burg. */
const standardIncluded = ['Gebläse mit 230-V-Stecker', 'Erdnägel', 'Unterlegplane', 'Transporttasche', 'Bedienungsanleitung']

// ÜBERGANGSLÖSUNG bis zur Veröffentlichung: Herstellerbilder mit Bildnachweis.
// Vor dem Livegang durch eigene Fotos ersetzen oder eine schriftliche Freigabe des Herstellers einholen.
const jb = 'Bild: JB Inflatables'
const kiddyfun = 'Bild: Kiddyfun'

export const castles: Castle[] = [
  {
    // Quelle: huepfburgenwelt.de, "Hüpfburg Mini Zirkus mit Dach" (JB Inflatables), Stand 15.10.2026.
    slug: 'mini-zirkus',
    name: 'Mini-Zirkus',
    size: 'klein',
    isPlaceholder: false,
    teaser: 'Die kleine Zirkusburg mit Dach für die Jüngsten und kleine Gärten.',
    description:
      'Clowns, Zirkuszelt und leuchtendes Orange: Der Mini-Zirkus ist unsere kleinste Burg. Er passt in fast jeden Garten und ist ideal für Geburtstage mit wenigen, jüngeren Kindern. Das Dach spendet Schatten, der flache Einstieg macht das Hineinklettern leicht.',
    highlights: ['Passt in fast jeden Garten', 'Mit Dach als Sonnenschutz', 'Passt in den Kombi', 'Aufbau in ca. 10 Minuten'],
    // Händler: "4 x 3,1 x 2,8 m", Achsen nicht beschriftet.
    dimensionsMeters: { length: 4, width: 3.1, height: 2.8 },
    ageRange: null,
    maxPersons: 4,
    spaceRequired: 'Burg 4 × 3,1 m, dazu rundum ca. 1,8 m frei und vor dem Eingang mehr Platz (Richtwert nach EN 14960)',
    power: '230 V, 1 Gebläse (1,1 kW)',
    weightKg: 69,
    packSize: 'ca. 70 × 90 cm',
    transport: 'Packmaß ca. 70 × 90 cm, 69 kg: passt in einen Kombi, zwei Personen zum Tragen',
    setupTime: 'ca. 10 Minuten',
    material: 'PVC-Plane mit 9×9-Gewebe, mehrfach vernäht und verstärkt',
    safety: 'nach EN 14960 (NEN-EN 14960 laut Hersteller)',
    included: standardIncluded,
    pricing: { weekday: 89, weekend: 119, weekendPackage: 179, deposit: 100 },
    images: [
      { src: '/castles/mini-zirkus/1.jpg', alt: 'Orange-gelbe Mini-Hüpfburg mit Dach und Clown-Motiven an den Seiten', credit: jb },
      { src: '/castles/mini-zirkus/2.jpg', alt: 'Mini-Zirkus aufgebaut auf einem Platz, Ansicht schräg von vorn', credit: jb },
      { src: '/castles/mini-zirkus/3.jpg', alt: 'Mini-Zirkus von der anderen Seite mit Einstiegsstufe', credit: jb },
      { src: '/castles/mini-zirkus/4.jpg', alt: 'Nahaufnahme des gemalten Clowns mit Zylinder und Fliege', credit: jb },
      { src: '/castles/mini-zirkus/5.jpg', alt: 'Blick ins Innere auf die Rückwand mit Zirkus-Schriftzug und Clown auf dem Hochrad', credit: jb },
    ],
  },
  {
    // Quelle: huepfburgenwelt.de, "Hüpfburg Party Standard" (JB Inflatables), Stand 15.10.2026.
    slug: 'partyburg',
    name: 'Partyburg',
    size: 'mittel',
    isPlaceholder: false,
    teaser: 'Bunte Burg mit großer 3D-Partyfigur auf dem Dach, für bis zu 10 Kinder.',
    description:
      'Auf dem Dach sitzt eine große Partyfigur mit Hütchen und Luftballons, innen geht es kunterbunt mit „Happy Party“ zu. Die Partyburg ist unsere Allrounderin für Kindergeburtstage und Gartenfeste: genug Platz für eine ganze Geburtstagsrunde und trotzdem in einem Kombi zu transportieren.',
    highlights: ['Bis zu 10 Kinder gleichzeitig', 'Mit Dach und 3D-Figur', 'Aufbau in ca. 10 Minuten', 'Prüfzertifikat nach EN 14960'],
    // Händler: "5,2 x 4 x 5,5 m", Achsen nicht beschriftet. Höhe inklusive Figur.
    dimensionsMeters: { length: 5.2, width: 4, height: 5.5 },
    ageRange: null,
    maxPersons: 10,
    spaceRequired: 'Burg 5,2 × 4 m, dazu rundum ca. 1,8 m frei und vor dem Eingang mehr Platz (Richtwert nach EN 14960)',
    power: '230 V, 1 Gebläse (1,1 kW)',
    weightKg: 100,
    packSize: 'ca. 70 × 100 cm',
    transport: 'Packmaß ca. 70 × 100 cm, 100 kg: Kombi oder Transporter, zwei Personen zum Tragen',
    setupTime: 'ca. 10 Minuten',
    material: 'PVC-Plane mit 9×9-Gewebe, mehrfach vernäht und verstärkt',
    safety: 'nach EN 14960, mit Zertifikat einer Prüfstelle',
    included: standardIncluded,
    pricing: { weekday: 129, weekend: 169, weekendPackage: 249, deposit: 150 },
    images: [
      { src: '/castles/partyburg/1.jpg', alt: 'Bunte Hüpfburg mit Dach und großer Partyfigur mit Hütchen obenauf', credit: jb },
      { src: '/castles/partyburg/2.jpg', alt: 'Partyburg aufgebaut im Freien, Ansicht schräg von vorn', credit: jb },
      { src: '/castles/partyburg/3.jpg', alt: 'Partyburg von der Seite vor einem Gebäude', credit: jb },
      { src: '/castles/partyburg/4.jpg', alt: 'Nahaufnahme der Partyfigur mit Luftballons auf dem Dach', credit: jb },
      { src: '/castles/partyburg/5.jpg', alt: 'Blick ins Innere: bunte Sprungfläche und Rückwand mit Happy-Party-Schriftzug', credit: jb },
      { src: '/castles/partyburg/6.jpg', alt: 'Nahaufnahme des Happy-Party-Schriftzugs an der Innenwand', credit: jb },
      { src: '/castles/partyburg/7.jpg', alt: 'Nahaufnahme eines gemalten Gesichts an einer Säule', credit: jb },
    ],
  },
  {
    // Quelle: kiddyfun.de, "Hüpfburg 6x5 m - Clown" (Lieferumfang: "Clown XL"), Stand 21.10.2026.
    // Gebläse ist beim Händler nicht dabei und wird separat gekauft (empfohlen: 1,1 kW Abgabeleistung).
    slug: 'clown-xl',
    name: 'Clown XL',
    size: 'groß',
    isPlaceholder: false,
    teaser: 'Unsere große Burg mit Clown auf dem Dach und viel Sprungfläche.',
    description:
      'Der Clown oben auf der Burg lacht den Kindern schon von Weitem entgegen. Die große Sprungfläche bietet viel Platz, das Dach schützt bei starker Sonne und leichtem Regen. Ideal für größere Kindergeburtstage, Vereins- und Gartenfeste.',
    highlights: ['Große Sprungfläche, 6 × 5 m', 'Mit Dach als Sonnen- und Regenschutz', 'Für größere Feste', 'Lieferung mit Aufbau empfohlen'],
    // Händler: "6m x 5m x 4,5m", Achsen nicht beschriftet.
    dimensionsMeters: { length: 6, width: 5, height: 4.5 },
    // Kiddyfun nennt weder Personenzahl noch Alter [PRÜFEN nach Kauf].
    ageRange: null,
    maxPersons: null,
    spaceRequired: 'Burg 6 × 5 m, dazu rundum ca. 1,8 m frei und vor dem Eingang mehr Platz (Richtwert nach EN 14960)',
    power: '230 V, 1 Gebläse (1,1 kW)',
    weightKg: 150,
    packSize: 'ca. 120 × 80 × 80 cm',
    transport: 'Packmaß ca. 120 × 80 × 80 cm, ca. 150 kg: Transporter oder Anhänger und drei Personen zum Tragen. Wir empfehlen die Lieferung mit Aufbau',
    // Händler nennt keine Aufbauzeit; Richtwert anderer Verleiher für 6 × 5 m [PRÜFEN].
    setupTime: 'ca. 20 bis 30 Minuten',
    material: 'PVC 0,55 mm, mehrfach vernäht, große verdeckte Reißverschlüsse zum Ablassen der Luft',
    safety: 'gefertigt nach DIN EN 14960 (laut Händler)',
    included: [...standardIncluded, 'Reparaturset'],
    pricing: { weekday: 159, weekend: 199, weekendPackage: 299, deposit: 200 },
    images: [
      { src: '/castles/clown-xl/1.jpg', alt: 'Große Hüpfburg mit Dach in Rot, Blau und Gelb, obenauf ein Clown mit blauem Hut und Händen', credit: kiddyfun },
      { src: '/castles/clown-xl/2.jpg', alt: 'Clown XL von hinten mit Gebläseanschluss', credit: kiddyfun },
    ],
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
