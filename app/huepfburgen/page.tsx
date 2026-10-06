import type { Metadata } from 'next'
import { CastleCard } from '@/components/castles/castle-card'
import { DateFilter } from '@/components/booking/date-filter'
import { PageHero } from '@/components/common/page-hero'
import { LinkButton } from '@/components/common/link-button'
import { getBookedDates } from '@/lib/availability'
import { getSelectability } from '@/lib/booking-rules'
import { castles } from '@/lib/castles'
import { formatDateLong, isValidISODate, todayISO } from '@/lib/dates'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Hüpfburgen mieten: Übersicht',
  description: `Alle Hüpfburgen im Überblick: Maße, Alter, Personenzahl, Platzbedarf und Preis. Verleih im ${siteConfig.serviceArea.headline}.`,
  alternates: { canonical: '/huepfburgen' },
}

export default async function CastlesPage({ searchParams }: PageProps<'/huepfburgen'>) {
  const params = await searchParams
  const rawDate = Array.isArray(params.datum) ? params.datum[0] : params.datum
  const today = todayISO()
  const date = isValidISODate(rawDate) ? rawDate : undefined

  const availability = date
    ? await Promise.all(
        castles.map(async (castle) => {
          const booked = new Set(await getBookedDates(castle.slug))
          return [castle.slug, getSelectability(date, 'day', booked, today) === 'ok'] as const
        }),
      )
    : []
  const freeBySlug = new Map(availability)
  const freeCount = availability.filter(([, free]) => free).length

  return (
    <>
      <PageHero
        eyebrow="Unsere Hüpfburgen"
        title="Hüpfburg mieten: suchen Sie sich eine aus"
        intro="Alle Burgen mit Maßen, Altersempfehlung, Platz- und Strombedarf. Datum wählen zeigt sofort, welche Burg frei ist."
      >
        <DateFilter today={today} defaultDate={date} inputId="burgen-datum" className="mt-8 max-w-3xl" />
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="burgen-liste">
        <h2 id="burgen-liste" className="sr-only">
          Liste der Hüpfburgen
        </h2>

        {date ? (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="status">
            <p className="text-lg">
              {freeCount > 0 ? (
                <>
                  <strong>{freeCount === 1 ? '1 Burg ist' : `${freeCount} Burgen sind`}</strong> am {formatDateLong(date)} frei.
                </>
              ) : (
                <>
                  Am <strong>{formatDateLong(date)}</strong> ist leider keine Burg frei. Probieren Sie einen anderen Tag.
                </>
              )}
            </p>
            <LinkButton href="/huepfburgen" variant="ghost">
              Datum zurücksetzen
            </LinkButton>
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {castles.map((castle) => (
            <CastleCard key={castle.slug} castle={castle} date={date} isFreeOnDate={date ? freeBySlug.get(castle.slug) : undefined} />
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-muted-foreground">
          Alle Burgen, Maße und Preise auf dieser Seite sind Platzhalter und werden vor dem Start durch die echten Daten ersetzt.
        </p>
      </section>
    </>
  )
}
