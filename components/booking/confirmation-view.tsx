'use client'

import { useEffect, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { DraftNotice } from '@/components/common/draft-notice'
import { LinkButton } from '@/components/common/link-button'
import { parseSelection } from '@/lib/booking-selection'
import { getCastle } from '@/lib/castles'
import { addDays, formatDateLong } from '@/lib/dates'
import { getExtra } from '@/lib/extras'
import { formatCents } from '@/lib/format'
import { calculatePrice, pricingConfig } from '@/lib/pricing'
import { siteConfig } from '@/lib/site-config'

export function ConfirmationView() {
  const [params, setParams] = useState<Record<string, string> | null>(null)
  useEffect(() => {
    setParams(Object.fromEntries(new URLSearchParams(window.location.search)))
  }, [])
  if (!params) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-muted-foreground sm:px-6">Buchung wird geladen …</p>
  }

  const selection = parseSelection(params)
  const castle = selection ? getCastle(selection.slug) : undefined
  const rawReference = Array.isArray(params.ref) ? params.ref[0] : params.ref
  const reference = rawReference && /^[A-Z0-9-]{4,20}$/.test(rawReference) ? rawReference : undefined

  const price =
    selection && castle
      ? calculatePrice({
          castle,
          date: selection.date,
          rentalType: selection.rentalType,
          fulfilment: selection.fulfilment,
          postalCode: selection.postalCode,
          extras: selection.extras,
        })
      : null

  if (!selection || !castle || price?.status !== 'ok') {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-semibold">Keine Buchung gefunden</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Zu diesem Link liegen keine Buchungsdaten vor. Wenn Sie gerade gebucht haben, melden Sie sich bitte bei uns.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/huepfburgen">Zu den Hüpfburgen</LinkButton>
          <LinkButton href="/kontakt" variant="outline">
            Kontakt
          </LinkButton>
        </div>
      </section>
    )
  }

  const dateText =
    selection.rentalType === 'weekendPackage'
      ? `${formatDateLong(selection.date)} bis ${formatDateLong(addDays(selection.date, pricingConfig.weekendPackage.days - 1))}`
      : formatDateLong(selection.date)

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-center gap-3 text-primary">
        <CircleCheck className="size-10" aria-hidden="true" />
        <p className="font-heading text-lg font-semibold">Vielen Dank</p>
      </div>
      <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">Ihre Buchung ist eingegangen</h1>
      {reference ? (
        <p className="mt-3 text-lg">
          Buchungsnummer: <strong className="font-mono tracking-wide">{reference}</strong>
        </p>
      ) : null}

      <div className="mt-8">
        <DraftNotice>
          Dies ist eine Vorschau ohne Backend: Es wurde nichts gespeichert, keine E-Mail verschickt und keine Zahlung ausgelöst.
        </DraftNotice>
      </div>

      <div className="mt-8 rounded-3xl border-2 bg-card p-5 sm:p-6">
        <h2 className="font-heading text-xl font-semibold">Ihre Auswahl</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
          <dt className="text-muted-foreground">Hüpfburg</dt>
          <dd className="font-semibold">{castle.name}</dd>
          <dt className="text-muted-foreground">Termin</dt>
          <dd className="font-semibold">{dateText}</dd>
          <dt className="text-muted-foreground">Übergabe</dt>
          <dd className="font-semibold">
            {selection.fulfilment === 'delivery'
              ? `Lieferung mit Aufbau und Abbau, PLZ ${selection.postalCode}`
              : 'Selbstabholung'}
          </dd>
          {selection.extras.length > 0 ? (
            <>
              <dt className="text-muted-foreground">Zubehör</dt>
              <dd className="font-semibold">{selection.extras.map((id) => getExtra(id)?.name).filter(Boolean).join(', ')}</dd>
            </>
          ) : null}
          <dt className="text-muted-foreground">Gesamtpreis</dt>
          <dd className="font-heading text-lg font-semibold">{formatCents(price.totalCents)}</dd>
          <dt className="text-muted-foreground">Kaution (bei Übernahme)</dt>
          <dd className="font-semibold">{formatCents(price.depositCents)}</dd>
        </dl>
      </div>

      <h2 className="mt-10 font-heading text-2xl font-semibold">Wie es weitergeht</h2>
      <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 leading-relaxed marker:font-bold marker:text-primary">
        <li>Sie erhalten eine Bestätigung per E-Mail mit allen Angaben zu Ihrer Buchung.</li>
        <li>
          Wir melden uns zur Abstimmung der genauen Uhrzeit für {selection.fulfilment === 'delivery' ? 'die Lieferung' : 'die Übergabe'}.
        </li>
        <li>Die Kaution bringen Sie zur Übernahme mit (bar oder per Überweisung nach Absprache).</li>
      </ol>

      <p className="mt-8 text-muted-foreground">
        Fragen zur Buchung? Rufen Sie uns an unter{' '}
        <a href={siteConfig.contact.phoneHref} className="font-semibold text-primary underline underline-offset-4">
          {siteConfig.contact.phone}
        </a>{' '}
        oder schreiben Sie an{' '}
        <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-primary underline underline-offset-4">
          {siteConfig.contact.email}
        </a>
        .
      </p>
      <div className="mt-8">
        <LinkButton href="/">Zur Startseite</LinkButton>
      </div>
    </section>
  )
}
