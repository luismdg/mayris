import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Dev-only helper: lets "Modo configuración" save your labels straight into src/data/story.config.json
const saveStory = () => ({
  name: 'save-story',
  configureServer(server) {
    server.middlewares.use('/__story/save', (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
      let body = ''
      req.on('data', (d) => (body += d))
      req.on('end', () => {
        try {
          const json = JSON.parse(body)
          fs.writeFileSync(path.resolve('src/data/story.config.json'), JSON.stringify(json, null, 2))
          res.end('ok')
        } catch (e) { res.statusCode = 400; res.end(String(e)) }
      })
    })
  },
})

export default defineConfig({ plugins: [react(), saveStory()] })
