# Starlette Features for FastHTML

FastHTML inherits from Starlette, giving you access to its features.

## Request Object

Access via the `request` (or `req`) parameter:

```python
@rt
def handler(request):
    # URL information
    url = str(request.url)
    scheme = request.url.scheme  # http, https
    host = request.url.netloc    # example.com:8080
    path = request.url.path      # /search
    query = request.url.query    # kw=hello
    
    # Client information
    client_ip = request.client.host
    client_port = request.client.port
    
    # HTTP method
    method = request.method  # GET, POST, etc.
    
    # Headers
    headers = request.headers
    user_agent = request.headers.get('user-agent')
    host = request.headers['host']
    
    return Div(f"Request from {client_ip}")
```

## Request Headers

```python
@rt
def headers(request):
    all_headers = dict(request.headers)
    
    # Common headers
    user_agent = request.headers.get('user-agent')
    accept = request.headers.get('accept')
    cookie = request.headers.get('cookie')
    
    return Pre(str(all_headers))
```

## Request Body & Data

```python
# Get raw body
@rt
async def raw(request):
    body = await request.body()
    return Response(f"Received {len(body)} bytes")

# Get JSON
@rt  
async def api(request):
    data = await request.json()
    return {"received": data}

# Get form data (FastHTML handles this automatically with type hints)
@rt
async def manual_form(request):
    form = await request.form()
    username = form.get('username')
    return Div(f"Hello {username}")
```

## Request Scope

The scope dict contains all request metadata:

```python
@rt
def scope_info(request):
    scope = request.scope
    
    # Type: 'http' or 'websocket'
    req_type = scope['type']
    
    # HTTP version
    http_ver = scope['http_version']
    
    # Server and client addresses
    server = scope['server']  # ('127.0.0.1', 8000)
    client = scope['client']  # ('127.0.0.1', 54321)
    
    # Request details
    method = scope['method']
    path = scope['path']
    query_string = scope['query_string']  # bytes
    
    # App references
    app = scope['app']
    
    # Custom data (e.g., auth)
    auth = scope.get('auth')
    
    return Div("Scope info")
```

## State Storage

Store data in request or app scope:

```python
# App-level state (available to all requests)
app.state.db_connection = get_db()
app.state.config = load_config()

@rt
def handler(request):
    # Access app state
    db = request.app.state.db_connection
    
    # Request-level state
    request.state.start_time = time.time()
    request.state.user_id = 123
    
    return Div("OK")
```

## State Helper

Wrap dicts to use dot notation:

```python
from starlette.datastructures import State

config = State({
    "api_key": "secret",
    "max_retries": 3
})

# Access with dots instead of brackets
key = config.api_key
retries = config.max_retries
```

## Custom Responses

Return any Starlette response:

```python
from starlette.responses import (
    Response,
    HTMLResponse,
    PlainTextResponse,
    JSONResponse,
    RedirectResponse,
    StreamingResponse,
    FileResponse
)

@rt
def plain_text():
    return PlainTextResponse("Plain text")

@rt
def json_data():
    return JSONResponse({"status": "ok"})

@rt
def custom():
    return Response(
        content="Custom response",
        status_code=201,
        headers={"X-Custom": "Header"},
        media_type="text/plain"
    )

@rt
def redirect():
    return RedirectResponse(
        url="/new-location",
        status_code=303  # 301, 302, 303, 307
    )

@rt
def download():
    return FileResponse(
        path="files/document.pdf",
        filename="download.pdf",
        media_type="application/pdf"
    )
```

## Streaming Responses

```python
async def generate_data():
    for i in range(10):
        yield f"data: {i}\n\n"
        await asyncio.sleep(1)

@rt
async def stream():
    return StreamingResponse(
        generate_data(),
        media_type="text/event-stream"
    )
```

## File Uploads

```python
from starlette.datastructures import UploadFile

@rt
async def upload(file: UploadFile):
    # File properties
    filename = file.filename
    content_type = file.content_type
    
    # Read content
    contents = await file.read()
    
    # Or save directly
    with open(f"uploads/{filename}", "wb") as f:
        f.write(contents)
    
    return Div(f"Uploaded {filename} ({len(contents)} bytes)")

# Multiple files
@rt
async def multi_upload(files: list[UploadFile]):
    saved = []
    for file in files:
        content = await file.read()
        # Save each file
        saved.append(file.filename)
    return Div(f"Uploaded: {', '.join(saved)}")
```

## Background Tasks

```python
from starlette.background import BackgroundTask, BackgroundTasks

@rt
def with_bg_task():
    def cleanup():
        print("Cleaning up...")
    
    task = BackgroundTask(cleanup)
    return Response("Done", background=task)

@rt
def multiple_bg_tasks():
    tasks = BackgroundTasks()
    tasks.add_task(log_event, "action_completed")
    tasks.add_task(send_email, "admin@example.com")
    
    return Response("Processing", background=tasks)
```

## Lifespan Events

Run code on app startup/shutdown:

```python
async def startup():
    print("App starting...")
    app.state.db = await connect_db()

async def shutdown():
    print("App shutting down...")
    await app.state.db.close()

app = FastHTML(
    on_startup=[startup],
    on_shutdown=[shutdown]
)

# Or use lifespan context manager
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    # Startup
    app.state.db = await connect_db()
    yield
    # Shutdown
    await app.state.db.close()

app = FastHTML(lifespan=lifespan)
```

## Exception Handling

```python
from starlette.exceptions import HTTPException

@rt
def may_fail():
    if not authorized:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    if not found:
        raise HTTPException(status_code=404, detail="Not found")
    
    return Div("Success")

# Custom exception handler
async def http_exception_handler(request, exc):
    return PlainTextResponse(
        str(exc.detail),
        status_code=exc.status_code
    )

app = FastHTML(
    exception_handlers={
        HTTPException: http_exception_handler
    }
)
```
