import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

// Preserve every supplied contour; crop only the canvas in the web copy.
const source = await readFile('assets/brand/logo.svg', 'utf8')
const artwork = source.match(/<path\b[^>]*\/>/g)?.join('')
if (!artwork) throw new Error('No artwork paths found in assets/brand/logo.svg')
const bounds = '112 178 1359 662'
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds}" width="1359" height="662">${artwork}</svg>`
await mkdir('public/brand', { recursive: true })
await writeFile('public/brand/logo.svg', mark)

// The supplied white silhouette stays visible in either browser tab theme.
function tile(size) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#101215"/><svg x="3" y="18" width="58" height="28" viewBox="${bounds}">${artwork}</svg></svg>`)
}
await writeFile('public/favicon.svg', tile(64))
await sharp(Buffer.from(mark)).resize({ width: 512 }).png().toFile('public/brand/logo-512.png')
await sharp(tile(512)).png().toFile('public/brand/icon-512.png')
await sharp(tile(180)).png().toFile('public/apple-touch-icon.png')
await sharp(tile(32)).png().toFile('public/favicon-32.png')
await sharp(tile(16)).png().toFile('public/favicon-16.png')

// ICO directory with PNG payloads for Windows and browser fallback.
const sizes = [16, 32, 48]
const entries = await Promise.all(sizes.map(size => sharp(tile(size)).png().toBuffer()))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
entries.forEach((data, i) => {
  const entry = 6 + 16 * i
  header[entry] = sizes[i]
  header[entry + 1] = sizes[i]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(data.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += data.length
})
await writeFile('public/favicon.ico', Buffer.concat([header, ...entries]))
console.log('Exported the supplied Emunium SVG, raster icons, and favicons.')
