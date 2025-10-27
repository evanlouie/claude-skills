# Data Extraction

Patterns and techniques for extracting structured data from web pages using Playwright.

## Basic Text Extraction

### Single Element

```typescript
// Text content
const title = await page.getByRole('heading', { name: 'Dashboard' }).textContent();

// Inner text (rendered)
const text = await page.getByTestId('description').innerText();

// Input value
const email = await page.getByLabel('Email').inputValue();

// HTML
const html = await page.getByTestId('content').innerHTML();
```

### Multiple Elements

```typescript
// Get all text from matching elements
const items = await page.getByRole('listitem').allTextContents();
console.log('Items:', items);

// Alternative: iterate through elements
const itemLocators = await page.getByRole('listitem').all();
const itemTexts = await Promise.all(
  itemLocators.map(item => item.textContent())
);
```

### Attributes

```typescript
// Get attribute value
const href = await page.getByRole('link', { name: 'Docs' }).getAttribute('href');
const src = await page.getByAltText('Logo').getAttribute('src');
const ariaLabel = await page.getByRole('button').getAttribute('aria-label');

// Get multiple attributes
const link = page.getByRole('link').first();
const attributes = {
  href: await link.getAttribute('href'),
  title: await link.getAttribute('title'),
  target: await link.getAttribute('target')
};
```

## Table Extraction

### Simple Table

```typescript
// Get all rows
const rows = await page.getByRole('row').all();

// Extract table data
const tableData: string[][] = [];
for (const row of rows) {
  const cells = await row.getByRole('cell').allTextContents();
  tableData.push(cells);
}

console.log('Table data:', tableData);
```

### Table with Headers

```typescript
// Get headers
const headerCells = await page.getByRole('columnheader').all();
const headers = await Promise.all(
  headerCells.map(cell => cell.textContent())
);

// Get data rows (skip header row)
const rows = await page.getByRole('row').all();
const dataRows = rows.slice(1);  // Skip first row

const data = await Promise.all(
  dataRows.map(async row => {
    const cells = await row.getByRole('cell').allTextContents();
    return cells;
  })
);

// Combine into objects
const tableObjects = data.map(row => {
  const obj: Record<string, string> = {};
  headers.forEach((header, i) => {
    if (header) obj[header] = row[i];
  });
  return obj;
});

console.log('Structured data:', tableObjects);
```

### Complex Table with Filtering

```typescript
// Extract specific columns
const nameColumn = await page.getByRole('cell', { name: /^Name/ }).allTextContents();
const emailColumn = await page.getByRole('cell', { name: /@/ }).allTextContents();

// Find row by content and extract data
const userRow = page.getByRole('row').filter({ hasText: 'john@example.com' });
const userData = await userRow.getByRole('cell').allTextContents();
```

## List Extraction

### Simple Lists

```typescript
// Get all list items
const items = await page.getByRole('listitem').allTextContents();

// Or with structure
const listItems = await page.getByRole('listitem').all();
const structuredItems = await Promise.all(
  listItems.map(async item => ({
    text: await item.textContent(),
    link: await item.getByRole('link').getAttribute('href').catch(() => null)
  }))
);
```

### Nested Lists

```typescript
// Get parent items
const parentItems = await page.locator('ul > li').all();

const nestedData = await Promise.all(
  parentItems.map(async parent => {
    const title = await parent.locator('> span').textContent();
    const subItems = await parent.locator('ul > li').allTextContents();
    return { title, subItems };
  })
);
```

## Form Data Extraction

### Extract Form Values

```typescript
// Get all form field values
const formData = {
  firstName: await page.getByLabel('First name').inputValue(),
  lastName: await page.getByLabel('Last name').inputValue(),
  email: await page.getByLabel('Email').inputValue(),
  country: await page.getByLabel('Country').inputValue(),
  agreeToTerms: await page.getByLabel('I agree').isChecked()
};

console.log('Form data:', formData);
```

### Extract Select Options

```typescript
// Get all options in a select
const options = await page.getByLabel('Country').locator('option').all();
const optionValues = await Promise.all(
  options.map(async opt => ({
    value: await opt.getAttribute('value'),
    text: await opt.textContent()
  }))
);
```

### Extract Checkbox States

```typescript
// Get all checkboxes with their states
const checkboxes = await page.getByRole('checkbox').all();
const checkboxStates = await Promise.all(
  checkboxes.map(async cb => ({
    label: await cb.getAttribute('aria-label'),
    checked: await cb.isChecked()
  }))
);
```

## Structured Data from JavaScript

### Extract JSON from Page

```typescript
// Extract data from JavaScript variable
const data = await page.evaluate(() => {
  // @ts-ignore
  return window.__INITIAL_STATE__;
});
console.log('Hydration data:', data);

// Extract from script tag
const jsonData = await page.evaluate(() => {
  const script = document.querySelector('script[type="application/json"]');
  return script ? JSON.parse(script.textContent || '{}') : null;
});
```

