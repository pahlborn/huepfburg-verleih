import json, re, html, hashlib, os, sys
S = sys.argv[1]
d = json.load(open(f'{S}/eu_data.json'))
P = d['providers']; PLN = d['rates']['PLN']
def page(dirn, u):
    fn = f'{S}/{dirn}/' + hashlib.md5(u.encode()).hexdigest() + '.html'
    return open(fn, encoding='utf-8', errors='ignore').read() if os.path.exists(fn) else None
def plain(h):
    h = re.sub(r'<script(?![^>]*ld\+json)[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', h, flags=re.I)
    h = re.sub(r'<(del|s)\b[^>]*>', ' [DEL] ', h, flags=re.I)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h)))
de = lambda s: float(s.replace('.', '').replace(',', '.'))
en = lambda s: float(s.replace(',', ''))
def jb_prices(p):
    m = re.search(r'([\d.]+,\d\d) € ([\d.]+,\d\d) € ([\d.]+,\d\d) € \(inkl\. MwSt\.\) Speichern ([\d.]+,\d\d) €', p)
    if m: return de(m.group(2)), de(m.group(1))
    m = re.search(r'([\d.]+,\d\d) € ([\d.]+,\d\d) € \(inkl\. MwSt\.\)', p)
    return (de(m.group(1)), None) if m else (None, None)
def hf_prices(p):
    m = re.search(r'Regulärer Preis ([\d,]+) € Angebotspreis ([\d,]+) € Regulärer Preis \[DEL\] (?:([\d,]+) € )?Einzelpreis / Sparen Sie ([\d,]+) €', p)
    if not m: return None, None
    now = en(m.group(2)); old = en(m.group(3)) if m.group(3) else None
    return now, (old if old and old > now else None)
def kid_prices(p):
    m = re.search(r'Kiddyfun ([\d.]+,\d\d) €\* (?:% ([\d.]+,\d\d) €\* \(([\d.,]+)% gespart\) )?Netto: ([\d.]+,\d\d) €', p)
    if not m: return None, None
    now = de(m.group(4)); old = round(de(m.group(2)) / 1.19, 2) if m.group(2) else None
    return now, old
updates = {}
for a in d['items']:
    prov = P[a['p']]['n']; h = page('sale_html', a['u'])
    if not h: continue
    p = plain(h); rec = None
    if prov.startswith('JB'):
        now, old = jb_prices(p)
        if old: rec = dict(now=now, old=old, label='Rabatt im Shop', kind='rabatt')
        elif now: rec = dict(now=now)
    elif prov.startswith('Happy Fun'):
        now, old = hf_prices(p)
        if old: rec = dict(now=now, old=old, label='Abverkauf' if 'GEBRAUCHT' not in (a.get('nt') or '').upper() else 'Abverkauf, gebraucht', kind='abverkauf')
        elif now: rec = dict(now=now)
    elif prov.startswith('Eventmodule Factory'):
        m = re.search(r'Regulärer Preis: ([\d.]+,\d\d) € Rabattpreis netto ([\d.]+,\d\d) €', p)
        if m: rec = dict(now=de(m.group(2)), old=round(de(m.group(1)) / 1.19, 2), label='Sonderangebot, Lagerware', kind='rabatt')
        else:
            m = re.search(r'netto ([\d.]+,\d\d) € inkl\. 19% MwSt', p)
            if m: rec = dict(now=de(m.group(1)))
    elif prov.startswith('Kiddyfun'):
        now, old = kid_prices(p)
        if old: rec = dict(now=now, old=old, label='Sale', kind='rabatt')
        elif now: rec = dict(now=now)
    elif prov.startswith('Gangaru'):
        m = re.search(r'Streichpreis ([\d ]+(?:,\d+)?) PLN', a.get('pnote') or '')
        ld = re.findall(r'"price"\s*:\s*"?([\d.]+)', h)
        until = re.search(r'data-countdown-product="(\d{4})-(\d\d)-(\d\d)', h)
        if m and ld:
            nowpln = float(ld[0]); oldpln = float(m.group(1).replace(' ', '').replace(',', '.'))
            if oldpln > nowpln:
                rec = dict(now=round(nowpln / PLN, 2), old=round(oldpln / PLN, 2), label='Aktion', kind='aktion',
                           until=f'{until.group(3)}.{until.group(2)}.{until.group(1)}' if until else None, cur='PLN', now_cur=nowpln, old_cur=oldpln)
    if rec: updates[a['u']] = rec
json.dump(updates, open(f'{S}/sale_updates.json', 'w'), ensure_ascii=False, indent=1)
print('updates', len(updates), 'with discount', sum(1 for r in updates.values() if r.get('old')))
changed = [(a['n'], a['pn'], round(updates[a['u']]['now'])) for a in d['items'] if a['u'] in updates and a['pn'] and abs(updates[a['u']]['now'] - a['pn']) > 1]
print('price changed since 09.10.:', len(changed)); [print('  ', c) for c in changed[:20]]
