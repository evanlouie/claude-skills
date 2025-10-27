# Playwright Automation Scripts Reference

Complete reference for 32 browser automation utility scripts.

## Background Process Requirement

**CRITICAL**: All automation scripts require a persistent background browser instance.

### Starting the Background Browser

Use Claude Code's Bash tool with `run_in_background: true`:

```typescript
await Bash({
  command: 'bun run scripts/browser-manager.ts start',
  run_in_background: true,
  description: 'Start persistent Playwright browser'
});
```

**Why background execution is required:**
- The browser process must continue running while scripts execute
- Without `run_in_background: true`, the browser would block
- All 32 automation scripts connect to this shared browser instance via CDP endpoint

### Managing the Background Browser

```bash
# Check status
bun run scripts/browser-manager.ts status

# Stop when finished
bun run scripts/browser-manager.ts stop

# Restart
bun run scripts/browser-manager.ts restart
```

## Quick Reference by Category

### Navigation (3 scripts)
- `browser_navigate` - Navigate to URLs
- `browser_navigate_back` - Go back in history
- `browser_close` - Close browser page

### Interaction (9 scripts)
- `browser_click` - Click elements (single/double, any button)
- `browser_type` - Type text into inputs
- `browser_hover` - Hover over elements
- `browser_drag` - Drag and drop operations
- `browser_press_key` - Keyboard input
- `browser_file_upload` - Upload files
- `browser_fill_form` - Fill multiple form fields
- `browser_select_option` - Select dropdown options
- `browser_handle_dialog` - Handle alerts/confirms

### Information Gathering (4 scripts)
- `browser_snapshot` - Capture accessibility snapshot
- `browser_console_messages` - Get console logs
- `browser_network_requests` - List network activity
- `browser_evaluate` - Execute JavaScript

### Visual Capture (2 scripts)
- `browser_take_screenshot` - Capture PNG/JPEG screenshots
- `browser_pdf_save` - Generate PDFs

### Browser Control (3 scripts)
- `browser_resize` - Change viewport size
- `browser_tabs` - Manage browser tabs
- `browser_wait_for` - Wait for conditions

### Coordinate Actions (3 scripts)
- `browser_mouse_click_xy` - Click at coordinates
- `browser_mouse_drag_xy` - Drag to coordinates
- `browser_mouse_move_xy` - Move mouse to coordinates

### Testing Utilities (5 scripts)
- `browser_verify_element_visible` - Assert element visibility
- `browser_verify_text_visible` - Assert text presence
- `browser_verify_list_visible` - Assert list contents
- `browser_verify_value` - Assert element value
- `browser_generate_locator` - Generate test locators

### Debugging (2 scripts)
- `browser_start_tracing` - Start trace recording
- `browser_stop_tracing` - Stop and save trace

### Setup (1 script)
- `browser_install` - Install browser binaries

## Detailed Documentation

---

### browser_navigate

**Purpose**: Navigate the browser to a specific URL.

**Usage**:
```bash
bun run scripts/browser_navigate.ts --url <URL> [options]
```

**Parameters**:
- `--url` (required): URL to navigate to
- `--waitUntil` (optional): When to consider navigation complete: load, domcontentloaded, networkidle
- `--timeout` (optional): Maximum navigation time in milliseconds (default: 30000)

**Examples**:
```bash
bun run scripts/browser_navigate.ts --url http://localhost:3000
bun run scripts/browser_navigate.ts --url https://example.com/dashboard --waitUntil networkidle
```

**Output**:
```json
{
  "success": true,
  "url": "http://localhost:3000",
  "finalUrl": "http://localhost:3000/"
}
```

---

### browser_navigate_back

**Purpose**: Go back to the previous page in browser history.

**Usage**:
```bash
bun run scripts/browser_navigate_back.ts
```

**Parameters**: None

**Example**:
```bash
bun run scripts/browser_navigate_back.ts
```

**Output**:
```json
{
  "success": true,
  "action": "navigate_back"
}
```

**Implementation**:
```typescript
await page.goBack();
```

---

### browser_close

**Purpose**: Close the current browser page.

**Usage**:
```bash
bun run scripts/browser_close.ts
```

**Parameters**: None

**Example**:
```bash
bun run scripts/browser_close.ts
```