### Extract from Local Storage

```typescript
const storage = await page.evaluate(() => {
  const data: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      try {
        data[key] = JSON.parse(value || '');
      } catch {
        data[key] = value;
      }
    }
  }
  return data;
});
```

### Extract Application State

```typescript
// Redux store
const reduxState = await page.evaluate(() => {
  // @ts-ignore
  const store = window.__REDUX_DEVTOOLS_EXTENSION__?.store;
  return store?.getState();
});

// Vuex store
const vuexState = await page.evaluate(() => {
  // @ts-ignore
  return window.$store?.state;
});

// Angular services
const angularData = await page.evaluate(() => {
  // @ts-ignore
  const element = document.querySelector('[ng-version]');
  // @ts-ignore
  const component = ng?.probe(element)?.componentInstance;
  return component?.data;
});
```

## Pagination Patterns

### Extract Data Across Pages

```typescript
async function extractPaginatedData(page: Page) {
  const allData: any[] = [];
  let hasNextPage = true;

  while (hasNextPage) {
    // Extract current page data
    const pageData = await page.getByRole('listitem').all();
    const items = await Promise.all(
      pageData.map(item => item.textContent())
    );
    allData.push(...items);

    // Check for next button
    const nextButton = page.getByRole('button', { name: 'Next' });
    hasNextPage = await nextButton.isEnabled();

    if (hasNextPage) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }
  }

  return allData;
}

const data = await extractPaginatedData(page);
console.log(`Extracted ${data.length} items`);
```

### Pagination with URL Parameters

```typescript
async function extractFromPages(page: Page, baseUrl: string, maxPages: number) {
  const allData: any[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    await page.goto(`${baseUrl}?page=${pageNum}`);
    await page.waitForLoadState('networkidle');

    const items = await page.getByRole('listitem').allTextContents();
    allData.push(...items);

    // Stop if no items
    if (items.length === 0) break;
  }

  return allData;
}
```

## Infinite Scroll Extraction

```typescript
async function extractInfiniteScroll(page: Page, maxScrolls = 10) {
  const allItems: string[] = [];
  let previousHeight = 0;
  let scrollCount = 0;

  while (scrollCount < maxScrolls) {
    // Extract current items
    const items = await page.getByRole('listitem').allTextContents();
    allItems.push(...items);

    // Scroll to bottom
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) break;

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);  // Wait for content to load

    previousHeight = currentHeight;
    scrollCount++;
  }

  // Remove duplicates
  return [...new Set(allItems)];
}
```

## Dynamic Content Extraction

### Wait for Content to Load

```typescript
// Wait for specific element
await page.getByText('Content loaded').waitFor();

// Wait for minimum item count
await expect(page.getByRole('listitem')).toHaveCount(10);

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Then extract
const data = await page.getByRole('listitem').allTextContents();
```

### Extract After Action

```typescript
// Click to load more
await page.getByRole('button', { name: 'Load more' }).click();
await page.waitForLoadState('networkidle');

// Extract new content
const items = await page.getByRole('listitem').allTextContents();
```

## API Response Extraction

### Intercept and Extract API Data

```typescript
// Listen for API response
const dataPromise = page.waitForResponse(
  response => response.url().includes('/api/users') && response.ok()
);

// Trigger request
await page.getByRole('button', { name: 'Load users' }).click();

// Get response data
const response = await dataPromise;
const users = await response.json();
console.log('API data:', users);
```

### Extract Multiple API Calls

```typescript
const apiData: Record<string, any> = {};

page.on('response', async response => {
  const url = response.url();
  if (url.includes('/api/')) {
    const endpoint = url.split('/api/')[1];
    try {
      apiData[endpoint] = await response.json();
    } catch {
      // Not JSON
    }
  }
});

await page.goto('http://localhost:3000/dashboard');
await page.waitForLoadState('networkidle');

console.log('All API data:', apiData);
```

## Accessibility Tree Extraction

```typescript
// Get accessibility snapshot
const snapshot = await page.locator('body').ariaSnapshot();
console.log('Accessibility tree:', snapshot);

// Extract specific component
const formSnapshot = await page.getByRole('form').ariaSnapshot();

// Parse accessibility information
const accessibilityInfo = await page.evaluate(() => {
  const elements = document.querySelectorAll('[role]');
  return Array.from(elements).map(el => ({
    role: el.getAttribute('role'),
    label: el.getAttribute('aria-label'),
    description: el.getAttribute('aria-description'),
    expanded: el.getAttribute('aria-expanded')
  }));
});
```

## Image and Media Extraction

### Extract Image URLs

```typescript
// Get all image sources
const images = await page.locator('img').all();
const imageSrcs = await Promise.all(
  images.map(img => img.getAttribute('src'))
);

// Get images with metadata
const imageData = await Promise.all(
  images.map(async img => ({
    src: await img.getAttribute('src'),
    alt: await img.getAttribute('alt'),
    width: await img.getAttribute('width'),
    height: await img.getAttribute('height')
  }))
);
```

