import type { Metadata } from 'next'
import { CastleCard } from '@/components/castles/castle-card'
import { LinkButton } from '@/components/common/link-button'
import { FaqExcerpt } from '@/components/home/faq-excerpt'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { ServiceAreaTeaser } from '@/components/home/service-area-teaser'
import { TrustBlock } from '@/components/home/trust-block'
import { castles } from '@/lib/castles'
import { todayISO } from '@/lib/dates'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: { absolute: `Hüpfburg mieten im ${siteConfig.serviceArea.headline} | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero today={todayISO()} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="burgen-vorschau">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="burgen-vorschau" className="text-3xl font-semibold sm:text-4xl">
            Unsere Hüpfburgen
          </h2>
          <LinkButton href="/huepfburgen" variant="outline">
            Alle ansehen
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {castles.map((castle) => (
            <CastleCard key={castle.slug} castle={castle} headingLevel="h3" />
          ))}
        </div>
      </section>

      <HowItWorks />
      <ServiceAreaTeaser />
      <TrustBlock />
      <FaqExcerpt />
    </>
  )
}
