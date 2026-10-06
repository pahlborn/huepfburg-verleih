import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

interface DraftNoticeProps {
  children?: ReactNode
}

/** Sichtbarer Hinweis für rechtliche Entwurfsseiten. */
export function DraftNotice({ children }: DraftNoticeProps) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border-2 border-accent bg-accent/30 p-4 text-accent-foreground"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-heading text-lg font-semibold">Entwurf: vor Veröffentlichung rechtlich prüfen</p>
        {children ? <p className="mt-1 text-sm leading-relaxed">{children}</p> : null}
      </div>
    </div>
  )
}
