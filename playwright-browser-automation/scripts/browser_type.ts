#!/usr/bin/env bun

/**
 * Type text into an element
 *
 * Usage:
 *   bun run browser_type.ts --element <selector> --text <text> [options]
 *
 * Options:
 *   --submit    Press Enter after typing
 *   --slowly    Type with delay between keystrokes
 *   --delay     Milliseconds between keystrokes (default: 50)
 *
 * Examples:
 *   bun run browser_type.ts --element "input[name=email]" --text "user@example.com"
 *   bun run browser_type.ts --element "#search" --text "playwright" --submit
 *   bun run browser_type.ts --element "textarea" --text "Hello" --slowly --delay 100
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  requireArgs(args, ['element', 'text']);

  try {
    const { page } = await getBrowserClient();
    const locator = page.locator(args.element);

    if (args.slowly) {
      await locator.pressSequentially(args.text, {
        delay: args.delay || 50
      });
    } else {
      await locator.fill(args.text);
    }

    if (args.submit) {
      await locator.press('Enter');
    }

    formatOutput({
      success: true,
      action: 'type',
      element: args.element,
      textLength: args.text.length,
      submitted: !!args.submit
    });
  } catch (error) {
    exitWithError(
      'Failed to type text',
      { element: args.element, error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
