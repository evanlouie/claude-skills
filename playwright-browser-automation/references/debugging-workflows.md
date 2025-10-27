# Debugging Workflows

Comprehensive guide to debugging web applications using Playwright's debugging tools.

## Debugging Modes

### Headed Mode

Run browser visibly to observe application behavior:

```bash
bunx playwright test debug-app.ts --headed
```

Benefits:
- Visual observation of interactions
- See actual rendering and timing issues
- Identify layout and CSS problems
- Verify hover states and animations

### Slow Motion

Slow down execution to follow actions:

```typescript
import { chromium } from '@playwright/test';

const browser = await chromium.launch({
  headless: false,
  slowMo: 1000  // 1 second delay between actions
});
```

Or via environment variable:
```bash
SLOW_MO=1000 bunx playwright test --headed
```

## Playwright Inspector

Interactive debugging tool for stepping through tests.

### Launch Inspector

```bash
# Debug mode automatically opens Inspector
bunx playwright test debug-app.ts --debug

# Or set environment variable
PWDEBUG=1 bunx playwright test debug-app.ts
```

### Inspector Features

**Step through test**:
- Click "Step over" to execute next action
- See action details and element highlights
- View actionability logs

**Live locator editing**:
- Test selectors in real-time
- Preview matching elements
- Refine locators interactively

**Pick locator**:
- Click elements in browser
- Get suggested locators
- Copy locator code

### Programmatic Pause

Insert breakpoints in test code:

```typescript
import { test } from '@playwright/test';

test('debug with pause', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Pause here - Inspector opens
  await page.pause();

  // Continue execution after Inspector interaction
  await page.getByRole('button', { name: 'Submit' }).click();
});
```

Use `page.pause()` to:
- Inspect page state at specific moment
- Test locators interactively
- Examine DOM structure
- Debug failing assertions

## Console Debugging

### PWDEBUG=console Mode

Access browser DevTools with Playwright API:

```bash
PWDEBUG=console bunx playwright test debug-app.ts --headed
```

In browser console, `playwright` object provides:
- `playwright.locator(selector)`: Test locators
- `playwright.$()`, `playwright.$$()`: Query elements
- `playwright.inspect(selector)`: Highlight element

Example console usage:
```javascript
// In browser console during test
playwright.locator('button').count()
playwright.$('button')  // Find first button
playwright.inspect('button')  // Highlight all buttons
```

### Capture Console Output

Listen to console messages in test:

```typescript
test('capture console', async ({ page }) => {
  const messages: string[] = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    messages.push(`[${type}] ${text}`);
  });

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Action' }).click();

  console.log('Console output:', messages);
});
```

### Capture Page Errors

Listen to JavaScript errors:

```typescript
test('capture errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('Page error:', error.message);
  });

  await page.goto('http://localhost:3000');

  if (errors.length > 0) {
    console.log('JavaScript errors detected:', errors);
  }
});
```

### Access Console API Results

Get values returned from console methods:

```typescript
page.on('console', async msg => {
  // Get arguments passed to console method
  const args = await Promise.all(
    msg.args().map(arg => arg.jsonValue())
  );
  console.log('Console arguments:', args);
});
```

## Trace Viewer

Record and replay test execution with detailed information.

### Record Traces

Configure in test:

```typescript
test.use({
  trace: 'on'  // Always record
  // trace: 'on-first-retry'  // Only on retry
  // trace: 'retain-on-failure'  // Keep only if test fails
});
```

Or in `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    trace: 'retain-on-failure'
  }
});
```

### View Traces

After test execution:

```bash
bunx playwright show-trace trace.zip
```

Or for test runner traces:

```bash
bunx playwright show-report
```

### Trace Viewer Features

**Timeline**:
- Visual representation of all actions
- Screenshots at each step
- Network activity

**Action details**:
- Exact locator used
- Action parameters
- Duration and timing

**DOM snapshots**:
- Inspect DOM at each action
- See element properties
- View computed styles

**Console and network**:
- Console messages
- Network requests and responses
- API call details

**Source code**:
- Test source with executed lines
- Stack traces for errors

## Screenshots and Videos

### Manual Screenshots

Capture at any point in test:

```typescript
// Full page screenshot
await page.screenshot({ path: 'debug-full.png', fullPage: true });

// Viewport only
await page.screenshot({ path: 'debug-viewport.png' });

// Element screenshot
await page.getByTestId('component').screenshot({ path: 'component.png' });

// Screenshot without saving (for inspection)
const buffer = await page.screenshot();
```

