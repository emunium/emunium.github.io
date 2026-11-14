# Emunium

**Browser automation with real OS mouse and keyboard input. No WebDriver. No CDP-driven page actions.**

Emunium is for browser automation where protocol-generated clicks and keystrokes are not what you want. It reads the page through a small browser extension, then moves the real cursor, clicks, types and drags through the operating system. On Windows that means Win32 `SendInput` / `SetCursorPos`; on Linux, X11 XTest; on macOS, the native desktop path used by `pyautogui`.

It works with installed Chrome, Edge, Brave and Chromium, can attach to your own persistent browser profile, and supports Firefox-family browsers such as Camoufox through `Browser.connect()`. Chrome 137+ is handled without a remote-debugging TCP port for extension loading: Emunium uses a private debugging pipe for that step, while its own extension bridge stays local on `127.0.0.1`.

Human input is built in. The default pointer planner uses sigma-lognormal strokes based on the Plamondon model, Fitts' law timing, drift, tremor and occasional corrective movement. You can switch between `natural`, `careful` and `brisk` presets without tuning the math yourself.

Emunium does **not** claim to bypass Cloudflare, anti-fraud systems or bot detection. Its difference is architectural: browser state is read through an extension, while input is delivered through the OS instead of WebDriver/CDP input commands.

![Preview](https://raw.githubusercontent.com/DedInc/emunium/main/preview.gif)

## Why Emunium?

| | Typical browser automation | Emunium |
|---|---|---|
| Clicks and typing | Browser automation protocol | Real OS mouse and keyboard input |
| Cursor | Browser-level pointer actions | The real system cursor moves |
| Input verification | Framework-dependent | Checks that the page sees the pointer over the target before clicking |
| Browser profile | Often a dedicated automation session | Installed browsers, persistent profiles, or attach to your own browser |
| Human-like motion | Usually custom work | `natural`, `careful`, `brisk` presets built in |
| Browser control | WebDriver / browser protocol stack | Extension bridge for page state + OS-native input |
| Camoufox | Separate integration work | Supported through `Browser.connect()` with a prepared profile |

If you need a headless scraper, Playwright or Selenium may be the simpler tool. If you need a visible browser driven through the same mouse and keyboard path as a desktop user, that is the problem Emunium is built around.

## Install

```bash
pip install emunium
```

Python 3.10+ is required.

## Quick start

```python
from emunium import Browser, expect

with Browser() as browser:
    browser.goto("https://example.com/login")

    browser.get_by_label("Email").type("me@example.com")
    browser.get_by_placeholder("Password").type("secret")
    browser.get_by_role("button", name="Sign in").click()

    expect(browser).to_have_url("*/dashboard")
```

The locator API is intentionally familiar: CSS, XPath, roles, labels, placeholders and test ids are supported. Actions wait for the element and then use native input.

## Browsers

By default, Emunium launches the first installed browser it finds in this order:

```text
Chrome -> Edge -> Brave -> Chromium -> Chrome for Testing
```

Choose one explicitly when needed:

```python
from emunium import Browser

with Browser(browser="chrome") as browser:
    browser.goto("https://example.com/")
```

Supported launch targets include `chrome`, `edge`, `brave`, `chromium`, `cft`, `auto`, or a Chromium executable path.

### Camoufox and other Firefox-family browsers

Firefox-family browsers use `Browser.connect()` and a persistent Emunium extension. Pass a prepared Camoufox profile instead of asking Emunium to manufacture or modify its fingerprint:

```python
from emunium import Browser

camoufox_path = r"C:\Browsers\Camoufox\camoufox.exe"
camoufox_profile = r"C:\Browsers\Camoufox\profiles\automation"

with Browser.connect(
    browser=camoufox_path,
    user_data_dir=camoufox_profile,
    timeout=120.0,
) as browser:
    browser.goto("https://example.com/")
    browser.get_by_role("button", name="Continue").click()
```

The same attach mode works with your own Chrome, Edge, Brave or Chromium profile when the Emunium extension is installed there.

## Human input presets

The default is `natural`.

```python
from emunium import Browser

browser = Browser(motion="natural", typing="natural")
browser = Browser(motion="careful", typing="careful")
browser = Browser(motion="brisk", typing="brisk")
```

| Preset | Pointer | Typing |
|---|---|---|
| `natural` | General-purpose human-like movement | 280 characters/minute median |
| `careful` | Slower, more corrective movement | 200 characters/minute median |
| `brisk` | Faster movement | 420 characters/minute median |

You normally do not need to tune anything below this level.

<details>
<summary>How the motion model works</summary>

The default `SigmaDriftPlanner` combines:

- sigma-lognormal strokes inspired by Plamondon's model;
- Fitts' law for movement duration: `a + b * log2(D / W + 1)`;
- target-size-aware timing;
- tremor and slow drift;
- occasional overshoot or undershoot followed by a corrective sub-stroke.

Alternative planners are `BezierTremorPlanner`, `WindMousePlanner` and `LinearPlanner`. Custom planners can implement the `MotionPlanner` protocol.

The full parameter ranges and validation rules belong in the changelog/source reference, not in the main sales path of this README.

</details>

## Native input

On Windows, mouse and keyboard events are sent through Win32 APIs. Unicode text is emitted as keystrokes with `SendInput`, so Cyrillic, CJK, accented characters and emoji do not depend on the active keyboard layout.

On Linux, input goes through X11 XTest and requires X11 or XWayland. On macOS, desktop input uses `pyautogui` and the required Accessibility permissions.

Before a click, Emunium verifies that the page actually sees the pointer over the target. If it cannot verify the target, it raises an error instead of clicking blindly.

## Standalone desktop automation

Emunium can also drive non-browser desktop applications through screenshot template matching and OCR:

```bash
pip install "emunium[standalone,ocr]"
```

```python
from emunium import Emunium

emu = Emunium(ocr=True)
button = emu.find_text_elements("Sign in")
if button:
    emu.click_at(button[0])
```

## Important limitations

- Native input requires a visible browser window. Headless mode supports DOM/navigation work, not real mouse or keyboard input.
- Browser element automation is top-frame only; iframes are not traversed.
- Linux native input requires X11 or XWayland.
- The real cursor and keyboard are used, so do not fight the automation by using them at the same time.
- Camoufox support means Emunium can attach to a prepared Camoufox profile; Emunium does not create or guarantee any particular fingerprint.
- Emunium makes no promise of being undetectable or of bypassing anti-bot / anti-fraud systems.

## More detail

Release-level behavior changes, exception semantics, waits, locators, result records, browser-specific installation details, motion parameters and low-level implementation notes are documented in [`CHANGELOG.md`](CHANGELOG.md) and in the public API docstrings.

## License

MIT
