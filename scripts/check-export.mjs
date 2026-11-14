import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { root, pages, contentFiles, contentRoute } from './lib/content.mjs'

const out = path.join(root, 'out')
const routes = contentFiles().map(contentRoute).map(route => route.replace(/^\/|\/$/g, ''))
for (const route of routes) {
  const filename = path.join(out, route, 'index.html')
  assert(fs.existsSync(filename), `Missing static route: /${route}/`)
  const html = fs.readFileSync(filename, 'utf8')
  assert(html.includes('<title>'), `Missing title: ${filename}`)
  assert(!html.includes('href="/emunium.github.io/'), 'Organization site must not use a repo-name basePath')
}
for (const filename of ['404.html', '.nojekyll', 'sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt', 'source/README.md', 'source/CHANGELOG.md', '_pagefind/pagefind.js']) {
  assert(fs.existsSync(path.join(out, filename)), `Missing export artifact: ${filename}`)
}
// Check real HTML links rather than guessing that every route exists.
for (const route of routes) {
  const html = fs.readFileSync(path.join(out, route, 'index.html'), 'utf8')
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"<>]*)"/g)) {
    const href = match[1].replace(/&amp;/g, '&')
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const url = new URL(href, 'https://emunium.github.io')
    let target = path.join(out, decodeURIComponent(url.pathname))
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html')
    assert(fs.existsSync(target), `Broken local link on /${route}/: ${href}`)
    if (url.hash && target.endsWith('.html')) {
      const fragment = decodeURIComponent(url.hash.slice(1))
      const destination = fs.readFileSync(target, 'utf8')
      assert(destination.includes(`id="${fragment}"`), `Missing fragment from /${route}/: ${href}`)
    }
  }
}
console.log(`PASS: ${routes.length} exported routes, 404, Pagefind bundle, metadata, and original-source downloads.`)
