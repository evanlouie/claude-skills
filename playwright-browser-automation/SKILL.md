---
name: playwright-browser-automation
description: This skill should be used when debugging, testing, or automating browser interactions for web applications in any language or framework. Playwright is used as an external tool via `bunx playwright` and is NEVER installed as a project dependency. Use this skill for frontend debugging and visual verification (screenshots, PDFs), browser automation (navigation, clicking, filling forms, selecting dropdowns, file uploads, drag-and-drop, hover interactions, keyboard input), dialog handling (alerts, confirms, prompts), data extraction (page snapshots, accessibility trees, console logs, structured scraping, application state inspection), executing custom JavaScript in browser context, testing user flows and interactions with assertions/verification, cross-browser testing, network interception and analysis, responsive design verification, tab management, wait strategies, trace recording for debugging, locator generation for test automation, coordinate-based mouse operations, and debugging running applications (Node.js, Python, Ruby, PHP, etc.). The skill provides Bun-based workflows, API references, and battle-tested patterns for reliable browser automation.
---

# Playwright Browser Automation

## Overview

Playwright serves as an external browser automation and debugging tool for web applications built in any language or framework. Unlike traditional testing tools, Playwright remains completely external to the project being debugged—never installed as a dependency, never modifying project files.

**Critical principle**: Playwright is NEVER installed in the project. It connects to running applications via HTTP, making it framework-agnostic.

## When to Use This Skill

Use Playwright for:
- **Debugging running web applications** - Inspect behavior, console logs, network requests
- **Visual verification** - Capture screenshots and PDFs for documentation or review
- **Browser automation** - Automate repetitive interactions and user flows
- **Data extraction** - Scrape structured data, extract tables, lists, or API responses
- **Testing interactions** - Verify forms, navigation, dynamic content
- **State inspection** - Access application state, localStorage, Redux/Vuex stores
- **Responsive testing** - Verify behavior across different viewport sizes
- **Cross-browser verification** - Test on Chromium, Firefox, and WebKit
- **Network analysis** - Monitor API calls, inspect request/response data

Works with applications in any language: Python, Ruby, PHP, Node.js, Go, Java, and more.

## Quick Start

### One-Time Setup

Install browser binaries (only needed once):

```bash
bunx playwright install
```

This installs browsers to system cache (~/.cache/ms-playwright/), shared across all usage.

### Create External Test File

Create a standalone test file OUTSIDE the project directory:

```typescript
// /tmp/debug-app.ts or any location outside your project
import { test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3000' });

test('debug application', async ({ page }) => {
  await page.goto('/');
  await page.pause();  // Opens Playwright Inspector for interactive debugging
});
```

### Run Test

```bash
bunx playwright test debug-app.ts --headed
```

The `--headed` flag shows the browser so interactions are visible.

## Common Workflows

### Visual Debugging

Run headed browser with interactive pause points:

```bash
bunx playwright test debug-app.ts --headed
```

In test file:
```typescript
await page.goto('http://localhost:3000');
await page.pause();  // Opens Inspector—step through actions, test selectors
```

### Screenshot Capture

```typescript
// Full page screenshot
await page.screenshot({ path: 'debug.png', fullPage: true });

// Element screenshot
await page.getByTestId('component').screenshot({ path: 'component.png' });

// Multiple viewports
await page.setViewportSize({ width: 375, height: 667 });
await page.screenshot({ path: 'mobile.png' });
```

### Console Log Inspection

```typescript
const logs: string[] = [];

page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', error => console.error('Error:', error.message));

await page.goto('http://localhost:3000');
// Interact with app...
console.log('Captured logs:', logs);
```

### Network Monitoring

```typescript
page.on('response', async response => {
  if (response.url().includes('/api/')) {
    console.log(`${response.status()} ${response.url()}`);
    const body = await response.json().catch(() => null);
    if (body) console.log('Response:', body);
  }
});

await page.goto('http://localhost:3000');
await page.waitForLoadState('networkidle');
```

### Data Extraction

