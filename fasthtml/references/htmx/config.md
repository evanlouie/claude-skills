# HTMX Configuration Options

Configuration options can be set programmatically via `htmx.config` or declaratively using a meta tag:

```html
<meta name="htmx-config" content='{"defaultSwapStyle":"outerHTML"}'>
```

## Core Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.defaultSwapStyle` | `innerHTML` | Default swap style |
| `htmx.config.defaultSwapDelay` | 0 | Default swap delay in ms |
| `htmx.config.defaultSettleDelay` | 20 | Default settle delay in ms |
| `htmx.config.timeout` | 0 | Request timeout in ms (0 = no timeout) |

## History Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.historyEnabled` | `true` | Enable/disable history |
| `htmx.config.historyCacheSize` | 10 | Number of pages to cache |
| `htmx.config.refreshOnHistoryMiss` | `false` | If true, full page refresh on history cache miss instead of AJAX |
| `htmx.config.historyRestoreAsHxRequest` | `true` | Whether to treat history cache miss reload as "HX-Request" |

## Styling Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.includeIndicatorStyles` | `true` | Whether to load indicator styles |
| `htmx.config.indicatorClass` | `htmx-indicator` | CSS class for indicators |
| `htmx.config.requestClass` | `htmx-request` | CSS class applied during requests |
| `htmx.config.addedClass` | `htmx-added` | CSS class for newly added content |
| `htmx.config.settlingClass` | `htmx-settling` | CSS class during settling phase |
| `htmx.config.swappingClass` | `htmx-swapping` | CSS class during swapping phase |
| `htmx.config.attributesToSettle` | `["class", "style", "width", "height"]` | Attributes to settle during settling phase |

## Scroll Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.scrollBehavior` | `instant` | Scroll behavior: `instant`, `smooth`, or `auto` |
| `htmx.config.defaultFocusScroll` | `false` | Whether to scroll focused element into view |
| `htmx.config.scrollIntoViewOnBoost` | `true` | Whether boosted element targets scroll into viewport |

## Security Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.allowEval` | `true` | Allow htmx's use of eval for certain features |
| `htmx.config.allowScriptTags` | `true` | Process script tags in new content |
| `htmx.config.inlineScriptNonce` | `''` | Nonce to add to inline scripts |
| `htmx.config.inlineStyleNonce` | `''` | Nonce to add to inline styles |
| `htmx.config.withCredentials` | `false` | Allow cross-site requests with credentials |
| `htmx.config.selfRequestsOnly` | `true` | Only allow AJAX requests to same domain |

## Processing Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.disableSelector` | `[hx-disable], [data-hx-disable]` | Elements matching this won't be processed |
| `htmx.config.disableInheritance` | `false` | If true, completely disable attribute inheritance |
| `htmx.config.ignoreTitle` | `false` | If true, don't update document title from responses |
| `htmx.config.allowNestedOobSwaps` | `true` | Whether to process OOB swaps in nested elements |

## WebSocket Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.wsReconnectDelay` | `full-jitter` | WebSocket reconnect delay strategy |
| `htmx.config.wsBinaryType` | `blob` | Type of binary data over WebSocket |

## Advanced Configuration

| Config Variable | Default | Description |
|----------------|---------|-------------|
| `htmx.config.getCacheBusterParam` | `false` | If true, append target element ID to GET requests |
| `htmx.config.globalViewTransitions` | `false` | Use View Transition API when swapping content |
| `htmx.config.methodsThatUseUrlParams` | `["get", "delete"]` | Methods that encode params in URL |
| `htmx.config.triggerSpecsCache` | `null` | Cache for evaluated trigger specifications |
| `htmx.config.responseHandling` | (see docs) | Default response handling for status codes |
