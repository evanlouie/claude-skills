---
name: fasthtml
description: Create Python web applications with FastHTML, a library for building server-rendered hypermedia applications using HTMX, Starlette, and Python FastTags. Use this skill when building web apps, APIs with HTML responses, CRUD applications, real-time features with websockets/SSE, or any server-rendered Python web application.
---

# FastHTML Web Development

## Overview

FastHTML is a Python library for creating server-rendered hypermedia applications. It combines:
- **Starlette** - ASGI web framework
- **HTMX** - Hypermedia-driven interactions
- **FastTags (FT)** - Python functions that generate HTML
- **Uvicorn** - ASGI server

FastHTML is NOT FastAPI - it's designed for HTML-first applications, not API services.

## When to Use This Skill

- Building server-rendered web applications
- Creating CRUD applications
- Real-time features (websockets, SSE)
- Forms and data validation
- Authentication and sessions
- Database-backed applications

## Core Concepts

### 1. FastTags (FT)

HTML elements as Python functions:

```python
# Positional args = children, keyword args = attributes
Div("Hello", cls="container")  # <div class="container">Hello</div>

# Nested elements
Form(
    Input(name="email", type="email"),
    Button("Submit")
)
```

### 2. Routes

Functions become route handlers:

```python
@rt('/')  # or @rt - path defaults to function name
def index():
    return Div("Home")

@rt('/user/{id}')
def user(id: int):  # Type hints parse path params
    return Div(f"User {id}")
```

### 3. HTMX Integration

HTMX attributes work seamlessly with FT:

```python
Button(
    "Load More",
    hx_get="/api/data",
    hx_target="#results",
    hx_swap="beforeend"
)
```

### 4. Form Handling

Type annotations auto-parse form data:

```python
@dataclass
class LoginForm:
    username: str
    password: str

@rt
def login(form: LoginForm):  # Auto-populated from POST data
    return Div(f"Welcome {form.username}")
```

### 5. Special Parameters

Request these in any handler:
- `request` / `req` - Starlette request
- `session` / `sess` - Session dict
- `auth` - From `request.scope['auth']`
- `htmx` - HTMX headers

## Reference Navigation

### HTMX References
Load when working with HTMX features:

- **references/htmx/attributes.md** - All HTMX attributes (`hx-get`, `hx-post`, `hx-swap`, etc.)
- **references/htmx/events.md** - All HTMX events (lifecycle, errors, validation)
- **references/htmx/headers-api.md** - Request/response headers and JavaScript API
- **references/htmx/config.md** - HTMX configuration options

### FastHTML References
Load based on what you're building:

- **references/fasthtml/core-routing.md** - App setup, routing, responses, websockets
- **references/fasthtml/components.md** - FT basics, HTML components, forms, custom components
- **references/fasthtml/assets.md** - JavaScript, CSS, SVG, static files
- **references/fasthtml/extensions.md** - Database (fastlite), sessions, OAuth, SSE, testing

### MonsterUI References
Load when using MonsterUI (shadcn-like components for FastHTML):

- **references/monsterui/layout.md** - Container, Grid, Flex, Card, Modal, Accordion
- **references/monsterui/forms.md** - LabelInput, Select, Checkbox, buttons, form components
- **references/monsterui/typography.md** - Headings, text styles, lists, icons
- **references/monsterui/components.md** - Alert, Table, Steps, Loading, etc.

### Other References

- **references/starlette.md** - Starlette features (request object, responses, state)
- **references/examples/websockets.md** - WebSocket example
- **references/examples/todo-crud.md** - Complete CRUD app walkthrough

## Building FastHTML Apps

### 1. Minimal App

```python
from fasthtml.common import *

app, rt = fast_app()

@rt
def index():
    return Div("Hello World")

serve()
```

### 2. App with Database

```python
from fasthtml.common import *

db = database('data/app.db')
class Item: name: str; done: bool
items = db.create(Item)

app, rt = fast_app()

@rt
def index():
    return Ul(*[Li(item.name) for item in items()])

serve()
```

### 3. App with Auth

```python
from fasthtml.common import *

def auth_check(req, sess):
    auth = req.scope['auth'] = sess.get('auth')
    if not auth:
        return RedirectResponse('/login')

bware = Beforeware(auth_check, skip=['/login'])
app, rt = fast_app(before=bware)

@rt
def index(auth):
    return Div(f"Welcome {auth}")

serve()
```

## Best Practices

### When to Load References

1. **Start of task** - Determine which references are needed
2. **Unknown features** - Load relevant reference on-demand
3. **Complex implementations** - Load examples for patterns

### Code Organization

- Use `fast_app()` for simple apps
- Use `APIRouter` for multi-file apps
- Extract components into functions
- Use dataclasses for form/data structures

### Response Patterns

- Return FT objects for HTML
- Return tuples for multiple updates
- Return dicts/lists for JSON
- Use `RedirectResponse` for redirects

### HTMX Patterns

- Use `hx-get/post` for actions
- Use `hx-target` for partial updates
- Use `hx-swap="outerHTML"` to replace elements
- Use `hx-swap-oob` for multiple updates

### Database Patterns

- Use `xtra()` in beforeware for multi-tenant filtering
- Use type hints on route handlers for auto-parsing
- Use `transform=True` for schema migrations
- Index by primary key: `users['alice']`

## Common Workflows

### CRUD Application
1. Load: `references/fasthtml/core-routing.md`
2. Load: `references/fasthtml/extensions.md` (database section)
3. Load: `references/examples/todo-crud.md` for patterns
4. Implement routes following CRUD pattern

### Real-time Features
1. Load: `references/fasthtml/core-routing.md` (websockets section)
2. Load: `references/examples/websockets.md`
3. Enable `exts='ws'` in FastHTML
4. Implement websocket handler

### Forms & Validation
1. Load: `references/fasthtml/components.md` (forms section)
2. Define dataclass for form structure
3. Use type hints in route handler
4. Use `fill_form()` to populate existing data

### Styled UI with MonsterUI
1. Load: `references/monsterui/layout.md` for page structure
2. Load: `references/monsterui/forms.md` for form components
3. Load: `references/monsterui/components.md` for UI elements
4. Use theme: `Theme.blue.headers()` in `fast_app()`

## Quick Reference

### Imports
```python
from fasthtml.common import *  # All core functionality
from monsterui.all import *    # MonsterUI components
```

### App Setup
```python
app, rt = fast_app(
    pico=True,           # PicoCSS (default)
    hdrs=[],            # Additional headers
    before=None,        # Beforeware
    db_file='app.db'    # Auto-create database
)
```

### Route Handler
```python
@rt('/path')
def handler(param: type, session, request):
    return FT_elements
```

### Database
```python
db = database('file.db')
class Model: field: type
table = db.create(Model, pk='id', transform=True)

# CRUD
table.insert(field="value")
table[id]  # Read by pk
table()    # All rows
table.update(obj)
table.delete(id)
```

### Sessions
```python
sess['key'] = value
value = sess.get('key')
del sess['key']
```

Remember: Load references as needed based on the specific features you're implementing. Don't try to load everything at once.