**Output**:
```json
{
  "success": true,
  "action": "close_page"
}
```

**Implementation**:
```typescript
await page.close();
```

---

### browser_click

**Purpose**: Click an element on the page.

**Usage**:
```bash
bun run scripts/browser_click.ts --element <selector> [options]
```

**Parameters**:
- `--element` (required): CSS selector or locator
- `--doubleClick` (optional): Perform double-click instead of single
- `--button` (optional): Mouse button: left (default), right, middle
- `--modifiers` (optional): Modifier keys JSON array: ["Alt", "Control", "Meta", "Shift"]

**Examples**:
```bash
bun run scripts/browser_click.ts --element "button[type=submit]"
bun run scripts/browser_click.ts --element "#login-btn" --doubleClick
bun run scripts/browser_click.ts --element ".menu-item" --button right
bun run scripts/browser_click.ts --element "a" --modifiers '["Control"]'
```

**Output**:
```json
{
  "success": true,
  "action": "click",
  "element": "button[type=submit]"
}
```

---

### browser_type

**Purpose**: Type text into an input element.

**Usage**:
```bash
bun run scripts/browser_type.ts --element <selector> --text <text> [options]
```

**Parameters**:
- `--element` (required): CSS selector for input element
- `--text` (required): Text to type
- `--submit` (optional): Press Enter after typing
- `--slowly` (optional): Type with delay between keystrokes
- `--delay` (optional): Milliseconds between keystrokes when using --slowly (default: 50)

**Examples**:
```bash
bun run scripts/browser_type.ts --element "input[name=email]" --text "user@example.com"
bun run scripts/browser_type.ts --element "#search" --text "playwright" --submit
bun run scripts/browser_type.ts --element "textarea" --text "Hello world" --slowly --delay 100
```

**Output**:
```json
{
  "success": true,
  "action": "type",
  "element": "input[name=email]",
  "textLength": 16,
  "submitted": false
}
```

---

### browser_hover

**Purpose**: Hover mouse over an element.

**Usage**:
```bash
bun run scripts/browser_hover.ts --element <selector>
```

**Parameters**:
- `--element` (required): CSS selector for element

**Example**:
```bash
bun run scripts/browser_hover.ts --element ".dropdown-menu"
```

**Output**:
```json
{
  "success": true,
  "action": "hover",
  "element": ".dropdown-menu"
}
```

**Implementation**:
```typescript
await page.locator(args.element).hover();
```

---

### browser_drag

**Purpose**: Perform drag and drop operation between two elements.

**Usage**:
```bash
bun run scripts/browser_drag.ts --startElement <selector> --endElement <selector>
```

**Parameters**:
- `--startElement` (required): Source element selector
- `--endElement` (required): Target element selector

**Example**:
```bash
bun run scripts/browser_drag.ts --startElement "#draggable" --endElement "#droppable"
```

**Output**:
```json
{
  "success": true,
  "action": "drag",
  "from": "#draggable",
  "to": "#droppable"
}
```

**Implementation**:
```typescript
await page.locator(startElement).dragTo(page.locator(endElement));
```

---

### browser_press_key

**Purpose**: Press a keyboard key.

**Usage**:
```bash
bun run scripts/browser_press_key.ts --key <key>
```

**Parameters**:
- `--key` (required): Key name (e.g., Enter, Escape, ArrowDown, Control+A)

**Examples**:
```bash
bun run scripts/browser_press_key.ts --key Enter
bun run scripts/browser_press_key.ts --key Escape
bun run scripts/browser_press_key.ts --key "Control+A"
```

**Output**:
```json
{
  "success": true,
  "action": "press_key",
  "key": "Enter"
}
```

**Implementation**:
```typescript
await page.keyboard.press(args.key);
```

---

### browser_file_upload

**Purpose**: Upload one or multiple files to a file input.

**Usage**:
```bash
bun run scripts/browser_file_upload.ts --element <selector> --paths <paths-json>
```

**Parameters**:
- `--element` (required): File input selector
- `--paths` (required): JSON array of file paths

**Example**:
```bash
bun run scripts/browser_file_upload.ts --element "input[type=file]" --paths '["file1.txt","file2.pdf"]'
```

**Output**:
```json
{
  "success": true,
  "action": "file_upload",
  "element": "input[type=file]",
  "fileCount": 2
}
```

