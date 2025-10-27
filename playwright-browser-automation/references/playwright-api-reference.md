# Playwright API Reference

Comprehensive reference for Playwright's core APIs used in browser automation and testing.

## Page Class

The Page provides methods to interact with a single tab in a browser context.

### Navigation

Navigate between pages and manage browser history:

```typescript
await page.goto(url, options?)
```
Navigate to a URL. Options include:
- `waitUntil`: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
- `timeout`: Maximum navigation time in milliseconds
- `referer`: Referer header value

```typescript
await page.goBack(options?)
await page.goForward(options?)
await page.reload(options?)
```
Navigate browser history or reload the current page.

### Content Access

Retrieve page content and structure:

```typescript
const html = await page.content()
```
Get full HTML including doctype.

```typescript
const title = await page.title()
const url = page.url()
```
Access page metadata.

### Element Location

Find elements using various strategies:

```typescript
page.locator(selector, options?)
```
Create a locator for any CSS selector. Options include `has`, `hasText`, `hasNot`, `hasNotText` for filtering.

#### User-Facing Locators (Recommended)

```typescript
page.getByRole(role, options?)
```
Locate by ARIA role (button, textbox, heading, etc.). Most reliable approach.
Options: `name`, `checked`, `disabled`, `expanded`, `includeHidden`, `level`, `pressed`, `selected`

```typescript
page.getByText(text, options?)
```
Find elements containing text. Supports substring, exact match, or regex.

```typescript
page.getByLabel(text, options?)
```
Locate form controls by their associated label text.

```typescript
page.getByPlaceholder(text, options?)
page.getByAltText(text, options?)
page.getByTitle(text, options?)
```
Find elements by placeholder, alt text, or title attributes.

```typescript
page.getByTestId(testId)
```
Locate by data-testid attribute (configurable via `testIdAttribute` in config).

### Frame Handling

Work with iframes and frames:

```typescript
page.frameLocator(selector)
```
Locate iframe for further interactions within.

```typescript
page.frame(frameSelector)
page.frames()
page.mainFrame()
```
Access specific frames or list all frames.

### JavaScript Execution

Run custom code in the browser context:

```typescript
await page.evaluate(pageFunction, arg?)
```
Execute function in page context and return serializable result.

```typescript
const handle = await page.evaluateHandle(pageFunction, arg?)
```
Execute function returning JSHandle for complex objects.

```typescript
await page.exposeFunction(name, callback)
```
Add function callable from page JavaScript.

```typescript
await page.addInitScript(script, arg?)
```
Evaluate script before page loads (useful for mocking).

### Visual Capture

Generate screenshots and PDFs:

```typescript
await page.screenshot(options?)
```
Capture page or element screenshot.
Options:
- `path`: File path to save
- `type`: 'png' | 'jpeg'
- `fullPage`: Capture entire scrollable page
- `clip`: { x, y, width, height } for specific region
- `quality`: 0-100 for JPEG
- `omitBackground`: Transparent background
- `animations`: 'disabled' | 'allow'

```typescript
await page.pdf(options?)
```
Generate PDF (Chromium only).
Options:
- `path`: Save location
- `format`: 'Letter', 'A4', etc.
- `landscape`: Boolean
- `margin`: { top, right, bottom, left }
- `printBackground`: Include backgrounds
- `scale`: Page scale factor

### Console and Logging

Access browser console output:

```typescript
const messages = page.consoleMessages()
```
Retrieve up to 200 last console messages.

```typescript
const errors = page.pageErrors()
```
Get up to 200 last page errors.

```typescript
page.on('console', msg => console.log(msg.text()))
```
Listen to console events in real-time.

### Network

Monitor and intercept network requests:

```typescript
await page.route(url, handler, options?)
```
Intercept matching requests. Handler receives `Route` object with methods:
- `abort()`: Cancel request
- `continue()`: Proceed with request
- `fulfill()`: Respond with mock data

```typescript
await page.unroute(url, handler?)
```
Remove request interception.

```typescript
const requests = page.requests()
```
Access up to 100 last network requests.

```typescript
page.on('request', request => console.log(request.url()))
page.on('response', response => console.log(response.status()))
```
Listen to network events.

### Emulation

Modify browser environment:

```typescript
await page.emulateMedia(options?)
```
Set media type or color scheme:
- `media`: 'screen' | 'print' | null
- `colorScheme`: 'light' | 'dark' | 'no-preference' | null

```typescript
await page.setViewportSize({ width, height })
```
Change viewport dimensions (useful for responsive testing).

### Utility Methods

```typescript
await page.pause()
```
Pause execution and open Playwright Inspector.

```typescript
await page.waitForLoadState(state?, options?)
```
Wait for 'load' | 'domcontentloaded' | 'networkidle'.

```typescript
await page.waitForTimeout(timeout)
```
Wait for specified milliseconds (avoid in favor of specific waits).

```typescript
await page.waitForURL(url, options?)
```
Wait until URL matches pattern.

```typescript
await page.close(options?)
```
Close the page.

```typescript
page.isClosed()
```
Check if page is closed.

## Locator Class

Locators represent a way to find elements on the page at any moment. They auto-retry and wait for elements to be actionable.

### Actions

Perform interactions on elements:

```typescript
await locator.click(options?)
```
Click element. Options include:
- `button`: 'left' | 'right' | 'middle'
- `clickCount`: For double/triple clicks
- `delay`: Time between mousedown and mouseup
- `position`: { x, y } click coordinates
- `modifiers`: ['Alt', 'Control', 'Meta', 'Shift']
- `force`: Bypass actionability checks
- `noWaitAfter`: Don't wait for navigation
- `timeout`: Maximum time

