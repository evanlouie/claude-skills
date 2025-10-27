/**
 * Playwright Configuration for External Testing
 *
 * This configuration is designed for using Playwright as an external debugging tool.
 * Place this file outside your project directory, alongside your standalone test files.
 *
 * Learn more: https://playwright.dev/docs/test-configuration
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables for configuration
 * Usage: BASE_URL=http://localhost:5000 bunx playwright test
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  // Test directory - current directory by default
  testDir: '.',

  // Maximum time one test can run
  timeout: 30000,

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['list'],  // Console output
    ['html']   // HTML report
  ],

  // Shared settings for all tests
  use: {
    // Base URL for page.goto('/')
    baseURL: BASE_URL,

    // Collect trace on first retry only
    trace: 'on-first-retry',

    // Take screenshot on failure only
    screenshot: 'only-on-failure',

    // Record video on failure only
    video: 'retain-on-failure',

    // Maximum time each action can take
    actionTimeout: 10000,

    // Headless mode (set to false to see browser)
    headless: true,

    // Browser viewport
    viewport: { width: 1280, height: 720 }
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    // Uncomment to test on Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },

    // Uncomment to test on WebKit (Safari)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // },

    // Test against mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] }
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] }
    // },
  ],

  // Folder for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results/',

  // Run your local dev server before starting the tests
  // Useful if you want Playwright to start your app automatically
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000
  // }
});

/**
 * Common configuration patterns:
 *
 * # Run all tests
 * bunx playwright test
 *
 * # Run tests in headed mode (visible browser)
 * bunx playwright test --headed
 *
 * # Run specific test file
 * bunx playwright test debug-app.ts
 *
 * # Run with Playwright Inspector
 * bunx playwright test --debug
 *
 * # Run tests matching a pattern
 * bunx playwright test -g "login"
 *
 * # Run on specific browser
 * bunx playwright test --project=chromium
 *
 * # Show HTML report after tests
 * bunx playwright show-report
 *
 * # Run with custom base URL
 * BASE_URL=http://localhost:5000 bunx playwright test
 *
 * # Run with slow motion (for debugging)
 * bunx playwright test --headed --slow-mo=1000
 */
