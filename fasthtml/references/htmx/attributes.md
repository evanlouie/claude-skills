# HTMX Attributes Reference

## Core Attributes

The most commonly used HTMX attributes:

| Attribute | Description |
|-----------|-------------|
| `hx-get` | Issues a `GET` to the specified URL |
| `hx-post` | Issues a `POST` to the specified URL |
| `hx-on*` | Handle events with inline scripts on elements |
| `hx-push-url` | Push a URL into the browser location bar to create history |
| `hx-select` | Select content to swap in from a response |
| `hx-select-oob` | Select content to swap in from a response, somewhere other than the target (out of band) |
| `hx-swap` | Controls how content will swap in (`outerHTML`, `beforeend`, `afterend`, ...) |
| `hx-swap-oob` | Mark element to swap in from a response (out of band) |
| `hx-target` | Specifies the target element to be swapped |
| `hx-trigger` | Specifies the event that triggers the request |
| `hx-vals` | Add values to submit with the request (JSON format) |

## Additional Attributes

All other attributes available in HTMX:

| Attribute | Description |
|-----------|-------------|
| `hx-boost` | Add progressive enhancement for links and forms |
| `hx-confirm` | Shows a `confirm()` dialog before issuing a request |
| `hx-delete` | Issues a `DELETE` to the specified URL |
| `hx-disable` | Disables htmx processing for the given node and any children nodes |
| `hx-disabled-elt` | Adds the `disabled` attribute to the specified elements while a request is in flight |
| `hx-disinherit` | Control and disable automatic attribute inheritance for child nodes |
| `hx-encoding` | Changes the request encoding type |
| `hx-ext` | Extensions to use for this element |
| `hx-headers` | Adds to the headers that will be submitted with the request |
| `hx-history` | Prevent sensitive data being saved to the history cache |
| `hx-history-elt` | The element to snapshot and restore during history navigation |
| `hx-include` | Include additional data in requests |
| `hx-indicator` | The element to put the `htmx-request` class on during the request |
| `hx-inherit` | Control and enable automatic attribute inheritance for child nodes if disabled by default |
| `hx-params` | Filters the parameters that will be submitted with a request |
| `hx-patch` | Issues a `PATCH` to the specified URL |
| `hx-preserve` | Specifies elements to keep unchanged between requests |
| `hx-prompt` | Shows a `prompt()` before submitting a request |
| `hx-put` | Issues a `PUT` to the specified URL |
| `hx-replace-url` | Replace the URL in the browser location bar |
| `hx-request` | Configures various aspects of the request |
| `hx-sync` | Control how requests made by different elements are synchronized |
| `hx-validate` | Force elements to validate themselves before a request |
| `hx-vars` | Adds values dynamically to the parameters (deprecated, use `hx-vals`) |

## CSS Classes

HTMX provides these CSS classes for styling:

| Class | Description |
|-------|-------------|
| `htmx-added` | Applied to new content before swap, removed after settled |
| `htmx-indicator` | Dynamically toggles visible (opacity:1) when `htmx-request` is present |
| `htmx-request` | Applied to element or `hx-indicator` element during request |
| `htmx-settling` | Applied to target after content swap, removed after settled |
| `htmx-swapping` | Applied to target before content swap, removed after swap |

Duration for `htmx-settling` and `htmx-swapping` can be modified via `hx-swap`.
