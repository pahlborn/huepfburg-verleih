import { FaqList } from '@/components/common/faq-list'
import { LinkButton } from '@/components/common/link-button'
import { faqItems } from '@/lib/faq'

export function FaqExcerpt() {
  const items = faqItems.filter((item) => item.featured)

  return (
    <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6" aria-labelledby="faq-titel">
      <h2 id="faq-titel" className="text-3xl font-semibold sm:text-4xl">
        Häufige Fragen
      </h2>
      <div className="mt-6">
        <FaqList items={items} />
      </div>
      <LinkButton href="/faq" variant="outline" className="mt-6">
        Alle Fragen ansehen
      </LinkButton>
    </section>
  )
}
