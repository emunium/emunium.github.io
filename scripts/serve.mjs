import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out')
const port = Number(process.env.PORT || 3000)
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('No static build found. Run npm run build first.'); process.exit(1)
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.xml': 'application/xml' }
http.createServer((req, res) => {
  let url
  try { url = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname) }
  catch { res.writeHead(400); return res.end('Bad request') }
  let filename = path.resolve(root, '.' + url)
  if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden') }
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html')
  let status = 200
  if (!fs.existsSync(filename)) { status = 404; filename = path.join(root, '404.html') }
  if (!fs.existsSync(filename)) { res.writeHead(404); return res.end('Not found') }
  res.writeHead(status, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' })
  if (req.method === 'HEAD') return res.end()
  const stream = fs.createReadStream(filename)
  stream.on('error', () => res.destroy())
  stream.pipe(res)
}).listen(port, '127.0.0.1', () => console.log(`Static preview: http://localhost:${port}`))
