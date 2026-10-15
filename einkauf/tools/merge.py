"""Führt Basisdaten, aktuelle Preise und Outlet-Funde zusammen und schreibt einen Bericht.
Aufruf: merge.py <arbeitsordner> <data-ordner> <stand TT.MM.JJJJ>"""
import json, sys, os, re
W, D, STAND = sys.argv[1], sys.argv[2], sys.argv[3]
d = json.load(open(f'{D}/base_castles.json')); prev = json.load(open(f'{D}/castles.json'))
up = json.load(open(f'{W}/sale_updates.json')); new = json.load(open(f'{W}/sale_new_items.json'))
P = d['providers']; pidx = {p['n']: i for i, p in enumerate(P)}
fmt = lambda v: f"{v:,.2f} €".replace(',', 'X').replace('.', ',').replace('X', '.')
for a in d['items']:
    r = up.get(a['u'])
    if not r: continue
    if r.get('now'): a['pn'] = round(r['now'])
    if r.get('old'):
        a['s'] = {'o': round(r['old']), 'l': r['label'], 'k': r['kind'], 'u': r.get('until')}
        if r.get('cur') == 'PLN': a['s']['n'] = f"{r['old_cur']:,.0f} PLN → {r['now_cur']:,.0f} PLN netto".replace(',', '.')
known = {a['u'] for a in d['items']}
for x in new:
    if x['u'] in known: continue
    it = {'p': pidx[x['p_name']], 'n': x['n'], 'u': x['u'], 'pn': round(x['now']), 'pf': 'netto', 'po': fmt(x['now']) + ' netto', 'pnote': '',
          'l': x['l'], 'w': x['w'], 'h': x['h'], 'k': x['k'], 'a': x.get('a'), 'kg': x['kg'], 'm': None, 'en': x['en'], 'bl': x['bl'], 'sl': x['sl'], 'r': None,
          't': None, 'c': x['c'], 'img': x['img'], 'used': x['used'], 'nt': x['nt']}
    it['s'] = {'o': round(x['old']) if x.get('old') and x['old'] > x['now'] else None, 'l': x['label'], 'k': x['kind'], 'u': None}
    d['items'].append(it); known.add(x['u'])
d['sale_date'] = STAND
# Merkliste-Schlüssel wie im Browser (FNV-1a, base36)
def fav(s):
    h = 2166136261
    for ch in s: h ^= ord(ch); h = (h * 16777619) & 0xffffffff
    n, out = h, ''
    while True:
        n, r = divmod(n, 36); out = '0123456789abcdefghijklmnopqrstuvwxyz'[r] + out
        if not n: break
    return out
watch = set()
wf = f'{D}/watchlist.txt'
if os.path.exists(wf):
    for line in open(wf, encoding='utf-8'):
        line = line.strip()
        if not line or line.startswith('#'): continue
        m = re.search(r'[?&]f=([0-9a-z.]+)', line)
        if m: watch |= set(m.group(1).split('.'))
        else: watch.add(line)
pm = {a['u']: a for a in prev['items']}
rows = {'drop': [], 'up': [], 'newdeal': [], 'ended': [], 'new': [], 'gone': []}
cur = {a['u']: a for a in d['items']}
for u, a in cur.items():
    b = pm.get(u)
    if not b: rows['new'].append(a); continue
    if a.get('pn') and b.get('pn') and a['pn'] < b['pn'] - 1: rows['drop'].append((a, b['pn']))
    if a.get('pn') and b.get('pn') and a['pn'] > b['pn'] + 1: rows['up'].append((a, b['pn']))
    if a.get('s') and not b.get('s'): rows['newdeal'].append(a)
    if b.get('s') and not a.get('s'): rows['ended'].append(a)
for u, b in pm.items():
    if u not in cur: rows['gone'].append(b)
name = lambda a: f"{a['n']} ({P[a['p']]['n']})"
star = lambda a: '★ ' if (fav(a['u'] + '|' + a['n']) in watch or a['u'] in watch) else ''
L = [f'# Angebots-Check Hüpfburgen, Stand {STAND}', '', f"{len(d['items'])} Burgen, davon {sum(1 for a in d['items'] if a.get('s'))} mit Angebot. ★ = auf deiner Merkliste.", '']
def sec(title, items, f):
    L.append(f'## {title} ({len(items)})')
    items = sorted(items, key=lambda x: (0 if star(x[0] if isinstance(x, tuple) else x) else 1))
    L.extend(f(x) for x in items[:40]) if items else L.append('keine')
    L.append('')
sec('Günstiger geworden', rows['drop'], lambda x: f"- {star(x[0])}{name(x[0])}: {x[1]} € → {x[0]['pn']} € netto · {x[0]['u']}")
sec('Neu im Angebot', rows['newdeal'], lambda a: f"- {star(a)}{name(a)}: {a['pn']} € netto ({a['s']['l']}{', statt ' + str(a['s']['o']) + ' €' if a['s'].get('o') else ''}{', bis ' + a['s']['u'] if a['s'].get('u') else ''}) · {a['u']}")
sec('Neu in der Liste (Outlet, Abverkauf)', rows['new'], lambda a: f"- {star(a)}{name(a)}: {a['pn']} € netto · {a['u']}")
sec('Angebot beendet', rows['ended'], lambda a: f"- {star(a)}{name(a)}: jetzt {a['pn']} € netto · {a['u']}")
sec('Teurer geworden', rows['up'], lambda x: f"- {star(x[0])}{name(x[0])}: {x[1]} € → {x[0]['pn']} € netto")
sec('Nicht mehr in Outlet oder Abverkauf gefunden', rows['gone'], lambda a: f"- {star(a)}{name(a)}")
watched = [a for a in d['items'] if star(a)]
if watch:
    L.append(f'## Deine Merkliste ({len(watched)} Burgen gefunden)')
    L.extend(f"- {name(a)}: {a['pn']} € netto{' · ' + a['s']['l'] if a.get('s') else ''}{' statt ' + str(a['s']['o']) + ' €' if a.get('s') and a['s'].get('o') else ''}" for a in watched)
open(f'{W}/report.md', 'w').write('\n'.join(L) + '\n')
json.dump(d, open(f'{D}/castles.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('\n'.join(L[:12]))
print({k: len(v) for k, v in rows.items()}, 'Merkliste:', len(watched))