**Implementation**:
```typescript
await page.locator(args.element).setInputFiles(args.paths);
```

---

### browser_fill_form

**Purpose**: Fill multiple form fields at once.

**Usage**:
```bash
bun run scripts/browser_fill_form.ts --fields <fields-json>
```

**Parameters**:
- `--fields` (required): JSON array of {selector, value} objects

**Example**:
```bash
bun run scripts/browser_fill_form.ts --fields '[{"selector":"input[name=username]","value":"admin"},{"selector":"input[name=password]","value":"secret"}]'
```

**Output**:
```json
{
  "success": true,
  "action": "fill_form",
  "fieldsCount": 2
}
```

**Implementation**:
```typescript
for (const field of fields) {
  await page.locator(field.selector).fill(field.value);
}
```

---

### browser_select_option

**Purpose**: Select an option in a dropdown menu.

**Usage**:
```bash
bun run scripts/browser_select_option.ts --element <selector> --values <values-json>
```

**Parameters**:
- `--element` (required): Select element selector
- `--values` (required): JSON array of values to select

**Example**:
```bash
bun run scripts/browser_select_option.ts --element "select[name=country]" --values '["us"]'
```

**Output**:
```json
{
  "success": true,
  "action": "select_option",
  "element": "select[name=country]",
  "values": ["us"]
}
```

**Implementation**:
```typescript
await page.locator(args.element).selectOption(args.values);
```

---

### browser_handle_dialog

**Purpose**: Handle browser dialogs (alert, confirm, prompt).

**Usage**:
```bash
bun run scripts/browser_handle_dialog.ts --accept <true|false> [--promptText <text>]
```

**Parameters**:
- `--accept` (required): true to accept, false to dismiss
- `--promptText` (optional): Text to enter in prompt dialog

**Example**:
```bash
bun run scripts/browser_handle_dialog.ts --accept true
bun run scripts/browser_handle_dialog.ts --accept true --promptText "My input"
```

**Output**:
```json
{
  "success": true,
  "action": "handle_dialog",
  "accepted": true
}
```

**Implementation**:
```typescript
page.on('dialog', dialog => {
  if (accept) dialog.accept(promptText);
  else dialog.dismiss();
});
```

---

### browser_snapshot

**Purpose**: Capture accessibility snapshot of the page.

**Usage**:
```bash
bun run scripts/browser_snapshot.ts
```

**Parameters**: None

**Example**:
```bash
bun run scripts/browser_snapshot.ts
```

**Output**:
```json
{
  "success": true,
  "snapshot": "- heading \"Page Title\" [level=1]\n  - button \"Submit\""
}
```

**Implementation**:
```typescript
const snapshot = await page.locator('body').ariaSnapshot();
```

---

### browser_console_messages

**Purpose**: Get console messages from the page.

**Usage**:
```bash
bun run scripts/browser_console_messages.ts [--onlyErrors]
```

**Parameters**:
- `--onlyErrors` (optional): Only return error messages

**Examples**:
```bash
bun run scripts/browser_console_messages.ts
bun run scripts/browser_console_messages.ts --onlyErrors
```

**Output**:
```json
{
  "success": true,
  "messages": [
    {"type": "log", "text": "App initialized", "location": {...}},
    {"type": "error", "text": "TypeError: ...", "location": {...}}
  ],
  "count": 2
}
```

---

### browser_network_requests

**Purpose**: Get all network requests since page load.

**Usage**:
```bash
bun run scripts/browser_network_requests.ts
```

**Parameters**: None

**Example**:
```bash
bun run scripts/browser_network_requests.ts
```

**Output**:
```json
{
  "success": true,
  "requests": [
    {"method": "GET", "url": "http://...", "status": 200},
    {"method": "POST", "url": "http://...", "status": 201}
  ],
  "count": 2
}
```

**Implementation**:
```typescript
const requests: any[] = [];
page.on('response', response => {
  requests.push({
    method: response.request().method(),
    url: response.url(),
    status: response.status()
  });
});
```

---

### browser_evaluate

**Purpose**: Execute JavaScript in the page context.

**Usage**:
```bash
bun run scripts/browser_evaluate.ts --function <js-function> [options]
```

