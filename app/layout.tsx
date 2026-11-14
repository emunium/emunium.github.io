import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Brand } from '../components/brand'
import { ThemeToggle } from '../components/theme-toggle'
import { HashDetails } from '../components/hash-details'
import { site } from '../site.config.mjs'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Emunium - Browser automation at the OS level', template: '%s | Emunium' },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon-32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg?v=2', sizes: 'any', type: 'image/svg+xml' }
    ],
    apple: { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' }
  },
  twitter: { card: 'summary', title: site.name, description: site.description }
}
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0b0c0e' }, { media: '(prefers-color-scheme: light)', color: '#fafafa' }]
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 213, saturation: 85 }} backgroundColor={{ dark: '#0b0c0e', light: '#fafafa' }} />
      <body>
        <Layout
          banner={
            <Banner storageKey="emunium-docs-3.1.0" className="release-banner">
              <Link href="/changelog/">
                <span className="release-label">v{site.version}</span>
                <span>Installed browsers. Live locators. Verified input.</span>
                <span className="banner-more">Read the release notes <span aria-hidden="true">&rarr;</span></span>
              </Link>
            </Banner>
          }
          navbar={<Navbar logo={<Brand />} align="left" projectLink={site.sourceRepository}><ThemeToggle /></Navbar>}
          pageMap={await getPageMap()}
          search={<Search placeholder="Search documentation..." aria-label="Search documentation" />}
          docsRepositoryBase={`${site.docsRepository}/tree/${site.branch}`}
          editLink="Edit this page"
          feedback={{ content: 'Report an issue', link: `${site.docsRepository}/issues/new` }}
          sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 2 }}
          toc={{ title: 'On this page', backToTop: true }}
          navigation={{ prev: true, next: true }}
          nextThemes={{ defaultTheme: 'dark', storageKey: 'emunium-theme', disableTransitionOnChange: true }}
          footer={
            <Footer className="site-footer">
              <div className="footer-inner">
                <div><Brand compact /><p>Real input. Clear documentation.</p></div>
                <div className="footer-links">
                  <Link href="/docs/">Documentation</Link>
                  <a href={site.sourceRepository}>GitHub</a>
                  <Link href="/docs/license/">MIT License</Link>
                </div>
              </div>
            </Footer>
          }
        ><HashDetails />{children}</Layout>
      </body>
    </html>
  )
}
