"""Which memory belongs to which chapter. Edit freely, then re-run tools/pipeline.py.
Rules are checked top to bottom; first match wins. Keywords look at the (renamed) file description."""
import re

# id, key, default-theme hint (the real theme/title/text defaults live in src/defaults.js)
CHAPTERS = [
    ('c01', 'first-days'), ('c02', 'first-date-school'), ('c03', 'her-birthdays'), ('c04', 'concerts'),
    ('c05', 'garage-hack'), ('c06', 'anniversary'), ('c07', 'christmas'), ('c08', 'flowers-feb'),
    ('c09', 'love-letters'), ('c10', 'roblox'), ('c11', 'hackmty'), ('c12', 'her-voice'),
    ('c13', 'smartest'), ('c14', 'trips'), ('c15', 'kitchen-now'),
]

# undated files -> the date they obviously belong to (from their name)
INFER = {
    'cute-lego-wallpaper-custom': '2024-09-07', 'drake&josh-custome': '2025-11-01', 'el-patron-surprise-photo': '2024-09-17',
    'flower-business': '2025-02-14', 'his-birthday-means-way-to-much': '2024-12-02', 'pizza-christmas-date': '2025-12-30',
    'working-on-a-car-student-group': '2024-10-11',
}
EXTRA_LOVE = re.compile(r'she-is-beatif|she-likes-this-photo|unny-love-photo|holding-a-cisco')  # undated "her" photos -> love letters

R = lambda p: re.compile(p, re.I)
KEY_RULES = [  # (chapter, regex over slug, optional extra predicate on date)
    ('c04', R(r'travis|weeknd|weend'), lambda d, s: 'birthday' not in s),
    ('c12', R(r'(^|-)(sang|sing|sings|singin|singing)(-|$)'), None),
    ('c13', R(r'school-proyect|school-project|presentation|presenting|2nd-place|student-group-work|yc-application|explaining'), lambda d, s: d >= '2025-01-01' and 'mexican' not in s),
    ('c07', R(r'santa(?!-fe)|christmas|chirtmas|chritsmas|winter|softtoy|his-birthday|pizza-christmas'), None),
    ('c03', R(r'her-birthday|birthday-in-school|el-patron|confeti'), lambda d, s: 'mom' not in s),
]
# (chapter, from, to)  inclusive date windows for everything else (incl. unnamed IMG_ videos)
WINDOWS = [
    ('c04', '2024-09-21', '2024-09-21'), ('c04', '2026-04-20', '2026-04-21'),
    ('c12', '2025-11-12', '2025-11-22'), ('c12', '2026-02-23', '2026-02-23'), ('c12', '2026-05-15', '2026-05-15'), ('c12', '2026-05-24', '2026-05-24'),
    ('c13', '2025-12-09', '2025-12-09'),
    ('c03', '2024-09-17', '2024-09-19'), ('c03', '2025-09-07', '2025-09-16'),
    ('c07', '2025-12-30', '2025-12-30'), ('c07', '2024-11-20', '2024-12-27'),
    ('c01', '2000-01-01', '2024-08-19'), ('c02', '2024-08-20', '2024-09-16'),
    ('c05', '2024-09-20', '2024-10-28'), ('c06', '2024-11-05', '2024-11-19'),
    ('c08', '2025-01-22', '2025-02-27'), ('c09', '2025-03-11', '2025-06-09'), ('c10', '2025-06-17', '2025-08-29'),
    ('c11', '2025-10-03', '2025-11-11'), ('c14', '2025-12-20', '2026-01-24'), ('c15', '2026-02-10', '2026-12-31'),
]

def assign_chapters(media):
    by = {c: [] for c, _ in CHAPTERS}
    for m in media:
        slug = m.get('slug', ''); d = (m.get('date') or '')[:10]
        if not d:
            d = next((v for k, v in INFER.items() if slug.startswith(k)), '')
            if d: m['date'] = d + 'T12:00:00'
        target = None
        if not d: target = 'c09'
        else:
            for ch, rx, pred in KEY_RULES:
                if rx.search(slug) and (pred is None or pred(d, slug)): target = ch; break
            if not target:
                for ch, a, b in WINDOWS:
                    if a <= d <= b: target = ch; break
        by[target or 'c15'].append(m)
    out = []
    for cid, key in CHAPTERS:
        ms = sorted(by[cid], key=lambda m: m.get('date') or 'z')
        ds = [m['date'][:10] for m in ms if m.get('date')]
        out.append(dict(id=cid, key=key, start=ds[0] if ds else '', end=ds[-1] if ds else '', media=[m['id'] for m in ms]))
    return out
