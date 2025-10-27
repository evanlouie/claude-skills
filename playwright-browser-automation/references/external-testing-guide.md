# External Testing with Playwright

Guide for using Playwright as an external debugging and testing tool without installing it in project dependencies.

## Core Principle

**CRITICAL**: Playwright is NEVER installed as a project dependency. It remains completely external to the application being tested.

This approach provides:
- Zero impact on project dependencies and lockfiles
- Language-agnostic testing (works with any web framework)
- Clean separation between application and testing tools
- No need to modify project configuration files

## Philosophy

Playwright serves as an external debugging tool, similar to browser DevTools. The application being tested can be written in any language or framework:
- Python (Flask, Django, FastAPI)
- Ruby (Rails, Sinatra)
- PHP (Laravel, Symfony)
- Node.js (Express, Fastify, Next.js)
- Go (Gin, Echo)
- Java (Spring Boot)
- Any other web framework

Playwright connects to the running application via HTTP, making it framework-agnostic.

## Setup

### One-Time Browser Installation

Install browser binaries (Chromium, Firefox, WebKit):

```bash
bunx playwright install
```

This downloads browser engines to `~/.cache/ms-playwright/` (or platform-specific cache directory). Browsers are shared across all Playwright usage.

To install specific browsers:

```bash
bunx playwright install chromium
bunx playwright install firefox
bunx playwright install webkit
```

### Verify Installation

```bash
bunx playwright --version
```

## Creating External Test Files

### File Organization

Create test files **outside** the project directory structure:

```
/path/to/web-project/          # Your web application
├── src/
├── app.py
└── ...

/path/to/debugging/             # External testing directory
├── debug-login.ts              # Standalone test files
├── debug-checkout.ts
├── scrape-data.ts
└── playwright.config.ts        # Optional configuration
```

Alternatively, create a temporary test file anywhere:

```bash
# Create test file in system temp directory
/tmp/debug-app.ts
```

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('debug application feature', async ({ page }) => {
  // Connect to running application
  await page.goto('http://localhost:3000');

  // Interact and debug
  await page.getByRole('button', { name: 'Login' }).click();
  await page.screenshot({ path: 'debug-login.png' });

  // Extract information
  const title = await page.title();
  console.log('Page title:', title);
});
```

### Running Tests

Execute with bunx (no installation required):

```bash
bunx playwright test debug-login.ts
```

Run with headed browser for visual debugging:

```bash
bunx playwright test debug-login.ts --headed
```

Run single test by name:

```bash
bunx playwright test -g "debug application feature"
```

## Targeting Running Applications

### baseURL Configuration

Configure target application URL in test file or config:

```typescript
// In test file
test.use({ baseURL: 'http://localhost:3000' });

test('navigate to page', async ({ page }) => {
  await page.goto('/products');  // Resolves to http://localhost:3000/products
});
```

Or in `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000'
  }
});
```

### Different Ports and Hosts

Target any running application:

```typescript
// Python Flask app on 5000
test.use({ baseURL: 'http://localhost:5000' });

// Ruby Rails app on 3000
test.use({ baseURL: 'http://localhost:3000' });

// PHP app on 8080
test.use({ baseURL: 'http://localhost:8080' });

// Remote staging server
test.use({ baseURL: 'https://staging.example.com' });
```

## Common External Testing Patterns

### Quick Debugging Script

Create minimal test for rapid debugging:

```typescript
import { test } from '@playwright/test';

test('quick debug', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.pause();  // Opens Playwright Inspector
});
```

Run with:
```bash
bunx playwright test quick-debug.ts --headed
```

### Screenshot Capture

Capture visual state without writing test assertions:

```typescript
import { test } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Full page screenshot
  await page.screenshot({
    path: 'screenshots/homepage.png',
    fullPage: true
  });

  // Element screenshot
  const loginForm = page.getByRole('form', { name: 'Login' });
  await loginForm.screenshot({ path: 'screenshots/login-form.png' });

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'screenshots/mobile.png' });
});
```

### Console Log Inspection

Capture and analyze browser console output:

```typescript
import { test } from '@playwright/test';

test('inspect console logs', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Output captured logs
  console.log('Console logs:', logs);
  console.log('Page errors:', errors);
});
```

### Network Request Monitoring

Monitor API calls and responses:

```typescript
import { test } from '@playwright/test';