**Parameters**:
- `--function` (required): JavaScript function as string
- `--element` (optional): Evaluate on specific element
- `--arg` (optional): JSON argument to pass to function

**Examples**:
```bash
bun run scripts/browser_evaluate.ts --function "() => document.title"
bun run scripts/browser_evaluate.ts --function "() => window.location.href"
bun run scripts/browser_evaluate.ts --function "(x) => x * 2" --arg 5
bun run scripts/browser_evaluate.ts --function "() => localStorage.getItem('token')"
```

**Output**:
```json
{
  "success": true,
  "result": "Page Title"
}
```

---

### browser_take_screenshot

**Purpose**: Take a screenshot of the page or element.

**Usage**:
```bash
bun run scripts/browser_take_screenshot.ts [options]
```

**Parameters**:
- `--filename` (optional): Output filename (default: screenshot.png)
- `--type` (optional): Image type: png (default) or jpeg
- `--element` (optional): Selector of element to screenshot
- `--fullPage` (optional): Capture full scrollable page
- `--quality` (optional): JPEG quality 0-100

**Examples**:
```bash
bun run scripts/browser_take_screenshot.ts --filename debug.png
bun run scripts/browser_take_screenshot.ts --filename page.png --fullPage
bun run scripts/browser_take_screenshot.ts --filename header.png --element "#header"
bun run scripts/browser_take_screenshot.ts --filename photo.jpg --type jpeg --quality 90
```

**Output**:
```json
{
  "success": true,
  "filename": "debug.png",
  "type": "png",
  "fullPage": false,
  "element": "page"
}
```

---

### browser_pdf_save

**Purpose**: Save the current page as PDF.

**Usage**:
```bash
bun run scripts/browser_pdf_save.ts [--filename <name>]
```

**Parameters**:
- `--filename` (optional): Output PDF filename (default: page.pdf)
- `--format` (optional): Paper format: Letter, A4, etc.
- `--landscape` (optional): Landscape orientation

**Example**:
```bash
bun run scripts/browser_pdf_save.ts --filename report.pdf
bun run scripts/browser_pdf_save.ts --filename doc.pdf --format A4 --landscape
```

**Output**:
```json
{
  "success": true,
  "filename": "report.pdf"
}
```

**Implementation**:
```typescript
await page.pdf({ path: filename, format: 'A4' });
```

---

### browser_resize

**Purpose**: Change browser viewport size.

**Usage**:
```bash
bun run scripts/browser_resize.ts --width <width> --height <height>
```

**Parameters**:
- `--width` (required): Viewport width in pixels
- `--height` (required): Viewport height in pixels

**Example**:
```bash
bun run scripts/browser_resize.ts --width 1920 --height 1080
bun run scripts/browser_resize.ts --width 375 --height 667
```

**Output**:
```json
{
  "success": true,
  "width": 1920,
  "height": 1080
}
```

**Implementation**:
```typescript
await page.setViewportSize({ width, height });
```

---

### browser_tabs

**Purpose**: Manage browser tabs (list, create, close, select).

**Usage**:
```bash
bun run scripts/browser_tabs.ts --action <action> [--index <index>]
```

**Parameters**:
- `--action` (required): list, create, close, select
- `--index` (optional): Tab index for close/select actions

**Examples**:
```bash
bun run scripts/browser_tabs.ts --action list
bun run scripts/browser_tabs.ts --action create
bun run scripts/browser_tabs.ts --action close --index 1
bun run scripts/browser_tabs.ts --action select --index 0
```

**Output**:
```json
{
  "success": true,
  "action": "list",
  "tabs": [
    {"index": 0, "url": "http://...", "title": "..."},
    {"index": 1, "url": "http://...", "title": "..."}
  ]
}
```

---

### browser_wait_for

**Purpose**: Wait for text to appear/disappear or for a specified time.

**Usage**:
```bash
bun run scripts/browser_wait_for.ts [options]
```

**Parameters**:
- `--time` (optional): Wait for milliseconds
- `--text` (optional): Wait for text to appear
- `--textGone` (optional): Wait for text to disappear

**Examples**:
```bash
bun run scripts/browser_wait_for.ts --time 2000
bun run scripts/browser_wait_for.ts --text "Loading complete"
bun run scripts/browser_wait_for.ts --textGone "Loading..."
```

