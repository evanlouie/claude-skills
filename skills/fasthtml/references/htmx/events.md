# HTMX Events Reference

All HTMX events that can be listened to or triggered.

## Lifecycle Events

| Event | Description |
|-------|-------------|
| `htmx:beforeRequest` | Triggered before an AJAX request is made |
| `htmx:beforeSend` | Triggered just before an ajax request is sent |
| `htmx:beforeSwap` | Triggered before a swap is done, allows you to configure the swap |
| `htmx:beforeOnLoad` | Triggered before any response processing occurs |
| `htmx:afterSwap` | Triggered after new content has been swapped in |
| `htmx:afterSettle` | Triggered after the DOM has settled |
| `htmx:afterRequest` | Triggered after an AJAX request has completed |
| `htmx:afterOnLoad` | Triggered after an AJAX request has completed processing a successful response |

## Request Events

| Event | Description |
|-------|-------------|
| `htmx:configRequest` | Triggered before the request, allows you to customize parameters, headers |
| `htmx:xhr:loadstart` | Triggered when an ajax request starts |
| `htmx:xhr:progress` | Triggered periodically during an ajax request that supports progress events |
| `htmx:xhr:loadend` | Triggered when an ajax request ends |
| `htmx:xhr:abort` | Triggered when an ajax request aborts |

## Swap Events

| Event | Description |
|-------|-------------|
| `htmx:beforeTransition` | Triggered before the View Transition wrapped swap occurs |
| `htmx:oobBeforeSwap` | Triggered before an out of band element swap is done |
| `htmx:oobAfterSwap` | Triggered after an out of band element has been swapped in |

## History Events

| Event | Description |
|-------|-------------|
| `htmx:beforeHistorySave` | Triggered before content is saved to the history cache |
| `htmx:historyRestore` | Triggered when htmx handles a history restoration action |
| `htmx:historyCacheHit` | Triggered on a cache hit in the history subsystem |
| `htmx:historyCacheMiss` | Triggered on a cache miss in the history subsystem |
| `htmx:historyCacheMissLoad` | Triggered on a successful remote retrieval |
| `htmx:historyCacheMissLoadError` | Triggered on an unsuccessful remote retrieval |
| `htmx:historyCacheError` | Triggered on an error during cache writing |
| `htmx:pushedIntoHistory` | Triggered after a url is pushed into history |
| `htmx:replacedInHistory` | Triggered after a url is replaced in history |

## Error Events

| Event | Description |
|-------|-------------|
| `htmx:responseError` | Triggered when an HTTP response error (non-200/300 code) occurs |
| `htmx:sendError` | Triggered when a network error prevents an HTTP request from happening |
| `htmx:sendAbort` | Triggered when a request is aborted |
| `htmx:swapError` | Triggered when an error occurs during the swap phase |
| `htmx:onLoadError` | Triggered when an exception occurs during onLoad handling |
| `htmx:targetError` | Triggered when an invalid target is specified |
| `htmx:timeout` | Triggered when a request timeout occurs |

## Validation Events

| Event | Description |
|-------|-------------|
| `htmx:validation:validate` | Triggered before an element is validated |
| `htmx:validation:failed` | Triggered when an element fails validation |
| `htmx:validation:halted` | Triggered when a request is halted due to validation errors |

## User Interaction Events

| Event | Description |
|-------|-------------|
| `htmx:confirm` | Triggered after a trigger occurs, allows you to cancel (or delay) issuing the AJAX request |
| `htmx:prompt` | Triggered after a prompt is shown |
| `htmx:abort` | Send this event to an element to abort a request |

## Processing Events

| Event | Description |
|-------|-------------|
| `htmx:beforeProcessNode` | Triggered before htmx initializes a node |
| `htmx:afterProcessNode` | Triggered after htmx has initialized a node |
| `htmx:beforeCleanupElement` | Triggered before htmx disables an element or removes it from the DOM |
| `htmx:load` | Triggered when new content is added to the DOM |

## Extension Events

| Event | Description |
|-------|-------------|
| `htmx:noSSESourceError` | Triggered when an element refers to a SSE event but no parent SSE source exists |
| `htmx:sseError` | Triggered when an error occurs with a SSE source |
| `htmx:sseOpen` | Triggered when a SSE source is opened |

## OOB Errors

| Event | Description |
|-------|-------------|
| `htmx:oobErrorNoTarget` | Triggered when an out of band element does not have a matching ID in the current DOM |
