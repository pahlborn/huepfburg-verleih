"""Liest die Sale-, Outlet- und Abverkaufs-Kategorien und lädt neue Produktseiten. Aufruf: fetch_outlets.py <arbeitsordner>"""
import urllib.request, urllib.robotparser, urllib.parse, re, hashlib, json, time, os, sys, concurrent.futures as cf
W = sys.argv[1]
UA = "Mozilla/5.0 (compatible; research-bot; checks product prices once a week)"
LISTS = {
    'happy': 'https://happy-fun.com/collections/gebrauchte-huepfburg',
    'kiddy_sale': 'https://www.kiddyfun.de/Sale/',
    'kiddy_outlet': 'https://www.kiddyfun.de/Outlet/',
    'jb': 'https://www.huepfburgenwelt.de/sortiment/huepfburgen-kaufen/jb-outlet',
}
os.makedirs(f'{W}/sale_html2', exist_ok=True); os.makedirs(f'{W}/sale_new', exist_ok=True)
robots = {}
def allowed(u):
    host = u.split('/')[2]
    if host not in robots:
        r = urllib.robotparser.RobotFileParser()
        try: r.parse(urllib.request.urlopen(urllib.request.Request(f'https://{host}/robots.txt', headers={'User-Agent': UA}), timeout=12).read().decode('utf-8', 'ignore').splitlines())
        except Exception: r.parse([])
        robots[host] = r
    return robots[host].can_fetch(UA, u)
def fetch(u, fn):
    if not allowed(u): return 'robots'
    for _ in range(3):
        try:
            h = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA, 'Accept-Language': 'de'}), timeout=25).read(4000000)
            open(fn, 'wb').write(h); time.sleep(0.4); return 'ok'
        except Exception as e: err = str(e)[:50]; time.sleep(3)
    return err
base_items = json.load(open(f'{W}/eu_data.json'))['items']
known = {a['u'].rstrip('/').replace('www.', '') for a in base_items}
found = []
for k, u in LISTS.items():
    fn = f'{W}/sale_html2/' + hashlib.md5(u.encode()).hexdigest() + '.html'
    st = fetch(u, fn); print('Liste', k, st)
    if st != 'ok': continue
    h = open(fn, encoding='utf-8', errors='ignore').read()
    base = '{0.scheme}://{0.netloc}'.format(urllib.parse.urlparse(u))
    if k == 'happy': links = [base + l for l in re.findall(r'href="(?:/collections/[^"/]+)?(/products/[^"?#]+)"', h)]
    elif k == 'jb': links = [base + l for l in re.findall(r'href="(/p/[^"?#]+)"', h)]
    else: links = re.findall(r'href="(https://www\.kiddyfun\.de/[A-Za-z0-9\-]*[Hh]uepfburg[^"?#]*/[A-Za-z0-9\-]+|https://www\.kiddyfun\.de/Multi[^"?#]*/[A-Za-z0-9\-]+)"', h)
    for l in dict.fromkeys(links): found.append((k, l))
seen = set(); todo = []
for k, l in found:
    key = l.rstrip('/').replace('www.', '')
    if key in seen: continue
    seen.add(key); todo.append({'src': k, 'u': l, 'known': key in known})
def work(t):
    if t['known']: return t, 'skip'
    return t, fetch(t['u'], f'{W}/sale_new/' + hashlib.md5(t['u'].encode()).hexdigest() + '.html')
with cf.ThreadPoolExecutor(5) as ex:
    for t, s in ex.map(work, todo): t['st'] = s
json.dump(todo, open(f'{W}/sale_new/_todo.json', 'w'), indent=0)
print('Outlet-Produkte', len(todo), 'neu geladen', sum(1 for t in todo if t['st'] == 'ok'))
