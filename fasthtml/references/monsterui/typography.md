# MonsterUI Typography

## Headings

```python
# Styled headings with appropriate sizes
H1("Main Title")        # uk-h1 text-4xl
H2("Section Title")     # uk-h2 text-3xl
H3("Subsection")        # uk-h3 text-2xl
H4("Heading 4")         # uk-h4 text-xl
H5("Heading 5")         # uk-h5 text-lg
H6("Heading 6")         # uk-h6 text-base
```

## Text Styles

### Basic Text

```python
P("Regular paragraph")
Small("Small text")
Strong("Bold text")
Em("Italic text")
```

### Text Style Classes

```python
# Use TextT enum for styling
P("Muted text", cls=TextT.muted)
P("Primary color", cls=TextT.primary)
P("Secondary color", cls=TextT.secondary)
P("Success", cls=TextT.success)
P("Warning", cls=TextT.warning)
P("Error", cls=TextT.error)

# Text sizes
P("Extra small", cls=TextT.xs)
P("Small", cls=TextT.sm)
P("Large", cls=TextT.lg)
P("Extra large", cls=TextT.xl)

# Text weights
P("Light", cls=TextT.light)
P("Normal", cls=TextT.normal)
P("Medium", cls=TextT.medium)
P("Bold", cls=TextT.bold)
P("Extra bold", cls=TextT.extrabold)

# Text alignment
P("Left aligned", cls=TextT.left)
P("Centered", cls=TextT.center)
P("Right aligned", cls=TextT.right)
P("Justified", cls=TextT.justify)

# Special styles
P("Italic", cls=TextT.italic)
P("Underlined", cls=TextT.underline)
P("Truncate long text...", cls=TextT.truncate)
P("Break-words", cls=TextT.break_)
P("No wrap", cls=TextT.nowrap)
```

### Text Presets

Common typography combinations:

```python
# Muted small text
P("Subtitle text", cls=TextPresets.muted_sm)

# Muted large text
P("Secondary info", cls=TextPresets.muted_lg)

# Bold small text
P("Label", cls=TextPresets.bold_sm)

# Bold large text
P("Emphasis", cls=TextPresets.bold_lg)

# Medium weight small
P("Metadata", cls=TextPresets.md_weight_sm)

# Medium weight muted
P("Helper text", cls=TextPresets.md_weight_muted)
```

## Subtitle Helper

```python
# Muted small text for subtitles
Subtitle("This goes under a heading")
```

## Semantic Text Elements

### Quotations

```python
# Inline quote
Q("To be or not to be")

# Block quote
Blockquote(
    P("The only way to do great work is to love what you do."),
    Cite("Steve Jobs")
)
```

### Code

```python
# Inline code
CodeSpan("npm install")

# Code block
CodeBlock("""
def hello():
    print("world")
""")
```

### Emphasis & Strong

```python
P("This is ", Em("emphasized"), " text")
P("This is ", Strong("important"), " text")
P("This is ", I("italic"), " text")
```

### Highlighting

```python
# Highlighted text
Mark("Important note")
```

### Deletions & Insertions

```python
# Deleted text (strikethrough)
Del("Old price: $99")
S("Deprecated feature")  # Alternative strikethrough

# Inserted text (underlined)
Ins("New price: $79")
```

### Subscript & Superscript

```python
# Chemical formula
P("H", Sub("2"), "O")

# Mathematical expression
P("x", Sup("2"), " + y", Sup("2"))
```

### Technical Text

```python
# Variables
Var("x")

# Keyboard input
Kbd("Ctrl+C")

# Sample output
Samp("Error: File not found")

# Abbreviations
Abbr("HTML", title="HyperText Markup Language")

# Definitions
Dfn("Recursion", title="See recursion")
```

### Metadata

```python
# Citation
Cite("Shakespeare")

# Time
Time("2025-01-01", datetime="2025-01-01T00:00:00")

# Address
Address(
    "123 Main St",
    Br(),
    "City, State 12345"
)

# Data value
Data("Product", value="12345")

# Meter
Meter(value=0.7, min=0, max=1)

# Output
Output("Result: 42", _for="calculation")
```

## Lists

```python
# Styled lists with ListT enum
Ul(
    Li("Item 1"),
    Li("Item 2"),
    Li("Item 3"),
    cls=ListT.disc  # disc, circle, square, decimal, hyphen, bullet, divider, striped
)

# Bullet list (default disc style)
Ul(
    Li("First"),
    Li("Second"),
    cls=ListT.bullet
)

# Divider list
Ul(
    Li("Home"),
    Li("About"),
    Li("Contact"),
    cls=ListT.divider
)

# Striped list
Ul(
    Li("Row 1"),
    Li("Row 2"),
    Li("Row 3"),
    cls=ListT.striped
)
```

## Figures & Captions

```python
# Figure with caption
Figure(
    Img(src="image.jpg"),
    Caption("Fig 1: Beautiful sunset")
)
```

## Details & Summary

```python
# Collapsible details
Details(
    Summary("Click to expand"),
    P("Hidden content here"),
    P("More details...")
)
```

## Markdown Rendering

```python
# Render markdown to styled HTML
render_md("""
# Heading

This is **bold** and *italic* text.

- List item 1
- List item 2

```python
def hello():
    print("world")
```
""")
```

## Icons

### UkIcon

```python
# Lucide icons
UkIcon("heart", height=24, width=24)
UkIcon("user", height=16, stroke_width=2)
UkIcon("check", cls="text-green-500")
```

### UkIconLink

```python
# Icon as a link
UkIconLink("github", href="https://github.com/user")

# Icon button
UkIconLink("settings", button=True, onclick="openSettings()")
```

### DiceBearAvatar

```python
# Generated avatar from name
DiceBearAvatar("John Doe", h=48, w=48)
```

## Complete Typography Example

```python
Article(
    H1("Article Title"),
    Subtitle("A comprehensive guide"),
    P(
        "This article demonstrates ",
        Strong("various typography"),
        " options including ",
        Em("emphasis"),
        " and ",
        Code("inline code"),
        "."
    ),
    Blockquote(
        P("Great typography is invisible."),
        Cite("— Typography Wisdom")
    ),
    H2("Section"),
    P("More content with ", Mark("highlighted"), " text."),
    CodeBlock("""
def example():
    return "Hello World"
    """)
)
```
