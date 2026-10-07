import type { Metadata } from 'next'
import { DraftNotice } from '@/components/common/draft-notice'
import { PageHero } from '@/components/common/page-hero'
import { LegalSection, Placeholder } from '@/components/legal/legal-section'
import { formatEuro } from '@/lib/format'
import { pricingConfig } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Mietbedingungen',
  description: 'Mietbedingungen für Hüpfburgen: Aufsicht, Wetter, Aufstellort, Strom, Aufbau, Rückgabe, Kaution, Stornierung und Haftung.',
  alternates: { canonical: '/mietbedingungen' },
}

const terms = siteConfig.rentalTerms

const tableOfContents = [
  { id: 'geltung', title: 'Geltungsbereich und Vertrag' },
  { id: 'nutzung', title: 'Nutzung und Aufsicht' },
  { id: 'verhalten', title: 'Verhaltensregeln auf der Burg' },
  { id: 'wetter', title: 'Wetter' },
  { id: 'aufstellort', title: 'Aufstellort' },
  { id: 'strom', title: 'Strom' },
  { id: 'aufbau', title: 'Aufbau, Abbau und Lieferung' },
  { id: 'rueckgabe', title: 'Rückgabe und Reinigung' },
  { id: 'kaution', title: 'Kaution' },
  { id: 'stornierung', title: 'Stornierung' },
  { id: 'haftung', title: 'Haftung' },
  { id: 'widerruf', title: 'Widerrufsrecht' },
  { id: 'schluss', title: 'Schlussbestimmungen' },
] as const

