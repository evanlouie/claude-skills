# Automation Patterns

Battle-tested patterns for reliable browser automation with Playwright.

## Waiting Strategies

Playwright auto-waits for elements to be actionable, but manual waits are sometimes necessary.

### Wait for Element State

```typescript
// Wait for element to be visible
await locator.waitFor({ state: 'visible' });

// Wait for element to be attached to DOM
await locator.waitFor({ state: 'attached' });

// Wait for element to be hidden
await locator.waitFor({ state: 'hidden' });

// Wait for element to be detached from DOM
await locator.waitFor({ state: 'detached' });
```

### Wait for Load States

```typescript
// Wait for DOMContentLoaded event
await page.waitForLoadState('domcontentloaded');

// Wait for load event
await page.waitForLoadState('load');

// Wait for network to be idle (no requests for 500ms)
await page.waitForLoadState('networkidle');
```

Pattern for SPAs that load content dynamically:

```typescript
await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
// Now safe to interact with dynamically loaded content
```

### Wait for Network Requests

```typescript
// Wait for specific API response
await page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);

// Wait for request to be sent
await page.waitForRequest(
  request => request.url().includes('/api/login')
);

// Wait for multiple responses
const responsePromise = page.waitForResponse('/api/data');
await page.getByRole('button', { name: 'Load' }).click();
const response = await responsePromise;
console.log(await response.json());
```

### Wait for URL Changes

```typescript
// Wait for navigation to specific URL
await page.waitForURL('**/dashboard');

// Wait for URL pattern
await page.waitForURL(/\/products\/\d+/);

// Wait for URL with timeout
await page.waitForURL('**/checkout', { timeout: 10000 });
```

### Wait for Custom Conditions

```typescript
// Wait until function returns truthy
await page.waitForFunction(() => {
  return document.querySelector('.spinner') === null;
});

// Wait with arguments
await page.waitForFunction((count) => {
  return document.querySelectorAll('.item').length >= count;
}, 10);

// Wait for global variable
await page.waitForFunction(() => {
  // @ts-ignore
  return window.dataLoaded === true;
});
```

### Anti-Pattern: Arbitrary Timeouts

**Avoid**:
```typescript
await page.waitForTimeout(5000);  // Flaky and slow
```

**Prefer**:
```typescript
await page.waitForLoadState('networkidle');  // Deterministic
await locator.waitFor({ state: 'visible' });  // Specific condition
```

## Form Interaction Patterns

### Fill Text Inputs

```typescript
// Simple fill (clears first)
await page.getByLabel('Email').fill('user@example.com');

// Type character by character
await page.getByLabel('Search').pressSequentially('playwright', { delay: 100 });

// Fill and submit
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('secret');
await page.getByRole('button', { name: 'Login' }).click();
```

### Select Dropdown Options

```typescript
// Select by value
await page.getByLabel('Country').selectOption('us');

// Select by label
await page.getByLabel('Size').selectOption({ label: 'Medium' });

// Select by index
await page.getByLabel('Quantity').selectOption({ index: 2 });

// Multi-select
await page.getByLabel('Interests').selectOption(['sports', 'music', 'coding']);
```

### Checkboxes and Radio Buttons

```typescript
// Check checkbox
await page.getByLabel('Accept terms').check();

// Uncheck checkbox
await page.getByLabel('Subscribe').uncheck();

// Ensure checked state
if (!await page.getByLabel('Remember me').isChecked()) {
  await page.getByLabel('Remember me').check();
}

// Radio button (automatically unchecks others)
await page.getByLabel('Payment method: Credit Card').check();
```

### File Uploads

```typescript
// Single file
await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');

// Multiple files
await page.getByLabel('Upload files').setInputFiles([
  'file1.jpg',
  'file2.jpg'
]);

// Clear file input
await page.getByLabel('Upload file').setInputFiles([]);

// Upload with buffer
const buffer = Buffer.from('file content');
await page.getByLabel('Upload').setInputFiles({
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: buffer
});
```

### Date Inputs

```typescript
// HTML5 date input
await page.getByLabel('Start date').fill('2025-01-15');

// Date picker interactions
await page.getByLabel('Select date').click();
await page.getByRole('button', { name: 'Next month' }).click();
await page.getByRole('button', { name: '25' }).click();
```

## Navigation Patterns

### Single Page Navigation

```typescript
// Navigate and wait
await page.goto('http://localhost:3000/products');

// Navigate without waiting
await page.goto('http://localhost:3000', { waitUntil: 'commit' });

// Navigate with timeout
await page.goto('http://localhost:3000', { timeout: 60000 });
```

### History Navigation

