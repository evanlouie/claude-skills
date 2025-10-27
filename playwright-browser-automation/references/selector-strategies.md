# Selector Strategies

Best practices for creating reliable, maintainable locators in Playwright.

## Selector Priority

Playwright recommends user-facing locators that reflect how users and assistive technology perceive the page.

### Priority Order

1. **Role locators** - `getByRole()` - Most resilient
2. **Label locators** - `getByLabel()` - For form inputs
3. **Text locators** - `getByText()` - For visible text content
4. **Test ID locators** - `getByTestId()` - Explicit test hooks
5. **CSS/XPath** - `locator()` - Last resort

## User-Facing Locators

### Role-Based Selection

Reflect accessibility structure and user perception:

```typescript
// Buttons
page.getByRole('button', { name: 'Submit' })
page.getByRole('button', { name: /submit/i })  // Case-insensitive

// Links
page.getByRole('link', { name: 'Documentation' })

// Headings
page.getByRole('heading', { name: 'Dashboard', level: 1 })

// Text inputs
page.getByRole('textbox', { name: 'Email' })

// Checkboxes
page.getByRole('checkbox', { name: 'Accept terms' })

// Radio buttons
page.getByRole('radio', { name: 'Option A' })

// Select dropdowns
page.getByRole('combobox', { name: 'Country' })

// Tables
page.getByRole('table')
page.getByRole('row')
page.getByRole('cell')
```

Common roles:
- `button`, `link`, `textbox`, `checkbox`, `radio`, `combobox`
- `heading`, `banner`, `navigation`, `main`, `article`, `section`
- `list`, `listitem`, `table`, `row`, `cell`, `columnheader`
- `dialog`, `alertdialog`, `menu`, `menuitem`
- `tab`, `tabpanel`, `tablist`

### Label-Based Selection

For form controls:

```typescript
// Works with <label> elements
page.getByLabel('First name')
page.getByLabel('Email address')
page.getByLabel('Password')

// Works with aria-label
page.getByLabel('Search')  // <input aria-label="Search">

// Works with aria-labelledby
page.getByLabel('Username')  // <input aria-labelledby="username-label">
```

### Text Content Selection

Find elements by visible text:

```typescript
// Exact match
page.getByText('Welcome back')

// Substring match
page.getByText('Welcome', { exact: false })

// Regex
page.getByText(/welcome/i)

// Button with specific text
page.getByText('Add to cart')
```

### Placeholder Selection

For inputs with placeholder text:

```typescript
page.getByPlaceholder('Enter your email')
page.getByPlaceholder('Search...')
page.getByPlaceholder(/search/i)
```

### Alt Text Selection

For images:

```typescript
page.getByAltText('Company logo')
page.getByAltText('Product image')
page.getByAltText(/profile picture/i)
```

### Title Selection

For elements with title attributes:

```typescript
page.getByTitle('Close')
page.getByTitle('More information')
page.getByTitle(/tooltip/i)
```

## Test ID Locators

Explicit test hooks separate from presentation:

```typescript
// Default: data-testid attribute
page.getByTestId('submit-button')
page.getByTestId('user-profile')
page.getByTestId('error-message')

// In HTML:
// <button data-testid="submit-button">Submit</button>
```

### Custom Test ID Attribute

Configure different attribute in `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    testIdAttribute: 'data-test'
  }
});

// Now use:
page.getByTestId('submit')  // Matches data-test="submit"
```

## CSS and XPath Selectors

Use as last resort when user-facing locators aren't suitable.

### CSS Selectors

```typescript
// By ID
page.locator('#submit-button')

// By class
page.locator('.btn-primary')

// By attribute
page.locator('[name="email"]')
page.locator('[type="submit"]')

// Descendant combinator
page.locator('.form-group input')

// Direct child
page.locator('.navbar > button')

// Multiple classes
page.locator('.btn.btn-primary.btn-lg')

// Attribute contains
page.locator('[class*="primary"]')

// Attribute starts with
page.locator('[id^="user-"]')

// Pseudo-classes
page.locator('button:visible')
page.locator('input:enabled')
```

### XPath Selectors

