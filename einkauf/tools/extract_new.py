import json, re, html, hashlib, os, sys
S = sys.argv[1]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extract_sales.py')).read().split("updates = {}")[0].replace("S = sys.argv[1]", "S = sys.argv[1]"))
todo = json.load(open(f'{S}/sale_new/_todo.json'))
NOTCASTLE = re.compile(r'wasserrutsche|torschuss|fu(ss|ß)ball-?dart|\bdart\b|hindernis|base.?jump|wabbelberg|fallbecken|splash|tunnel', re.I)
JBSLIDE = re.compile(r'^(hüpfburg )?rutsche\b|^(delphin|seaworld|giraffe) rutsche|rutsche super$', re.I)
def cat_of(n):
    l = n.lower()
    if re.search(r'multiplay|multifun|maxifun|combo|multi-spass|multi spass|active center|vulkan', l): return 'Multiplay/Combo'
    if 'rutsche' in l or 'slide' in l: return 'Hüpfburg mit Rutsche'
    return 'Hüpfburg'
def dims_from(s):
    m = re.search(r'(\d+(?:[.,]\d+)?)\s?[x×]\s?(\d+(?:[.,]\d+)?)(?:\s?[x×]\s?(\d+(?:[.,]\d+)?))?\s?m\b', s)
    if not m: return None, None, None
    f = lambda v: float(v.replace(',', '.')) if v else None
    return f(m.group(1)), f(m.group(2)), f(m.group(3))
