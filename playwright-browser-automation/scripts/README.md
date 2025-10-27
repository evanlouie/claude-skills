# Playwright Automation Scripts

32 executable browser automation scripts for common operations.

## Quick Start

### 1. Start Background Browser

**CRITICAL**: Must use background execution with Claude Code:

```typescript
await Bash({
  command: 'bun run scripts/browser-manager.ts start',
  run_in_background: true,
  description: 'Start persistent Playwright browser'
});
```

### 2. Use Automation Scripts

```bash
# Navigate
bun run scripts/browser_navigate.ts --url http://localhost:3000

# Interact
bun run scripts/browser_click.ts --element "button[type=submit]"
bun run scripts/browser_type.ts --element "input[name=email]" --text "user@example.com"

# Capture
bun run scripts/browser_take_screenshot.ts --filename debug.png --fullPage
bun run scripts/browser_console_messages.ts

# Execute JavaScript
bun run scripts/browser_evaluate.ts --function "() => document.title"
```

### 3. Stop Browser

```bash
bun run scripts/browser-manager.ts stop
```

## Available Scripts

### Navigation (3)
- `browser_navigate.ts` - Navigate to URLs
- `browser_navigate_back.ts` - Go back in history
- `browser_close.ts` - Close page

### Interaction (9)
- `browser_click.ts` - Click elements
- `browser_type.ts` - Type text
- `browser_hover.ts` - Hover over elements
- `browser_drag.ts` - Drag and drop
- `browser_press_key.ts` - Press keyboard keys
- `browser_file_upload.ts` - Upload files
- `browser_fill_form.ts` - Fill multiple fields
- `browser_select_option.ts` - Select dropdown options
- `browser_handle_dialog.ts` - Handle alerts/confirms

### Information (4)
- `browser_snapshot.ts` - Accessibility snapshot
- `browser_console_messages.ts` - Console logs
- `browser_network_requests.ts` - Network activity
- `browser_evaluate.ts` - Execute JavaScript

### Visual (2)
- `browser_take_screenshot.ts` - Screenshots
- `browser_pdf_save.ts` - Generate PDFs

### Browser Control (3)
- `browser_resize.ts` - Change viewport
- `browser_tabs.ts` - Manage tabs
- `browser_wait_for.ts` - Wait for conditions

### Coordinates (3)
- `browser_mouse_click_xy.ts` - Click at coordinates
- `browser_mouse_drag_xy.ts` - Drag to coordinates
- `browser_mouse_move_xy.ts` - Move mouse

### Testing (5)
- `browser_verify_element_visible.ts` - Assert element visible
- `browser_verify_text_visible.ts` - Assert text visible
- `browser_verify_list_visible.ts` - Assert list contents
- `browser_verify_value.ts` - Assert value
- `browser_generate_locator.ts` - Generate locators

### Debugging (2)
- `browser_start_tracing.ts` - Start trace recording
- `browser_stop_tracing.ts` - Stop and save trace

### Setup (1)
- `browser_install.ts` - Install browsers

## Detailed Documentation

See `../references/automation-scripts-reference.md` for:
- Complete parameter documentation
- Usage examples for all 32 scripts
- Background process details
- Script generation guide
- Troubleshooting

## Architecture

```
scripts/
├── browser-manager.ts     # Background browser lifecycle
├── lib/
│   ├── browser-client.ts  # Connect to background browser
│   ├── utils.ts          # CLI parsing, output formatting
│   └── types.ts          # TypeScript types
└── [32 automation scripts]
```

All scripts:
- Connect to persistent background browser via CDP
- Parse CLI arguments (--key value or --key=value)
- Output JSON results to stdout
- Exit with error code 1 on failure

## Generating Missing Scripts

If a script isn't created yet, generate it following the pattern in `automation-scripts-reference.md`. Basic structure:

```typescript
#!/usr/bin/env bun

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireArgs(args, ['requiredParam']);

  try {
    const { page } = await getBrowserClient();
    // Playwright API call
    await page.someMethod(args.param);
    formatOutput({ success: true });
  } catch (error) {
    exitWithError('Operation failed', { error: error.message });
  }
}

main();
```

## Troubleshooting

**Background browser not running**:
```bash
# Check status
bun run scripts/browser-manager.ts status

# Start (must use run_in_background: true in Claude Code)
bun run scripts/browser-manager.ts start

# Restart if needed
bun run scripts/browser-manager.ts restart
```

**Connection failed**:
- Browser may have crashed
- Check `~/.playwright-browser/endpoint` file exists
- Restart browser with `browser-manager.ts restart`

**Script missing**:
- Not all 32 scripts are pre-generated
- See `automation-scripts-reference.md` for complete signatures
- Generate following established patterns
