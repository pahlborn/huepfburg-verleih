import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { footerLinks, fullAddress, siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="mt-20 pb-20 text-footer md:pb-0">
      <div className="battlements" aria-hidden="true" />
      <div className="bg-footer text-footer-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-heading text-xl font-semibold">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs leading-relaxed text-footer-foreground/80">
              Hüpfburgen mieten im {siteConfig.serviceArea.headline}. Abholen oder liefern lassen.
            </p>
          </div>

          <nav aria-label="Service">
            <p className="font-heading text-lg font-semibold">Service</p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.service.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-footer-foreground/85 underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Rechtliches">
            <p className="font-heading text-lg font-semibold">Rechtliches</p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-footer-foreground/85 underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-heading text-lg font-semibold">Kontakt</p>
            <ul className="mt-3 flex flex-col gap-2.5 text-footer-foreground/85">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-1 size-4 shrink-0" aria-hidden="true" />
                <a href={siteConfig.contact.phoneHref} className="underline-offset-4 hover:underline">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-1 size-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${siteConfig.contact.email}`} className="underline-offset-4 hover:underline">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
                <span>{fullAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-footer-foreground/15">
          <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-footer-foreground/75 sm:px-6">
            Entwurf mit Platzhaltern: Firmenname, Kontaktdaten, Preise und Bilder sind noch nicht final. © {new Date().getFullYear()}{' '}
            {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