```typescript
// Extract list items
const items = await page.getByRole('listitem').allTextContents();

// Extract table data
const rows = await page.getByRole('row').all();
const tableData = await Promise.all(
  rows.map(row => row.getByRole('cell').allTextContents())
);

// Access application state
const appState = await page.evaluate(() => ({
  // @ts-ignore
  currentUser: window.currentUser,
  localStorage: { ...localStorage }
}));
```

### Execute JavaScript

```typescript
// Access application internals
const reduxState = await page.evaluate(() => {
  // @ts-ignore
  return window.__REDUX_DEVTOOLS_EXTENSION__?.store?.getState();
});

// Modify page for debugging
await page.evaluate(() => {
  localStorage.setItem('debugMode', 'true');
});
await page.reload();
```

## Progressive Disclosure - Finding Detailed Information

Comprehensive documentation is available in `references/` files. Use grep to find specific information:

### API Reference
```bash
# Find locator methods
rg -n "locator\." references/playwright-api-reference.md

# Find waiting strategies
rg -n "waitFor" references/playwright-api-reference.md

# Find screenshot options
rg -n "screenshot" references/playwright-api-reference.md
```

### External Testing Guide
```bash
# External testing philosophy
rg -n "external" references/external-testing-guide.md

# Browser installation
rg -n "install" references/external-testing-guide.md

# Different frameworks
rg -n "Flask\|Rails\|Laravel" references/external-testing-guide.md
```

### Automation Patterns
```bash
# Waiting strategies
rg -n "Wait for" references/automation-patterns.md

# Form interactions
rg -n "Form Interaction" references/automation-patterns.md

# Error handling
rg -n "Error Handling" references/automation-patterns.md
```

### Debugging Workflows
```bash
# Playwright Inspector
rg -n "Inspector" references/debugging-workflows.md

# Console debugging
rg -n "console" references/debugging-workflows.md

# Network debugging
rg -n "Network" references/debugging-workflows.md
```

### Selector Strategies
```bash
# Role-based selectors
rg -n "getByRole" references/selector-strategies.md

# Best practices
rg -n "Best Practices" references/selector-strategies.md

# Anti-patterns
rg -n "Anti-Pattern" references/selector-strategies.md
```

### Data Extraction
```bash
# Table extraction
rg -n "Table Extraction" references/data-extraction.md

# Pagination
rg -n "Pagination" references/data-extraction.md

# API interception
rg -n "API Response" references/data-extraction.md
```

### Automation Scripts
```bash
# List all scripts by category
rg -n "Quick Reference" references/automation-scripts-reference.md

# Find specific script documentation
rg -n "browser_navigate" references/automation-scripts-reference.md
rg -n "browser_click" references/automation-scripts-reference.md
rg -n "browser_fill_form" references/automation-scripts-reference.md

# Browse by category
rg -n "Navigation\|Interaction\|Information" references/automation-scripts-reference.md
rg -n "Testing Utilities" references/automation-scripts-reference.md
```

## Key Concepts

### User-Facing Locators

Prioritize locators that reflect how users perceive the page:

```typescript
// ✅ Best - role-based (most resilient)
page.getByRole('button', { name: 'Submit' })

// ✅ Good - label-based (for forms)
page.getByLabel('Email address')

// ✅ Good - text content
page.getByText('Welcome back')

// ✅ Good - test IDs (explicit hooks)
page.getByTestId('submit-button')

// ❌ Avoid - implementation details
page.locator('.btn-primary-v2')  // Brittle, tied to CSS classes
```

### Auto-Waiting

Playwright automatically waits for elements to be actionable before performing actions. No need for arbitrary delays:

```typescript
// Automatically waits for button to be visible, enabled, and stable
await page.getByRole('button', { name: 'Submit' }).click();

// ❌ Avoid arbitrary timeouts
await page.waitForTimeout(5000);  // Flaky and slow

// ✅ Use specific wait conditions
await page.waitForLoadState('networkidle');
await page.getByText('Success').waitFor();
```

### Browser Contexts

Contexts provide isolated sessions with independent cookies, storage, and cache:

