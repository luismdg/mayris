import re, json, sys, urllib.request, urllib.parse
def search(q):
    req = urllib.request.Request('https://www.youtube.com/results?search_query=' + urllib.parse.quote(q) + '&hl=en', headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en'})
    h = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', 'ignore')
    out = []
    for m in re.finditer(r'"videoRenderer":\{"videoId":"([\w-]{11})".*?"title":\{"runs":\[\{"text":"(.*?)"\}\].*?"ownerText":\{"runs":\[\{"text":"(.*?)"', h):
        out.append((m.group(1), m.group(2), m.group(3)))
        if len(out) >= 4: break
    return out
for q in sys.argv[1:]:
    print('##', q)
    for r in search(q): print('  ', r)