export default function RentalTermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title="Mietbedingungen"
        intro="Die wichtigsten Regeln für eine sichere und entspannte Feier. Gelb markierte Werte sind Platzhalter."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <DraftNotice>Alle Regelungen und Werte sind typische Branchenbeispiele und müssen angepasst werden.</DraftNotice>

        <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr]">
          <nav aria-labelledby="inhalt-titel" className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="inhalt-titel" className="font-heading text-lg font-semibold">
              Inhalt
            </h2>
            <ol className="mt-3 flex list-decimal flex-col gap-1.5 rounded-2xl bg-secondary/60 py-4 pr-4 pl-9 marker:font-semibold marker:text-primary">
              {tableOfContents.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`} className="underline-offset-4 hover:text-primary hover:underline">
                    {entry.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-12">
            <LegalSection id="geltung" title="Geltungsbereich und Vertrag">
              <p>
                Diese Bedingungen gelten für die Vermietung von Hüpfburgen und Zubehör durch {siteConfig.name} (
                <Placeholder>{siteConfig.address.owner}</Placeholder>). Der Mietvertrag kommt mit der Buchung über den Button
                &bdquo;Zahlungspflichtig buchen&ldquo; und unserer Bestätigung zustande. Maßgeblich sind die Angaben zu Burg,
                Termin, Übergabeart und Preis in der Buchungszusammenfassung.
              </p>
              <p>
                Der Mietpreis, die Lieferpauschale und die Kaution werden getrennt ausgewiesen. Alle Preise sind{' '}
                <Placeholder>[Hinweis zur Umsatzsteuer, z. B. Endpreise nach § 19 UStG]</Placeholder>.
              </p>
            </LegalSection>

            <LegalSection id="nutzung" title="Nutzung und Aufsicht">
              <ul>
                <li>Die Hüpfburg darf nur unter ständiger Aufsicht einer volljährigen, nüchternen Person genutzt werden.</li>
                <li>Eltern und Aufsichtspersonen haften für ihre Kinder. Das Betreten und Benutzen erfolgt auf eigene Gefahr.</li>
                <li>
                  Alters- und Größenvorgaben sowie die maximale Personenzahl der jeweiligen Burg sind einzuhalten. Sie stehen
                  bei jeder Burg und in der Buchungsbestätigung.
                </li>
                <li>Erwachsene dürfen die Burg nicht betreten, und die Burg darf nicht überlastet werden.</li>
              </ul>
            </LegalSection>

            <LegalSection id="verhalten" title="Verhaltensregeln auf der Burg">
              <p>Vor dem Betreten sind abzulegen:</p>
              <ul>
                <li>Schuhe und Brillen</li>
                <li>spitze oder harte Gegenstände (z. B. Schlüssel, Haarspangen)</li>
                <li>Schmuck und Gürtel</li>
              </ul>
              <p>Außerdem gilt:</p>
              <ul>
                <li>Kein Essen, Trinken oder Kaugummi auf der Burg.</li>
                <li>Keine Pyrotechnik, kein offenes Feuer und keine Wunderkerzen in der Nähe.</li>
                <li>Kein Spritzwasser auf Gebläse, Kabel und Steckdosen.</li>
                <li>Nicht an den Wänden hochklettern oder daran hängen und keine Tiere auf die Burg lassen.</li>
              </ul>
            </LegalSection>

            <LegalSection id="wetter" title="Wetter">
              <p>
                Die Burg darf nicht bei Regen, Gewitter oder ab Windstärke {terms.windLimit.beaufort} (
                <Placeholder>{terms.windLimit.kmh}</Placeholder>) betrieben werden. Dann ist das Gebläse sofort abzuschalten
                und die Burg zu entleeren. Bei Gewitter verlassen alle Personen die Burg und den Aufstellort.
              </p>
              <p>
                Bei schlechtem Wetter am Miettag ist eine kostenfreie Umbuchung oder Stornierung möglich, wenn Sie uns bis{' '}
                <Placeholder>{terms.weatherChangeHoursBefore} Stunden</Placeholder> vor Mietbeginn informieren. Bei
                gebuchter Lieferung mit Auf- und Abbau sind die dafür anfallenden Kosten ggf. trotzdem zu tragen. Wir
                empfehlen, die Wettervorhersage am Vortag zu prüfen.
              </p>
            </LegalSection>

            <LegalSection id="aufstellort" title="Aufstellort">
              <ul>
                <li>Ebener, sauberer und möglichst steinfreier Untergrund, Rasen oder Hartfläche.</li>
                <li>Eine Unterlegplane ist zu verwenden. Auf Hartflächen schützt sie Burg und Boden.</li>
                <li>
                  Gefälle höchstens ca. <Placeholder>{terms.maxSlopeDegrees} Grad</Placeholder>.
                </li>
                <li>Die Burg ist nach Anleitung zu verankern. Die Art der Verankerung hängt vom Untergrund ab.</li>
                <li>
                  Ausreichend Platz plus Sicherheitsabstand zu Wänden, Zäunen, Bäumen, Fahrzeugen und anderen Hindernissen. Der
                  Platzbedarf steht bei jeder Burg.
                </li>
                <li>
                  Ebenerdiger Zugang zum Aufstellort mit ca. <Placeholder>{terms.accessWidthMeters} m</Placeholder> Breite.
                </li>
              </ul>
              <p>Bitte geben Sie bei der Buchung den Untergrund an, damit wir Sie bei Bedarf beraten können.</p>
            </LegalSection>

            <LegalSection id="strom" title="Strom">
              <p>
                Der Mieter stellt den Strom: eine 230-V-Haushaltssteckdose in Reichweite des Gebläses (Kabellänge siehe
                Burg). Das Gebläse muss während der gesamten Nutzung durchgehend laufen, sonst fällt die Burg zusammen. Bitte
                prüfen Sie vorab, dass die Steckdose abgesichert ist und kein weiteres Großgerät am selben Stromkreis hängt.
              </p>
            </LegalSection>

            <LegalSection id="aufbau" title="Aufbau, Abbau und Lieferung">
              <p>
                <strong>Selbstabholung (Standard):</strong> Auf- und Abbau erfolgen durch den Mieter nach Anleitung, mit
                mindestens <Placeholder>{terms.minPersonsForSetup} Personen</Placeholder>. Nötig ist ein Kombi oder größerer
                Transporter. Den Platzbedarf im Fahrzeug nennen wir bei jeder Burg.
              </p>
              <p>
                <strong>Lieferung mit Aufbau und Abbau (optional):</strong> Der Vermieter liefert, baut auf und holt nach
                Terminabsprache wieder ab. Die Lieferpauschale ist eine Kostenerstattung nach Zone:
              </p>
              <ul>
                {pricingConfig.deliveryZones.map((zone) => (
                  <li key={zone.id}>
                    {zone.label} (bis {zone.maxKm} km): <Placeholder>{formatEuro(zone.fee)}</Placeholder>
                  </li>
                ))}
                <li>Darüber: {pricingConfig.beyondZonesLabel}</li>
              </ul>
              <p>Der Mieter sorgt dafür, dass der Aufstellort zum vereinbarten Zeitpunkt frei und zugänglich ist.</p>
            </LegalSection>

            <LegalSection id="rueckgabe" title="Rückgabe und Reinigung">
              <p>
                Die Burg ist trocken und sauber zurückzugeben. Bei starker Verschmutzung oder Nässe berechnen wir eine
                Reinigungspauschale von <Placeholder>{formatEuro(terms.cleaningFee)}</Placeholder>. Bei Schimmel durch
                feucht verpackte Rückgabe berechnen wir die Ersatzkosten.
              </p>
              <p>
                Empfehlung: Machen Sie bei Übernahme und Rückgabe kurze Fotos oder ein Video vom Zustand der Burg. Das schützt
                beide Seiten.
              </p>
            </LegalSection>

            <LegalSection id="kaution" title="Kaution">
              <p>
                Die Kaution ist bei Übernahme fällig, in bar oder per Überweisung (Höhe je Burg, z. B.{' '}
                <Placeholder>100 Euro</Placeholder>). Sie wird nach ordnungsgemäßer Rückgabe erstattet. Berechtigte Forderungen
                wie Reinigung oder Schäden können mit der Kaution verrechnet werden.
              </p>
            </LegalSection>

            <LegalSection id="stornierung" title="Stornierung">
              <p>Bei Stornierung durch den Mieter fallen folgende Anteile des Mietpreises an (Ausnahme: Schlechtwetter, siehe oben):</p>
              <ul>
                {terms.cancellationTiers.map((tier) => (
                  <li key={tier.daysBefore}>
                    {tier.label}: <Placeholder>{tier.percent} %</Placeholder>
                  </li>
                ))}
              </ul>
              <p>Dem Mieter bleibt der Nachweis vorbehalten, dass kein oder ein geringerer Schaden entstanden ist.</p>
            </LegalSection>

            <LegalSection id="haftung" title="Haftung">
              <p>
                Der Mieter haftet ab Übergabe für Schäden und Verlust der Mietsache, soweit er sie zu vertreten hat. Das gilt
                auch für Schäden durch Dritte und Gäste während der Mietzeit. Der Vermieter haftet nach den gesetzlichen
                Vorschriften, bei einfacher Fahrlässigkeit nur bei Verletzung wesentlicher Vertragspflichten{' '}
                <Placeholder>[Haftungsklausel rechtlich prüfen]</Placeholder>.
              </p>
            </LegalSection>

            <LegalSection id="widerruf" title="Widerrufsrecht">
              <p>
                Bei Verträgen über Freizeitbetätigungen, die einen spezifischen Termin oder Zeitraum vorsehen, besteht kein
                Widerrufsrecht (§ 312g Abs. 2 Nr. 9 BGB). Mit der Buchung eines bestimmten Termins ist das hier der Fall.
              </p>
              <p>
                <Placeholder>[Entwurf: Formulierung und Anwendbarkeit auf diesen Vertragstyp rechtlich prüfen lassen.]</Placeholder>
              </p>
            </LegalSection>

            <LegalSection id="schluss" title="Schlussbestimmungen">
              <p>
                Es gilt deutsches Recht. Sollte eine Bestimmung unwirksam sein, bleibt der Rest wirksam.{' '}
                <Placeholder>[Gerichtsstand, Streitbeilegung und weitere Klauseln ergänzen.]</Placeholder>
              </p>
              <p className="text-sm text-muted-foreground">Stand: [Datum eintragen]</p>
            </LegalSection>
          </div>
        </div>
      </div>
    </>
  )
}