```typescript
// Basic XPath
page.locator('xpath=//button[@type="submit"]')

// Shortened syntax
page.locator('//button[@type="submit"]')

// Text content
page.locator('//button[text()="Submit"]')

// Contains text
page.locator('//div[contains(text(), "Error")]')

// Axes
page.locator('//button/following-sibling::span')
page.locator('//div[@class="form"]//input[@name="email"]')
```

**Note**: XPath doesn't work with Shadow DOM. Prefer CSS or user-facing locators.

## Filtering and Refining Locators

### Filter by Text

```typescript
// Has specific text
page.getByRole('button').filter({ hasText: 'Submit' })
page.getByRole('button').filter({ hasText: /submit/i })

// Does not have text
page.getByRole('listitem').filter({ hasNotText: 'Completed' })
```

### Filter by Nested Elements

```typescript
// Has nested element
page.getByRole('listitem').filter({
  has: page.getByRole('button', { name: 'Delete' })
})

// Does not have nested element
page.getByRole('row').filter({
  hasNot: page.getByText('Inactive')
})
```

### Chaining Filters

```typescript
page.getByRole('listitem')
  .filter({ hasText: 'Product' })
  .filter({ has: page.getByRole('button', { name: 'Add to cart' }) })
  .filter({ hasNotText: 'Out of stock' })
```

### Nth Selection

```typescript
// First match
page.getByRole('button').first()

// Last match
page.getByRole('button').last()

// Specific index (0-based)
page.getByRole('button').nth(2)
```

### Locator Operators

```typescript
// AND - both conditions must match
page.getByRole('button')
  .and(page.getByText('Submit'))

// OR - either condition matches
page.getByRole('button', { name: 'Submit' })
  .or(page.getByRole('button', { name: 'Save' }))
```

### Descendant Locators

```typescript
// Find within another locator
const form = page.getByRole('form', { name: 'Login' });
await form.getByLabel('Email').fill('user@example.com');
await form.getByLabel('Password').fill('secret');
await form.getByRole('button', { name: 'Submit' }).click();
```

## Framework-Specific Strategies

### React Components

```typescript
// Use test IDs in React components
// <Button data-testid="submit-btn">Submit</Button>
page.getByTestId('submit-btn')

// Or roles with accessible names
// <Button aria-label="Submit form">Submit</Button>
page.getByRole('button', { name: 'Submit form' })

// Avoid React-specific attributes
// Avoid: page.locator('[data-reactid="..."]')  // Changes on rebuild
```

### Vue Components

```typescript
// Use semantic roles
page.getByRole('button', { name: 'Add item' })

// Or test IDs
page.getByTestId('add-item-btn')

// Avoid Vue internals
// Avoid: page.locator('[data-v-...]')  // Scoped style hashes change
```

### Angular Components

```typescript
// Use roles and labels
page.getByLabel('Username')
page.getByRole('button', { name: 'Login' })

// Or test IDs
page.getByTestId('login-form')

// Avoid Angular-specific attributes
// Avoid: page.locator('[ng-reflect-name="..."]')  // Internal attributes
```

### Shadow DOM

Playwright automatically pierces Shadow DOM:

```typescript
// Works across shadow boundaries
page.getByRole('button', { name: 'Submit' })
page.getByText('Content inside shadow root')

// CSS piercing
page.locator('custom-element >> button')

// Note: XPath does NOT work with Shadow DOM
```

## Best Practices

### DO: Use User-Facing Attributes

```typescript
// ✅ Good - reflects user perception
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Welcome back')
```

### DON'T: Rely on Implementation Details

```typescript
// ❌ Bad - tied to implementation
page.locator('.btn-primary-submit-v2')
page.locator('[data-reactid="$.0.1.2"]')
page.locator('#root > div:nth-child(3) > button')
```

### DO: Use Explicit Test IDs

```typescript
// ✅ Good - explicit test hook
page.getByTestId('checkout-button')

// HTML:
// <button data-testid="checkout-button">Checkout</button>
```

### DON'T: Use Generated IDs

```typescript
// ❌ Bad - auto-generated, unstable
page.locator('#btn-a7f3b9e2')
page.locator('[id^="ember"]')
```

### DO: Combine Locators

```typescript
// ✅ Good - specific and maintainable
page.getByRole('dialog', { name: 'Confirm deletion' })
  .getByRole('button', { name: 'Confirm' })
```

