#!/usr/bin/env bun

/**
 * Take a screenshot of the page or element
 *
 * Usage:
 *   bun run browser_take_screenshot.ts [options]
 *
 * Options:
 *   --filename   Output filename (default: screenshot.png)
 *   --type       Image type: png (default) or jpeg
 *   --element    Selector of element to screenshot (optional, defaults to full page)
 *   --fullPage   Capture full scrollable page (default: false)
 *   --quality    JPEG quality 0-100 (only for jpeg type)
 *
 * Examples:
 *   bun run browser_take_screenshot.ts --filename debug.png
 *   bun run browser_take_screenshot.ts --filename page.png --fullPage
 *   bun run browser_take_screenshot.ts --filename component.png --element "#header"
 *   bun run browser_take_screenshot.ts --filename photo.jpg --type jpeg --quality 90
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const filename = args.filename || 'screenshot.png';
  const type = args.type || 'png';

  try {
    const { page } = await getBrowserClient();

    const options: any = {
      path: filename,
      type: type,
      fullPage: args.fullPage || false
    };

    if (type === 'jpeg' && args.quality) {
      options.quality = parseInt(args.quality, 10);
    }

    if (args.element) {
      const locator = page.locator(args.element);
      await locator.screenshot(options);
    } else {
      await page.screenshot(options);
    }

    formatOutput({
      success: true,
      filename: filename,
      type: type,
      fullPage: options.fullPage,
      element: args.element || 'page'
    });
  } catch (error) {
    exitWithError(
      'Failed to take screenshot',
      { filename, error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
