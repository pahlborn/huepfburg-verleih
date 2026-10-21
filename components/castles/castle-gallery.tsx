'use client'

import { useState } from 'react'
import { CastleMedia } from '@/components/castles/castle-media'
import type { Castle } from '@/lib/castles'
import { withBasePath } from '@/lib/base-path'
import { cn } from '@/lib/utils'

/** Großes Bild mit Vorschaubildern darunter. Ohne Fotos werden zwei Platzhalter gezeigt. */
export function CastleGallery({ castle }: { castle: Castle }) {
  const [active, setActive] = useState(0)
  const count = castle.images.length

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-white">
        <CastleMedia castle={castle} index={active} priority sizes="(min-width: 1024px) 55vw, 100vw" contain />
      </div>
      {count > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label="Weitere Fotos">
          {castle.images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Foto ${index + 1} von ${count} zeigen: ${image.alt}`}
                aria-current={index === active ? 'true' : undefined}
                className={cn(
                  'relative block aspect-[4/3] w-full overflow-hidden rounded-xl border-2 bg-white transition',
                  index === active ? 'border-primary' : 'border-transparent opacity-80 hover:opacity-100',
                )}
              >
                {/* Vorschaubild: einfaches img, damit es auch im statischen Export ohne Bildoptimierung klein bleibt */}
                <img src={withBasePath(image.src)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : count === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-2xl border">
              <CastleMedia castle={castle} index={index} sizes="(min-width: 1024px) 27vw, 50vw" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
