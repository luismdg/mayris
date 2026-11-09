import os, sys, json, subprocess
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ExifTags
SRC = sys.argv[1]; OUT = sys.argv[2]
IMG = {'.jpg','.jpeg','.png'}; VID = {'.mov','.mp4'}

def gps(exif):
    try:
        g = exif.get_ifd(0x8825)
        if not g: return None
        def conv(v, ref):
            d = float(v[0]) + float(v[1])/60 + float(v[2])/3600
            return -d if ref in ('S','W') else d
        return [round(conv(g[2], g[1]),5), round(conv(g[4], g[3]),5)]
    except Exception: return None

def img_meta(p):
    m = {}
    try:
        with Image.open(p) as im:
            m['w'], m['h'] = im.size
            ex = im.getexif()
            if ex:
                sub = ex.get_ifd(0x8769)
                d = sub.get(36867) or sub.get(36868) or ex.get(306)
                if d: m['date'] = str(d).replace(':','-',2).replace(' ','T')
                o = ex.get(274)
                if o in (5,6,7,8): m['w'], m['h'] = m['h'], m['w']
                m['gps'] = gps(ex)
                m['model'] = ex.get(272)
    except Exception as e: m['err']=str(e)
    return m

def vid_meta(p):
    m = {}
    try:
        o = subprocess.run(['ffprobe','-v','error','-print_format','json','-show_format','-show_streams',p],capture_output=True,text=True)
        j = json.loads(o.stdout)
        f = j.get('format',{}); t = f.get('tags',{})
        m['dur'] = round(float(f.get('duration',0)),2)
        d = t.get('com.apple.quicktime.creationdate') or t.get('creation_time')
        if d: m['date'] = d
        loc = t.get('com.apple.quicktime.location.ISO6709')
        if loc: m['loc'] = loc
        for s in j.get('streams',[]):
            if s.get('codec_type')=='video':
                w,h = s['width'], s['height']
                rot = 0
                for sd in s.get('side_data_list',[]) or []:
                    if 'rotation' in sd: rot = abs(int(sd['rotation']))
                if rot in (90,270): w,h = h,w
                m['w'],m['h'] = w,h; break
        m['hasAudio'] = any(s.get('codec_type')=='audio' for s in j.get('streams',[]))
    except Exception as e: m['err']=str(e)
    return m

def one(p):
    ext = os.path.splitext(p)[1].lower()
    st = os.stat(p)
    base = {'file': os.path.relpath(p, SRC).replace(chr(92),'/'), 'size': st.st_size, 'kind': 'image' if ext in IMG else 'video'}
    base.update(img_meta(p) if ext in IMG else vid_meta(p))
    return base

files = [os.path.join(dp,f) for dp,_,fs in os.walk(SRC) for f in fs if os.path.splitext(f)[1].lower() in IMG|VID]
with ThreadPoolExecutor(8) as ex: res = list(ex.map(one, files))
res.sort(key=lambda r: r.get('date',''))
json.dump(res, open(OUT,'w'), indent=1)
print(len(res), 'files;', sum(1 for r in res if 'date' in r), 'with date;', sum(1 for r in res if r.get('gps') or r.get('loc')), 'with gps')
