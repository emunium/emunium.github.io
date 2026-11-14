import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: { codeblocks: true },
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: { light: 'github-light', dark: 'github-dark' }
    }
  }
})

export default withNextra({
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true
  // emunium.github.io is served at '/'. Do not set basePath to the repo name.
})
