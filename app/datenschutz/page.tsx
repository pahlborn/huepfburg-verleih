import type { Metadata } from 'next'
import { DraftNotice } from '@/components/common/draft-notice'
import { PageHero } from '@/components/common/page-hero'
import { LegalSection, Placeholder } from '@/components/legal/legal-section'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  const { address, contact, legal } = siteConfig

  return (
    <>
      <PageHero title="Datenschutzerklärung" eyebrow="Rechtliches" />
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6">
        <DraftNotice>
          Der Text beschreibt den technischen Stand dieser Vorschau. Sobald Hosting, Datenbank, E-Mail-Versand und Zahlung
          angebunden sind, muss er vollständig angepasst werden.
        </DraftNotice>

        <LegalSection id="verantwortlicher" title="Verantwortlicher">
          <p>
            <Placeholder>{address.owner}</Placeholder>, {siteConfig.name}, <Placeholder>{address.street}</Placeholder>,{' '}
            {address.postalCode} {address.city}. E-Mail: {contact.email}, Telefon: {contact.phone}.
          </p>
        </LegalSection>

        <LegalSection id="grundsatz" title="Keine Cookies, keine Tracker">
          <p>
            Diese Website setzt keine Cookies und verwendet keine Analyse- oder Marketing-Tools. Schriftarten werden lokal von
            unserem Server ausgeliefert, es werden keine Daten an Schriftarten-Anbieter übertragen.
          </p>
        </LegalSection>

        <LegalSection id="hosting" title="Hosting und Server-Logfiles">
          <p>
            Beim Aufruf der Seite verarbeitet der Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt,
            aufgerufene Seite), um die Seite auszuliefern und sicher zu betreiben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
            DSGVO. <Placeholder>[Hosting-Anbieter, Serverstandort und Speicherdauer eintragen.]</Placeholder>
          </p>
        </LegalSection>

        <LegalSection id="buchung" title="Buchung und Kontaktaufnahme">
          <p>
            Bei einer Buchung verarbeiten wir Name, E-Mail, Telefonnummer, Adresse des Aufstellorts, gewünschten Termin und
            Angaben zum Untergrund, um den Mietvertrag zu erfüllen (Art. 6 Abs. 1 lit. b DSGVO). Bei Anfragen per E-Mail oder
            Telefon verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage.
          </p>
          <p>
            <Placeholder>[Speicherdauer, gesetzliche Aufbewahrungsfristen, Empfänger (z. B. Steuerberater, Zahlungsdienst) und Auftragsverarbeiter ergänzen.]</Placeholder>
          </p>
        </LegalSection>

        <LegalSection id="rechte" title="Ihre Rechte">
          <ul>
            <li>Auskunft, Berichtigung und Löschung Ihrer Daten</li>
            <li>Einschränkung der Verarbeitung und Datenübertragbarkeit</li>
            <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen</li>
            <li>Beschwerde bei einer Datenschutzaufsichtsbehörde</li>
          </ul>
          <p>Zuständige Aufsichtsbehörde (Beispiel): {legal.supervisoryAuthority}.</p>
        </LegalSection>
      </div>
    </>
  )
}