**Output**:
```json
{
  "success": true,
  "action": "wait",
  "condition": "text_appear",
  "text": "Loading complete"
}
```

---

### browser_mouse_click_xy

**Purpose**: Click at specific X,Y coordinates on an element.

**Usage**:
```bash
bun run scripts/browser_mouse_click_xy.ts --element <selector> --x <x> --y <y>
```

**Parameters**:
- `--element` (required): Element selector
- `--x` (required): X coordinate relative to element
- `--y` (required): Y coordinate relative to element

**Example**:
```bash
bun run scripts/browser_mouse_click_xy.ts --element "#canvas" --x 100 --y 200
```

**Output**:
```json
{
  "success": true,
  "action": "click_xy",
  "x": 100,
  "y": 200
}
```

**Implementation**:
```typescript
await page.locator(element).click({ position: { x, y } });
```

---

### browser_mouse_drag_xy

**Purpose**: Drag from start coordinates to end coordinates.

**Usage**:
```bash
bun run scripts/browser_mouse_drag_xy.ts --element <selector> --startX <x> --startY <y> --endX <x> --endY <y>
```

**Parameters**:
- `--element` (required): Element selector
- `--startX`, `--startY` (required): Start coordinates
- `--endX`, `--endY` (required): End coordinates

**Example**:
```bash
bun run scripts/browser_mouse_drag_xy.ts --element "#canvas" --startX 0 --startY 0 --endX 100 --endY 100
```

**Implementation**:
```typescript
const box = await element.boundingBox();
await page.mouse.move(box.x + startX, box.y + startY);
await page.mouse.down();
await page.mouse.move(box.x + endX, box.y + endY);
await page.mouse.up();
```

---

### browser_mouse_move_xy

**Purpose**: Move mouse to specific coordinates.

**Usage**:
```bash
bun run scripts/browser_mouse_move_xy.ts --element <selector> --x <x> --y <y>
```

**Parameters**:
- `--element` (required): Element selector
- `--x`, `--y` (required): Coordinates relative to element

**Example**:
```bash
bun run scripts/browser_mouse_move_xy.ts --element "#canvas" --x 150 --y 250
```

**Implementation**:
```typescript
const box = await element.boundingBox();
await page.mouse.move(box.x + x, box.y + y);
```

---

### browser_verify_element_visible

**Purpose**: Verify element is visible on the page.

**Usage**:
```bash
bun run scripts/browser_verify_element_visible.ts --role <role> --name <name>
```

**Parameters**:
- `--role` (required): ARIA role (button, textbox, etc.)
- `--name` (required): Accessible name

**Example**:
```bash
bun run scripts/browser_verify_element_visible.ts --role button --name Submit
```

**Output**:
```json
{
  "success": true,
  "verified": true,
  "element": "button[name='Submit']"
}
```

**Implementation**:
```typescript
const locator = page.getByRole(role, { name });
await expect(locator).toBeVisible();
```

---

### browser_verify_text_visible

**Purpose**: Verify text is visible on the page.

**Usage**:
```bash
bun run scripts/browser_verify_text_visible.ts --text <text>
```

**Parameters**:
- `--text` (required): Text to verify

**Example**:
```bash
bun run scripts/browser_verify_text_visible.ts --text "Welcome back"
```

**Output**:
```json
{
  "success": true,
  "verified": true,
  "text": "Welcome back"
}
```

**Implementation**:
```typescript
await expect(page.getByText(text)).toBeVisible();
```

---

### browser_verify_list_visible

**Purpose**: Verify list is visible with specific items.

**Usage**:
```bash
bun run scripts/browser_verify_list_visible.ts --element <selector> --items <items-json>
```

**Parameters**:
- `--element` (required): List selector
- `--items` (required): JSON array of expected item texts

**Example**:
```bash
bun run scripts/browser_verify_list_visible.ts --element "ul#menu" --items '["Home","About","Contact"]'
```

**Output**:
```json
{
  "success": true,
  "verified": true,
  "itemCount": 3
}
```

---

### browser_verify_value

**Purpose**: Verify element has expected value.

**Usage**:
```bash
bun run scripts/browser_verify_value.ts --element <selector> --value <value>
```

**Parameters**:
- `--element` (required): Element selector
- `--value` (required): Expected value

