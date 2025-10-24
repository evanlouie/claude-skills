# HTMX Headers & JavaScript API

## Request Headers

Headers sent by HTMX in requests:

| Header | Description |
|--------|-------------|
| `HX-Boosted` | Indicates that the request is via an element using `hx-boost` |
| `HX-Current-URL` | The current URL of the browser |
| `HX-History-Restore-Request` | "true" if the request is for history restoration after a miss in the local history cache |
| `HX-Prompt` | The user response to an `hx-prompt` |
| `HX-Request` | Always "true" |
| `HX-Target` | The `id` of the target element if it exists |
| `HX-Trigger-Name` | The `name` of the triggered element if it exists |
| `HX-Trigger` | The `id` of the triggered element if it exists |

## Response Headers

Headers you can set in responses to control HTMX behavior:

| Header | Description |
|--------|-------------|
| `HX-Location` | Allows client-side redirect without full page reload |
| `HX-Push-Url` | Pushes a new url into the history stack |
| `HX-Redirect` | Client-side redirect to a new location |
| `HX-Refresh` | If set to "true" the client will do a full refresh of the page |
| `HX-Replace-Url` | Replaces the current URL in the location bar |
| `HX-Reswap` | Specifies how the response will be swapped (see `hx-swap` for values) |
| `HX-Retarget` | CSS selector that updates the target of the content update |
| `HX-Reselect` | CSS selector to choose which part of response is used for swap |
| `HX-Trigger` | Trigger client-side events |
| `HX-Trigger-After-Settle` | Trigger client-side events after the settle step |
| `HX-Trigger-After-Swap` | Trigger client-side events after the swap step |

## JavaScript API

Core methods available via `htmx` object:

### DOM Manipulation
- `htmx.addClass(element, class)` - Adds a class to the given element
- `htmx.removeClass(element, class)` - Removes a class from the given element
- `htmx.toggleClass(element, class)` - Toggles a class on the given element
- `htmx.takeClass(element, class)` - Takes a class from other elements for the given element
- `htmx.find(selector)` - Finds a single element matching the selector
- `htmx.findAll(elt, selector)` - Finds all elements matching a given selector
- `htmx.closest(element, selector)` - Finds the closest parent matching the selector
- `htmx.remove(element)` - Removes the given element

### Events
- `htmx.on(target, eventName, handler)` - Creates an event listener, returning it
- `htmx.off(target, eventName, handler)` - Removes an event listener
- `htmx.trigger(element, eventName, detail)` - Triggers an event on an element
- `htmx.onLoad(callback)` - Adds a callback handler for the `htmx:load` event

### AJAX & Processing
- `htmx.ajax(method, url, options)` - Issues an htmx-style ajax request
- `htmx.process(element)` - Processes the given element and its children, hooking up any htmx behavior
- `htmx.swap(target, content, options)` - Performs swapping (and settling) of HTML content
- `htmx.values(element, requestType)` - Returns the input values associated with the given element

### Configuration
- `htmx.config` - A property that holds the current htmx config object
- `htmx.logAll()` - Installs a logger that will log all htmx events
- `htmx.logger` - A property set to the current logger (default is `null`)
- `htmx.parseInterval(interval)` - Parses an interval declaration into a millisecond value

### Extensions
- `htmx.defineExtension(name, extension)` - Defines an htmx extension
- `htmx.removeExtension(name)` - Removes an htmx extension
- `htmx.createEventSource` - Property holding the function to create SSE EventSource objects
- `htmx.createWebSocket` - Property holding the function to create WebSocket objects
