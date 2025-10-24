# FastHTML Components & Forms

## FastTags (FT) Basics

FTs are Python functions that create HTML elements. They use:
- **Positional arguments** → children
- **Keyword arguments** → attributes
- **Special aliases** for Python reserved words (`cls` → `class`, `_for`/`fr` → `for`)

```python
# Basic usage
Div("Hello", cls="container")  # <div class="container">Hello</div>

# Children and attributes
Button("Click me", onclick="alert('hi')", type="submit")

# Special characters in attributes via dict unpacking
Div(**{'@click': "handler()", 'data-value': '123'})

# Nested elements
Card(
    H1("Title"),
    P("Content"),
    cls="card"
)
```

## Common HTML Components

All standard HTML tags available: `Div`, `Span`, `P`, `H1`-`H6`, `A`, `Button`, `Form`, `Input`, `Select`, `Table`, etc.

### Extended Components

FastHTML adds helpful extensions:

```python
# A tag with default href='#'
A("Link", href="/page")

# AX - concise A tag
AX("Click", hx_get="/data", target_id="result")

# Form with multipart encoding by default
Form(
    Input(name="file", type="file"),
    Button("Submit")
)

# Hidden input
Hidden(value="secret", id="token")

# Checkbox with label
CheckboxX(checked=True, label="Accept", value="yes", id="accept")

# Script that doesn't escape code
Script("console.log('hello');")

# Style that doesn't escape code
Style("body { margin: 0; }")
```

## Form Handling

### fill_form

Fill form fields from an object:

```python
@dataclass
class User:
    name: str
    email: str
    age: int

user = User(name="Alice", email="alice@example.com", age=30)

user_form = Form(
    Input(name="name"),
    Input(name="email"),
    Input(name="age", type="number"),
    Button("Save")
)

# Fill form with user data
filled_form = fill_form(user_form, user)
```

### Form Data to Objects

Type-annotated parameters automatically parse form data:

```python
@dataclass
class LoginData:
    username: str
    password: str

@rt
def login(data: LoginData):
    # data is automatically created from form fields
    return Div(f"Welcome {data.username}")
```

## Creating Custom Components

Components are just Python functions:

```python
def Card(title, *content, **kwargs):
    return Article(
        Header(H3(title)),
        Div(*content),
        cls="card",
        **kwargs
    )

# Usage
Card("My Title", P("Paragraph 1"), P("Paragraph 2"))
```

## Titled Helper

Creates a page with title and H1:

```python
@rt
def page():
    return Titled("Page Title",
        P("Content here"),
        Div("More content")
    )
# Generates: Title + H1 in a Container with remaining children
```

## NotStr / Safe

Render raw HTML without escaping:

```python
# Escaped by default (safe)
Div("<script>alert('xss')</script>")

# Unescaped (use carefully!)
Div(NotStr("<strong>Bold</strong>"))
```

## Creating Dynamic Tags

Import any tag name from `fasthtml.components`:

```python
from fasthtml.components import CustomTag, MyElement

CustomTag("content")  # <custom-tag>content</custom-tag>
MyElement(cls="special")  # <my-element class="special"></my-element>
```

## FT with __ft__ Method

Classes with `__ft__` are automatically rendered:

```python
class MyComponent:
    def __init__(self, name):
        self.name = name
    
    def __ft__(self):
        return Div(f"Hello {self.name}", cls="greeting")

# Renders automatically
Div(MyComponent("Alice"))
```

## Form Components

### Input Types

```python
Input(type="text", name="username")
Input(type="password", name="pwd")
Input(type="email", name="email")
Input(type="number", name="age")
Input(type="file", name="upload")
Input(type="hidden", name="token", value="abc")
Input(type="checkbox", name="agree")
Input(type="radio", name="option", value="1")
```

### Select

```python
Select(
    Option("One", value="1"),
    Option("Two", value="2", selected=True),
    name="choice"
)
```

### Textarea

```python
Textarea("Default content", name="message", rows=5)
```

### Label

```python
Label("Email", Input(name="email"), _for="email")
```

## Container & Layout

```python
# Container (PicoCSS)
Container(H1("Title"), P("Content"))

# Article
Article(Header(H2("Title")), P("Content"), Footer("By Author"))

# Section
Section(H2("Section Title"), P("Content"))

# Group (Fieldset with role='group')
Group(
    Input(name="first"),
    Input(name="last"),
    Button("Submit")
)

# Grid (automatic grid layout)
Grid(
    Div("Cell 1"),
    Div("Cell 2"),
    Div("Cell 3")
)

# Card (Article with Header/Footer)
Card(
    P("Card content"),
    header=H3("Card Title"),
    footer=Small("Card footer")
)
```

## find_inputs

Find input elements in an FT tree:

```python
form = Form(
    Input(name="email"),
    Div(Input(name="password")),
    Button("Submit")
)

inputs = find_inputs(form, "input")
# Returns all Input elements
```

## html2ft

Convert HTML string to FT:

```python
html = "<div class='container'><p>Hello</p></div>"
ft = html2ft(html)
# Returns: Div(P("Hello"), cls="container")
```
