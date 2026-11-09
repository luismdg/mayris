import os, sys, json, subprocess, base64, io, re
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
SRC, META, OUTDIR, MANIFEST = sys.argv[1:5]
os.makedirs(OUTDIR, exist_ok=True)
meta = json.load(open(META, encoding='utf-8'))

def norm_date(r):
    d = r.get('date')
    if not d: return None
    return re.sub(r'([+-]\d{4}|Z)$', '', d)[:19]

stems = {}
for r in meta: stems.setdefault(os.path.splitext(r['file'])[0].lower(), []).append(r)
items = []
for k, v in stems.items():
    img = next((x for x in v if x['kind']=='image'), None)
    vid = next((x for x in v if x['kind']=='video'), None)
    if img and vid: items.append(dict(type='live', img=img, vid=vid))
    elif img: items.append(dict(type='photo', img=img))
    else: items.append(dict(type='video', vid=vid))
for it in items:
    base = it.get('img') or it['vid']
    it['date'] = norm_date(base) or norm_date(it.get('vid') or {}) or ''
    it['orig'] = os.path.basename(base['file'])
# undated -> inherit none; sort by date, undated last
items.sort(key=lambda i: (i['date']=='' , i['date']))
for n, it in enumerate(items, 1): it['id'] = f'm{n:03d}'

def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

def lqip(im):
    t = im.convert('RGB'); t.thumbnail((20,20))
    b = io.BytesIO(); t.save(b, 'JPEG', quality=40)
    avg = im.convert('RGB').resize((1,1), Image.LANCZOS).getpixel((0,0))
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), '#%02x%02x%02x' % avg

def make_image(path, out, maxside=1800):
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ('RGB','RGBA'): im = im.convert('RGB')
        im.thumbnail((maxside, maxside), Image.LANCZOS)
        im.save(out, 'WEBP', quality=80, method=4)
        return im.size, lqip(im)

def make_video(path, out, live, dur):
    vf = "scale='if(gt(iw,ih),-2,min(720,ih)):if(gt(iw,ih),min(720,ih),-2)'"
    if live: vf = "scale='if(gt(iw,ih),-2,min(540,ih)):if(gt(iw,ih),min(540,ih),-2)'"
    cmd = ['ffmpeg','-y','-v','error','-i',path]
    if dur > 90: cmd += ['-t','75']
    cmd += ['-vf', vf+',format=yuv420p', '-c:v','libx264','-preset','veryfast','-crf','29' if live else '27','-movflags','+faststart']
    cmd += ['-an'] if live else ['-c:a','aac','-b:a','96k']
    cmd += [out]
    return run(cmd)

def process(it):
    i = it['id']
    try:
        if it['type'] in ('photo','live'):
            size, (lq, col) = make_image(os.path.join(SRC, it['img']['file']), f'{OUTDIR}/{i}.webp')
            it.update(src=f'{i}.webp', w=size[0], h=size[1], lqip=lq, color=col)
        if it['type'] in ('live','video'):
            vp = os.path.join(SRC, it['vid']['file'])
            dur = it['vid'].get('dur', 0)
            r = make_video(vp, f'{OUTDIR}/{i}.mp4', it['type']=='live', dur)
            if r.returncode: it['err'] = r.stderr[-300:]
            it['video'] = f'{i}.mp4'; it['dur'] = min(dur, 75) if dur > 90 else dur
            it['trimmed'] = dur > 90
            it['hasAudio'] = bool(it['vid'].get('hasAudio')) and it['type']=='video'
            if it['type']=='video':
                run(['ffmpeg','-y','-v','error','-ss','0.4','-i',vp,'-frames:v','1','-vf','scale=-2:720',f'{OUTDIR}/{i}-poster.jpg'])
                pj = f'{OUTDIR}/{i}-poster.jpg'
                if os.path.exists(pj):
                    size, (lq, col) = make_image(pj, f'{OUTDIR}/{i}-poster.webp', 1200)
                    os.remove(pj)
                    it.update(src=f'{i}-poster.webp', w=size[0], h=size[1], lqip=lq, color=col)
                else:
                    it['err'] = it.get('err','') + ' nopost'
        loc = (it.get('img') or {}).get('gps')
        if loc: it['gps'] = loc
    except Exception as e:
        it['err'] = str(e)
    print(i, it['type'], it.get('err',''), flush=True)
    return it

with ThreadPoolExecutor(4) as ex: out = list(ex.map(process, items))
clean = [{k:v for k,v in it.items() if k not in ('img','vid')} for it in out]
json.dump(clean, open(MANIFEST,'w',encoding='utf-8'), indent=1, ensure_ascii=False)
print('DONE', len(clean), 'errors', sum(1 for c in clean if c.get('err')))
