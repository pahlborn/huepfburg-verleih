#!/usr/bin/env bash
# Wöchentlicher Angebots-Check: Preise und Rabatte neu lesen, Outlet-Kategorien prüfen, Seiten bauen, Bericht schreiben.
set -euo pipefail
cd "$(dirname "$0")"
W=work; rm -rf "$W"; mkdir -p "$W"
cp data/base_castles.json "$W/eu_data.json"
STAND="$(TZ=Europe/Berlin date +%d.%m.%Y)"
LANGDATUM="$(python3 -c "import datetime,zoneinfo;d=datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Berlin'));print(f'{d.day}. '+['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][d.month-1]+f' {d.year}')")"
python3 -I tools/fetch_pages.py "$W/eu_data.json" "$W/sale_html" || true
mkdir -p "$W/sale_html"
python3 -I tools/fetch_outlets.py "$W"
python3 -I tools/extract_sales.py "$W"
python3 -I tools/extract_new.py "$W" | head -3
python3 -I tools/merge.py "$W" data "$STAND"
sed -i "s/Angebote [0-9]\{1,2\}\. [A-Za-zä]* [0-9]\{4\}/Angebote $LANGDATUM/; s/Angebote (Stand [^)]*)/Angebote (Stand $LANGDATUM)/" templates/castles.html
python3 -I tools/build.py . ../public
echo "Bericht: einkauf/$W/report.md"
