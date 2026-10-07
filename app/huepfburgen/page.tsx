import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CastleDateFilter, CastleGrid } from '@/components/castles/castle-list'
import { PageHero } from '@/components/common/page-hero'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Hüpfburgen mieten: Übersicht',
  description: `Alle Hüpfburgen im Überblick: Maße, Alter, Personenzahl, Platzbedarf und Preis. Verleih im ${siteConfig.serviceArea.headline}.`,
  alternates: { canonical: '/huepfburgen' },
}

export default function CastlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Unsere Hüpfburgen"
        title="Hüpfburg mieten: suchen Sie sich eine aus"
        intro="Alle Burgen mit Maßen, Altersempfehlung, Platz- und Strombedarf. Datum wählen zeigt sofort, welche Burg frei ist."
      >
        <Suspense fallback={null}>
          <CastleDateFilter className="mt-8 max-w-3xl" />
        </Suspense>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="burgen-liste">
        <h2 id="burgen-liste" className="sr-only">
          Liste der Hüpfburgen
        </h2>
        <Suspense fallback={null}>
          <CastleGrid />
        </Suspense>
        <p className="mt-10 max-w-2xl text-muted-foreground">
          Alle Burgen, Maße und Preise auf dieser Seite sind Platzhalter und werden vor dem Start durch die echten Daten ersetzt.
        </p>
      </section>
    </>
  )
}
