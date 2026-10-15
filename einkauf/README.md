# Einkaufsrecherche Hüpfburgen und Zubehör

Daten und Werkzeuge hinter `public/einkauf-eu.html`, `public/zubehoer-eu.html` und `public/merkliste.html`.

- `data/base_castles.json`: Grunddaten der Burgen (Stand 9. Oktober 2026), ohne Angebote.
- `data/castles.json`: aktueller Stand mit Preisen, Rabatten und Outlet-Burgen. Wird bei jedem Lauf neu geschrieben.
- `data/accessories.json`: Zubehör und Gebläse.
- `data/watchlist.txt`: Merkliste-Link oder Produkt-URLs, die im Bericht mit ★ markiert werden.
- `templates/`: Seitenvorlagen, `__DATA__` wird durch die JSON-Daten ersetzt.

## Wöchentlicher Lauf

```
einkauf/run_weekly.sh            # Preise lesen, zusammenführen, Seiten bauen, Bericht in einkauf/work/report.md
einkauf/tools/publish_static.sh  # nur die drei Seiten in gh-pages übernehmen
```

Die Abrufe beachten robots.txt. Gesperrte Seiten werden nicht umgangen.
