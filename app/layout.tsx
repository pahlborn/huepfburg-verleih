import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import { JsonLd } from '@/components/common/json-ld'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { StickyCta } from '@/components/layout/sticky-cta'
import { siteConfig } from '@/lib/site-config'
import { withBasePath } from '@/lib/base-path'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' })
const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Hüpfburg mieten im Raum München, Dachau und Freising | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: siteConfig.name,
    title: `Hüpfburg mieten im ${siteConfig.serviceArea.headline}`,
    description: siteConfig.description,
  },
  icons: { icon: withBasePath('/icon.svg') },
  // Entwurf auf GitHub Pages: nicht in Suchmaschinen aufnehmen.
  ...(process.env.NEXT_PUBLIC_NOINDEX ? { robots: { index: false, follow: false } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

// PLATZHALTER: Alle Angaben stammen aus lib/site-config.ts und müssen vor dem Livegang ersetzt werden.
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteConfig.url}/#business`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.postalCode,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.countryCode,
  },
  areaServed: [
    { '@type': 'City', name: 'München' },
    { '@type': 'AdministrativeArea', name: 'Landkreis Dachau' },
    { '@type': 'AdministrativeArea', name: 'Landkreis Freising' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${nunito.variable} ${fredoka.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#inhalt"
          className="sr-only z-50 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyCta />
        <JsonLd data={localBusinessJsonLd} />
      </body>
    </html>
  )
}
