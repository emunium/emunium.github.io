"use client"
import { createContext, useContext, useState, type ReactNode } from 'react'
import { CheckIcon } from './icons'

type Engine = 'chromium' | 'gecko'

const EngineContext = createContext<{
  engine: Engine
  setEngine: (value: Engine) => void
}>({
  engine: 'chromium',
  setEngine: () => {}
})

export function DualEngineShell({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<Engine>('chromium')
  return (
    <EngineContext.Provider value={{ engine, setEngine }}>
      <div className="demo-shell" data-engine={engine}>
        {children}
      </div>
    </EngineContext.Provider>
  )
}

export function EngineSwitcherToolbar() {
  const { engine, setEngine } = useContext(EngineContext)
  return (
    <div className="pane-toolbar code-toolbar">
      <div className="engine-tabs" role="tablist" aria-label="Browser engine">
        <button
          type="button"
          role="tab"
          aria-selected={engine === 'chromium'}
          className="engine-tab"
          onClick={() => setEngine('chromium')}
        >
          Chromium (Chrome / Brave)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={engine === 'gecko'}
          className="engine-tab"
          onClick={() => setEngine('gecko')}
        >
          Gecko (Camoufox / Firefox)
        </button>
      </div>
    </div>
  )
}

function OsCursor() {
  return (
    <div className="os-cursor" aria-hidden="true">
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
        <path
          d="M4.5 2.5L18.5 13.2H11.2L14.3 20.4L11.4 21.7L8.3 14.4L4.5 18.2V2.5Z"
          fill="#111318"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function BrowserDemo() {
  const { engine } = useContext(EngineContext)

  return (
    <div className={`browser-demo browser-demo-${engine}`} data-pagefind-ignore>
      <div className="pane-toolbar">
        <span className={`address-bar address-bar-${engine}`}>
          <span className="lock-symbol" aria-hidden="true" />
          <span>
            {engine === 'chromium' ? 'app.example.com/login' : 'bot.sannysoft.com'}
          </span>
        </span>
      </div>

      <div className="simulation">
        {engine === 'chromium' ? (
          <div className="login-card login-card-chromium">
            <div className="login-header">
              <h3>Sign in</h3>
              <p>Enter your account credentials to continue.</p>
            </div>

            <div className="login-form">
              <div className="form-field">
                <span className="form-label">Email</span>
                <div className="form-input">
                  <span>me@example.com</span>
                </div>
              </div>

              <div className="form-field">
                <span className="form-label">Password</span>
                <div className="form-input form-input-masked">
                  <span>••••••••••</span>
                </div>
                <span className="form-aux">Forgot password?</span>
              </div>

              <div className="login-submit-wrap">
                <div className="login-submit">
                  <span>Sign in</span>
                </div>
                <OsCursor />
              </div>
            </div>
          </div>
        ) : (
          <div className="login-card login-card-gecko">
            <div className="login-header">
              <div className="gecko-header-top">
                <h3>Browser checks</h3>
                <span className="gecko-badge">Passed</span>
              </div>
              <p>Browser fingerprint and input verification.</p>
            </div>

            <dl className="stealth-checks">
              <div className="stealth-check">
                <dt>WebDriver Flag</dt>
                <dd className="check-passed"><CheckIcon width={14} height={14} aria-hidden="true" /> Missing / Passed</dd>
              </div>
              <div className="stealth-check">
                <dt>Native OS Input</dt>
                <dd className="check-passed"><CheckIcon width={14} height={14} aria-hidden="true" /> Verified (Win32/X11)</dd>
              </div>
              <div className="stealth-check">
                <dt>Engine</dt>
                <dd>Gecko (Camoufox Stealth Engine)</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
