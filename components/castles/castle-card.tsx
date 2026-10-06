import Link from 'next/link'
import { ArrowRight, CircleCheck, CircleX } from 'lucide-react'
import { CastleMedia } from '@/components/castles/castle-media'
import { CastleSpecs } from '@/components/castles/castle-specs'
import { getLowestPrice, type Castle } from '@/lib/castles'
import { formatDateLong, type ISODate } from '@/lib/dates'
import { formatEuro } from '@/lib/format'

interface CastleCardProps {
  castle: Castle
  headingLevel?: 'h2' | 'h3'
  /** Wunschdatum aus dem Kurzfilter. Wird an die Detailseite weitergereicht. */
  date?: ISODate
  /** Ergebnis der Verfügbarkeitsprüfung für `date`. */
  isFreeOnDate?: boolean
}

const sizeLabel = { klein: 'Klein', mittel: 'Mittel', groß: 'Groß' } as const

export function CastleCard({ castle, headingLevel = 'h2', date, isFreeOnDate }: CastleCardProps) {
  const Heading = headingLevel
  const href = date ? `/huepfburgen/${castle.slug}?datum=${date}#buchung` : `/huepfburgen/${castle.slug}`

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow focus-within:shadow-md hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <CastleMedia castle={castle} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-primary shadow-sm">
            {sizeLabel[castle.size]}
          </span>
          {castle.isPlaceholder ? (
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground shadow-sm">
              Platzhalter
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <Heading className="text-2xl font-semibold">
            <Link href={href} className="rounded-md after:absolute after:inset-0 after:content-['']">
              {castle.name}
            </Link>
          </Heading>
          <p className="mt-1 text-muted-foreground">{castle.teaser}</p>
        </div>

        {date && isFreeOnDate !== undefined ? (
          <p
            className={
              isFreeOnDate
                ? 'flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-primary'
                : 'flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive'
            }
          >
            {isFreeOnDate ? (
              <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <CircleX className="size-4 shrink-0" aria-hidden="true" />
            )}
            {isFreeOnDate ? 'Frei am' : 'Leider belegt am'} {formatDateLong(date)}
          </p>
        ) : null}

        <CastleSpecs castle={castle} compact />

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <p className="text-muted-foreground">
            ab <span className="font-heading text-3xl font-semibold text-foreground">{formatEuro(getLowestPrice(castle))}</span>{' '}
            pro Tag
          </p>
          <span className="flex items-center gap-1.5 font-heading font-medium text-primary" aria-hidden="true">
            Ansehen
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  )
}
