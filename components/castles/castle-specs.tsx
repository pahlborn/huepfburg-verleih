import { Baby, Layers, Package, Plug, Ruler, Scaling, ShieldCheck, Timer, Users, Weight } from 'lucide-react'
import type { Castle } from '@/lib/castles'
import { formatDimensions } from '@/lib/castles'
import { cn } from '@/lib/utils'

interface CastleSpecsProps {
  castle: Castle
  compact?: boolean
  className?: string
}

const pending = 'Angabe folgt'

/** Technische Daten einer Burg als beschriftete Liste. Kompakt für Karten, ausführlich für die Detailseite. */
export function CastleSpecs({ castle, compact = false, className }: CastleSpecsProps) {
  const items = [
    { icon: Ruler, label: 'Maße', value: formatDimensions(castle) },
    { icon: Users, label: 'Für Kinder', value: castle.maxPersons ? `bis zu ${castle.maxPersons} Kinder gleichzeitig` : pending },
    { icon: Baby, label: 'Alter', value: castle.ageRange ?? pending },
    { icon: Weight, label: 'Gewicht der Burg', value: `${castle.weightKg} kg` },
    { icon: Scaling, label: 'Platzbedarf', value: castle.spaceRequired, wide: true },
    { icon: Plug, label: 'Strombedarf', value: castle.power },
    ...(compact
      ? []
      : [
          { icon: Timer, label: 'Aufbau', value: castle.setupTime },
          { icon: Package, label: 'Packmaß', value: castle.packSize },
          { icon: Layers, label: 'Material', value: castle.material },
          { icon: ShieldCheck, label: 'Sicherheit', value: castle.safety },
        ]),
  ]

  return (
    <dl className={cn('grid gap-x-4 gap-y-3', compact ? 'grid-cols-2 text-sm' : 'sm:grid-cols-2', className)}>
      {items.map(({ icon: Icon, label, value, wide }, index) => (
        <div
          key={label}
          className={cn(
            'flex items-start gap-2.5',
            compact && index === 0 && 'col-span-2',
            compact && label === 'Platzbedarf' && 'hidden',
            !compact && wide && 'sm:col-span-2',
          )}
        >
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <dt className="text-sm font-bold text-muted-foreground">{label}</dt>
            <dd className={cn('leading-snug', value === pending && 'text-muted-foreground italic')}>{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
