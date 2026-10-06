import type { ReactNode } from 'react'

interface OptionCardProps {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: string
  description?: ReactNode
}

/** Große, gut tippbare Radio-Auswahl. Nutzt echte Radio-Buttons und ist per Tastatur bedienbar. */
export function OptionCard({ name, value, checked, onChange, title, description }: OptionCardProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-card p-4 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-secondary">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 size-5 shrink-0 accent-primary"
      />
      <span>
        <span className="block font-heading text-lg leading-snug font-semibold">{title}</span>
        {description ? <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  )
}