### Automatic Screenshots

Configure in test:

```typescript
test.use({
  screenshot: 'on'  // Always capture
  // screenshot: 'only-on-failure'  // Only when test fails
  // screenshot: 'off'  // Disable
});
```

### Video Recording

Record browser session:

```typescript
test.use({
  video: 'on'  // Always record
  // video: 'retain-on-failure'  // Keep only if test fails
  // video: 'on-first-retry'  // Record on retry
});
```

Access video path after test:

```typescript
test('with video', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // ... test actions
});

// After test, video available at test-results/<test-name>/video.webm
```

### Screenshot Options

```typescript
await page.screenshot({
  path: 'debug.png',
  type: 'png',  // or 'jpeg'
  quality: 90,  // JPEG only, 0-100
  fullPage: true,  // Capture entire scrollable page
  clip: {  // Capture specific region
    x: 0,
    y: 0,
    width: 800,
    height: 600
  },
  animations: 'disabled',  // Wait for animations
  omitBackground: true  // Transparent background
});
```

## Network Debugging

### Monitor All Requests

```typescript
test('monitor network', async ({ page }) => {
  page.on('request', request => {
    console.log(`>> ${request.method()} ${request.url()}`);
  });

  page.on('response', response => {
    console.log(`<< ${response.status()} ${response.url()}`);
  });

  await page.goto('http://localhost:3000');
});
```

### Filter Specific Requests

```typescript
test('monitor API calls', async ({ page }) => {
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/')) {
      console.log('API Request:', {
        method: request.method(),
        url: url,
        headers: request.headers(),
        postData: request.postData()
      });
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/')) {
      console.log('API Response:', {
        status: response.status(),
        url: url,
        headers: response.headers(),
        body: await response.text()
      });
    }
  });

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Load Data' }).click();
  await page.waitForLoadState('networkidle');
});
```

### Debug Failed Requests

```typescript
test('catch failed requests', async ({ page }) => {
  const failedRequests: string[] = [];

  page.on('requestfailed', request => {
    const failure = request.failure();
    failedRequests.push(`${request.url()}: ${failure?.errorText}`);
  });

  await page.goto('http://localhost:3000');

  if (failedRequests.length > 0) {
    console.log('Failed requests:', failedRequests);
  }
});
```

### Inspect Request/Response Details

```typescript
test('detailed network inspection', async ({ page }) => {
  page.on('response', async response => {
    if (response.url().includes('/api/users')) {
      console.log({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        timing: await response.serverAddr(),
        body: await response.json()
      });
    }
  });

  await page.goto('http://localhost:3000');
});
```

## Element Debugging

### Highlight Elements

Visual debugging of locators:

```typescript
const button = page.getByRole('button', { name: 'Submit' });

// Highlight element
await button.highlight();

// Take screenshot while highlighted
await page.screenshot({ path: 'highlighted.png' });
```

### Inspect Element Properties

```typescript
const element = page.getByTestId('component');

console.log('Element state:', {
  visible: await element.isVisible(),
  enabled: await element.isEnabled(),
  editable: await element.isEditable(),
  text: await element.textContent(),
  html: await element.innerHTML(),
  value: await element.inputValue().catch(() => null),
  attributes: {
    id: await element.getAttribute('id'),
    class: await element.getAttribute('class')
  },
  boundingBox: await element.boundingBox()
});
```

### Debug Selector Issues

```typescript
// Check how many elements match
const count = await page.getByRole('button').count();
console.log(`Found ${count} buttons`);

// List all matching elements
const buttons = await page.getByRole('button').all();
for (const button of buttons) {
  const text = await button.textContent();
  console.log('Button:', text);
}

// Test selector variations
console.log('By role:', await page.getByRole('button', { name: 'Submit' }).count());
console.log('By text:', await page.getByText('Submit').count());
console.log('By test ID:', await page.getByTestId('submit-btn').count());
```

### Accessibility Tree Inspection

```typescript
// Get accessibility snapshot
const snapshot = await page.locator('body').ariaSnapshot();
console.log('Accessibility tree:', snapshot);

// Or for specific element
const formSnapshot = await page.getByRole('form').ariaSnapshot();
console.log('Form accessibility:', formSnapshot);
```

## State Debugging

### Inspect Page State