```typescript
await page.goto('http://localhost:3000/page1');
await page.goto('http://localhost:3000/page2');

// Go back
await page.goBack();

// Go forward
await page.goForward();

// Reload
await page.reload();
```

### Link Navigation

```typescript
// Click link and wait for navigation
await page.getByRole('link', { name: 'Products' }).click();
await page.waitForURL('**/products');

// Click link that opens in new tab
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByRole('link', { name: 'External Link' }).click()
]);
await newPage.waitForLoadState();
```

### SPA Navigation

For single-page applications that don't trigger full page loads:

```typescript
// Click navigation without waiting for page load
await page.getByRole('link', { name: 'About' }).click({ noWaitAfter: true });

// Wait for URL change
await page.waitForURL('**/about');

// Or wait for content
await page.getByRole('heading', { name: 'About Us' }).waitFor();
```

## Error Handling and Retry Logic

### Try-Catch with Timeout

```typescript
try {
  await page.getByRole('button', { name: 'Submit' }).click({ timeout: 5000 });
} catch (error) {
  console.log('Submit button not found or not clickable');
  // Fallback logic
}
```

### Conditional Actions

```typescript
// Check if element exists before interaction
const loginButton = page.getByRole('button', { name: 'Login' });
if (await loginButton.isVisible()) {
  await loginButton.click();
}

// Alternative: use count
if (await page.getByText('Cookie banner').count() > 0) {
  await page.getByRole('button', { name: 'Accept' }).click();
}
```

### Retry Pattern

```typescript
async function clickWithRetry(locator: Locator, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await locator.click({ timeout: 5000 });
      return;
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

await clickWithRetry(page.getByRole('button', { name: 'Load More' }));
```

### Handle Popups and Alerts

```typescript
// Accept dialog
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button', { name: 'Delete' }).click();

// Dismiss dialog
page.on('dialog', dialog => dialog.dismiss());

// Get dialog message
page.on('dialog', dialog => {
  console.log('Dialog message:', dialog.message());
  dialog.accept();
});

// Handle once
page.once('dialog', dialog => dialog.accept());
```

## Dynamic Content Patterns

### Handle Lazy-Loaded Content

```typescript
// Scroll to trigger lazy loading
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForLoadState('networkidle');

// Scroll element into view
await page.getByText('Load more content').scrollIntoViewIfNeeded();
```

### Infinite Scroll

```typescript
async function scrollToBottom(page: Page, maxScrolls = 10) {
  let previousHeight = 0;
  let scrollCount = 0;

  while (scrollCount < maxScrolls) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);

    if (currentHeight === previousHeight) break;

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);  // Wait for content to load

    previousHeight = currentHeight;
    scrollCount++;
  }
}

await page.goto('http://localhost:3000/feed');
await scrollToBottom(page);
```

### Wait for Dynamic Updates

```typescript
// Wait for element text to change
const status = page.getByTestId('status');
await expect(status).toHaveText('Processing...');
await expect(status).toHaveText('Complete', { timeout: 30000 });

// Wait for element count to change
const items = page.getByRole('listitem');
const initialCount = await items.count();
await page.getByRole('button', { name: 'Load More' }).click();
await expect(items).toHaveCount(initialCount + 10);
```

### Handle Loading States

```typescript
// Wait for spinner to disappear
await page.getByTestId('loading-spinner').waitFor({ state: 'hidden' });

// Alternative: wait for content to appear
await page.getByRole('heading', { name: 'Dashboard' }).waitFor();

// Combined approach
const loadingSpinner = page.getByTestId('spinner');
if (await loadingSpinner.isVisible()) {
  await loadingSpinner.waitFor({ state: 'hidden' });
}
```

## Network Interception Patterns

### Mock API Responses

```typescript
// Mock single endpoint
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
  });
});

await page.goto('http://localhost:3000');
```

### Modify Requests

```typescript
// Add authentication header
await page.route('**/api/**', route => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer fake-token';
  route.continue({ headers });
});
```

### Block Resources

```typescript
// Block images and stylesheets for faster tests
await page.route('**/*.{png,jpg,jpeg,svg,css}', route => route.abort());

// Block analytics
await page.route('**/*google-analytics.com/**', route => route.abort());
await page.route('**/*facebook.com/**', route => route.abort());
```

### Capture Network Traffic

```typescript
const apiCalls: string[] = [];

await page.route('**/api/**', route => {
  apiCalls.push(`${route.request().method()} ${route.request().url()}`);
  route.continue();
});

await page.goto('http://localhost:3000');
console.log('API calls made:', apiCalls);
```

## Multi-Tab and Window Patterns

### Handle New Tabs

