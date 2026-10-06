import { Castle as CastleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceholderImageProps {
  label: string
  tone?: 'sky' | 'sun'
  className?: string
}

/** Bildplatzhalter. Wird durch echte Fotos ersetzt (siehe lib/castles.ts, Feld "images"). */
export function PlaceholderImage({ label, tone = 'sky', className }: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={`Bildplatzhalter: ${label}`}
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden text-center',
        tone === 'sky' ? 'bg-secondary text-primary' : 'bg-accent/40 text-accent-foreground',
        className,
      )}
    >
      <CastleIcon className="size-12 opacity-80" strokeWidth={1.5} aria-hidden="true" />
      <span className="px-4 text-sm font-semibold">Bildplatzhalter</span>
      <span className="px-4 text-xs text-foreground/70">{label}</span>
    </div>
  )
}
