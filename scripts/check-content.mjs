import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { root, read, pages, sections, codeBlocks, anchorMap, transform, contentFiles, contentRoute } from './lib/content.mjs'

const parts = sections(read('sources/README.original.md'))
let count = 0
const anchors = anchorMap(parts)
for (const page of pages) {
  const filename = `content/docs/${page.slug}.mdx`
  const content = read(filename)
  assert(content.includes(`# ${page.title}`), `Missing title in ${filename}`)
  const blocks = codeBlocks(parts.get(page.title))
  const actual = codeBlocks(content)
  for (const code of blocks) assert(actual.includes(code), `A source code block is missing or changed in ${filename}`)
  count += blocks.length
  for (const chunk of transform(parts.get(page.title), anchors).split(/\n\s*\n/).filter(Boolean)) {
    assert(content.includes(chunk), `A source paragraph, table, or example is missing in ${filename}`)
  }
  // A loose upper-bound guard catches accidental truncation while allowing wrappers.
  assert(content.length >= parts.get(page.title).trim().length * 0.9, `Section appears truncated: ${filename}`)
  const headings = content.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '').split('\n').filter(line => /^#+ /.test(line))
  assert(headings.filter(line => line.startsWith('# ')).length === 1, `Expected one H1: ${filename}`)
}
for (const [title] of parts) {
  if (!['__intro__', 'Table of Contents'].includes(title)) assert(pages.some(page => page.title === title), `Unmapped source section: ${title}`)
}
assert(read('content/changelog.mdx').includes(transform(read('sources/CHANGELOG.md'), new Map(), false)), 'Changelog text is incomplete')
for (const code of codeBlocks(read('sources/CHANGELOG.md'))) assert(codeBlocks(read('content/changelog.mdx')).includes(code), 'A changelog code block was lost')
const routes = new Set(contentFiles().map(contentRoute))
const mdxFiles = contentFiles()
for (const filename of mdxFiles) {
  const content = fs.readFileSync(filename, 'utf8')
  assert.equal((content.match(/^```/gm) || []).length % 2, 0, `Unclosed fence: ${filename}`)
  assert.equal((content.match(/<details>/g) || []).length, (content.match(/<\/details>/g) || []).length, `Unclosed details: ${filename}`)
  for (const match of content.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const route = match[1].split('#')[0]
    assert(routes.has(route) || route.startsWith('/source/'), `Unresolved internal link in ${filename}: ${route}`)
  }
}
console.log(`PASS: all ${pages.length} source sections; all ${count} source code blocks; source prose and tables; MDX fences, details and internal page links.`)
