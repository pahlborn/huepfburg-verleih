import type { Metadata } from 'next'
import { DraftNotice } from '@/components/common/draft-notice'
import { PageHero } from '@/components/common/page-hero'
import { LegalSection, Placeholder } from '@/components/legal/legal-section'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false, follow: true },
}

export default function ImprintPage() {
  const { address, contact, legal } = siteConfig

  return (
    <>
      <PageHero title="Impressum" eyebrow="Rechtliches" />
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6">
        <DraftNotice>Pflichtangaben nach § 5 DDG prüfen und vollständig ergänzen.</DraftNotice>

        <LegalSection id="anbieter" title="Angaben zum Anbieter">
          <address className="not-italic">
            <Placeholder>{address.owner}</Placeholder>
            <br />
            {siteConfig.name}
            <br />
            <Placeholder>{address.street}</Placeholder>
            <br />
            {address.postalCode} {address.city}
          </address>
        </LegalSection>

        <LegalSection id="kontakt" title="Kontakt">
          <p>
            Telefon: {contact.phone}
            <br />
            E-Mail: {contact.email}
          </p>
        </LegalSection>

        <LegalSection id="register" title="Register und Steuer">
          <p>
            Registereintrag: <Placeholder>{legal.registerEntry}</Placeholder>
          </p>
          <p>
            Umsatzsteuer: <Placeholder>{legal.vatId}</Placeholder>
          </p>
        </LegalSection>

        <LegalSection id="verantwortlich" title="Verantwortlich für den Inhalt">
          <p>
            <Placeholder>{legal.responsiblePerson}</Placeholder>, Anschrift wie oben.
          </p>
        </LegalSection>

        <LegalSection id="streitbeilegung" title="Verbraucherstreitbeilegung">
          <p>
            <Placeholder>
              [Hinweis, ob zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle bereit
              oder verpflichtet, rechtlich prüfen.]
            </Placeholder>
          </p>
        </LegalSection>
      </div>
    </>
  )
}
