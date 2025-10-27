#!/usr/bin/env bun

/**
 * Click an element on the page
 *
 * Usage:
 *   bun run browser_click.ts --element <selector> [options]
 *
 * Options:
 *   --doubleClick    Perform double-click instead of single click
 *   --button         Mouse button: left (default), right, middle
 *   --modifiers      Modifier keys: Alt, Control, Meta, Shift (JSON array)
 *
 * Examples:
 *   bun run browser_click.ts --element "button[type=submit]"
 *   bun run browser_click.ts --element "#login-btn" --doubleClick
 *   bun run browser_click.ts --element ".menu-item" --button right
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  requireArgs(args, ['element']);

  try {
    const { page } = await getBrowserClient();
    const locator = page.locator(args.element);

    const options = {
      button: args.button || 'left',
      modifiers: args.modifiers,
      timeout: args.timeout || 30000
    };

    if (args.doubleClick) {
      await locator.dblclick(options);
    } else {
      await locator.click(options);
    }

    formatOutput({
      success: true,
      action: args.doubleClick ? 'double-click' : 'click',
      element: args.element
    });
  } catch (error) {
    exitWithError(
      'Failed to click element',
      { element: args.element, error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
