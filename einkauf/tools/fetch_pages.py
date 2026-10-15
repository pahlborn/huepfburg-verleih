import json, sys, os, time, hashlib, urllib.request, urllib.robotparser, urllib.parse, concurrent.futures as cf
UA = "Mozilla/5.0 (compatible; research-bot; checks product prices once)"
data = json.load(open(sys.argv[1])); outdir = sys.argv[2]
robots = {}
def rp_for(u):
    host = urllib.parse.urlparse(u).netloc
    if host not in robots:
        rp = urllib.robotparser.RobotFileParser()
        try:
            rp.parse(urllib.request.urlopen(urllib.request.Request(f"https://{host}/robots.txt", headers={"User-Agent": UA}), timeout=12).read().decode("utf-8","ignore").splitlines())
        except Exception: rp.parse([])
        robots[host] = rp
    return robots[host]
urls = sorted({a["u"] for a in data["items"]} | {p["u"] for p in data["providers"]})
def work(u):
    fn = os.path.join(outdir, hashlib.md5(u.encode()).hexdigest() + ".html")
    if not rp_for(u).can_fetch(UA, u): return u, "robots"
    try:
        h = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "de"}), timeout=25).read(3000000)
        open(fn, "wb").write(h); time.sleep(0.4); return u, "ok"
    except Exception as e: return u, str(e)[:60]
res = {}
with cf.ThreadPoolExecutor(6) as ex:
    for u, st in ex.map(work, urls): res[u] = st
json.dump(res, open(os.path.join(outdir, "_status.json"), "w"), indent=0)
import collections; print(collections.Counter(res.values()).most_common(8))
