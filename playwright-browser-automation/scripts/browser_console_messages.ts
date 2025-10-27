#!/usr/bin/env bun

/**
 * Get console messages from the page
 *
 * Usage:
 *   bun run browser_console_messages.ts [options]
 *
 * Options:
 *   --onlyErrors    Only return error messages
 *
 * Examples:
 *   bun run browser_console_messages.ts
 *   bun run browser_console_messages.ts --onlyErrors
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  try {
    const { page } = await getBrowserClient();

    const messages = page.context().consoleMessages;
    const errors = page.context().pageErrors;

    if (args.onlyErrors) {
      formatOutput({
        success: true,
        errors: errors.map(e => e.message),
        count: errors.length
      });
    } else {
      formatOutput({
        success: true,
        messages: messages.map(m => ({
          type: m.type(),
          text: m.text(),
          location: m.location()
        })),
        count: messages.length
      });
    }
  } catch (error) {
    exitWithError(
      'Failed to get console messages',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
