import type { ReactNode } from 'react'
import Link from 'next/link'
import { Arrow, BookIcon, CodeIcon, InputIcon, WindowIcon } from './icons'
import { CopyButton } from './copy-button'
import { DualEngineShell, EngineSwitcherToolbar } from './browser-demo'

export function InstallCommand() {
  return (
    <div className="install-command">
      <span aria-hidden="true">$</span>
      <code>pip install emunium</code>
      <CopyButton text="pip install emunium" label="Copy installation command" />
    </div>
  )
}

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Browser automation. At the OS level.</h1>
      <p className="hero-description">
        Find elements in the page, move the real mouse, and type real keys. A Python alternative to Playwright and Selenium for native-input workflows using your installed{' '}
        <Link href="/docs/browsers/">Chrome</Link> or prepared{' '}
        <Link href="/docs/browsers/">Camoufox profile</Link>, without CDP or WebDriver for page actions.
      </p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/docs/quick-start/">
          Get started <Arrow />
        </Link>
        <Link className="button button-secondary" href="/docs/">
          Read the docs <BookIcon />
        </Link>
      </div>
      <InstallCommand />
    </section>
  )
}

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <div className="section-header">
        <h2 id="demo-title">From code to cursor</h2>
        <p>
          One verified path across both browser engines. Launch an installed Chromium browser over a private pipe or connect to a prepared Camoufox profile through a signed policy extension.{' '}
          <Link className="text-link" href="/docs/mouse-and-keyboard/">
            How native input works <Arrow />
          </Link>
        </p>
      </div>
      <DualEngineShell>{children}</DualEngineShell>
      <div className="browser-strip" role="group" aria-label="Supported browsers">
        <div className="browser-engine-group" role="group" aria-labelledby="chromium-browsers">
          <span className="browser-engine-label" id="chromium-browsers">Chromium-based</span>
          <ul className="browser-badges">
            {['Chrome', 'Brave', 'Edge', 'Chromium', 'Vivaldi', 'Opera', 'Yandex'].map(browser => <li key={browser}>{browser}</li>)}
          </ul>
        </div>
        <div className="browser-engine-group" role="group" aria-labelledby="gecko-browsers">
          <span className="browser-engine-label" id="gecko-browsers">Gecko-based</span>
          <ul className="browser-badges">
            {['Firefox', 'Camoufox', 'LibreWolf', 'Floorp'].map(browser => <li key={browser}>{browser}</li>)}
          </ul>
        </div>
        <p className="browser-support-note">Any Chromium or Gecko fork is supported.</p>
      </div>
    </section>
  )
}

export function CodePane({ children }: { children: ReactNode }) {
  return (
    <div className="code-pane">
      <EngineSwitcherToolbar />
      <div className="home-code">{children}</div>
    </div>
  )
}

export function HomeSections() {
  return (
    <div className="home-sections">
      <section className="approach-section" aria-labelledby="approach-title">
        <div className="section-header">
          <h2 id="approach-title">The page tells you where</h2>
          <p>
            The operating system does the rest. Emunium reads the DOM through a browser extension and sends mouse and keyboard input directly through the OS.
          </p>
        </div>
        <div className="approach-grid">
          <div>
            <span className="step-icon">
              <CodeIcon />
            </span>
            <h3>Locate</h3>
            <p>Use roles, labels, text, CSS, or XPath. Live locators query the page again on every call so they never go stale.</p>
            <Link href="/docs/locators/">
              Locators <Arrow />
            </Link>
          </div>
          <div>
            <span className="step-icon">
              <InputIcon />
            </span>
            <h3>Move &amp; type</h3>
            <p>Choose natural, careful, or brisk input presets. Windows uses Win32 SendInput; Linux uses X11 XTest.</p>
            <Link href="/docs/human-like-input/">
              Input presets <Arrow />
            </Link>
          </div>
          <div>
            <span className="step-icon">
              <WindowIcon />
            </span>
            <h3>Verify</h3>
            <p>Check that the page sees the pointer over the intended target element before any mouse button is pressed.</p>
            <Link href="/docs/coordinates/">
              Click verification <Arrow />
            </Link>
          </div>
        </div>
        <aside className="architecture-note" aria-label="Architecture note">
          <p>
            <strong>Architecture note:</strong> No CDP for page actions is not the same as no CDP anywhere. Chrome launch uses a private debugging pipe to install the extension, and Emunium communicates over a local bridge (
            <Link href="/docs/browsers/">see browser setup</Link>). Native input does not guarantee undetectability.
          </p>
        </aside>
      </section>

      <section className="browser-section" aria-labelledby="browser-title">
        <div className="section-header">
          <h2 id="browser-title">Your browser and your profile</h2>
          <p>
            Start an installed browser or connect to a profile you already use. There is no need to rebuild your workflow around a disposable session.{' '}
            <Link className="text-link" href="/docs/connect/">
              Connect to your browser <Arrow />
            </Link>
          </p>
        </div>
        <div className="browser-options">
          <Link className="browser-option" href="/docs/browsers/">
            <span className="browser-monogram" aria-hidden="true">
              C
            </span>
            <div>
              <h3>Chrome, without a debugging port</h3>
              <p>Launch the Chrome, Edge, Brave, or Chromium binary on your machine. The extension installs over a private pipe, not a remote-debugging TCP port.</p>
              <span className="option-link">
                Chrome, Edge, Brave &amp; Chromium <Arrow />
              </span>
            </div>
          </Link>
          <Link className="browser-option" href="/docs/connect/">
            <span className="browser-monogram" aria-hidden="true">
              Cf
            </span>
            <div>
              <h3>Connect a prepared Camoufox profile</h3>
              <p>Use the Firefox-family extension workflow to attach to your Camoufox executable and persistent profile directory.</p>
              <span className="option-link">
                Camoufox &amp; Firefox setup <Arrow />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="explore-section" aria-labelledby="explore-title">
        <div className="section-header">
          <h2 id="explore-title">Start small, go deep</h2>
          <p>
            Follow the quick start to make your first verified click, or browse the complete reference for locators, waits, and desktop automation.{' '}
            <Link className="text-link" href="/docs/">
              Explore all documentation <Arrow />
            </Link>
          </p>
        </div>
        <div className="explore-grid">
          <Link href="/docs/quick-start/">
            <span className="explore-icon">
              <BookIcon />
            </span>
            <h3>
              Your first script <Arrow />
            </h3>
            <p>Install Emunium and make a verified click in a visible browser window.</p>
          </Link>
          <Link href="/docs/locators/">
            <span className="explore-icon">
              <CodeIcon />
            </span>
            <h3>
              The API, in full <Arrow />
            </h3>
            <p>Locators, waits, tabs, network responses, typed errors, and every option.</p>
          </Link>
          <Link href="/docs/standalone/">
            <span className="explore-icon">
              <WindowIcon />
            </span>
            <h3>
              Beyond the browser <Arrow />
            </h3>
            <p>Image template matching, OCR, offline HTML parsing, and parallel workers.</p>
          </Link>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-copy">
          <h2>Start with one click</h2>
          <p>Install the package, launch your browser, and run a verified native-input script.</p>
        </div>
        <Link className="button button-primary" href="/docs/quick-start/">
          Open quick start <Arrow />
        </Link>
      </section>
    </div>
  )
}
