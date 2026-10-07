import { siteConfig } from '@/lib/site-config'
import { formatEuro } from '@/lib/format'

const { rentalTerms } = siteConfig

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
  /** Wird auf der Startseite im FAQ-Auszug gezeigt. */
  featured?: boolean
}

export const faqItems: FaqItem[] = [
  {
    id: 'platzbedarf',
    category: 'Aufstellort',
    question: 'Wie viel Platz brauche ich für eine Hüpfburg?',
    answer:
      'Das hängt von der Burg ab: Neben der Burg selbst brauchen Sie rundherum einen Sicherheitsabstand zu Zäunen, Hecken, Bäumen und Mauern. Den genauen Platzbedarf inklusive Abstand finden Sie bei jeder Burg unter "Platzbedarf". Außerdem muss der Zugang zum Aufstellort ebenerdig und mindestens ca. 1,5 m breit sein.',
    featured: true,
  },
  {
    id: 'strom',
    category: 'Aufstellort',
    question: 'Brauche ich Strom?',
    answer:
      'Ja. Das Gebläse braucht eine normale 230-V-Haushaltssteckdose in Reichweite und läuft während der gesamten Nutzung durchgehend. Den Strom stellen Sie. Bei größeren Entfernungen helfen wir gern mit einem Verlängerungskabel nach Absprache.',
    featured: true,
  },
  {
    id: 'untergrund',
    category: 'Aufstellort',
    question: 'Auf welchem Untergrund kann die Burg stehen?',
    answer: `Ideal ist ein ebener, sauberer und möglichst steinfreier Untergrund, also Rasen oder eine Hartfläche. Das Gefälle darf höchstens ca. ${rentalTerms.maxSlopeDegrees} Grad betragen. Wir legen eine Unterlegplane aus und verankern die Burg nach Anleitung. Geben Sie im Buchungsformular bitte an, was bei Ihnen vorhanden ist.`,
    featured: true,
  },
  {
    id: 'wetter',
    category: 'Wetter',
    question: 'Was passiert bei schlechtem Wetter?',
    answer: `Bei Regen, Gewitter und ab Windstärke ${rentalTerms.windLimit.beaufort} (${rentalTerms.windLimit.kmh}) darf die Burg nicht betrieben werden. Dann wird sie sofort abgeschaltet und entleert. Bei schlechtem Wetter am Miettag können Sie bis ${rentalTerms.weatherChangeHoursBefore} Stunden vorher kostenfrei umbuchen oder stornieren. Bei gebuchter Lieferung mit Auf- und Abbau sind die dafür anfallenden Kosten ggf. trotzdem zu tragen.`,
    featured: true,
  },
  {
    id: 'aufbau',
    category: 'Aufbau',
    question: 'Wer baut die Hüpfburg auf und ab?',
    answer: `Standard ist die Selbstabholung: Sie holen die Burg bei uns ab und bauen sie nach Anleitung selbst auf und ab. Dafür sind mindestens ${rentalTerms.minPersonsForSetup} Personen und ein Kombi oder größerer Transporter nötig. Alternativ liefern wir die Burg und übernehmen Aufbau und Abbau nach Terminabsprache gegen Kostenerstattung nach Liefer-Zone.`,
  },
  {
    id: 'transport',
    category: 'Aufbau',
    question: 'Welches Fahrzeug brauche ich zur Abholung?',
    answer:
      'Je nach Burg reicht ein Kombi oder es ist ein Transporter nötig. Die Maße der Transportbehälter und das Gewicht stehen bei jeder Burg. Die Burgen sind zusammengerollt und müssen mindestens zu zweit getragen werden.',
  },
  {
    id: 'reinigung',
    category: 'Rückgabe',
    question: 'Muss ich die Burg reinigen?',
    answer: `Bitte geben Sie die Burg trocken und grob sauber zurück. Kehren oder Abwischen genügt. Bei starker Verschmutzung oder Nässe berechnen wir eine Reinigungspauschale (aktuell ${formatEuro(rentalTerms.cleaningFee)}), bei Schimmel durch feucht verpackte Burgen die Ersatzkosten.`,
  },
  {
    id: 'alter',
    category: 'Nutzung',
    question: 'Für welches Alter sind die Burgen geeignet?',
    answer:
      'Jede Burg hat eine Altersempfehlung und eine maximale Personenzahl, die Sie bei der Burg finden. Erwachsene dürfen die Burg nicht betreten. Kinder dürfen nur unter ständiger Aufsicht einer volljährigen, nüchternen Person hüpfen.',
    featured: true,
  },
  {
    id: 'zahlung',
    category: 'Zahlung',
    question: 'Wie läuft die Zahlung ab?',
    answer:
      'Beim Buchen sehen Sie den Mietpreis und die Kaution getrennt. Die Kaution ist bei Übernahme fällig (bar oder per Überweisung) und wird nach ordnungsgemäßer Rückgabe zurückgegeben. Die genauen Zahlungswege [Platzhalter: z. B. Überweisung, bar bei Übergabe] bestätigen wir mit der Buchung.',
  },
  {
    id: 'kaution',
    category: 'Zahlung',
    question: 'Wie hoch ist die Kaution?',
    answer:
      'Die Kaution hängt von der Burg ab und steht auf der Preisseite sowie bei jeder Burg. Sie wird getrennt vom Mietpreis ausgewiesen.',
  },
  {
    id: 'storno',
    category: 'Zahlung',
    question: 'Kann ich stornieren?',
    answer:
      'Ja. Die Stornobedingungen finden Sie in den Mietbedingungen. Bei schlechtem Wetter am Miettag ist die Umbuchung oder Stornierung innerhalb der Frist kostenfrei.',
  },
]

export const faqCategories = [...new Set(faqItems.map((item) => item.category))]

export const contactHint = `Ihre Frage ist nicht dabei? Rufen Sie uns an unter ${siteConfig.contact.phone} oder schreiben Sie uns.`
