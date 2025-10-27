#!/usr/bin/env bun

/**
 * Execute JavaScript in the page context
 *
 * Usage:
 *   bun run browser_evaluate.ts --function <js-function> [options]
 *
 * Options:
 *   --element    Evaluate on specific element instead of page (optional)
 *   --arg        JSON argument to pass to function (optional)
 *
 * Examples:
 *   bun run browser_evaluate.ts --function "() => document.title"
 *   bun run browser_evaluate.ts --function "() => window.location.href"
 *   bun run browser_evaluate.ts --function "(x) => x * 2" --arg 5
 *   bun run browser_evaluate.ts --function "() => localStorage.getItem('user')"
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  requireArgs(args, ['function']);

  try {
    const { page } = await getBrowserClient();

    // Create function from string
    let result;
    if (args.element) {
      const locator = page.locator(args.element);
      result = await locator.evaluate(
        eval(args.function),
        args.arg
      );
    } else {
      result = await page.evaluate(
        eval(args.function),
        args.arg
      );
    }

    formatOutput({
      success: true,
      result: result
    });
  } catch (error) {
    exitWithError(
      'Failed to evaluate JavaScript',
      { function: args.function, error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
