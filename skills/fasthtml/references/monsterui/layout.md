# MonsterUI Layout Components

MonsterUI is a shadcn-like component library for FastHTML using Tailwind and FrankenUI.

## Setup

```python
from fasthtml.common import *
from monsterui.all import *

# Use a MonsterUI theme
app, rt = fast_app(hdrs=Theme.blue.headers(highlightjs=True))
```

## Themes

Available themes: `slate`, `stone`, `gray`, `neutral`, `red`, `rose`, `orange`, `green`, `blue`, `yellow`, `violet`, `zinc`

```python
# With options
Theme.blue.headers(
    mode='light',          # or 'dark'
    icons=True,           # Include Lucide icons
    daisy=True,           # Include DaisyUI
    highlightjs=True,     # Code highlighting
    katex=False,          # LaTeX support
    apex_charts=False     # Chart library
)
```

## Container

```python
# Basic container with default margins
Container(
    H1("Content"),
    P("Paragraph")
)

# With size
Container(*content, cls=ContainerT.lg)  # xs, sm, lg, xl, expand
```

## Grid

Smart responsive grid:

```python
# Auto-sized columns based on content
Grid(
    Div("Cell 1"),
    Div("Cell 2"),
    Div("Cell 3")
)

# Specify column count
Grid(
    Div("1"), Div("2"), Div("3"),
    Div("4"), Div("5"), Div("6"),
    cols=3
)
```

## Flex Layouts

### DivFullySpaced

```python
# Space-between layout
DivFullySpaced(
    Div("Left"),
    Div("Right")
)
```

### DivCentered

```python
# Centered content
DivCentered(
    H1("Centered Title"),
    P("Centered text")
)
```

### DivLAligned / DivRAligned

```python
# Left-aligned
DivLAligned(
    Button("Cancel"),
    Button("OK")
)

# Right-aligned
DivRAligned(
    Button("Cancel"),
    Button("OK")
)
```

### DivVStacked / DivHStacked

```python
# Vertical stack
DivVStacked(
    Div("Top"),
    Div("Middle"),
    Div("Bottom")
)

# Horizontal stack
DivHStacked(
    Button("Back"),
    Button("Next")
)
```

## Center

```python
# Center both vertically and horizontally
Center(
    H1("Centered Content")
)
```

## Section

```python
# Section with styling and margins
Section(
    H2("Section Title"),
    P("Content"),
    cls=SectionT.primary  # default, muted, primary, secondary, xs, sm, lg, xl
)
```

## Divider

```python
# Horizontal divider
Divider()

# With text
Divider("OR")

# Styles
Divider(cls=DividerT.sm)  # sm, icon, vertical

# Simple line divider
DividerSplit()
```

## Card

```python
# Card with header, body, footer
Card(
    P("Card content here"),
    P("More content"),
    header=H3("Card Title"),
    footer=Small("Card footer"),
    cls=CardT.default  # default, primary, secondary, destructive, hover
)

# Manual card construction
CardContainer(
    CardHeader(H3("Title")),
    CardBody(P("Content")),
    CardFooter(Button("Action"))
)
```

## Article

```python
# Styled article container
Article(
    ArticleTitle("Blog Post Title"),
    ArticleMeta("By Author • Jan 1, 2025"),
    P("Article content..."),
    P("More content...")
)
```

## Modal

```python
# Complete modal
Modal(
    ModalTitle("Confirm Action"),
    P("Are you sure?"),
    footer=DivFullySpaced(
        Button("Cancel", cls=ButtonT.ghost),
        Button("Confirm", cls=ButtonT.destructive)
    ),
    id="confirm-modal"
)

# Manual construction
ModalContainer(
    ModalDialog(
        ModalHeader(ModalTitle("Title"), ModalCloseButton()),
        ModalBody(P("Content")),
        ModalFooter(Button("Close"))
    )
)
```

## Accordion

```python
# Accordion with multiple items
Accordion(
    AccordionItem("First", P("First content")),
    AccordionItem("Second", P("Second content")),
    AccordionItem("Third", P("Third content"))
)
```

## Tabs

```python
# Tab container
TabContainer(
    Li(A("Tab 1", href="#tab1")),
    Li(A("Tab 2", href="#tab2")),
    Li(A("Tab 3", href="#tab3"))
)
```

## Navigation

### NavContainer

```python
# Sidebar navigation
NavContainer(
    NavHeaderLi("Menu"),
    Li(A("Home", href="/")),
    Li(A("About", href="/about")),
    NavDividerLi(),
    NavSubtitle("Settings"),
    Li(A("Profile", href="/profile")),
    Li(A("Logout", href="/logout")),
    cls=NavT.default  # default, primary, secondary
)
```

### NavBar

```python
# Responsive top navigation
NavBar(
    A("Logo", href="/", cls="brand"),
    A("Home", href="/"),
    A("Products", href="/products"),
    A("About", href="/about")
)
```

## Slider

```python
# Image/content slider with navigation
Slider(
    SliderItems(
        Div("Slide 1"),
        Div("Slide 2"),
        Div("Slide 3")
    ),
    SliderNav()  # Previous/Next arrows
)
```

## Placeholder

```python
# Loading placeholder
Placeholder(
    Div("Loading..."),
    cls="animate-pulse"
)
```

## Progress

```python
# Progress bar
Progress(value=60, max=100)
```

## Lightbox

```python
# Image gallery lightbox
LightboxContainer(
    LightboxItem(Img(src="thumb1.jpg"), href="full1.jpg"),
    LightboxItem(Img(src="thumb2.jpg"), href="full2.jpg"),
    LightboxItem(Img(src="thumb3.jpg"), href="full3.jpg")
)
```