out = []; skipped = []
for t in todo:
    if t['known'] or t['st'] != 'ok': continue
    h = page('sale_new', t['u']); p = plain(h)
    it = {'u': t['u'], 'src': t['src']}
    if t['src'] == 'jb':
        m = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', h); name = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).strip() if m else None
        now, old = jb_prices(p)
        sp = re.search(r'([\d.]+ x [\d.]+ x [\d.]+)m (?:(?:Blower|Gebläse) ([\d,.]+) ?KW )?(\d+) kg', p)
        l, w, hh = dims_from(sp.group(1) + 'm') if sp else (None, None, None)
        pers = re.search(r'Max\. gesamt (\d+) Personen', p)
        img = re.search(r'(https://jb-inflatables-nl-shopware\.s3\.eu-central-1\.amazonaws\.com/media/[^"\'\s?]+\.(?:jpe?g|png|webp))', h)
        it.update(p_name='JB Inflatables / huepfburgenwelt.de', n=name, now=now, old=old, l=l, w=w, h=hh, kg=float(sp.group(3)) if sp else None,
                  k=int(pers.group(1)) if pers else None, bl=('inkl. Gebläse' in p) or None, en=('14960' in p) or None,
                  img=img.group(1) if img else None, label='JB Outlet' if not old else 'JB Outlet, Rabatt im Shop', kind='outlet', nt='Aus der Kategorie JB Outlet; Maße ohne Achsenbeschriftung wie angegeben')
    elif t['src'].startswith('kiddy'):
        m = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', h); name = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).strip() if m else None
        now, old = kid_prices(p)
        l, w, hh = dims_from(name or '')
        hm = re.search(r'Höhe:? ?(\d+(?:,\d+)?) ?m', p); hh = hh or (float(hm.group(1).replace(',', '.')) if hm else None)
        pers = re.search(r'Belastbarkeit:? ?(\d+) Personen', p)
        kg = re.search(r'Gewicht:? ?(?:ca\. ?)?(\d+(?:,\d+)?) ?kg', p)
        imgs = [x for x in re.findall(r'(https://(?:www\.)?kiddyfun\.de/media/[^"\'\s]+?\.(?:png|jpe?g|webp))', h) if 'Logo' not in x]
        desc = p.split('Produktinformationen', 1)[-1][:2500]; state = re.search(r'(B-Ware|Vorführ\w*|Ausstellungs\w*|gebraucht\b|gebrauchte\w*|Restposten|Gebrauchsspuren|Messemodell\w*)', desc, re.I)
        it.update(p_name='Kiddyfun', n=name, now=now, old=old, l=l, w=w, h=hh, kg=float(kg.group(1).replace(',', '.')) if kg else None,
                  k=int(pers.group(1)) if pers else None, bl=False if 'Gebläse' not in p.split('Beschreibung')[-1][:1500] else None, en=('14960' in p) or None,
                  img=imgs[0].replace(' ', '%20') if imgs else None, label='Kiddyfun ' + ('Sale' if t['src'] == 'kiddy_sale' else 'Outlet'), kind='outlet' if t['src'] == 'kiddy_outlet' else 'rabatt',
                  nt=('Aus der Kategorie ' + ('Sale' if t['src'] == 'kiddy_sale' else 'Outlet')) + (f'; Seite nennt: {state.group(1)}' if state else '') + '; Maße aus dem Namen')
    elif t['src'] == 'happy':
        i = p.find('Regulärer Preis'); j = p.rfind('Kunden lieben unsere Produkte', 0, i)
        name = p[j + len('Kunden lieben unsere Produkte'):i].strip() if i > 0 and j > 0 else None
        now, old = hf_prices(p)
        g = re.search(r'Größe(?: \(L x B x H\))?: ?([\d,]+) x ([\d,]+)(?: x ([\d,]+))? ?m', p)
        gw = re.search(r'Gewicht: ?([\d,]+) ?kg', p); age = re.search(r'Alter der Benutzer: ?([^A-ZÄÖÜ]{2,30}?Jahre)', p)
        f = lambda v: float(v.replace(',', '.')) if v else None
        users = re.search(r'Benutzer: ?(\d+)', p) or re.search(r'(\d+)\s*Benutzer', p)
        img = re.search(r'property="og:image" content="([^"]+)"', h)
        it.update(p_name='Happy Fun GmbH', n=name, now=now, old=old, l=f(g.group(1)) if g else None, w=f(g.group(2)) if g else None, h=f(g.group(3)) if g else None,
                  kg=float(gw.group(1).replace(',', '.')) if gw else None, k=int(users.group(1)) if users else None, bl=False, a=age.group(1).strip() if age else None, en=('14960' in p) or None, img=html.unescape(img.group(1)) if img else None,
                  label='Abverkauf, gebraucht' if re.search(r'gebraucht', t['u'] + (name or ''), re.I) else 'Abverkauf', kind='abverkauf',
                  nt='Aus der Kategorie Gebrauchte Hüpfburgen und Abverkauf (Shop-Banner: „Mega Abverkauf! Einzelstücke & Restposten“); Gebläse wird bei Happy Fun separat verkauft')
    if not it.get('n') or not it.get('now') or NOTCASTLE.search(it['n'] + ' ' + t['u'].split('/')[-1]) or (t['src'] == 'jb' and JBSLIDE.search(it['n'])):
        skipped.append((t['src'], it.get('n'), t['u'])); continue
    it['c'] = cat_of(it['n']); it['sl'] = bool(re.search(r'rutsche|slide', it['n'], re.I))
    it['used'] = bool(re.search(r'gebraucht', it['label'] + it['nt'], re.I))
    out.append(it)
json.dump(out, open(f'{S}/sale_new_items.json', 'w'), ensure_ascii=False, indent=1)
import collections
print('new', len(out), collections.Counter(x['src'] for x in out)); print('skipped', len(skipped))
for s in skipped: print('  skip', s[0], s[1])
print('missing dims', sum(1 for x in out if not x['l']), 'missing img', sum(1 for x in out if not x['img']), 'with old', sum(1 for x in out if x['old']))
for x in out[:3]+out[-3:]: print(x['n'], x['now'], x['old'], x['l'], x['w'], x['h'], x['kg'], x['k'], x['label'])
