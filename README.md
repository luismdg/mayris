# Para Mayris — love letter site

React + Vite + GSAP ScrollTrigger + Lenis. 199 memories (101 live photos, 34 videos, 64 photos), grouped into 21 chapters from the photos' real EXIF / QuickTime dates.

## Run
```
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # production build -> dist/
```

## Configuration mode (add your text)
- In `npm run dev` a **✎ Configurar** button is always visible. In a production build open `/?edit`.
- **Historia**: names, intro line, first-memory / anniversary dates, prologue lines, final letter.
- **Capítulos**: title, giant word, subtitle, tag, **style/era** (Calma, Night Club, The Flash, Pétalos, Atardecer, San Valentín, Terminal, Fiesta), chapter text, reorder, hide, add new.
- **Recuerdos**: thumbnails grid; select one or many → write a caption for the whole group, tag, move to another chapter, hide.
- Inside the lightbox you can also caption/tag/hide any single memory.
- **Datos**: *Guardar en el proyecto* writes `src/data/story.config.json` (dev only), or Export/Import JSON. Changes also auto-save in the browser.

## Música, stickers y recetas
- **Music** (`src/music.js`): each chapter has a song (change it in Capítulos → Canción). It plays after the first click on "con música" / "Abrir la carta". It uses YouTube embeds (official upload first, then lyric/audio uploads if the label blocks embedding). To use your own audio instead, put `public/music/<key>.mp3` (keys: `lloviendo`, `holdon`, `rumores`, `yellow`, `nothin`, `feeling`, `goosebumps`).
- **Stickers** (`src/components/Stickers.jsx`): characters and icons are drawn as SVG. To use real artwork, drop `public/stickers/<name>.png` (names: `minion`, `minion2`, `snoopy`, `woodstock`, `bolt`, `car`, `santahat`, `chefhat`, `discoball`, `mic`, `controller`, `block`, `disc`, `cam`, `heart`, `star`, `banana`). It replaces the drawing automatically.
- **Recipes** (`src/data/recipes.js`): 10 quick recipes with links to the full versions.
- **Default captions** (Spanish) live in `src/data/captions.es.json`; anything you write in config mode overrides them.

## After renaming / adding photos
Descriptive file names drive the story (e.g. `travis-scott-concert#2.JPG`, `she-sang-...`). Ids are hash-based, so renaming never breaks your captions.
```
python -I tools/pipeline.py "<path to resources folder>"
```
It re-reads dates, pairs Live Photos (same name **or** same timestamp), encodes only new files, and regroups using `tools/chapters_spec.py` (keyword rules + date windows - edit it to move things between chapters).
The 18-minute video `IMG_6199.MOV` (2.7 GB) is trimmed to its first 75 s.
