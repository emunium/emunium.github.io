import fs from 'node:fs'
import path from 'node:path'
import { root, read, write, pages, contentFiles, contentRoute } from './lib/content.mjs'
import { site } from '../site.config.mjs'

write('public/source/README.md', read('sources/README.original.md'))
write('public/source/CHANGELOG.md', read('sources/CHANGELOG.md'))
write('public/.nojekyll', '')
const routes = contentFiles().map(contentRoute)
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
write('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => `  <url><loc>${escape(site.url + route)}</loc></url>`).join('\n') + '\n</urlset>\n')
write('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`)
write('public/llms.txt', `# Emunium\n\n> ${site.description}\n\n## Documentation\n\n` + pages.map(page => `- [${page.title}](${site.url}/docs/${page.slug}/): ${page.description}`).join('\n') + `\n\n## Original sources\n\n- [README](${site.url}/source/README.md)\n- [Changelog](${site.url}/source/CHANGELOG.md)\n- [Complete documentation](${site.url}/llms-full.txt)\n`)
write('public/llms-full.txt', `# Emunium documentation\n\nSource snapshot: supplied Emunium README and CHANGELOG for ${site.version}.\nNo undetectability claim is made. See the Browsers section for the distinction between native input and Chrome extension installation.\n\n` + read('sources/README.original.md') + '\n\n' + read('sources/CHANGELOG.md'))
console.log(`Prepared source downloads, sitemap, robots, and plain-text documentation for ${routes.length} routes.`)
