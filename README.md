# Hüpfburg-Verleih [Name]: Website-Entwurf

Deutschsprachige Website (Next.js App Router, TypeScript, Tailwind, shadcn/ui) mit Sofortauskunft zu Verfügbarkeit und Preis. Alle Inhalte sind **Platzhalter**.

## Wo wird was gepflegt?

| Was | Datei |
| --- | --- |
| Firmenname, Telefon, E-Mail, Adresse, Öffnungszeiten, Wunschzeiten, Untergründe | `lib/site-config.ts` |
| Werte der Mietbedingungen (Wind, Reinigung, Storno-Staffel, Gefälle usw.) | `lib/site-config.ts` → `rentalTerms` |
| Vertrauenspunkte (`confirmed: false` = sichtbar als Platzhalter markiert) | `lib/site-config.ts` → `trustPoints` |
| Hüpfburgen: Maße, Alter, Personen, Strom, Preise, Kaution, Fotos | `lib/castles.ts` |
| Preisregeln: Wochentag/Wochenende, Wochenendpaket, Lieferzonen und Postleitzahlen | `lib/pricing.ts` |
| Feiertage (zählen als Wochenende) | `lib/holidays.ts` |
| Verfügbarkeit / belegte Tage (Mock-Daten) | `lib/availability.ts` |
| FAQ-Texte | `lib/faq.ts` |
| Mietbedingungen (Text) | `app/mietbedingungen/page.tsx` |
| Impressum, Datenschutz | `app/impressum/page.tsx`, `app/datenschutz/page.tsx` |

## Neue Hüpfburg anlegen
Einen Eintrag in `castles` (`lib/castles.ts`) ergänzen. Startseite, Übersicht, Detailseite, Preistabelle und Sitemap übernehmen ihn automatisch. Setze `isPlaceholder: false`, sobald die Daten echt sind.

## Echte Fotos einsetzen
Bilder nach `public/castles/<slug>/` legen und in `images` des Eintrags eintragen. Solange `images` leer ist, werden Bildplatzhalter angezeigt. Das Hero-Bild der Startseite steht in `components/home/hero.tsx`.

## Verfügbarkeit und Buchung anbinden
- `lib/availability.ts` ist die Abstraktion. Sie liefert aktuell Mock-Daten (einige Tage belegt). Die Stelle für die Datenbank ist dort mit `TODO: DATENBANK` markiert.
- Die Server Action `app/buchung/actions.ts` prüft Eingaben und Verfügbarkeit neu auf dem Server und leitet auf `/buchung/bestaetigung` weiter. Es wird nichts gespeichert, keine E-Mail versendet und keine Zahlung ausgelöst.
- Beim Anbinden: Buchung atomar speichern (doppelte Buchungen verhindern), Bestätigungs-E-Mail senden, Zahlungsweise festlegen.

## Vor der Veröffentlichung
- Alle Platzhalter ersetzen (`[eckige Klammern]`, `example.de`, `0000 000000`).
- Mietbedingungen, Impressum, Datenschutz rechtlich prüfen lassen. Der Hinweis „Entwurf: vor Veröffentlichung rechtlich prüfen“ bleibt sichtbar, bis das erledigt ist.
- Vertrauenspunkte (z. B. DIN EN 14960, Versicherung) nur mit Nachweis auf `confirmed: true` setzen.
- `siteConfig.url` auf die echte Domain setzen (Sitemap, Canonical, JSON-LD).

## Technik
- Keine Cookies, keine Tracker, Schriften lokal über `next/font`.
- `pnpm dev` startet die Entwicklung, `pnpm build` erzeugt den Produktions-Build.
