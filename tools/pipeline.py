"""Rebuild everything from the resources folder (safe to re-run after renaming files).
usage: python -I tools/pipeline.py <resources_dir>
 1. reads dates from EXIF / QuickTime (tools/extract_meta.py)
 2. pairs Live Photos (same stem OR same timestamp +-2s)
 3. stable ids = hash(size|date|kind)  -> renaming files never breaks captions
 4. encodes only what is missing in public/media (webp / h264), migrating old m001-style outputs
 5. groups into chapters (tools/chapters_spec.py) and writes src/data/{media,chapters}.json
"""
import os, sys, json, re, hashlib, subprocess, base64, io
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
sys.path.insert(0, os.path.dirname(__file__))
from chapters_spec import assign_chapters, CHAPTERS

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'media')
os.makedirs(OUT, exist_ok=True)
subprocess.run([sys.executable, '-I', os.path.join(ROOT, 'tools', 'extract_meta.py'), SRC, os.path.join(ROOT, 'tools', 'meta_raw2.json')], check=True)
meta = json.load(open(os.path.join(ROOT, 'tools', 'meta_raw2.json'), encoding='utf-8'))

def nd(r):
    d = r.get('date')
    return re.sub(r'([+-]\d{4}|Z)$', '', d)[:19] if d else ''
def stem(r): return os.path.splitext(os.path.basename(r['file']))[0]
def secs(d):
    from datetime import datetime
    return datetime.fromisoformat(d).timestamp()

# ---------- pairing ----------
imgs = [r for r in meta if r['kind'] == 'image']; vids = [r for r in meta if r['kind'] == 'video']
used = set(); items = []
bystem = {}
for v in vids: bystem.setdefault(stem(v).lower(), []).append(v)
pairs = {}
for i in imgs:
    v = next((x for x in bystem.get(stem(i).lower(), []) if id(x) not in used), None)
    if v: pairs[id(i)] = v; used.add(id(v))
for i in imgs:
    if id(i) in pairs or not nd(i): continue
    best = None
    for v in vids:
        if id(v) in used or not nd(v) or v.get('dur', 99) > 3.6 or v['size'] > 12e6: continue
        dt = abs(secs(nd(i)) - secs(nd(v)))
        if dt <= 2 and (best is None or dt < best[0]): best = (dt, v)
    if best: pairs[id(i)] = best[1]; used.add(id(best[1]))
for i in imgs:
    items.append(dict(type='live' if id(i) in pairs else 'photo', img=i, vid=pairs.get(id(i))))
for v in vids:
    if id(v) not in used: items.append(dict(type='video', vid=v))

def desc_of(r):
    s = stem(r)
    if re.fullmatch(r'(IMG_\d+(-\d)?|[0-9A-Fa-f-]{36}|\d{8}_\d{6}|E[0-9A-F-]{30,})', s): return ''
    return re.sub(r'\s+', ' ', re.sub(r'#\d+$', '', s).replace('-', ' ').replace('_', ' ')).strip()
for it in items:
    base = it.get('img') or it['vid']
    it['date'] = nd(base) or (nd(it['vid']) if it.get('vid') else '')
    it['desc'] = desc_of(base) or (desc_of(it['vid']) if it.get('vid') else '')
    it['slug'] = re.sub(r'#\d+$', '', stem(base)).lower()
    it['id'] = 'k' + hashlib.sha1(f"{base['size']}|{nd(base)}|{base['kind']}".encode()).hexdigest()[:8]

# ---------- migrate old m001-style outputs (match by byte size) ----------
try:
    old_m = json.load(open(os.path.join(ROOT, 'tools', 'manifest_raw.json'), encoding='utf-8'))
    old_meta = json.load(open(os.path.join(ROOT, 'tools', 'meta_raw.json'), encoding='utf-8'))
    size_of = {os.path.basename(r['file']): r['size'] for r in old_meta}
    old_by_size = {size_of[o['orig']]: o for o in old_m if o['orig'] in size_of}
    mig = 0
    for it in items:
        base = it.get('img') or it['vid']; o = old_by_size.get(base['size'])
        if not o or o['type'] != it['type'] or not os.path.exists(f"{OUT}/{o['id']}.webp" if o.get('src') else f"{OUT}/{o['id']}.mp4"): continue
        for suf in ('.webp', '.mp4', '-poster.webp'):
            a, b = f"{OUT}/{o['id']}{suf}", f"{OUT}/{it['id']}{suf}"
            if os.path.exists(a) and not os.path.exists(b): os.rename(a, b); mig += 1
        it['_old'] = o
    print('migrated files:', mig)
