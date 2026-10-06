import { HandHelping, ShieldCheck, Sparkles, Umbrella, type LucideIcon } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const icons: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  umbrella: Umbrella,
  sparkles: Sparkles,
  'hand-helping': HandHelping,
}

export function TrustBlock() {
  const hasUnconfirmed = siteConfig.trustPoints.some((point) => !point.confirmed)

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="vertrauen-titel">
      <h2 id="vertrauen-titel" className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
        Sicher feiern mit sauberen Burgen
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteConfig.trustPoints.map((point) => {
          const Icon = icons[point.icon] ?? ShieldCheck
          return (
            <li key={point.id} className="flex flex-col gap-3 rounded-3xl border bg-card p-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold">{point.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{point.text}</p>
              {point.confirmed ? null : (
                <p className="mt-auto w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  Platzhalter: noch bestätigen
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {hasUnconfirmed ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Die gekennzeichneten Aussagen sind Entwurfstexte. Sie werden erst veröffentlicht, wenn sie belegt sind (Prüfbericht,
          Versicherungsnachweis).
        </p>
      ) : null}
    </section>
  )
}
