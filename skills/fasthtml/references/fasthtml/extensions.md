# FastHTML Extensions

## Database (Fastlite)

FastHTML includes fastlite for easy SQLite database operations.

### Setup

```python
from fasthtml.common import *

db = database('data/myapp.db')

# Define tables as classes
class User:
    name: str
    email: str
    active: bool = True

class Post:
    id: int
    title: str
    content: str
    user_id: int

# Create tables (pk defaults to 'id')
users = db.create(User, pk='name')
posts = db.create(Post, transform=True)  # transform=True updates existing table
```

### CRUD Operations

```python
# Create
user = users.insert(name='Alice', email='alice@example.com')
post = posts.insert(title='Hello', content='World', user_id=1)

# Read
user = users['Alice']  # By primary key
all_users = users()    # All records

# Filter
active_users = users(where="active=?", params=(True,))
user_posts = posts(where="user_id=?", params=(user.id,))

# Limit and order
recent = posts(order_by='id DESC', limit=10)
page2 = posts(limit=10, offset=10)

# Check existence
if 'Alice' in users:
    print("User exists")

# Update
user.email = 'newemail@example.com'
users.update(user)

# Delete
users.delete('Alice')  # By primary key
```

### xtra() - Automatic Filtering

Constrain all future queries on a table:

```python
# In beforeware, constrain todos to current user
def before(req, sess):
    auth = sess.get('auth')
    todos.xtra(user_id=auth)  # All queries now filtered by user_id

@rt
def list_todos():
    return todos()  # Automatically filtered to current user
```

## Sessions & Cookies

### Sessions

Sessions are Starlette sessions (cryptographically signed cookies):

```python
@rt
def login(username: str, sess):
    sess['user'] = username
    sess['logged_in'] = True
    return RedirectResponse('/')

@rt
def profile(sess):
    user = sess.get('user')
    if not user:
        return RedirectResponse('/login')
    return Div(f"Welcome {user}")

@rt
def logout(sess):
    sess.clear()  # or del sess['user']
    return RedirectResponse('/')
```

### Cookies

```python
# Set cookie
@rt
def set():
    return P("Cookie set"), cookie('mycookie', 'value', max_age=3600)

# Read cookie
@rt
def get(mycookie: str):
    return P(f"Cookie value: {mycookie}")
```

## Authentication (OAuth)

### Google OAuth

```python
from fasthtml.common import *
from fasthtml.oauth import GoogleAppClient, OAuth

# Create Google client
client = GoogleAppClient.from_file(
    'client_secret.json',
    code='authorization_code',
    scope=['openid', 'email', 'profile']
)

# Setup OAuth middleware
oauth = OAuth(
    app,
    client,
    skip=[r'/login', r'/static/.*'],  # Skip auth for these routes
    redir_path='/auth/redirect',
    logout_path='/logout'
)

@rt('/login')
def login(request):
    return A("Login with Google", href=oauth.login_link(request))

@rt
def profile(auth):  # 'auth' injected by OAuth middleware
    return Div(f"Logged in as: {auth['email']}")
```

### GitHub OAuth

```python
from fasthtml.oauth import GitHubAppClient

client = GitHubAppClient(
    client_id='your_client_id',
    client_secret='your_client_secret',
    code='authorization_code',
    scope=['user', 'repo']
)
```

### Discord OAuth

```python
from fasthtml.oauth import DiscordAppClient

client = DiscordAppClient(
    client_id='your_client_id',
    client_secret='your_client_secret',
    is_user=True,
    perms=0,
    scope=['identify', 'email']
)
```

## Server-Side Events (SSE)

Stream real-time updates to the browser:

```python
app, rt = fast_app(
    hdrs=(Script(src="https://unpkg.com/htmx-ext-sse@2.2.3/sse.js"),)
)

@rt
def index():
    return Div(
        hx_ext="sse",
        sse_connect="/stream",
        hx_swap="beforeend",
        sse_swap="message"
    )

# Generator function for streaming
shutdown_event = signal_shutdown()

async def number_stream():
    count = 0
    while not shutdown_event.is_set():
        yield sse_message(Div(f"Count: {count}"))
        count += 1
        await asyncio.sleep(1)

@rt
async def stream():
    return EventStream(number_stream())
```

## Exception Handlers

Customize error pages:

```python
def not_found(req, exc):
    return Titled("404 Not Found", P("Page doesn't exist"))

def server_error(req, exc):
    return Titled("500 Error", P("Something went wrong"))

app = FastHTML(
    exception_handlers={
        404: not_found,
        500: server_error
    }
)
```

## Testing

Use Starlette's TestClient:

```python
from starlette.testclient import TestClient

client = TestClient(app)

# Test GET
response = client.get('/')
assert response.status_code == 200
assert "Welcome" in response.text

# Test POST
response = client.post('/login', data={'username': 'alice', 'password': 'secret'})

# Test with HTMX headers
htmx_headers = {'HX-Request': '1', 'HX-Target': 'content'}
response = client.get('/partial', headers=htmx_headers)
```

## Background Tasks

Run tasks after response is sent:

```python
from starlette.background import BackgroundTask, BackgroundTasks

async def send_email(to: str, subject: str):
    # Email sending logic
    await asyncio.sleep(1)
    print(f"Email sent to {to}")

@rt
def signup(email: str):
    # Create user logic here
    task = BackgroundTask(send_email, to=email, subject="Welcome")
    return Response("Signed up!", background=task)

# Multiple tasks
@rt
def process(request):
    tasks = BackgroundTasks()
    tasks.add_task(log_action, "process_started")
    tasks.add_task(send_notification, request.user)
    return Response("Processing...", background=tasks)
```

## Toasts (Notifications)

Show temporary notification messages:

```python
setup_toasts(app, duration=5)  # Setup with 5 second duration

@rt
def action(session):
    # Do something
    add_toast(session, "Action completed!", "success")
    add_toast(session, "Warning message", "warning")
    add_toast(session, "Info message", "info")
    add_toast(session, "Error occurred", "error")
    
    return Titled("Done")
```

## Jupyter Notebook Support

Run FastHTML in Jupyter:

```python
from fasthtml.jupyter import *

app, rt = fast_app()

@rt
def index():
    return Div("Hello from Jupyter")

# Start server in background
server = JupyUvi(app, port=8000, start=True)

# Display in iframe
HTMX(app=app, port=8000, height=400)

# Stop server when done
server.stop()
```

## Middleware

Create custom middleware:

```python
from starlette.middleware.base import BaseHTTPMiddleware

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        print(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        print(f"Response: {response.status_code}")
        return response

app = FastHTML(middleware=[
    Middleware(LoggingMiddleware)
])
```