```typescript
// All tests in Playwright get a fresh context automatically
// Ensures clean state between test runs
test('my test', async ({ page }) => {
  // Fresh context with no cookies or localStorage
  await page.goto('http://localhost:3000');
});
```

## Template Files

### Standalone Test Template

Use `assets/standalone-test-example.ts` as a starting point:
- Demonstrates common debugging patterns
- Includes console monitoring, network inspection, data extraction
- Shows responsive testing across viewports
- Provides commented examples for quick adaptation

Copy and modify for specific debugging needs.

### Configuration Template

Use `assets/playwright.config.ts` for custom configuration:
- Configures baseURL for target application
- Sets up artifacts (screenshots, videos, traces)
- Defines browser projects (Chromium, Firefox, WebKit)
- Includes common configuration patterns

Place alongside test files, outside project directory.

## Persistent Browser & Automation Scripts

This skill includes 32 executable automation scripts for common browser operations. Scripts connect to a persistent browser instance that runs in the background.

### Background Process Management

**CRITICAL**: The persistent browser MUST run as a background process using the Bash tool with `run_in_background: true`.

**Start persistent browser (background process)**:
```typescript
// Use Bash tool with run_in_background
await Bash({
  command: 'bun run scripts/browser-manager.ts start',
  run_in_background: true,
  description: 'Start persistent Playwright browser'
});
```

**Check browser status**:
```bash
bun run scripts/browser-manager.ts status
```

**Stop browser when done**:
```bash
bun run scripts/browser-manager.ts stop
```

The background browser:
- Runs headless by default
- Saves connection endpoint to `~/.playwright-browser/endpoint`
- All automation scripts connect to this shared instance
- Efficient for multiple operations (no repeated browser launches)
- Must be stopped explicitly when finished

### Using Automation Scripts

Once the background browser is running, execute automation scripts directly:

```bash
# Navigation
bun run scripts/browser_navigate.ts --url http://localhost:3000

# Interaction
bun run scripts/browser_click.ts --element "button[type=submit]"
bun run scripts/browser_type.ts --element "input[name=email]" --text "user@example.com"
bun run scripts/browser_fill_form.ts --fields '[{"selector":"input[name=username]","value":"admin"}]'

# Visual capture
bun run scripts/browser_take_screenshot.ts --filename debug.png --fullPage
bun run scripts/browser_pdf_save.ts --filename page.pdf

# Information gathering
bun run scripts/browser_console_messages.ts
bun run scripts/browser_network_requests.ts
bun run scripts/browser_snapshot.ts
bun run scripts/browser_evaluate.ts --function "() => document.title"

# Testing utilities
bun run scripts/browser_verify_text_visible.ts --text "Welcome"
bun run scripts/browser_verify_element_visible.ts --role button --name Submit
```

### Workflow Pattern

**Typical automation session**:

1. **Start background browser** (once):
   ```typescript
   await Bash({
     command: 'bun run scripts/browser-manager.ts start',
     run_in_background: true
   });
   ```

2. **Execute automation scripts** (many times):
   ```bash
   bun run scripts/browser_navigate.ts --url http://localhost:3000
   bun run scripts/browser_click.ts --element "#login-btn"
   bun run scripts/browser_type.ts --element "input[name=password]" --text "secret"
   bun run scripts/browser_take_screenshot.ts --filename login.png
   ```

3. **Stop browser** (when finished):
   ```bash
   bun run scripts/browser-manager.ts stop
   ```

### Finding Script Documentation

**Quick reference**:
```bash
# List all available scripts by category
rg -n "Quick Reference" references/automation-scripts-reference.md

# Find specific script
rg -n "browser_navigate" references/automation-scripts-reference.md
rg -n "browser_fill_form" references/automation-scripts-reference.md

# Browse by category
rg -n "Interaction Scripts" references/automation-scripts-reference.md
rg -n "Testing Utilities" references/automation-scripts-reference.md
```

See `scripts/README.md` for script listing and `references/automation-scripts-reference.md` for complete documentation.

### Why Background Process?

The persistent browser architecture provides:
- **Efficiency**: Browser launches once, not per script
- **State preservation**: Browser maintains session, cookies, navigation history
- **Performance**: Instant script execution without browser startup overhead
- **Realism**: Mimics real user session with continuous browser state