```typescript
await locator.dblclick(options?)
```
Double-click element.

```typescript
await locator.hover(options?)
```
Hover over element.

```typescript
await locator.fill(value, options?)
```
Fill input/textarea. Clears existing value first.

```typescript
await locator.clear(options?)
```
Clear input field.

```typescript
await locator.type(text, options?)
await locator.pressSequentially(text, options?)
```
Type text character by character. `pressSequentially` is the modern API.
Options: `delay` - time between key presses

```typescript
await locator.press(key, options?)
```
Press single key (e.g., 'Enter', 'ArrowDown', 'Control+A').

```typescript
await locator.check(options?)
await locator.uncheck(options?)
```
Check or uncheck checkbox/radio button.

```typescript
await locator.selectOption(values, options?)
```
Select option(s) in `<select>` element. Values can be:
- String: by value or label
- Object: { value: 'val' }, { label: 'text' }, { index: 0 }
- Array: for multi-select

```typescript
await locator.dragTo(target, options?)
```
Drag element to target locator.

```typescript
await locator.setInputFiles(files, options?)
```
Set files for file input. Accepts file path(s) or buffer(s).

```typescript
await locator.focus()
await locator.blur()
```
Focus or blur element.

### State Inspection

Query element state:

```typescript
await locator.isVisible()
await locator.isHidden()
```
Check visibility status.

```typescript
await locator.isEnabled()
await locator.isDisabled()
```
Check if element is enabled/disabled.

```typescript
await locator.isEditable()
```
Check if element accepts input.

```typescript
await locator.isChecked()
```
Check checkbox/radio state.

```typescript
const value = await locator.inputValue()
```
Get input/textarea/select value.

```typescript
const text = await locator.innerText()
const html = await locator.innerHTML()
const content = await locator.textContent()
```
Extract text or HTML content.

```typescript
const attr = await locator.getAttribute(name)
```
Get attribute value.

```typescript
const box = await locator.boundingBox()
```
Get element position and size: { x, y, width, height }.

### Element Collections

Work with multiple matching elements:

```typescript
const count = await locator.count()
```
Get number of matching elements.

```typescript
const locators = await locator.all()
```
Get array of individual locators for each match.

```typescript
const texts = await locator.allInnerTexts()
const contents = await locator.allTextContents()
```
Extract text from all matching elements.

### Locator Refinement

Narrow down or combine locators:

```typescript
locator.filter(options?)
```
Filter by text or nested elements:
- `hasText`: Substring, string, or regex
- `hasNotText`: Exclude by text
- `has`: Must contain nested locator
- `hasNot`: Must not contain nested locator

```typescript
locator.first()
locator.last()
locator.nth(index)
```
Select specific match from multiple results.

```typescript
locator.and(otherLocator)
locator.or(otherLocator)
```
Combine locator conditions with AND/OR logic.

```typescript
locator.locator(selector)
```
Find descendant elements within locator results.

### Advanced

```typescript
await locator.evaluate(pageFunction, arg?)
```
Execute JavaScript against the element.

```typescript
await locator.evaluateAll(pageFunction, arg?)
```
Run function against all matching elements.

```typescript
await locator.dispatchEvent(type, eventInit?)
```
Trigger custom DOM event.

```typescript
const snapshot = await locator.ariaSnapshot()
```
Capture accessibility tree representation.

```typescript
await locator.highlight()
```
Show visual debugging indicator.

## Assertions

Use `@playwright/test` expect matchers for assertions:

### Visibility and State

```typescript
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeEditable()
await expect(locator).toBeChecked()
await expect(locator).toBeFocused()
```

### Content

```typescript
await expect(locator).toHaveText(text, options?)
await expect(locator).toContainText(text, options?)
await expect(locator).toHaveValue(value, options?)
```

### Attributes

```typescript
await expect(locator).toHaveAttribute(name, value?, options?)
await expect(locator).toHaveClass(className, options?)
await expect(locator).toHaveId(id, options?)
```

### Count

```typescript
await expect(locator).toHaveCount(count, options?)
```

### Page

```typescript
await expect(page).toHaveURL(url, options?)
await expect(page).toHaveTitle(title, options?)
```

### Options

All assertions support:
- `timeout`: Maximum wait time
- Options for text matching: `ignoreCase`, `useInnerText`

## Browser Context

Isolated browser session with independent cookies, storage, and cache.

```typescript
const context = await browser.newContext(options?)
```
Create new context. Options include:
- `viewport`: { width, height }
- `userAgent`: Custom user agent
- `locale`: Locale and timezone
- `permissions`: Array of permissions to grant
- `geolocation`: { latitude, longitude, accuracy }
- `colorScheme`: 'light' | 'dark' | 'no-preference'
- `storageState`: Restore cookies and localStorage

```typescript
const page = await context.newPage()
```
Create new page in context.

```typescript
await context.close()
```
Close context and all pages.

## Test Configuration

Configure test behavior in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 2,
  workers: 4,
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## Waiting Strategies

Playwright auto-waits for elements to be actionable before performing actions. Manual waits:

```typescript
await locator.waitFor(options?)
```
Wait for element state:
- `state`: 'attached' | 'detached' | 'visible' | 'hidden'
- `timeout`: Maximum wait time

```typescript
await page.waitForSelector(selector, options?)
```
Wait for element matching selector (prefer locator.waitFor()).

```typescript
await page.waitForResponse(urlOrPredicate, options?)
await page.waitForRequest(urlOrPredicate, options?)
```
Wait for specific network activity.

```typescript
await page.waitForEvent(event, optionsOrPredicate?)
```
Wait for specific page event.

```typescript
await page.waitForFunction(pageFunction, arg?, options?)
```
Wait until function returns truthy value.
