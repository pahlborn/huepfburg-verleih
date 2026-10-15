"""Baut die statischen Einkaufsseiten aus Vorlagen und Daten. Aufruf: build.py <einkauf-ordner> <public-ordner>"""
import sys
E, OUT = sys.argv[1], sys.argv[2]
head = '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex">\n'
J = lambda f: open(f'{E}/data/{f}', encoding='utf-8').read().replace('</', '<\\/')
T = lambda f: open(f'{E}/templates/{f}', encoding='utf-8').read()
def pub(t, name):
    e = t.index('</style>') + len('</style>')
    open(f'{OUT}/{name}', 'w', encoding='utf-8').write(head + t[:e] + '\n</head>\n<body>\n' + t[e:] + '\n</body>\n</html>\n')
pub(T('castles.html').replace('__DATA__', J('castles.json')), 'einkauf-eu.html')
pub(T('accessories.html').replace('__DATA__', J('accessories.json')), 'zubehoer-eu.html')
pub(T('merkliste.html').replace('__DATA_B__', J('castles.json')).replace('__DATA_Z__', J('accessories.json')), 'merkliste.html')
print('gebaut: einkauf-eu.html, zubehoer-eu.html, merkliste.html')
