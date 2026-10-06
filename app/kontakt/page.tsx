import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { LinkButton } from '@/components/common/link-button'
import { PageHero } from '@/components/common/page-hero'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `Kontakt zu ${siteConfig.name}: Fragen zu Hüpfburgen, Lieferung und Terminen im ${siteConfig.serviceArea.headline}.`,
  alternates: { canonical: '/kontakt' },
}

const linkClass = 'text-lg font-semibold text-primary underline underline-offset-4'

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Wir sind für Sie da"
        intro="Eine Burg buchen Sie am schnellsten direkt online. Für Sonderwünsche, Vereinsfeste, Gemeinden oder Lieferungen außerhalb der Zonen melden Sie sich gern bei uns."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div className="flex flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex gap-4">
            <Phone className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold">Telefon</h2>
              <a href={siteConfig.contact.phoneHref} className={linkClass}>
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold">E-Mail</h2>
              <a href={`mailto:${siteConfig.contact.email}`} className={linkClass}>
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold">Erreichbarkeit</h2>
              <p className="text-lg">{siteConfig.contact.availability}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <MapPin className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold">Standort</h2>
              <address className="text-lg not-italic">
                {siteConfig.address.owner}
                <br />
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.city}
              </address>
              <p className="mt-2 text-sm text-muted-foreground">{siteConfig.pickup.handoverNote}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-3xl bg-secondary/60 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Direkt zur Wunschburg</h2>
          <p className="leading-relaxed">
            Verfügbarkeit, Preis und Kaution sehen Sie sofort. Das spart Ihnen das Warten auf eine Antwort.
          </p>
          <LinkButton href="/huepfburgen" size="lg">
            Verfügbarkeit prüfen
          </LinkButton>
          <p className="text-sm text-muted-foreground">Liefergebiet: {siteConfig.serviceArea.headline}</p>
        </div>
      </div>
    </>
  )
}