### Extract Video Sources

```typescript
const videos = await page.locator('video').all();
const videoData = await Promise.all(
  videos.map(async video => ({
    src: await video.getAttribute('src'),
    poster: await video.getAttribute('poster'),
    sources: await video.locator('source').all().then(sources =>
      Promise.all(sources.map(s => s.getAttribute('src')))
    )
  }))
);
```

## Link Extraction

```typescript
// Get all links
const links = await page.getByRole('link').all();
const linkData = await Promise.all(
  links.map(async link => ({
    text: await link.textContent(),
    href: await link.getAttribute('href'),
    target: await link.getAttribute('target')
  }))
);

// Filter external links
const externalLinks = linkData.filter(link =>
  link.href?.startsWith('http') && !link.href.includes(page.url())
);
```

## Metadata Extraction

```typescript
// Extract page metadata
const metadata = await page.evaluate(() => {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href')
  };
});
```

## Complex Extraction Patterns

### Product Listing

```typescript
async function extractProducts(page: Page) {
  const productCards = await page.getByTestId('product-card').all();

  return await Promise.all(
    productCards.map(async card => ({
      name: await card.getByRole('heading').textContent(),
      price: await card.getByTestId('price').textContent(),
      image: await card.locator('img').getAttribute('src'),
      rating: await card.getByTestId('rating').getAttribute('aria-label'),
      link: await card.getByRole('link').getAttribute('href'),
      inStock: await card.getByText('In stock').count() > 0
    }))
  );
}

const products = await extractProducts(page);
console.log(`Extracted ${products.length} products`);
```

### User Profile Data

```typescript
async function extractProfile(page: Page) {
  return {
    name: await page.getByTestId('profile-name').textContent(),
    bio: await page.getByTestId('bio').textContent(),
    avatar: await page.getByTestId('avatar').getAttribute('src'),
    stats: {
      followers: await page.getByTestId('followers-count').textContent(),
      following: await page.getByTestId('following-count').textContent(),
      posts: await page.getByTestId('posts-count').textContent()
    },
    socialLinks: await Promise.all(
      (await page.getByTestId('social-links').getByRole('link').all())
        .map(async link => ({
          platform: await link.getAttribute('aria-label'),
          url: await link.getAttribute('href')
        }))
    )
  };
}
```

### Article Content

```typescript
async function extractArticle(page: Page) {
  return {
    title: await page.getByRole('heading', { level: 1 }).textContent(),
    author: await page.getByTestId('author-name').textContent(),
    publishDate: await page.getByTestId('publish-date').textContent(),
    content: await page.getByRole('article').innerText(),
    tags: await page.getByTestId('tag').allTextContents(),
    images: await Promise.all(
      (await page.locator('article img').all())
        .map(img => img.getAttribute('src'))
    ),
    comments: await page.getByTestId('comment').count()
  };
}
```

## Performance Optimization

### Parallel Extraction

```typescript
// Extract multiple data types in parallel
const [products, categories, metadata] = await Promise.all([
  page.getByTestId('product').allTextContents(),
  page.getByTestId('category').allTextContents(),
  page.evaluate(() => ({
    title: document.title,
    url: window.location.href
  }))
]);
```

### Batch Processing

```typescript
// Process items in batches
async function extractInBatches<T>(
  items: Locator[],
  batchSize: number,
  extractor: (item: Locator) => Promise<T>
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(extractor));
    results.push(...batchResults);
  }

  return results;
}

const items = await page.getByRole('listitem').all();
const data = await extractInBatches(items, 10, async item => ({
  text: await item.textContent(),
  link: await item.getByRole('link').getAttribute('href')
}));
```

## Error Handling

```typescript
async function safeExtract<T>(
  extractor: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await extractor();
  } catch (error) {
    console.error('Extraction failed:', error);
    return fallback;
  }
}

// Usage
const data = {
  title: await safeExtract(
    () => page.getByRole('heading').textContent(),
    'No title'
  ),
  price: await safeExtract(
    () => page.getByTestId('price').textContent(),
    'N/A'
  )
};
```

## Summary

**Common extraction patterns:**
- Text: `textContent()`, `innerText()`, `allTextContents()`
- Attributes: `getAttribute()`
- Forms: `inputValue()`, `isChecked()`
- Tables: Iterate through rows and cells
- Lists: `all()` + map/filter
- JavaScript: `evaluate()` for page variables
- API: `waitForResponse()` to intercept data
- Pagination: Loop through pages or scroll
- Complex: Combine multiple extraction methods

**Best practices:**
- Wait for content to load before extraction
- Handle missing elements with try-catch or count checks
- Extract in parallel when possible
- Use structured data extraction for complex content
- Consider pagination and infinite scroll
- Validate extracted data
