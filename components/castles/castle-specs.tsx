import { Baby, Plug, Ruler, Scaling, Users } from 'lucide-react'
import type { Castle } from '@/lib/castles'
import { formatDimensions } from '@/lib/castles'
import { cn } from '@/lib/utils'

interface CastleSpecsProps {
  castle: Castle
  compact?: boolean
  className?: string
}

/** Technische Daten einer Burg als beschriftete Liste. */
export function CastleSpecs({ castle, compact = false, className }: CastleSpecsProps) {
  const items = [
    { icon: Ruler, label: 'Maße', value: formatDimensions(castle) },
    { icon: Baby, label: 'Alter', value: castle.ageRange },
    { icon: Users, label: 'Max. Personen', value: `${castle.maxPersons} gleichzeitig` },
    { icon: Scaling, label: 'Platzbedarf', value: castle.spaceRequired },
    { icon: Plug, label: 'Strombedarf', value: castle.power },
  ]

  return (
    <dl className={cn('grid gap-x-4 gap-y-3', compact ? 'grid-cols-2 text-sm' : 'sm:grid-cols-2', className)}>
      {items.map(({ icon: Icon, label, value }, index) => (
        <div
          key={label}
          className={cn('flex items-start gap-2.5', compact && index === 0 && 'col-span-2', compact && index === 4 && 'col-span-2')}
        >
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</dt>
            <dd className="leading-snug">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