### DON'T: Use Long CSS Chains

```typescript
// ❌ Bad - brittle
page.locator('.container > .modal > .modal-footer > button.btn-danger')
```

## Selector Resilience

### Handle Dynamic Content

```typescript
// Wait for element to exist
await page.getByRole('button', { name: 'Submit' }).waitFor();

// Check if element exists
if (await page.getByText('Cookie banner').count() > 0) {
  await page.getByRole('button', { name: 'Accept' }).click();
}
```

### Handle Multiple Matches

```typescript
// Playwright throws error if multiple elements match
// Use filters to be more specific:
page.getByRole('button', { name: 'Delete' })  // Error if multiple

// Be specific:
page.getByRole('row', { name: 'User 123' })
  .getByRole('button', { name: 'Delete' })  // OK
```

### Handle Missing Elements

```typescript
// With timeout
try {
  await page.getByText('Success message').waitFor({ timeout: 5000 });
} catch {
  console.log('Success message did not appear');
}

// Check count
const count = await page.getByText('Error').count();
if (count > 0) {
  console.log('Error present');
}
```

## Debugging Selectors

### Test Selector Matching

```typescript
// Check how many elements match
const count = await page.getByRole('button').count();
console.log(`Found ${count} buttons`);

// List all matches
const buttons = await page.getByRole('button').all();
for (const button of buttons) {
  const text = await button.textContent();
  console.log('Button:', text);
}
```

### Highlight Elements

```typescript
// Visual debugging
const locator = page.getByRole('button', { name: 'Submit' });
await locator.highlight();
await page.screenshot({ path: 'highlighted.png' });
```

### Use Playwright Inspector

```bash
bunx playwright test --debug
```

In Inspector:
1. Click "Pick locator"
2. Click element in browser
3. See suggested locators
4. Test and refine

### Check Element Properties

```typescript
const element = page.getByTestId('component');

console.log({
  visible: await element.isVisible(),
  enabled: await element.isEnabled(),
  text: await element.textContent(),
  role: await element.getAttribute('role'),
  ariaLabel: await element.getAttribute('aria-label')
});
```

## Common Patterns

### Forms

```typescript
// Label-based
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('secret');
await page.getByRole('button', { name: 'Login' }).click();

// Or role-based for inputs
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
```

### Tables

```typescript
// Get specific row
const row = page.getByRole('row', { name: 'John Doe' });

// Get cell within row
const email = row.getByRole('cell', { name: /.*@.*/ });

// Click action button in row
await row.getByRole('button', { name: 'Edit' }).click();
```

### Lists

```typescript
// Get list item
const item = page.getByRole('listitem').filter({ hasText: 'Product A' });

// Click button within item
await item.getByRole('button', { name: 'Add to cart' }).click();
```

### Dialogs/Modals

```typescript
// Target specific dialog
const dialog = page.getByRole('dialog', { name: 'Confirm action' });

// Interact within dialog
await dialog.getByRole('button', { name: 'Confirm' }).click();
```

### Navigation

```typescript
// Main navigation
const nav = page.getByRole('navigation');
await nav.getByRole('link', { name: 'Products' }).click();

// Breadcrumbs
await page.getByRole('navigation', { name: 'Breadcrumb' })
  .getByRole('link', { name: 'Home' }).click();
```

## Selector Anti-Patterns

Avoid these brittle selectors:

```typescript
// ❌ Position-based
page.locator('div:nth-child(3) > button')

// ❌ Class-only (unless stable)
page.locator('.MuiButton-root-4729')

// ❌ Complex XPath
page.locator('//div[@class="container"]/div[2]/form/button[1]')

// ❌ Generated IDs
page.locator('#component-1847392')

// ❌ Presentation-tied
page.locator('.red-button.large.rounded')

// ✅ Instead, use:
page.getByRole('button', { name: 'Submit' })
page.getByTestId('submit-button')
```

## Summary

**Selector Priority:**
1. `getByRole()` - Most resilient
2. `getByLabel()` - For form controls
3. `getByText()` - For content
4. `getByTestId()` - Explicit hooks
5. CSS/XPath - Last resort

**Key Principles:**
- Reflect user perception
- Avoid implementation details
- Use accessibility attributes
- Test selector stability
- Combine and filter as needed
