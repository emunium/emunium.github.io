import crypto from 'node:crypto'
import { root, read, write, pages, sections, anchorMap, transform, codeBlocks, frontmatter } from './lib/content.mjs'

const original = read('sources/README.original.md')
const parts = sections(original)
const anchors = anchorMap(parts)
const manifest = []
for (const page of pages) {
  const source = parts.get(page.title)
  if (source === undefined) throw new Error(`Missing section: ${page.title}`)
  let body = transform(source, anchors)
  if (page.slug === 'human-like-input') {
    const motion = body.indexOf('## Motion planners')
    const typing = body.indexOf('## Typing rhythm')
    const instant = body.indexOf('## `human=False`')
    if (Math.min(motion, typing, instant) < 0) throw new Error('Human input headings changed; update the importer.')
    const presets = `## Choose a preset

| Preset | Pointer movement | Typing rhythm |
| --- | --- | --- |
| \`natural\` | Default, balanced movement | 280 characters per minute |
| \`careful\` | Slower, with more corrections | 200 characters per minute |
| \`brisk\` | Faster movement | 420 characters per minute |

\`Browser(motion="careful", typing="natural")\` selects each preset independently.

`;
    body = body.slice(0, motion) + presets + '<details>\n<summary>Motion planners, formulas, and parameter ranges</summary>\n\n' + body.slice(motion, typing) + '\n</details>\n\n<details>\n<summary>Typing rhythm and tuning reference</summary>\n\n' + body.slice(typing, instant) + '\n</details>\n\n' + body.slice(instant)
  }
  const result = frontmatter(page.title, page.description) + `# ${page.title}\n\n` + body.trim() + '\n'
  const destination = `content/docs/${page.slug}.mdx`
  write(destination, result)
  manifest.push({ ...page, file: destination, sourceBytes: Buffer.byteLength(source), codeBlocks: codeBlocks(source).length, sourceSha256: crypto.createHash('sha256').update(source).digest('hex') })
}
const changelog = read('sources/CHANGELOG.md')
write('content/changelog.mdx', frontmatter('Changelog', 'Emunium 3.1.0: behavior changes, new features, and fixes.') + transform(changelog, new Map(), false) + '\n')
write('reports/content-manifest.json', JSON.stringify({
  source: 'sources/README.original.md',
  sha256: crypto.createHash('sha256').update(original).digest('hex'),
  sourceLines: original.split('\n').length,
  sections: manifest,
  notes: ['All 25 non-TOC sections were migrated.', 'Top-level headings became page titles; internal links were rewritten.', 'Human-input parameter details are collapsible; their text and code are retained.', 'The introduction and original table of contents remain in the exact source snapshot.', 'The overview and home page are editorial summaries, not source replacements.']
}, null, 2) + '\n')

const groups = ['Get started', 'Browsers', 'Automation', 'Reference', 'Beyond the browser', 'Operations', 'Project']
const meta = { '*': { theme: { timestamp: false } }, index: 'Overview' }
for (const [i, group] of groups.entries()) {
  meta[`--${i}`] = { type: 'separator', title: group }
  for (const page of pages.filter(p => p.group === group)) {
    meta[page.slug] = page.slug === 'coordinates' ? 'Coordinates & DPI' : page.slug === 'connect' ? 'Connect to your browser' : page.slug === 'elements' ? 'Element API' : page.title
  }
}
write('content/docs/_meta.js', 'export default ' + JSON.stringify(meta, null, 2) + '\n')
console.log(`Imported ${manifest.length} sections and the complete changelog into ${root}/content.`)
