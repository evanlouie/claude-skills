#!/usr/bin/env bun

/**
 * Browser Manager - Start/stop/manage persistent background browser
 *
 * IMPORTANT: The 'start' command MUST be run as a background process using
 * Claude Code's Bash tool with run_in_background: true
 *
 * Usage:
 *   bun run browser-manager.ts start   # Start background browser
 *   bun run browser-manager.ts stop    # Stop background browser
 *   bun run browser-manager.ts status  # Check browser status
 *   bun run browser-manager.ts restart # Restart browser
 */

import { chromium, type Browser } from 'playwright';
import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const STATE_DIR = join(homedir(), '.playwright-browser');
const ENDPOINT_FILE = join(STATE_DIR, 'endpoint');
const PID_FILE = join(STATE_DIR, 'pid');

/**
 * Start persistent browser instance
 * This function never returns - it keeps the process alive indefinitely
 */
async function start(): Promise<void> {
  // Create state directory
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }

  // Check if already running
  if (existsSync(ENDPOINT_FILE)) {
    console.error('ERROR: Browser already running.');
    console.error('Use "status" to check or "stop" to terminate first.');
    console.error(`State directory: ${STATE_DIR}`);
    process.exit(1);
  }

  console.log('Starting persistent Playwright browser...');
  console.log(`State directory: ${STATE_DIR}`);

  let browser: Browser;

  try {
    // Launch browser with CDP endpoint
    browser = await chromium.launch({
      headless: true,
      args: [
        '--remote-debugging-port=0', // Let Playwright choose port
        '--no-sandbox', // Required for some environments
        '--disable-setuid-sandbox'
      ]
    });

    // Get CDP WebSocket endpoint
    const cdpEndpoint = browser.wsEndpoint();

    // Save state for other scripts
    writeFileSync(ENDPOINT_FILE, cdpEndpoint, 'utf-8');
    writeFileSync(PID_FILE, String(process.pid), 'utf-8');

    console.log('✓ Browser started successfully');
    console.log(`  CDP Endpoint: ${cdpEndpoint}`);
    console.log(`  Process PID: ${process.pid}`);
    console.log('');
    console.log('Browser is running in background.');
    console.log('Use automation scripts to interact with it.');
    console.log('Run "bun run browser-manager.ts stop" to terminate.');
    console.log('');

  } catch (error) {
    console.error('ERROR: Failed to start browser');
    console.error(error instanceof Error ? error.message : String(error));
    cleanup();
    process.exit(1);
  }

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, shutting down...');
    await browser.close();
    cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down...');
    await browser.close();
    cleanup();
    process.exit(0);
  });

  // CRITICAL: Keep process alive indefinitely
  // This is why run_in_background: true is required
  // Without this, the process would exit and close the browser
  await new Promise(() => {}); // Never resolves
}

/**
 * Stop persistent browser instance
 */
async function stop(): Promise<void> {
  if (!existsSync(ENDPOINT_FILE)) {
    console.log('No browser instance running.');
    return;
  }

  if (!existsSync(PID_FILE)) {
    console.log('Warning: PID file not found, cleaning up stale state');
    cleanup();
    return;
  }

  const pid = parseInt(readFileSync(PID_FILE, 'utf-8'), 10);

  console.log(`Stopping browser (PID: ${pid})...`);

  try {
    // Send SIGTERM to gracefully shutdown
    process.kill(pid, 'SIGTERM');

    // Wait a moment for graceful shutdown
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if still running
    try {
      process.kill(pid, 0); // Signal 0 checks if process exists
      console.log('Warning: Browser process still running, sending SIGKILL');
      process.kill(pid, 'SIGKILL');
    } catch {
      // Process already terminated
    }

    console.log('✓ Browser stopped successfully');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ESRCH') {
      console.log('Browser process already terminated');
    } else {
      console.error('Error stopping browser:', error);
    }
  }

  cleanup();
}

/**
 * Check browser status
 */
async function status(): Promise<void> {
  if (!existsSync(ENDPOINT_FILE)) {
    console.log('Status: Not running');
    console.log(`State directory: ${STATE_DIR}`);
    return;
  }

  const endpoint = readFileSync(ENDPOINT_FILE, 'utf-8').trim();

  if (!existsSync(PID_FILE)) {
    console.log('Status: Stale (missing PID file)');
    console.log(`Endpoint file exists: ${ENDPOINT_FILE}`);
    console.log('Run "stop" to clean up stale state');
    return;
  }

  const pid = parseInt(readFileSync(PID_FILE, 'utf-8'), 10);

  // Check if process is actually running
  try {
    process.kill(pid, 0); // Signal 0 checks if process exists without killing
    console.log('Status: Running');
    console.log(`  Process PID: ${pid}`);
    console.log(`  CDP Endpoint: ${endpoint}`);
    console.log(`  State directory: ${STATE_DIR}`);
  } catch {
    console.log('Status: Stale (process not found)');
    console.log(`  Expected PID: ${pid}`);
    console.log(`  Endpoint file: ${ENDPOINT_FILE}`);
    console.log('Run "stop" to clean up stale state');
  }
}

/**
 * Restart browser
 */
async function restart(): Promise<void> {
  console.log('Restarting browser...\n');
  await stop();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await start();
}

/**
 * Clean up state files
 */
function cleanup(): void {
  if (existsSync(ENDPOINT_FILE)) {
    unlinkSync(ENDPOINT_FILE);
  }
  if (existsSync(PID_FILE)) {
    unlinkSync(PID_FILE);
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const command = process.argv[2];

  switch (command) {
    case 'start':
      await start();
      break;
    case 'stop':
      await stop();
      break;
    case 'status':
      await status();
      break;
    case 'restart':
      await restart();
      break;
    default:
      console.log('Playwright Browser Manager');
      console.log('');
      console.log('Usage:');
      console.log('  bun run browser-manager.ts start   # Start background browser');
      console.log('  bun run browser-manager.ts stop    # Stop background browser');
      console.log('  bun run browser-manager.ts status  # Check status');
      console.log('  bun run browser-manager.ts restart # Restart browser');
      console.log('');
      console.log('IMPORTANT: "start" must be run as a background process:');
      console.log('  await Bash({');
      console.log('    command: "bun run scripts/browser-manager.ts start",');
      console.log('    run_in_background: true');
      console.log('  });');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('FATAL ERROR:', error);
  cleanup();
  process.exit(1);
});
