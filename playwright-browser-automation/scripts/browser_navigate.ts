#!/usr/bin/env bun

/**
 * Navigate browser to a URL
 *
 * Usage:
 *   bun run browser_navigate.ts --url <URL>
 *
 * Example:
 *   bun run browser_navigate.ts --url http://localhost:3000
 */

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  requireArgs(args, ['url']);

  try {
    const { page } = await getBrowserClient();

    await page.goto(args.url, {
      waitUntil: args.waitUntil || 'load',
      timeout: args.timeout || 30000
    });

    formatOutput({
      success: true,
      url: args.url,
      finalUrl: page.url()
    });
  } catch (error) {
    exitWithError(
      'Failed to navigate',
      { url: args.url, error: error instanceof Error ? error.message : String(error) }
    );
  }
}

main();