test('monitor network requests', async ({ page }) => {
  const requests: string[] = [];

  page.on('request', request => {
    if (request.url().includes('/api/')) {
      requests.push(`${request.method()} ${request.url()}`);
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      console.log(`${response.status()} ${response.url()}`);
      const body = await response.json().catch(() => null);
      if (body) console.log('Response:', body);
    }
  });

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Load Data' }).click();
  await page.waitForLoadState('networkidle');

  console.log('API requests made:', requests);
});
```

### Execute JavaScript for State Inspection

Access application state directly:

```typescript
import { test } from '@playwright/test';

test('inspect application state', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check Redux/Vuex store
  const state = await page.evaluate(() => {
    // @ts-ignore
    return window.__REDUX_DEVTOOLS_EXTENSION__?.store?.getState();
  });
  console.log('App state:', state);

  // Check localStorage
  const storage = await page.evaluate(() => {
    return { ...localStorage };
  });
  console.log('localStorage:', storage);

  // Check global variables
  const globals = await page.evaluate(() => {
    return {
      // @ts-ignore
      currentUser: window.currentUser,
      // @ts-ignore
      config: window.APP_CONFIG
    };
  });
  console.log('Global variables:', globals);
});
```

## Configuration for External Testing

### Minimal playwright.config.ts

Create alongside test files (not in project directory):

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { channel: 'chromium' }
    }
  ]
});
```

### Multi-Project Configuration

Test across multiple browsers:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',

  use: {
    baseURL: 'http://localhost:3000'
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ]
});
```

Run specific project:
```bash
bunx playwright test --project="Desktop Firefox"
```

## Advanced External Testing

### Testing Without Test Framework

For quick scripts, use Playwright directly without the test runner:

```typescript
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'debug.png' });

  const title = await page.title();
  console.log('Title:', title);

  await browser.close();
})();
```

Run directly:
```bash
bun run script.ts
```

### Testing Multiple Environments

Create separate test files or use environment variables:

```typescript
import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({ baseURL: BASE_URL });

test('test on any environment', async ({ page }) => {
  await page.goto('/');
  // Test logic
});
```

Run against different environments:
```bash
BASE_URL=http://localhost:5000 bunx playwright test
BASE_URL=https://staging.example.com bunx playwright test
BASE_URL=https://production.example.com bunx playwright test
```

## TypeScript Configuration

For TypeScript support in external tests, create minimal `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

Bun automatically handles TypeScript without requiring transpilation.

## Best Practices

1. **Keep tests external**: Never commit Playwright tests to application repository
2. **Use descriptive file names**: `debug-login-flow.ts`, `inspect-checkout-errors.ts`
3. **Leverage headed mode**: Run with `--headed` to visually observe behavior
4. **Use page.pause()**: Insert breakpoints for interactive debugging
5. **Capture artifacts**: Save screenshots, videos, and traces for analysis
6. **Target baseURL**: Configure base URL rather than hardcoding full URLs
7. **Clean up artifacts**: Delete generated files (screenshots, videos) after debugging
8. **Use environment variables**: Parameterize URLs and configuration for flexibility

## Troubleshooting

### Test Cannot Connect to Application

Ensure application is running:
```bash
# Check if server is listening
curl http://localhost:3000

# Verify port
netstat -an | grep LISTEN | grep 3000
```

Update baseURL if using different port:
```typescript
test.use({ baseURL: 'http://localhost:5000' });
```

### Browsers Not Installed

Run browser installation:
```bash
bunx playwright install
```

### Permission Errors

Browser cache may have permission issues:
```bash
rm -rf ~/.cache/ms-playwright
bunx playwright install
```

### bunx Command Not Found

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

## Examples for Different Frameworks

### Python Flask

```typescript
// debug-flask-app.ts
import { test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:5000' });

test('debug Flask routes', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'flask-home.png' });
});
```

### Ruby on Rails

```typescript
// debug-rails-app.ts
import { test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3000' });

test('debug Rails application', async ({ page }) => {
  await page.goto('/users');
  await page.screenshot({ path: 'rails-users.png' });
});
```

### PHP Laravel

```typescript
// debug-laravel-app.ts
import { test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:8000' });

test('debug Laravel routes', async ({ page }) => {
  await page.goto('/dashboard');
  await page.screenshot({ path: 'laravel-dashboard.png' });
});
```

All examples run the same way:
```bash
bunx playwright test debug-<framework>-app.ts --headed
```