Without background execution, each script would need to launch its own browser, defeating the purpose of a persistent instance.

## Anti-Patterns to Avoid

**DON'T: Install Playwright in the project**
```bash
# ❌ Never do this
cd my-project
bun add -d @playwright/test
```

Playwright should remain external. Use `bunx playwright` instead.

**DON'T: Commit test files to project repository**

Keep debugging tests separate from application code.

**DON'T: Use arbitrary timeouts**
```typescript
// ❌ Flaky and slow
await page.waitForTimeout(5000);

// ✅ Specific wait conditions
await page.waitForLoadState('networkidle');
```

**DON'T: Use brittle selectors**
```typescript
// ❌ Tied to implementation
page.locator('.MuiButton-root-4729')

// ✅ User-facing
page.getByRole('button', { name: 'Submit' })
```

## Debugging Commands Quick Reference

```bash
# Run with visible browser
bunx playwright test debug-app.ts --headed

# Run with Playwright Inspector
bunx playwright test debug-app.ts --debug

# Run with slow motion (1 second between actions)
bunx playwright test --headed --slow-mo=1000

# Run specific test
bunx playwright test -g "test name"

# Target different URL
BASE_URL=http://localhost:5000 bunx playwright test debug-app.ts

# Run on specific browser
bunx playwright test --project=chromium

# Show test report
bunx playwright show-report
```

## Language-Specific Examples

### Python/Flask (port 5000)
```typescript
test.use({ baseURL: 'http://localhost:5000' });
```

### Ruby/Rails (port 3000)
```typescript
test.use({ baseURL: 'http://localhost:3000' });
```

### PHP/Laravel (port 8000)
```typescript
test.use({ baseURL: 'http://localhost:8000' });
```

### Remote server
```typescript
test.use({ baseURL: 'https://staging.example.com' });
```

Playwright connects via HTTP—application language doesn't matter.

## Resources

### references/

Comprehensive documentation loaded on-demand:

- **playwright-api-reference.md** - Complete API documentation for Page, Locator, assertions, and configuration
- **external-testing-guide.md** - Philosophy and practices for using Playwright externally without project installation
- **automation-patterns.md** - Battle-tested patterns for reliable automation including waiting strategies, form interactions, and error handling
- **debugging-workflows.md** - Debugging tools and techniques including Inspector, trace viewer, console debugging, and network monitoring
- **selector-strategies.md** - Best practices for creating resilient locators with priority on user-facing attributes
- **data-extraction.md** - Patterns for extracting structured data including tables, lists, pagination, and API interception
- **automation-scripts-reference.md** - Complete documentation for all 32 browser automation scripts with signatures, parameters, examples, and implementation patterns

Use grep patterns (shown above) to find specific information quickly.

### assets/

Template files for quick start:

- **standalone-test-example.ts** - Comprehensive test template with debugging patterns
- **playwright.config.ts** - Configuration template for external testing

Copy, modify, and use these templates outside the project directory.

### scripts/

Executable automation utilities:

- **browser-manager.ts** - Manage background browser lifecycle (start/stop/status/restart)
- **lib/** - Shared library code for all scripts (browser-client, utils, types)
- **32 automation scripts** - Executable utilities for browser operations (navigation, interaction, visual capture, testing, etc.)

Scripts are thin wrappers around Playwright API designed for direct execution. Not all 32 scripts are pre-generated—Claude can generate missing scripts following patterns documented in `automation-scripts-reference.md`.

See `scripts/README.md` for complete listing and `references/automation-scripts-reference.md` for detailed documentation.

## Next Steps

1. **Install browsers** (one-time): `bunx playwright install`
2. **Create test file** outside project directory
3. **Run with headed mode**: `bunx playwright test --headed`
4. **Use page.pause()** for interactive debugging
5. **Capture artifacts** (screenshots, console logs, network traffic)
6. **Refer to references/** for detailed API and pattern documentation

Playwright enables powerful debugging and automation while remaining completely external to the project being tested.