**Example**:
```bash
bun run scripts/browser_verify_value.ts --element "input[name=email]" --value "user@example.com"
```

**Output**:
```json
{
  "success": true,
  "verified": true,
  "actualValue": "user@example.com"
}
```

**Implementation**:
```typescript
await expect(page.locator(element)).toHaveValue(value);
```

---

### browser_generate_locator

**Purpose**: Generate recommended locator for an element.

**Usage**:
```bash
bun run scripts/browser_generate_locator.ts --element <selector>
```

**Parameters**:
- `--element` (required): Current element selector

**Example**:
```bash
bun run scripts/browser_generate_locator.ts --element "#submit-btn"
```

**Output**:
```json
{
  "success": true,
  "recommended": "page.getByRole('button', { name: 'Submit' })",
  "alternatives": [
    "page.getByTestId('submit-button')",
    "page.getByText('Submit')"
  ]
}
```

---

### browser_start_tracing

**Purpose**: Start trace recording for debugging.

**Usage**:
```bash
bun run scripts/browser_start_tracing.ts [--name <name>]
```

**Parameters**:
- `--name` (optional): Trace name (default: trace)

**Example**:
```bash
bun run scripts/browser_start_tracing.ts --name debug-session
```

**Output**:
```json
{
  "success": true,
  "action": "start_tracing",
  "name": "debug-session"
}
```

**Implementation**:
```typescript
await context.tracing.start({ screenshots: true, snapshots: true });
```

---

### browser_stop_tracing

**Purpose**: Stop trace recording and save trace file.

**Usage**:
```bash
bun run scripts/browser_stop_tracing.ts [--filename <name>]
```

**Parameters**:
- `--filename` (optional): Output trace filename (default: trace.zip)

**Example**:
```bash
bun run scripts/browser_stop_tracing.ts --filename debug-trace.zip
```

**Output**:
```json
{
  "success": true,
  "action": "stop_tracing",
  "filename": "debug-trace.zip"
}
```

**Implementation**:
```typescript
await context.tracing.stop({ path: filename });
```

---

### browser_install

**Purpose**: Install Playwright browser binaries.

**Usage**:
```bash
bun run scripts/browser_install.ts [--browser <browser>]
```

**Parameters**:
- `--browser` (optional): Browser to install: chromium (default), firefox, webkit, or all

**Examples**:
```bash
bun run scripts/browser_install.ts
bun run scripts/browser_install.ts --browser firefox
bun run scripts/browser_install.ts --browser all
```

**Output**:
```json
{
  "success": true,
  "action": "install",
  "browser": "chromium"
}
```

**Implementation**:
```typescript
// Executes: bunx playwright install chromium
```

---

## Script Generation Guide

### Creating Missing Scripts

If a script doesn't exist yet, it can be generated following these patterns:

**Basic script structure**:
```typescript
#!/usr/bin/env bun

import { getBrowserClient } from './lib/browser-client';
import { parseArgs, formatOutput, exitWithError, requireArgs } from './lib/utils';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireArgs(args, ['requiredParam']);

  try {
    const { page } = await getBrowserClient();

    // Call Playwright API
    await page.someMethod(args.param);

    formatOutput({ success: true, /* result data */ });
  } catch (error) {
    exitWithError('Operation failed', { error: error.message });
  }
}

main();
```

### Common Patterns

**Element interaction**:
```typescript
const locator = page.locator(args.element);
await locator.someAction();
```

**Waiting**:
```typescript
await page.waitForLoadState('networkidle');
await locator.waitFor({ state: 'visible' });
```

**Data extraction**:
```typescript
const data = await locator.textContent();
const allData = await locator.allTextContents();
```

**Error handling**:
```typescript
try {
  // operation
} catch (error) {
  exitWithError('Description', { details: error.message });
}
```

## Troubleshooting

**Error: Background browser not running**
- Start browser with: `bun run scripts/browser-manager.ts start` (with `run_in_background: true`)
- Check status: `bun run scripts/browser-manager.ts status`

**Error: Failed to connect**
- Browser may have crashed
- Restart: `bun run scripts/browser-manager.ts restart`

**Script not found**
- Script may not be created yet
- Generate it following the patterns above
- All script signatures are documented in this reference
