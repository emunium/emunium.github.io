import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const read = relative => fs.readFileSync(path.join(root, relative), 'utf8')
export const write = (relative, text) => {
  const filename = path.join(root, relative)
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, text)
}
export const pages = JSON.parse(read('scripts/content-map.json'))
export const slugify = text => text.toLowerCase().replace(/[`*]/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-')

export function sections(markdown) {
  const result = new Map()
  let title = '__intro__', buffer = [], fence = false
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) fence = !fence
    if (!fence && line.startsWith('## ')) {
      result.set(title, buffer.join('\n')); title = line.slice(3).trim(); buffer = []
    } else buffer.push(line)
  }
  result.set(title, buffer.join('\n'))
  return result
}
export function anchorMap(parts) {
  const result = new Map()
  for (const page of pages) {
    result.set(slugify(page.title), `/docs/${page.slug}/`)
    let fence = false
    for (const line of (parts.get(page.title) || '').split('\n')) {
      if (line.startsWith('```')) fence = !fence
      if (!fence && /^#{3,6} /.test(line)) {
        const slug = slugify(line.replace(/^#+ /, ''))
        result.set(slug, `/docs/${page.slug}/#${slug}`)
      }
    }
  }
  return result
}
export function transform(markdown, anchors, promote = true) {
  let fence = false
  const text = markdown.trim().replace(/\n---\s*$/, '').trim()
  return text.split('\n').map(line => {
    if (line.startsWith('```')) { fence = !fence; return line }
    if (fence) return line
    if (promote && /^#{3,6} /.test(line)) line = line.slice(1)
    line = line.replace(/\]\(#([^)]*)\)/g, (match, anchor) => {
      if (!anchors.has(anchor)) throw new Error(`Unknown source anchor: ${anchor}`)
      return `](${anchors.get(anchor)})`
    })
    // MDX parses braces and raw HTML. Keep code spans untouched.
    return line.split(/(`+[^`]*`+)/g).map((piece, i) => i % 2 ? piece : piece.replace(/</g, '&lt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')).join('')
  }).join('\n')
}
export function codeBlocks(markdown) {
  return [...markdown.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(match => match[1])
}
export function proseWords(markdown) {
  return markdown.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '').trim().split(/\s+/).length
}
export function frontmatter(title, description) {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`
}

export function contentFiles(directory = path.join(root, 'content')) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? contentFiles(filename) : entry.name.endsWith('.mdx') ? [filename] : []
  }).sort()
}
export function contentRoute(filename) {
  const relative = path.relative(path.join(root, 'content'), filename).split(path.sep).join('/').replace(/\.mdx$/, '')
  return '/' + relative.replace(/(^|\/)index$/, '').replace(/\/$/, '') + (relative === 'index' ? '' : '/')
}
