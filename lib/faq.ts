import { siteConfig } from '@/lib/site-config'
import { formatEuro } from '@/lib/format'

const { rentalTerms } = siteConfig
const times = rentalTerms.handlingTimes
const handover = rentalTerms.handoverTimes

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
  /** Wird auf der Startseite im FAQ-Auszug gezeigt. */
  featured?: boolean
}

// Reihenfolge der Kategorien = Reihenfolge auf der FAQ-Seite.
// Fragen gesammelt aus den FAQ mehrerer Hüpfburg-Verleiher; Platzhalter vor dem Start ersetzen.
export const faqItems: FaqItem[] = [
  // --- Buchung und Abholung ---
  {
    id: 'verfuegbarkeit',
    category: 'Buchung und Abholung',
    question: 'Woher weiß ich, ob die Hüpfburg an meinem Termin frei ist?',
    answer:
      'Bei jeder Burg sehen Sie einen Kalender mit allen freien Tagen. Sie wählen das Datum, sehen sofort den Preis und können direkt buchen. Eine Anfrage und das Warten auf eine Antwort entfallen.',
    featured: true,
  },
  {
    id: 'buchung',
    category: 'Buchung und Abholung',
    question: 'Wie läuft die Buchung ab?',
    answer:
      'Burg und Datum wählen, Selbstabholung oder Lieferung auswählen, Ihre Daten eintragen und verbindlich buchen. Sie erhalten eine Bestätigung per E-Mail. Die Abstimmung der genauen Uhrzeit folgt danach.',
  },
  {
    id: 'zielgruppe',
    category: 'Buchung und Abholung',
    question: 'An wen vermieten Sie?',
    answer:
      'An Privatpersonen für Kindergeburtstage und Gartenfeste ebenso wie an Vereine, Kindergärten, Schulen, Firmen und Gemeinden.',
  },
  {
    id: 'abholzeiten',
    category: 'Buchung und Abholung',
    question: 'Wann hole ich die Burg ab und wann bringe ich sie zurück?',
    answer: `Bei der Tagesmiete holen Sie die Burg ab ${handover.dayPickupFrom} ab und bringen sie bis ${handover.dayReturnBy} zurück. Beim Wochenendpaket holen Sie sie ${handover.weekendPickup} ab und bringen sie ${handover.weekendReturn} zurück. Die genaue Uhrzeit stimmen wir nach der Buchung mit Ihnen ab.`,
  },
  {
    id: 'vorabend',
    category: 'Buchung und Abholung',
    question: 'Kann ich die Burg schon am Vorabend abholen?',
    answer:
      'Ja, nach Absprache, sofern die Burg am Vortag nicht vermietet ist. Sprechen Sie uns nach der Buchung einfach darauf an.',
  },
  {
    id: 'standort',
    category: 'Buchung und Abholung',
    question: 'Wo hole ich die Burg ab?',
    answer: `Bei uns in ${siteConfig.address.city} (Landkreis Dachau). Die genaue Adresse erhalten Sie mit der Buchungsbestätigung.`,
  },
  {
    id: 'liefergebiet',
    category: 'Buchung und Abholung',
    question: 'Liefern Sie auch zu mir?',
    answer: `Wir liefern im ${siteConfig.serviceArea.headline}. Den Lieferpreis sehen Sie beim Buchen sofort, wenn Sie die Postleitzahl des Aufstellorts eingeben. Weiter entfernte Orte auf Anfrage.`,
  },
  {
    id: 'transport',
    category: 'Buchung und Abholung',
    question: 'Welches Fahrzeug brauche ich zur Abholung?',
    answer:
      'Je nach Burg reicht ein Kombi oder es ist ein Transporter oder Anhänger nötig. Packmaß und Gewicht stehen bei jeder Burg. Die Burgen sind zusammengerollt und schwer: Kommen Sie bitte mindestens zu zweit, bei schweren Burgen besser zu dritt.',
  },

  // --- Aufbau und Abbau ---
  {
    id: 'aufbau',
    category: 'Aufbau und Abbau',
    question: 'Wer baut die Hüpfburg auf und ab?',
    answer: `Standard ist die Selbstabholung: Sie holen die Burg bei uns ab und bauen sie nach Anleitung selbst auf und ab. Dafür sind mindestens ${rentalTerms.minPersonsForSetup} Personen und ein passendes Fahrzeug nötig. Alternativ liefern wir die Burg und übernehmen Aufbau und Abbau nach Terminabsprache gegen Kostenerstattung nach Liefer-Zone. Bitte halten Sie dann eine erwachsene Person bereit, die beim Tragen hilft.`,
  },
  {
    id: 'aufbaudauer',
    category: 'Aufbau und Abbau',
    question: 'Wie lange dauert der Aufbau?',
    answer: `Insgesamt ${times.setupTotal}: Plane auslegen, Burg ausrollen, Gebläse anschließen, aufblasen und verankern. Die Zeit bei jeder Burg nennt den reinen Aufbau laut Hersteller. Planen Sie beim ersten Mal etwas Puffer ein.`,
    featured: true,
  },
  {
    id: 'aufblasen',
    category: 'Aufbau und Abbau',
    question: 'Wie lange dauert das Aufblasen?',
    answer: `Mit dem mitgelieferten Gebläse ist die Burg in ${times.inflate} prall. Das Gebläse bleibt danach eingeschaltet, solange die Burg genutzt wird.`,
  },
  {
    id: 'abbaudauer',
    category: 'Aufbau und Abbau',
    question: 'Wie lange dauern Luft ablassen und Abbau?',
    answer: `Das Luft ablassen dauert ${times.deflate}, Zusammenlegen und Einrollen ${times.fold}. Rechnen Sie mit etwa einer halben Stunde und mindestens ${rentalTerms.minPersonsForSetup} Personen.`,
  },
  {
    id: 'zusammenlegen',
    category: 'Aufbau und Abbau',
    question: 'Wie lege ich die Burg richtig zusammen?',
    answer:
      'Gebläse ausschalten und abziehen, Luftauslässe öffnen und die Restluft ohne Schuhe aus der Burg drücken. Dann die Seiten zur Mitte falten und die Burg in Richtung der offenen Auslässe straff einrollen, damit die letzte Luft entweicht. Mit den Gurten sichern und in die Tasche packen. Die Burg muss dabei trocken sein. Eine bebilderte Anleitung liegt bei.',
  },
  {
    id: 'einweisung',
    category: 'Aufbau und Abbau',
    question: 'Bekomme ich eine Einweisung?',
    answer:
      'Ja. Bei der Übergabe zeigen wir Ihnen Aufbau, Verankerung und Abbau. Zusätzlich liegt eine schriftliche Anleitung bei.',
  },
  {
    id: 'lieferumfang',
    category: 'Aufbau und Abbau',
    question: 'Was ist bei der Miete dabei?',
    answer:
      'Hüpfburg, Gebläse, Erdnägel zum Verankern, Unterlegplane, Transporttasche und Aufbauanleitung. Für harten Untergrund gibt es Sandsäcke und Fallschutzmatten [Platzhalter: inklusive oder gegen Aufpreis].',
  },

  // --- Aufstellort und Strom ---
  {
    id: 'platzbedarf',
    category: 'Aufstellort und Strom',
    question: 'Wie viel Platz brauche ich für eine Hüpfburg?',
    answer: `Das hängt von der Burg ab: Neben der Burg selbst brauchen Sie rundherum einen Sicherheitsabstand zu Zäunen, Hecken, Bäumen und Mauern. Den genauen Platzbedarf finden Sie bei jeder Burg. Außerdem muss der Zugang zum Aufstellort ebenerdig und mindestens ca. ${String(rentalTerms.accessWidthMeters).replace('.', ',')} m breit sein.`,
    featured: true,
  },
  {
    id: 'untergrund',
    category: 'Aufstellort und Strom',
    question: 'Auf welchem Untergrund kann die Burg stehen?',
    answer: `Ideal ist ein ebener, sauberer und möglichst steinfreier Rasen. Das Gefälle darf höchstens ca. ${rentalTerms.maxSlopeDegrees} Grad betragen. Auf Sand, Kies oder losem Boden darf die Burg nicht stehen. Unter die Burg kommt immer die Unterlegplane.`,
    featured: true,
  },
  {
    id: 'pflaster',
    category: 'Aufstellort und Strom',
    question: 'Geht das auch auf Pflaster, Asphalt oder Beton?',
    answer:
      'Ja. Dort hält die Burg nicht mit Erdnägeln, sondern wird mit Sandsäcken beschwert. Vor dem Eingang liegen Fallschutzmatten. Geben Sie den Untergrund bitte beim Buchen an, dann packen wir das passende Zubehör ein.',
  },
  {
    id: 'indoor',
    category: 'Aufstellort und Strom',
    question: 'Kann ich die Burg in einer Halle oder Turnhalle aufstellen?',
    answer:
      'Ja, wenn die Halle hoch genug ist. Die Höhe der Burg steht bei den Maßen, darüber braucht es noch etwas Abstand zur Decke und zu Lampen. Statt Erdnägeln werden Sandsäcke verwendet. Fragen Sie im Zweifel vorher bei uns nach.',
  },
  {
    id: 'strom',
    category: 'Aufstellort und Strom',
    question: 'Brauche ich Strom?',
    answer:
      'Ja. Das Gebläse braucht eine normale 230-V-Haushaltssteckdose in Reichweite. Einen besonderen Anschluss brauchen Sie nicht. Den Strom stellen Sie.',
    featured: true,
  },
  {
    id: 'kabel',
    category: 'Aufstellort und Strom',
    question: 'Darf ich ein Verlängerungskabel benutzen?',
    answer:
      'Ja. Nutzen Sie ein für draußen geeignetes Kabel und rollen Sie eine Kabeltrommel immer vollständig ab, sonst kann sie heiß werden. Verlegen Sie das Kabel so, dass niemand darüber stolpert. Bei langen Wegen helfen wir mit einem Kabel nach Absprache.',
  },
  {
    id: 'geblaese',
    category: 'Aufstellort und Strom',
    question: 'Muss das Gebläse die ganze Zeit laufen?',
    answer:
      'Ja. Die Burg verliert ständig etwas Luft über die Nähte, das ist so gewollt und völlig normal. Das Gebläse gleicht das aus. Wird es ausgeschaltet, sackt die Burg in kurzer Zeit zusammen, deshalb müssen dann sofort alle Kinder heraus.',
  },

  // --- Nutzung und Sicherheit ---
  {
    id: 'alter',
    category: 'Nutzung und Sicherheit',
    question: 'Für welches Alter und wie viele Kinder sind die Burgen gedacht?',
    answer:
      'Bei jeder Burg stehen die Altersempfehlung und für wie viele Kinder gleichzeitig sie gedacht ist. Bitte halten Sie beides ein und lassen Sie möglichst Kinder ähnlicher Größe zusammen hüpfen.',
    featured: true,
  },
  {
    id: 'erwachsene',
    category: 'Nutzung und Sicherheit',
    question: 'Dürfen auch Erwachsene in die Hüpfburg?',
    answer: 'Nein. Unsere Burgen sind nur für Kinder gedacht. Das Gewicht von Erwachsenen überlastet die Burg und gefährdet die Kinder.',
  },
  {
    id: 'aufsicht',
    category: 'Nutzung und Sicherheit',
    question: 'Muss jemand aufpassen?',
    answer:
      'Ja. Solange die Burg aufgebaut ist, muss ständig eine volljährige, nüchterne Person dabei sein und auf die Kinder achten. Eltern haften für ihre Kinder.',
  },
  {
    id: 'schuhe',
    category: 'Nutzung und Sicherheit',
    question: 'Was ist in der Burg nicht erlaubt?',
    answer:
      'Schuhe, Brillen, Schmuck, Gürtel und spitze Gegenstände bleiben draußen. Gehüpft wird in Socken oder barfuß. Essen, Trinken, Kaugummi, Konfetti, Farbe und Silly String sind in der Burg tabu.',
  },
  {
    id: 'betreuung',
    category: 'Nutzung und Sicherheit',
    question: 'Kann ich eine Betreuung dazubuchen?',
    answer:
      '[Platzhalter: Ja, nach Absprache gegen Aufpreis pro Stunde / Nein, die Aufsicht übernimmt der Mieter.]',
  },
  {
    id: 'pruefung',
    category: 'Nutzung und Sicherheit',
    question: 'Sind die Hüpfburgen geprüft?',
    answer:
      'Unsere Burgen sind Profi-Geräte aus robuster PVC-Plane, gebaut nach der Norm EN 14960 für aufblasbare Spielgeräte. [Platzhalter: Prüfbuch und regelmäßige Prüfung bestätigen.] Billige Nylon-Burgen aus dem Spielwarenhandel vermieten wir nicht.',
  },
  {
    id: 'versicherung',
    category: 'Nutzung und Sicherheit',
    question: 'Sind die Burgen versichert?',
    answer:
      '[Platzhalter: Wir sind als Vermieter haftpflichtversichert.] Für Schäden durch unsachgemäße Nutzung haftet der Mieter. Prüfen Sie für größere Feste, ob Ihre private Haftpflicht- oder eine Veranstaltungsversicherung greift.',
  },

  // --- Wetter ---
  {
    id: 'wetter',
    category: 'Wetter',
    question: 'Was passiert bei schlechtem Wetter?',
    answer: `Bei Regen, Gewitter und ab Windstärke ${rentalTerms.windLimit.beaufort} (${rentalTerms.windLimit.kmh}) darf die Burg nicht betrieben werden. Bei schlechtem Wetter am Miettag können Sie bis ${rentalTerms.weatherChangeHoursBefore} Stunden vorher kostenfrei umbuchen oder stornieren. Bei gebuchter Lieferung mit Auf- und Abbau sind die dafür anfallenden Kosten ggf. trotzdem zu tragen.`,
    featured: true,
  },
  {
    id: 'regen-party',
    category: 'Wetter',
    question: 'Was mache ich, wenn es während der Feier zu regnen beginnt?',
    answer:
      'Alle Kinder aus der Burg holen, das Gebläse ausschalten und den Stecker ziehen. Die Burg zusammensacken lassen und am besten mit einer Plane abdecken. Ist der Schauer vorbei, einfach wieder aufblasen: Durch die Luft trocknet die Burg von selbst.',
  },
  {
    id: 'wind',
    category: 'Wetter',
    question: 'Ab wann ist es zu windig?',
    answer: `Ab Windstärke ${rentalTerms.windLimit.beaufort}, das sind ${rentalTerms.windLimit.kmh}. Daran erkennen Sie es: Kleine Laubbäume beginnen zu schwanken. Die Burg muss dann sofort geräumt und abgeschaltet werden, auch wenn sie gut verankert ist.`,
  },

  // --- Rückgabe ---
  {
    id: 'reinigung',
    category: 'Rückgabe',
    question: 'Muss ich die Burg reinigen?',
    answer: `Bitte geben Sie die Burg trocken und besenrein zurück. Kehren, Absaugen oder Abwischen mit einem feuchten Tuch genügt. Bei starker Verschmutzung oder Nässe berechnen wir eine Reinigungspauschale (aktuell ${formatEuro(rentalTerms.cleaningFee)}), bei Schimmel durch feucht verpackte Burgen die Ersatzkosten.`,
  },
  {
    id: 'nass',
    category: 'Rückgabe',
    question: 'Die Burg ist nass geworden. Was jetzt?',
    answer:
      'Lassen Sie sie aufgeblasen stehen, bis sie trocken ist, das geht durch das Gebläse meist schnell. Rollen Sie sie nicht nass ein. Klappt das nicht mehr, sagen Sie uns bei der Rückgabe Bescheid, dann trocknen wir sie.',
  },
  {
    id: 'schaden',
    category: 'Rückgabe',
    question: 'Was passiert, wenn etwas kaputtgeht?',
    answer:
      'Melden Sie Schäden bitte sofort, nutzen Sie die Burg dann nicht weiter. Normale Abnutzung tragen wir. Schäden durch unsachgemäße Nutzung, etwa durch Schuhe, spitze Gegenstände oder Überlastung, trägt der Mieter.',
  },
  {
    id: 'fotos',
    category: 'Rückgabe',
    question: 'Sollte ich Fotos machen?',
    answer:
      'Ja, wir empfehlen kurze Fotos oder ein Video bei der Übernahme und vor der Rückgabe. So lässt sich später leicht klären, in welchem Zustand die Burg war.',
  },

  // --- Zahlung und Stornierung ---
  {
    id: 'zahlung',
    category: 'Zahlung und Stornierung',
    question: 'Wie kann ich bezahlen?',
    answer:
      'Beim Buchen sehen Sie Mietpreis und Kaution getrennt. [Platzhalter: Bezahlung online per PayPal, Klarna oder Karte / per Überweisung / bar bei Übergabe.]',
  },
  {
    id: 'kaution',
    category: 'Zahlung und Stornierung',
    question: 'Wie hoch ist die Kaution und wann bekomme ich sie zurück?',
    answer:
      'Die Kaution steht bei jeder Burg und wird getrennt vom Mietpreis ausgewiesen. Sie ist bei Übernahme fällig (bar oder per Überweisung) und wird nach ordnungsgemäßer Rückgabe zurückgezahlt [Platzhalter: sofort bar / innerhalb von X Werktagen].',
  },
  {
    id: 'storno',
    category: 'Zahlung und Stornierung',
    question: 'Kann ich stornieren?',
    answer:
      'Ja. Bei schlechtem Wetter ist die Stornierung innerhalb der Frist kostenfrei. In allen anderen Fällen gilt die Stornostaffel aus den Mietbedingungen: Je früher Sie absagen, desto günstiger.',
  },
  {
    id: 'widerruf',
    category: 'Zahlung und Stornierung',
    question: 'Habe ich ein Widerrufsrecht?',
    answer:
      'Nein. Bei der Miete für einen festen Termin besteht kein gesetzliches Widerrufsrecht [Entwurf: rechtlich prüfen]. Sie können aber zu den Stornobedingungen absagen.',
  },
]

export const faqCategories = [...new Set(faqItems.map((item) => item.category))]

export const contactHint = `Ihre Frage ist nicht dabei? Rufen Sie uns an unter ${siteConfig.contact.phone} oder schreiben Sie uns.`
