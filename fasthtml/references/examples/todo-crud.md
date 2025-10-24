# Todo CRUD Application

Complete walkthrough of an idiomatic FastHTML todo app with authentication.

## Setup

```python
from fasthtml.common import *
from hmac import compare_digest

# Database setup
db = database('data/utodos.db')

class User:
    name: str
    pwd: str

class Todo:
    id: int
    title: str
    done: bool
    name: str
    details: str
    priority: int

users = db.create(User, pk='name')
todos = db.create(Todo, transform=True)
```

## Authentication with Beforeware

```python
login_redir = RedirectResponse('/login', status_code=303)

def before(req, sess):
    # Get auth from session
    auth = req.scope['auth'] = sess.get('auth', None)
    if not auth:
        return login_redir
    # Filter todos to current user
    todos.xtra(name=auth)

bware = Beforeware(
    before,
    skip=[r'/favicon\.ico', r'/static/.*', r'.*\.css', '/login', '/send_login']
)

app = FastHTML(
    before=bware,
    hdrs=(picolink, SortableJS('.sortable'))
)
rt = app.route
```

## Login Routes

```python
@rt
def login():
    frm = Form(action=send_login, method='post')(
        Input(id='name', placeholder='Name'),
        Input(id='pwd', type='password', placeholder='Password'),
        Button('login')
    )
    return Titled("Login", frm)

@rt
def send_login(name: str, pwd: str, sess):
    if not name or not pwd:
        return login_redir
    
    try:
        u = users[name]
    except NotFoundError:
        # Create new user if doesn't exist
        u = users.insert(name=name, pwd=pwd)
    
    # Verify password
    if not compare_digest(u.pwd.encode("utf-8"), pwd.encode("utf-8")):
        return login_redir
    
    sess['auth'] = u.name
    return RedirectResponse('/', status_code=303)

@rt
def logout(sess):
    del sess['auth']
    return login_redir
```

## Helper Functions

```python
# Clear details view
def clr_details():
    return Div(hx_swap_oob='innerHTML', id='current-todo')

# Render a single todo
def render_todo(todo):
    show = f"/todos/{todo.id}"
    edit = f"{show}/edit"
    delete = f"{show}/delete"
    
    return Li(
        A(todo.title, href=show, hx_get=show, hx_target='#current-todo'),
        ' | ',
        A('edit', href=edit, hx_get=edit, hx_target='#current-todo'),
        ' | ',
        A('delete', href=delete, hx_delete=delete, 
          hx_swap='outerHTML', hx_target=f'#{todo.id}'),
        id=todo.id,
        cls='done' if todo.done else ''
    )
```

## Main Todo List

```python
@rt('/')
def index(auth):
    todo_list = Ul(
        *[render_todo(t) for t in todos()],
        id='todo-list',
        cls='sortable'
    )
    
    new_todo_form = Form(
        Input(name='title', placeholder='New todo'),
        Button('Add'),
        hx_post='/todos',
        hx_target='#todo-list',
        hx_swap='beforeend'
    )
    
    return Titled(
        f"Todos for {auth}",
        Card(
            Div(
                new_todo_form,
                todo_list
            ),
            Div(id='current-todo'),
            header=Button('Logout', hx_post=logout)
        )
    )
```

## CRUD Operations

### Create

```python
@rt('/todos')
def create(todo: Todo):
    # Auto-populates from form data
    return render_todo(todos.insert(todo)), clr_details()
```

### Read

```python
@rt('/todos/{id}')
def show(id: int):
    todo = todos[id]
    return Card(
        H2(todo.title),
        P(f"Done: {todo.done}"),
        P(f"Priority: {todo.priority}"),
        P(todo.details or "No details"),
        footer=A('Close', href='#', hx_get='/', hx_target='#current-todo')
    )
```

### Update

```python
@rt('/todos/{id}/edit')
def edit(id: int):
    todo = todos[id]
    form = Form(
        Input(name='title', value=todo.title),
        Input(name='priority', type='number', value=todo.priority),
        Textarea(name='details', rows=5)(todo.details or ''),
        Checkbox(name='done', checked=todo.done, label='Done'),
        Button('Save'),
        hx_put=f'/todos/{id}',
        hx_target='#current-todo'
    )
    return Card(H2("Edit Todo"), form)

@rt('/todos/{id}')
def update(id: int, todo: Todo):
    todos.update(todo)
    return show(id)
```

### Delete

```python
@rt('/todos/{id}/delete')
def delete(id: int):
    todos.delete(id)
    return clr_details()
```

## Form Handling

FastHTML automatically:
- Unpacks form data into typed parameters
- Creates dataclass instances from matching field names
- Handles nested forms and file uploads
- Validates required fields

```python
@dataclass
class TodoForm:
    title: str
    priority: int = 1
    done: bool = False
    details: str = ""

@rt('/todos')
def create_todo(form: TodoForm):
    # form is automatically populated from POST data
    todo = todos.insert(
        title=form.title,
        priority=form.priority,
        done=form.done,
        details=form.details
    )
    return render_todo(todo)
```

## HTMX Patterns

### Inline Editing

```python
@rt('/todos/{id}/title')
def edit_title(id: int):
    todo = todos[id]
    return Input(
        value=todo.title,
        hx_put=f'/todos/{id}/title',
        hx_trigger='blur',
        hx_swap='outerHTML'
    )

@rt('/todos/{id}/title')
def update_title(id: int, title: str):
    todo = todos[id]
    todo.title = title
    todos.update(todo)
    return A(title, hx_get=f'/todos/{id}/title/edit')
```

### Optimistic UI

```python
@rt('/todos/{id}/toggle')
def toggle(id: int):
    todo = todos[id]
    todo.done = not todo.done
    todos.update(todo)
    return render_todo(todo)
```

### Infinite Scroll

```python
@rt('/todos/more')
def more(offset: int = 0):
    batch = todos(limit=20, offset=offset)
    return [render_todo(t) for t in batch]

# In template:
Div(
    Ul(*todos[:20], id='todo-list'),
    Div(
        hx_get='/todos/more?offset=20',
        hx_trigger='revealed',
        hx_swap='outerHTML'
    )
)
```

## Key Takeaways

1. **Type annotations** auto-parse form data into objects
2. **Beforeware** handles auth and database filtering
3. **HTMX attributes** enable SPA-like behavior without JavaScript
4. **Tuple returns** allow multiple simultaneous updates
5. **OOB swaps** update multiple parts of the page
6. **Sessions** are cryptographically signed cookies
7. **Database xtra()** automatically filters all queries
