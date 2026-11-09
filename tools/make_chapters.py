import json, datetime as dt, sys
m = json.load(open('tools/manifest_raw.json', encoding='utf-8'))
def D(x): return dt.datetime.fromisoformat(x['date'])
def pin(x):
    d = D(x); md = (d.month, d.day)
    if d.month == 11 and 5 <= d.day <= 12: return f'anniv-{d.year}'
    if d.month == 9 and 13 <= d.day <= 19: return f'bday-her-{d.year}'
    if (d.month == 11 and d.day >= 29) or (d.month == 12 and d.day <= 5): return f'bday-him-{d.year}'
    if d.month == 2: return f'feb-{d.year}'
    return None
dated = [x for x in m if x['date']]; undated = [x for x in m if not x['date']]
chunks = []; cur = []; curkey = None
def flush():
    global cur
    if cur: chunks.append((curkey, cur)); cur = []
for x in dated:
    k = pin(x) or 'flow'
    if cur and k != curkey: flush()
    if cur and k == 'flow':
        gap = (D(x) - D(cur[-1])).days; span = (D(x) - D(cur[0])).days
        if (len(cur) >= 8 and (gap > 14 or span > 70)) or len(cur) >= 26: flush()
    curkey = k; cur.append(x)
flush()
merged = []
for k, c in chunks:
    if k == 'flow' and len(c) < 5 and merged and merged[-1][0] == 'flow': merged[-1][1].extend(c)
    elif k == 'flow' and len(c) < 5 and merged: merged[-1][1].extend(c)   # tiny: absorb into previous chapter
    else: merged.append((k, c))
allc = [(c[0]['date'], k, c) for k, c in merged]
out = []
for i, (_, key, c) in enumerate(allc, 1):
    c.sort(key=lambda x: x['date'])
    out.append(dict(id=f'c{i:02d}', key=key, start=c[0]['date'][:10], end=c[-1]['date'][:10], media=[x['id'] for x in c]))
if undated: out.append(dict(id=f'c{len(out)+1:02d}', key='undated', start='', end='', media=[x['id'] for x in undated]))
json.dump(out, open('tools/chapters_raw.json', 'w'), indent=1)
for c in out: print(c['id'], c['key'], c['start'], c['end'], len(c['media']))
