/**
 * Standalone Playwright Test Example
 *
 * This file demonstrates how to use Playwright as an external debugging tool
 * without installing it in your project dependencies.
 *
 * Run with: bunx playwright test standalone-test-example.ts --headed
 */

import { test, expect } from '@playwright/test';

// Configure the test to target your running application
test.use({
  baseURL: 'http://localhost:3000'  // Change to your app's URL
});

test.describe('Debug Application', () => {

  test('basic navigation and interaction', async ({ page }) => {
    // Navigate to your application
    await page.goto('/');

    // Verify page loaded
    await expect(page).toHaveTitle(/./);  // Has any title

    // Take screenshot of initial state
    await page.screenshot({ path: 'screenshots/01-homepage.png' });

    // Example: Click a button
    // await page.getByRole('button', { name: 'Login' }).click();

    // Example: Fill a form
    // await page.getByLabel('Email').fill('user@example.com');
    // await page.getByLabel('Password').fill('password');
    // await page.getByRole('button', { name: 'Submit' }).click();

    // Example: Wait for navigation
    // await page.waitForURL('**/dashboard');

    // Pause for interactive debugging (opens Playwright Inspector)
    await page.pause();
  });

  test('capture console output', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];

    // Listen to console
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Listen to errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');

    // Interact with your app
    // await page.getByRole('button', { name: 'Trigger Action' }).click();

    // Log captured output
    console.log('Console messages:', consoleMessages);
    console.log('Page errors:', errors);
  });

  test('monitor network requests', async ({ page }) => {
    const apiCalls: string[] = [];

    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
      }
    });

    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        console.log(`API Response: ${response.status()} ${response.url()}`);
        try {
          const body = await response.json();
          console.log('Response body:', body);
        } catch {
          // Not JSON
        }
      }
    });

    await page.goto('/');

    // Wait for network activity
    await page.waitForLoadState('networkidle');

    console.log('API calls made:', apiCalls);
  });

  test('extract page data', async ({ page }) => {
    await page.goto('/');

    // Example: Extract list items
    // const items = await page.getByRole('listitem').allTextContents();
    // console.log('List items:', items);

    // Example: Extract table data
    // const rows = await page.getByRole('row').all();
    // const tableData = await Promise.all(
    //   rows.map(row => row.getByRole('cell').allTextContents())
    // );
    // console.log('Table data:', tableData);

    // Example: Execute JavaScript to access app state
    const appState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        // @ts-ignore - Access your app's global variables
        // currentUser: window.currentUser,
        // @ts-ignore
        // appConfig: window.APP_CONFIG
      };
    });
    console.log('App state:', appState);
  });

  test('test responsive design', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.screenshot({ path: 'screenshots/desktop.png' });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshots/tablet.png' });

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'screenshots/mobile.png' });
  });

  test('inspect element properties', async ({ page }) => {
    await page.goto('/');

    // Example: Inspect a specific element
    // const button = page.getByRole('button', { name: 'Submit' });
    // console.log('Button state:', {
    //   visible: await button.isVisible(),
    //   enabled: await button.isEnabled(),
    //   text: await button.textContent(),
    //   boundingBox: await button.boundingBox()
    // });
  });

});

/**
 * Tips for using this template:
 *
 * 1. Run with --headed to see the browser:
 *    bunx playwright test standalone-test-example.ts --headed
 *
 * 2. Run with --debug to use Playwright Inspector:
 *    bunx playwright test standalone-test-example.ts --debug
 *
 * 3. Run specific test:
 *    bunx playwright test -g "basic navigation"
 *
 * 4. Run with slow motion:
 *    bunx playwright test --headed --slow-mo=1000
 *
 * 5. Change baseURL at runtime:
 *    BASE_URL=http://localhost:5000 bunx playwright test standalone-test-example.ts
 */
