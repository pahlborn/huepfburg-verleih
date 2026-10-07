/**
 * ZENTRALE PLATZHALTER-KONFIGURATION
 *
 * Alle Firmen- und Kontaktdaten sowie die Mietbedingungs-Werte werden hier gepflegt.
 * Preise der einzelnen Hüpfburgen: lib/castles.ts
 * Liefer-Zonen, Feiertage, Wochenendpaket: lib/pricing.ts
 *
 * Alles, was mit [eckigen Klammern] geschrieben ist, ist ein Platzhalter.
 */

export const siteConfig = {
  /** Firmenname (Platzhalter). Wird in Header, Footer, Titel, Impressum usw. verwendet. */
  name: 'Hüpfburg-Verleih [Name]',
  /** Kurzform für enge Stellen (z. B. mobiler Header). */
  shortName: 'Hüpfburg-Verleih [Name]',
  /** Produktions-URL für Sitemap, Canonical und JSON-LD. */
  url: 'https://www.example.de',
  tagline: 'Hüpfburgen mieten im Raum München, Dachau und Freising',
  description:
    'Hüpfburg mieten für Kindergeburtstag, Vereinsfest oder Firmenfeier: Verfügbarkeit und Preis sofort sehen, online buchen. Selbstabholung oder Lieferung im Raum München, Dachau und Freising.',

  serviceArea: {
    headline: 'Raum München, Dachau, Freising',
    regions: ['München', 'Landkreis Dachau', 'Landkreis Freising'],
  },

  contact: {
    phone: '0000 000000',
    phoneHref: 'tel:+490000000000',
    email: 'info@example.de',
    availability: 'Mo bis Fr 17:00 bis 20:00 Uhr, Sa 10:00 bis 14:00 Uhr [Platzhalter]',
  },

  address: {
    owner: '[Vor- und Nachname / Firmenname]',
    street: '[Straße und Hausnummer]',
    postalCode: '85778',
    city: 'Haimhausen',
    region: 'Bayern',
    countryCode: 'DE',
  },

  legal: {
    vatId: '[USt-IdNr. oder Hinweis auf § 19 UStG]',
    registerEntry: '[Handelsregister / Gewerbeanmeldung, falls zutreffend]',
    responsiblePerson: '[Vor- und Nachname]',
    supervisoryAuthority: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach',
  },

  pickup: {
    /** Übernahme-/Rückgabezeiten bei Selbstabholung (Platzhalter). */
    handoverNote:
      'Übergabe und Rückgabe nach Terminabsprache an unserem Standort. Die genaue Adresse erhalten Sie mit der Buchungsbestätigung.',
  },

  /** Wunschzeit für Übergabe bzw. Lieferung im Buchungsformular. */
  timeSlots: [
    { value: 'vormittag', label: 'Vormittag (ca. 8:00 bis 12:00 Uhr)' },
    { value: 'mittag', label: 'Mittag (ca. 12:00 bis 15:00 Uhr)' },
    { value: 'nachmittag', label: 'Nachmittag (ca. 15:00 bis 18:00 Uhr)' },
    { value: 'vortag', label: 'Am Vortag (nach Absprache)' },
    { value: 'absprache', label: 'Nach telefonischer Absprache' },
  ],

  surfaces: [
    { value: 'rasen', label: 'Rasen / Wiese' },
    { value: 'hartflaeche', label: 'Hartfläche (Pflaster, Beton, Asphalt)' },
    { value: 'sonstiges', label: 'Anderer Untergrund (bitte unten beschreiben)' },
  ],

  /** Werte, die in den Mietbedingungen und in der FAQ genannt werden. Alle Platzhalter. */
  rentalTerms: {
    windLimit: {
      beaufort: 5,
      kmh: 'ca. 29 bis 38 km/h',
    },
    /** Kostenlose Umbuchung/Stornierung bei schlechtem Wetter bis X Stunden vor Mietbeginn. */
    weatherChangeHoursBefore: 24,
    /** Kurzer Hinweis für Startseite, Karten und Buchung (mit Sternchen auf die Fußnote). */
    weatherBadge: 'Kostenlos stornieren bei schlechtem Wetter',
    maxSlopeDegrees: 5,
    accessWidthMeters: 1.5,
    cleaningFee: 40,
    /** Mindestzahl Personen für Auf- und Abbau bei Selbstabholung. */
    minPersonsForSetup: 2,
    /** Stornostaffel bei Stornierung durch den Mieter (außer Schlechtwetter). Platzhalter. */
    cancellationTiers: [
      { daysBefore: 14, label: 'bis 14 Tage vor Mietbeginn', percent: 0 },
      { daysBefore: 7, label: '13 bis 7 Tage vor Mietbeginn', percent: 30 },
      { daysBefore: 3, label: '6 bis 3 Tage vor Mietbeginn', percent: 50 },
      { daysBefore: 0, label: 'weniger als 3 Tage vor Mietbeginn', percent: 90 },
    ],
  },

  /**
   * Vertrauenspunkte. `confirmed: false` bedeutet: Aussage ist NICHT geprüft und wird auf der Seite
   * sichtbar als Platzhalter markiert. Erst auf `true` setzen, wenn sie belegt ist.
   */
  trustPoints: [
    {
      id: 'norm',
      icon: 'shield-check',
      title: 'Geprüft nach DIN EN 14960',
      text: 'Sicherheitsprüfung der Hüpfburgen nach Norm, mit Nachweis auf Anfrage.',
      confirmed: false,
    },
    {
      id: 'insurance',
      icon: 'umbrella',
      title: 'Versicherungsschutz',
      text: 'Betriebshaftpflicht für den Verleih. Details zum Umfang folgen.',
      confirmed: false,
    },
    {
      id: 'clean',
      icon: 'sparkles',
      title: 'Saubere Burgen',
      text: 'Jede Burg wird nach der Miete gereinigt und vor dem nächsten Einsatz kontrolliert.',
      confirmed: false,
    },
    {
      id: 'instruction',
      icon: 'hand-helping',
      title: 'Persönliche Einweisung',
      text: 'Kurze Erklärung zu Aufbau, Verankerung und Sicherheit bei der Übergabe.',
      confirmed: false,
    },
  ],
} as const

export type SiteConfig = typeof siteConfig

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`

export const navigation = [
  { href: '/huepfburgen', label: 'Hüpfburgen' },
  { href: '/preise-und-liefergebiet', label: 'Preise & Liefergebiet' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt', label: 'Kontakt' },
] as const

export const footerLinks = {
  service: [
    { href: '/huepfburgen', label: 'Alle Hüpfburgen' },
    { href: '/preise-und-liefergebiet', label: 'Preise & Liefergebiet' },
    { href: '/faq', label: 'Häufige Fragen' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  legal: [
    { href: '/mietbedingungen', label: 'Mietbedingungen' },
    { href: '/datenschutz', label: 'Datenschutz' },
    { href: '/impressum', label: 'Impressum' },
  ],
} as const
