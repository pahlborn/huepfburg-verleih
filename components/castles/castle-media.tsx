import Image from 'next/image'
import { PlaceholderImage } from '@/components/common/placeholder-image'
import type { Castle } from '@/lib/castles'

interface CastleMediaProps {
  castle: Castle
  index?: number
  priority?: boolean
  sizes?: string
  className?: string
}

/** Zeigt das Foto der Burg oder, solange noch keines hinterlegt ist, einen Platzhalter. */
export function CastleMedia({
  castle,
  index = 0,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className,
}: CastleMediaProps) {
  const image = castle.images[index]
  if (!image) {
    return (
      <PlaceholderImage
        label={`${castle.name} (${castle.size}), Foto ${index + 1}`}
        tone={index % 2 === 0 ? 'sky' : 'sun'}
        className={className}
      />
    )
  }
  return (
    <>
      <Image src={image.src || '/placeholder.svg'} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {image.credit ? (
        <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] leading-none text-white">
          {image.credit}
        </span>
      ) : null}
    </>
  )
}