except Exception as e: print('no migration', e)

# ---------- encode what's missing ----------
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)
def lqip(im):
    t = im.convert('RGB'); t.thumbnail((20, 20)); b = io.BytesIO(); t.save(b, 'JPEG', quality=40)
    a = im.convert('RGB').resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), '#%02x%02x%02x' % a
def make_image(path, out, maxside=1800):
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGB')
        im.thumbnail((maxside, maxside), Image.LANCZOS); im.save(out, 'WEBP', quality=80, method=4)
def read_img(p):
    with Image.open(p) as im: return im.size, lqip(im)
def make_video(path, out, live, dur):
    s = 540 if live else 720
    vf = f"scale='if(gt(iw,ih),-2,min({s},ih)):if(gt(iw,ih),min({s},ih),-2)',format=yuv420p"
    cmd = ['ffmpeg', '-y', '-v', 'error', '-i', path] + (['-t', '75'] if dur > 90 else [])
    cmd += ['-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '29' if live else '27', '-movflags', '+faststart']
    cmd += ['-an'] if live else ['-c:a', 'aac', '-b:a', '96k']
    return run(cmd + [out])

def process(it):
    i = it['id']
    try:
        if it['type'] in ('photo', 'live'):
            o = f'{OUT}/{i}.webp'
            if not os.path.exists(o): make_image(os.path.join(SRC, it['img']['file']), o)
            (w, h), (lq, col) = read_img(o); it.update(src=f'{i}.webp', w=w, h=h, lqip=lq, color=col)
        if it['type'] in ('live', 'video'):
            vp = os.path.join(SRC, it['vid']['file']); dur = it['vid'].get('dur', 0); o = f'{OUT}/{i}.mp4'
            if not os.path.exists(o):
                r = make_video(vp, o + '.tmp.mp4', it['type'] == 'live', dur)
                if r.returncode: it['err'] = r.stderr[-200:]
                else: os.replace(o + '.tmp.mp4', o)
            it.update(video=f'{i}.mp4', dur=min(dur, 75) if dur > 90 else dur, trimmed=dur > 90, hasAudio=bool(it['vid'].get('hasAudio')) and it['type'] == 'video')
            if it['type'] == 'video':
                pw = f'{OUT}/{i}-poster.webp'
                if not os.path.exists(pw):
                    pj = f'{OUT}/{i}-poster.jpg'
                    run(['ffmpeg', '-y', '-v', 'error', '-ss', '0.4', '-i', vp, '-frames:v', '1', '-vf', 'scale=-2:720', pj])
                    if os.path.exists(pj): make_image(pj, pw, 1200); os.remove(pj)
                if os.path.exists(pw):
                    (w, h), (lq, col) = read_img(pw); it.update(src=f'{i}-poster.webp', w=w, h=h, lqip=lq, color=col)
                else: it['err'] = 'no poster'
        g = (it.get('img') or {}).get('gps')
        if g: it['gps'] = g
    except Exception as e: it['err'] = str(e)
    return it

with ThreadPoolExecutor(4) as ex: items = list(ex.map(process, items))
items.sort(key=lambda i: (i['date'] == '', i['date']))
keep = ['id', 'type', 'date', 'desc', 'slug', 'src', 'video', 'w', 'h', 'dur', 'lqip', 'color', 'hasAudio', 'trimmed']
media = {it['id']: {k: it[k] for k in keep if k in it} for it in items}
errs = [(it['id'], it['err']) for it in items if it.get('err')]
# remove orphaned outputs
valid = set()
for it in items:
    for suf in ('.webp', '.mp4', '-poster.webp'): valid.add(it['id'] + suf)
for f in os.listdir(OUT):
    if f not in valid or f.endswith('.tmp.mp4'): os.remove(os.path.join(OUT, f))

chapters = assign_chapters(list(media.values()))
json.dump(media, open(os.path.join(ROOT, 'src', 'data', 'media.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(chapters, open(os.path.join(ROOT, 'src', 'data', 'chapters.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(items), 'items;', sum(1 for i in items if i['type'] == 'live'), 'live;', sum(1 for i in items if i['type'] == 'video'), 'videos; errors:', errs)
for c in chapters: print(c['id'], c['key'], len(c['media']), c['start'], c['end'])
