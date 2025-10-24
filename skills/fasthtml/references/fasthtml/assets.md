# FastHTML Assets: JavaScript, CSS & SVG

## JavaScript Helpers

### Adding External Scripts

```python
# Via fast_app hdrs
app, rt = fast_app(
    hdrs=(
        Script(src="https://cdn.jsdelivr.net/npm/chart.js"),
    )
)

# Via Script tag
Script(src="https://unpkg.com/htmx.org")
```

### Inline JavaScript

```python
# Script tag (auto-unescaped)
Script("""
    console.log('Hello');
    document.getElementById('btn').onclick = () => alert('Clicked');
""")

# With Python interpolation
data = {'x': [1, 2, 3], 'y': [4, 5, 6]}
Script(f"var chartData = {data}; plotChart(chartData);")
```

### JavaScript Libraries

#### MarkdownJS

Client-side markdown rendering:

```python
app, rt = fast_app(hdrs=(MarkdownJS(),))

@rt
def page():
    return Div("**Bold** and *italic*", cls="marked")
```

#### HighlightJS

Syntax highlighting:

```python
app, rt = fast_app(hdrs=(
    HighlightJS(langs=['python', 'javascript', 'html']),
))

@rt  
def code():
    return Pre(Code("def hello():\n    print('world')", cls="language-python"))
```

#### MermaidJS

Diagram rendering:

```python
app, rt = fast_app(hdrs=(MermaidJS(),))

@rt
def diagram():
    return Pre("""
        graph TD
        A[Start] --> B[Process]
        B --> C[End]
    """, cls="mermaid")
```

#### SortableJS

Drag-and-drop sortable lists:

```python
app, rt = fast_app(hdrs=(SortableJS('.sortable'),))

@rt
def list():
    return Ul(
        Li("Item 1"),
        Li("Item 2"),
        Li("Item 3"),
        cls="sortable"
    )
```

### SurrealJS

Inline DOM manipulation library (alternative to htmx):

```python
app, rt = fast_app(surreal=True)

# Surreal code block
@rt
def page():
    return Div(
        Button("Click", id="btn"),
        Surreal("me('#btn').on('click', e => alert('Hi'));")
    )

# Event handlers
On("alert('Clicked')", event="click", sel="#btn")

# Previous sibling handler
Prev("me().style.color = 'red'", event="click")

# Run on load
Now("me('#status').text('Ready')", sel="#status")
```

## CSS Helpers

### Inline Styles

```python
# Style tag (auto-unescaped)
Style("""
    .container { max-width: 1200px; margin: 0 auto; }
    .card { padding: 1rem; border: 1px solid #ccc; }
""")
```

### External Stylesheets

```python
app, rt = fast_app(
    hdrs=(
        Link(rel='stylesheet', href='/static/custom.css'),
    )
)
```

### PicoCSS

Built-in minimal CSS framework:

```python
# Enabled by default
app, rt = fast_app(pico=True)

# Disable it
app, rt = fast_app(pico=False)
```

### CSS from Files with Variables

```python
# StyleX reads CSS from file and replaces variables
StyleX(
    'styles/theme.css',
    primary_color='#007bff',
    font_family='Inter, sans-serif'
)
```

### Light/Dark Media

```python
# Light mode CSS
light_media(".card { background: white; }")

# Dark mode CSS  
dark_media(".card { background: #333; }")
```

## SVG Components

### Basic SVG

```python
# SVG container (xmlns added automatically)
Svg(
    Circle(cx=50, cy=50, r=40, fill="red"),
    width=100, height=100
)

# Common shapes
Rect(x=10, y=10, width=80, height=60, fill="blue")
Circle(cx=50, cy=50, r=30, fill="green")
Ellipse(cx=50, cy=50, rx=40, ry=20, fill="yellow")
Line(x1=0, y1=0, x2=100, y2=100, stroke="black", stroke_width=2)
```

### Polylines & Polygons

```python
# Polyline (open path)
Polyline(points="0,0 50,25 50,75 0,100", stroke="black", fill="none")

# Polygon (closed path)
Polygon(points="50,0 100,50 50,100 0,50", fill="purple")
```

### SVG Text

```python
Text("Hello SVG", x=10, y=30, font_size=20, fill="black")
```

### SVG Paths

```python
# PathFT helper for building paths
path = PathFT()
path.M(10, 10)           # Move to
path.L(90, 90)           # Line to
path.H(90)               # Horizontal line
path.V(10)               # Vertical line
path.Z()                 # Close path
path.C(20,20, 40,20, 50,10)  # Cubic bezier
path.Q(25,25, 50,10)     # Quadratic bezier
path.A(30,30, 0, 0, 1, 50,100)  # Arc
```

### SVG HTMX Integration

```python
# Out-of-band swap
SvgOob(Circle(cx=50, cy=50, r=30, id="myCircle"))

# Inband swap
SvgInb(Rect(x=10, y=10, width=50, height=50))
```

### Transforms

```python
# Transform helper
transform = transformd(
    translate=(10, 20),
    scale=(2, 2),
    rotate=45,
    skewX=10
)

Circle(cx=50, cy=50, r=20, **transform)
```

## Static File Serving

### Static File Routes

```python
# Serve single extension
app.static_route('.css', prefix='/static', static_path='./public')

# Serve multiple extensions
app.static_route_exts(
    prefix='/static',
    static_path='./public',
    exts=['css', 'js', 'png', 'jpg']
)

# Manual static route
@rt("/{fname:path}.{ext:static}")
def static(fname: str, ext: str):
    return FileResponse(f'public/{fname}.{ext}')
```

### Default Static Serving

By default, FastHTML serves these extensions from the app directory:
`ico|gif|jpg|jpeg|webm|css|js|woff|png|svg|mp4|webp|ttf|otf|eot|woff2|txt|xml|html`

## Social Cards

```python
# Generate OG and Twitter card headers
Socials(
    title="My App",
    site_name="My Site", 
    description="Description here",
    image="https://example.com/og-image.jpg",
    url="https://example.com",
    twitter_site="@myhandle"
)
```

## Favicon

```python
# Light and dark mode favicons
Favicon(
    light_icon="/static/favicon-light.png",
    dark_icon="/static/favicon-dark.png"
)
```

## YouTube Embed

```python
YouTubeEmbed(
    video_id="dQw4w9WgXcQ",
    width=560,
    height=315
)
```
