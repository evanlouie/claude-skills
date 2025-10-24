# FastHTML Core: App, Routing, and Responses

## FastHTML App

### Creating an App

```python
from fasthtml.common import *

app = FastHTML(
    debug=False,           # Enable debug mode
    routes=[],            # List of routes
    middleware=[],        # Starlette middleware
    exception_handlers={},  # Exception handler dict
    hdrs=[],              # Headers to include in HTML responses
    ftrs=[],              # Footer elements
    before=None,          # Beforeware object or function
    after=None,           # Function to run after route handler
    pico=True,            # Include PicoCSS
    htmx=True,            # Include HTMX
    surreal=False,        # Include SurrealJS
    default_hdrs=True,    # Include default headers
    secret_key=None,      # Session secret key (auto-generated if None)
    session_cookie='session',  # Cookie name for sessions
    htmlkw={},            # kwargs for HTML tag
    bodykw={}             # kwargs for Body tag
)

# Shortcut for creating app and route decorator
app, rt = fast_app()
```

### Fast App Helper

```python
def fast_app(
    db_file=None,         # SQLite database file
    render=None,          # Custom render function
    hdrs=[],             # Additional headers
    ftrs=[],             # Additional footers
    tbls=None,           # Database tables to create
    before=None,         # Beforeware
    middleware=[],       # Middleware list
    live=False,          # Enable live reload
    debug=False,         # Debug mode
    routes=[],           # Routes list
    exception_handlers={}, # Exception handlers
    on_startup=[],       # Startup handlers
    on_shutdown=[],      # Shutdown handlers
    pico=True,          # Include PicoCSS
    surreal=False,      # Include SurrealJS
    htmx=True,          # Include HTMX
    secret_key=None,    # Session secret
    **kwargs
)
```

## Routing

### Basic Route

```python
@rt('/')  # Path defaults to function name if not provided
def index():
    return Div("Hello World")

@rt('/user/{name}')  # Path parameters
def user(name: str):
    return Div(f"Hello {name}")
```

### HTTP Methods

```python
# GET and POST by default
@rt
def mypage():
    return Div("Content")

# Specify methods explicitly
@rt('/api/data', methods=['GET', 'POST'])
def api_data():
    return {"status": "ok"}
```

### Route with Type Annotations

```python
# Query parameters via type hints
@rt
def search(q: str, limit: int = 10):
    return Div(f"Searching for: {q}, limit: {limit}")
    
# Path parameters
@rt('/post/{id}')
def post(id: int):
    return Div(f"Post {id}")
    
# Form data auto-parsed to dataclass
@dataclass
class LoginForm:
    username: str
    password: str

@rt
def login(form: LoginForm):
    return Div(f"Login: {form.username}")
```

### Special Parameters

Route handlers can request these special parameters:

- `request` (or `req`, `requ`, etc.) - Starlette request object
- `session` (or `sess`, etc.) - Starlette session dict
- `auth` - Value from `request.scope['auth']`
- `htmx` - HTMX headers if present
- `app` - The FastHTML app object

```python
@rt
def profile(request, session, auth):
    user = session.get('user')
    ip = request.client.host
    return Div(f"User: {auth}")
```

## APIRouter

Organize routes across multiple files:

```python
# products.py
from fasthtml.common import *

ar = APIRouter(prefix='/products')

@ar
def list():
    return Div("Product list")

@ar('/{id}')
def detail(id: int):
    return Div(f"Product {id}")
```

```python
# main.py
from fasthtml.common import *
from products import ar

app, rt = fast_app()
ar.to_app(app)  # Add APIRouter routes to app
```

## Response Types

Routes can return:

1. **FT Objects** - Automatically rendered to HTML
2. **Tuples of FT Objects** - Concatenated into HTML
3. **Strings** - Returned as plain text
4. **Dicts/Lists** - Returned as JSON
5. **Starlette Responses** - Used directly

```python
# FT objects
@rt
def index():
    return Div("Hello")

# Tuple (multiple FT objects)
@rt
def page():
    return Title("My Page"), H1("Welcome"), P("Content")

# Plain text
@rt
def text():
    return "Plain text response"

# JSON
@rt
def api():
    return {"status": "ok", "data": [1, 2, 3]}

# Custom response
from starlette.responses import Response

@rt
def custom():
    return Response("Custom", media_type="text/plain")
```

## Special Response Helpers

### Redirect

```python
from fasthtml.common import *

@rt
def old_page():
    return RedirectResponse('/new-page', status_code=303)
    
# Or use Redirect helper (uses HTMX client-side redirect if available)
@rt  
def old_page2():
    return Redirect('/new-page')
```

### HTMX Response Headers

```python
@rt
def trigger_event():
    return Div("Content"), HtmxResponseHeaders(
        trigger="myEvent",
        location="/new-path"
    )
```

### File Response

```python
@rt("/{fname:path}.{ext:static}")
async def static_file(fname: str, ext: str):
    return FileResponse(f'public/{fname}.{ext}')
```

## Serving the App

```python
# Development server with live reload
serve()

# Production (use uvicorn directly)
# uvicorn main:app --host 0.0.0.0 --port 8000
```

## Beforeware

Run functions before route handlers:

```python
def auth_check(req, sess):
    auth = req.scope['auth'] = sess.get('auth', None)
    if not auth:
        return RedirectResponse('/login', status_code=303)

bware = Beforeware(
    auth_check,
    skip=[r'/login', r'/static/.*', r'.*\.css']  # Regex patterns to skip
)

app = FastHTML(before=bware)
```

## WebSockets

```python
app = FastHTML(exts='ws')

@app.ws('/ws', conn=on_connect, disconn=on_disconnect)
async def ws(msg: str, send):
    await send(Div(f"Echo: {msg}"))
    return Div("Response")

async def on_connect(send):
    await send(Div("Connected!"))

async def on_disconnect():
    print("Disconnected")
```
