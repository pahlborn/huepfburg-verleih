import type { Metadata } from 'next'
import { FaqList } from '@/components/common/faq-list'
import { JsonLd } from '@/components/common/json-ld'
import { LinkButton } from '@/components/common/link-button'
import { PageHero } from '@/components/common/page-hero'
import { contactHint, faqCategories, faqItems } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Häufige Fragen zur Hüpfburg-Miete',
  description:
    'Antworten zu Platzbedarf, Strom, Untergrund, Wetter, Aufbau, Reinigung, Alter und Zahlung bei der Miete einer Hüpfburg.',
  alternates: { canonical: '/faq' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Häufige Fragen"
        intro="Alles Wichtige zu Platz, Strom, Wetter und Ablauf. Die genauen Regeln stehen in den Mietbedingungen."
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 sm:px-6">
        {faqCategories.map((category) => (
          <section key={category} aria-labelledby={`kat-${category}`}>
            <h2 id={`kat-${category}`} className="mb-4 text-2xl font-semibold sm:text-3xl">
              {category}
            </h2>
            <FaqList items={faqItems.filter((item) => item.category === category)} />
          </section>
        ))}

        <div className="flex flex-col items-start gap-4 rounded-3xl bg-secondary/60 p-6">
          <p className="text-lg">{contactHint}</p>
          <LinkButton href="/kontakt">Zum Kontakt</LinkButton>
        </div>
      </div>
      <JsonLd data={faqJsonLd} />
    </>
  )
}