```typescript
// Wait for new page
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByRole('link', { name: 'Open in new tab' }).click()
]);

await newPage.waitForLoadState();
console.log('New page title:', await newPage.title());
await newPage.close();
```

### Switch Between Tabs

```typescript
const page1 = await context.newPage();
await page1.goto('http://localhost:3000/page1');

const page2 = await context.newPage();
await page2.goto('http://localhost:3000/page2');

// Interact with page1
await page1.getByRole('button', { name: 'Click me' }).click();

// Switch to page2
await page2.bringToFront();
await page2.getByRole('button', { name: 'Other button' }).click();
```

### Handle Popups

```typescript
// Wait for popup triggered by action
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('button', { name: 'Open popup' }).click()
]);

await popup.waitForLoadState();
await popup.getByRole('button', { name: 'Confirm' }).click();
await popup.close();
```

## Authentication Patterns

### Login Flow

```typescript
async function login(page: Page, username: string, password: string) {
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');
}

await login(page, 'admin', 'password123');
```

### Save Authentication State

```typescript
// Login and save storage state
await page.goto('http://localhost:3000/login');
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('password');
await page.getByRole('button', { name: 'Login' }).click();
await page.waitForURL('**/dashboard');

// Save state
await context.storageState({ path: 'auth.json' });

// Later, load state
const context = await browser.newContext({ storageState: 'auth.json' });
const page = await context.newPage();
await page.goto('http://localhost:3000/dashboard');  // Already logged in
```

### Set Cookies Directly

```typescript
await context.addCookies([
  {
    name: 'session',
    value: 'abc123',
    domain: 'localhost',
    path: '/'
  }
]);

await page.goto('http://localhost:3000/dashboard');
```

### Local Storage Setup

```typescript
await page.goto('http://localhost:3000');
await page.evaluate(() => {
  localStorage.setItem('token', 'fake-jwt-token');
  localStorage.setItem('userId', '12345');
});
await page.reload();
```

## Keyboard and Mouse Patterns

### Keyboard Shortcuts

```typescript
// Single key
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');

// With modifiers
await page.keyboard.press('Control+A');
await page.keyboard.press('Meta+V');  // Cmd+V on Mac

// Multiple keys
await page.keyboard.press('Shift+ArrowRight');
```

### Mouse Operations

```typescript
// Hover
await page.getByRole('button', { name: 'Menu' }).hover();

// Right click
await page.getByText('File').click({ button: 'right' });

// Double click
await page.getByText('Word').dblclick();

// Click with modifiers
await page.getByRole('link', { name: 'Link' }).click({
  modifiers: ['Control']
});

// Click at specific position
await page.getByTestId('canvas').click({ position: { x: 100, y: 200 } });
```

### Drag and Drop

```typescript
// Simple drag and drop
await page.getByText('Draggable item').dragTo(
  page.getByTestId('drop-zone')
);

// Manual drag control
await page.getByText('Item').hover();
await page.mouse.down();
await page.getByTestId('target').hover();
await page.mouse.up();
```

## Performance Optimization

### Reuse Browser Context

```typescript
// Reuse context for multiple tests (in external debugging, less common)
const context = await browser.newContext();

const page1 = await context.newPage();
await page1.goto('http://localhost:3000/page1');
// ... interact

const page2 = await context.newPage();
await page2.goto('http://localhost:3000/page2');
// ... interact

await context.close();
```

### Parallel Actions

```typescript
// Run independent actions in parallel
await Promise.all([
  page.getByLabel('First Name').fill('John'),
  page.getByLabel('Last Name').fill('Doe'),
  page.getByLabel('Email').fill('john@example.com')
]);

// Parallel navigation
const [page1, page2] = await Promise.all([
  context.newPage().then(p => p.goto('http://localhost:3000/page1')),
  context.newPage().then(p => p.goto('http://localhost:3000/page2'))
]);
```

### Disable Unnecessary Features

```typescript
const context = await browser.newContext({
  // Disable JavaScript (for static content)
  javaScriptEnabled: false,

  // Block images
  // (Use route blocking instead, shown earlier)
});
```

## Common Patterns Summary

Quick reference for frequent operations:

```typescript
// Wait for element to be visible
await locator.waitFor({ state: 'visible' });

// Fill form and submit
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('button', { name: 'Submit' }).click();

// Handle dynamic content
await page.waitForLoadState('networkidle');

// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Execute JavaScript
const result = await page.evaluate(() => window.location.href);

// Wait for navigation
await page.waitForURL('**/success');

// Handle dialogs
page.once('dialog', dialog => dialog.accept());

// Mock API
await page.route('**/api/data', route => route.fulfill({ body: '[]' }));
```
