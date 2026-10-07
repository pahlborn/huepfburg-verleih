import { CloudRain } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const terms = siteConfig.rentalTerms

/** Kleingedrucktes zur Schlechtwetter-Regel. Wird überall dort gezeigt, wo der Hinweis mit * steht. */
export const weatherFootnoteText = `* Bei Regen, Gewitter oder Wind ab Stärke ${terms.windLimit.beaufort} können Sie bis ${terms.weatherChangeHoursBefore} Stunden vor Mietbeginn kostenlos stornieren oder umbuchen. Bei gebuchter Lieferung mit Auf- und Abbau sind die dafür anfallenden Kosten ggf. trotzdem zu tragen.`

export function WeatherBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary',
        className,
      )}
    >
      <CloudRain className="size-4 shrink-0" aria-hidden="true" />
      {terms.weatherBadge}*
    </span>
  )
}

export function WeatherFootnote({ className }: { className?: string }) {
  return <p className={cn('text-xs leading-relaxed text-muted-foreground', className)}>{weatherFootnoteText}</p>
}