```typescript
test('inspect page state', async ({ page }) => {
  await page.goto('http://localhost:3000');

  console.log('Page state:', {
    url: page.url(),
    title: await page.title(),
    viewportSize: page.viewportSize(),
    isClosed: page.isClosed()
  });
});
```

### Application State Inspection

Access application variables and state:

```typescript
// Redux store
const reduxState = await page.evaluate(() => {
  // @ts-ignore
  const store = window.__REDUX_DEVTOOLS_EXTENSION__?.store;
  return store?.getState();
});
console.log('Redux state:', reduxState);

// Vuex store
const vuexState = await page.evaluate(() => {
  // @ts-ignore
  return window.__VUEX__;
});
console.log('Vuex state:', vuexState);

// Local storage
const storage = await page.evaluate(() => {
  const items: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) items[key] = localStorage.getItem(key) || '';
  }
  return items;
});
console.log('LocalStorage:', storage);

// Session storage
const session = await page.evaluate(() => {
  const items: Record<string, string> = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) items[key] = sessionStorage.getItem(key) || '';
  }
  return items;
});
console.log('SessionStorage:', session);

// Cookies
const cookies = await context.cookies();
console.log('Cookies:', cookies);
```

### Global Variables

```typescript
const globals = await page.evaluate(() => {
  return {
    // @ts-ignore
    user: window.currentUser,
    // @ts-ignore
    config: window.APP_CONFIG,
    // @ts-ignore
    version: window.VERSION
  };
});
console.log('Global variables:', globals);
```

## Debugging Specific Scenarios

### Debug Flaky Tests

Add extensive logging:

```typescript
test('debug flaky test', async ({ page }) => {
  console.log('Starting test');

  await page.goto('http://localhost:3000');
  console.log('Navigated to home');

  await page.waitForLoadState('networkidle');
  console.log('Network idle');

  const button = page.getByRole('button', { name: 'Submit' });
  console.log('Button count:', await button.count());

  await button.waitFor({ state: 'visible' });
  console.log('Button visible');

  await button.click();
  console.log('Button clicked');

  await page.waitForURL('**/success');
  console.log('Navigated to success page');
});
```

### Debug Timing Issues

```typescript
test('debug timing', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Log when element appears
  const element = page.getByTestId('dynamic-content');

  console.time('Wait for element');
  await element.waitFor({ state: 'visible' });
  console.timeEnd('Wait for element');

  // Check actionability
  const box = await element.boundingBox();
  console.log('Element position:', box);

  const isVisible = await element.isVisible();
  console.log('Is visible:', isVisible);

  // Verify no overlays
  const overlays = await page.locator('.overlay').count();
  console.log('Overlays present:', overlays);
});
```

### Debug Mobile Viewport

```typescript
test('debug mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('http://localhost:3000');

  // Take mobile screenshot
  await page.screenshot({ path: 'mobile-debug.png' });

  // Check responsive behavior
  const menu = page.getByRole('button', { name: 'Menu' });
  console.log('Mobile menu visible:', await menu.isVisible());
});
```

## Performance Debugging

### Measure Load Times

```typescript
test('measure performance', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms`);

  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
      load: perf.loadEventEnd - perf.fetchStart,
      domInteractive: perf.domInteractive - perf.fetchStart
    };
  });
  console.log('Performance metrics:', metrics);
});
```

### Identify Slow Operations

```typescript
test('profile operations', async ({ page }) => {
  await page.goto('http://localhost:3000');

  console.time('Form fill');
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  console.timeEnd('Form fill');

  console.time('API request');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForResponse('**/api/submit');
  console.timeEnd('API request');
});
```

## Debugging Checklist

When debugging failing tests:

1. **Run in headed mode**: See what's actually happening
2. **Add page.pause()**: Stop execution at problem point
3. **Check element count**: Verify selector matches expected elements
4. **Inspect console**: Look for JavaScript errors
5. **Monitor network**: Check for failed API calls
6. **Verify timing**: Ensure proper waiting strategies
7. **Take screenshots**: Capture visual state
8. **Check actionability**: Verify element is visible and clickable
9. **Review traces**: Use trace viewer for post-mortem analysis
10. **Simplify test**: Isolate problematic action

## Quick Debugging Commands

```bash
# Run with Inspector
bunx playwright test --debug

# Run headed with slow motion
bunx playwright test --headed --slow-mo=1000

# Run single test
bunx playwright test -g "test name"

# Show trace
bunx playwright show-trace trace.zip

# Run with console output
PWDEBUG=console bunx playwright test --headed
```
