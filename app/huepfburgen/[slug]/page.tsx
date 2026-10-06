import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, CircleCheck, TriangleAlert } from 'lucide-react'
import { BookingPanel } from '@/components/booking/booking-panel'
import { CastleMedia } from '@/components/castles/castle-media'
import { CastleSpecs } from '@/components/castles/castle-specs'
import { getBookedDates } from '@/lib/availability'
import { castles, getCastle, getLowestPrice } from '@/lib/castles'
import { isValidISODate, todayISO } from '@/lib/dates'
import { formatEuro } from '@/lib/format'
import { siteConfig } from '@/lib/site-config'

export function generateStaticParams() {
  return castles.map((castle) => ({ slug: castle.slug }))
}

export async function generateMetadata({ params }: PageProps<'/huepfburgen/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const castle = getCastle(slug)
  if (!castle) return {}
  return {
    title: `${castle.name} mieten (${castle.size}) ab ${formatEuro(getLowestPrice(castle))}`,
    description: `${castle.name}: ${castle.teaser} Verfügbarkeit und Preis sofort sehen, online buchen. Verleih im ${siteConfig.serviceArea.headline}.`,
    alternates: { canonical: `/huepfburgen/${castle.slug}` },
  }
}

export default async function CastleDetailPage({ params, searchParams }: PageProps<'/huepfburgen/[slug]'>) {
  const { slug } = await params
  const castle = getCastle(slug)
  if (!castle) notFound()

  const query = await searchParams
  const rawDate = Array.isArray(query.datum) ? query.datum[0] : query.datum
  const initialDate = isValidISODate(rawDate) ? rawDate : undefined

  const bookedDates = await getBookedDates(castle.slug)
  const today = todayISO()

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <nav aria-label="Brotkrumen">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Start
              </Link>
            </li>
            <ChevronRight className="size-4" aria-hidden="true" />
            <li>
              <Link href="/huepfburgen" className="underline-offset-4 hover:underline">
                Hüpfburgen
              </Link>
            </li>
            <ChevronRight className="size-4" aria-hidden="true" />
            <li aria-current="page" className="font-semibold text-foreground">
              {castle.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border">
            <CastleMedia castle={castle} index={0} priority sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((index) => (
              <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
                <CastleMedia castle={castle} index={index} sizes="(min-width: 1024px) 27vw, 50vw" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">Größe: {castle.size}</span>
              {castle.isPlaceholder ? (
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                  Platzhalter-Burg
                </span>
              ) : null}
            </div>
            <h1 className="text-4xl font-semibold sm:text-5xl">{castle.name}</h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{castle.description}</p>
          </div>

          <p className="text-muted-foreground">
            ab <span className="font-heading text-4xl font-semibold text-foreground">{formatEuro(getLowestPrice(castle))}</span> pro Tag,
            zzgl. Kaution {formatEuro(castle.pricing.deposit)}
          </p>

          <ul className="flex flex-col gap-2">
            {castle.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2">
                <CircleCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>

          <CastleSpecs castle={castle} />
        </div>
      </section>

      <section id="buchung" className="scroll-mt-20 bg-secondary/50 py-12" aria-labelledby="buchung-titel">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="buchung-titel" className="text-3xl font-semibold sm:text-4xl">
            Verfügbarkeit prüfen und buchen
          </h2>
          <p className="mt-2 mb-8 max-w-2xl text-lg text-muted-foreground">
            Termin wählen, Preis sofort sehen, direkt buchen. Ohne Anfrage und ohne Warten.
          </p>
          <div className="rounded-[2rem] border bg-background p-5 shadow-sm sm:p-8">
            <BookingPanel castle={castle} bookedDates={bookedDates} today={today} initialDate={initialDate} />
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Bitte lesen Sie vor der Buchung die{' '}
            <Link href="/mietbedingungen" className="font-semibold text-primary underline underline-offset-4">
              Mietbedingungen
            </Link>
            , insbesondere zu Wetter, Aufstellort und Strom.
          </p>
        </div>
      </section>
    </>
  )
}
