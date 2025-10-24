# MonsterUI Form Components

## Form Container

```python
# Styled form with automatic spacing
Form(
    LabelInput("Email", id="email", type="email"),
    LabelInput("Password", id="pwd", type="password"),
    Button("Submit", cls=ButtonT.primary),
    method="post",
    action="/login"
)
```

## Input Components

### LabelInput

```python
# Input with linked label
LabelInput(
    "Email Address",
    id="email",
    type="email",
    placeholder="you@example.com",
    required=True
)

# Text input (default)
LabelInput("Name", id="name")

# Number input
LabelInput("Age", id="age", type="number", min=0, max=120)

# Password input
LabelInput("Password", id="pwd", type="password")
```

### Input (standalone)

```python
# Styled input without label
Input(
    name="username",
    placeholder="Enter username",
    required=True
)
```

### LabelSelect

```python
# Select dropdown with label
LabelSelect(
    Option("Choose..."),
    Option("Option 1", value="1"),
    Option("Option 2", value="2"),
    Option("Option 3", value="3"),
    label="Select Option",
    id="choice"
)

# Or use Options helper
LabelSelect(
    Options("Opt 1", "Opt 2", "Opt 3"),
    label="Choice",
    id="sel"
)
```

### Select (standalone)

```python
# Styled select without label
Select(
    Option("Red", value="red"),
    Option("Green", value="green"),
    Option("Blue", value="blue"),
    name="color"
)
```

### LabelCheckboxX

```python
# Checkbox with label
LabelCheckboxX(
    "Accept terms",
    id="terms",
    checked=False
)

# With custom classes
LabelCheckboxX(
    "Remember me",
    id="remember",
    lbl_cls="text-sm",
    input_cls="accent-blue"
)
```

### CheckboxX (standalone)

```python
# Styled checkbox
CheckboxX(
    label="Agree",
    value="yes",
    id="agree",
    checked=True
)
```

### LabelRadio

```python
# Radio button with label
LabelRadio(
    "Option A",
    id="opt_a",
    name="choice",
    value="a"
)

# Group of radio buttons
Form(
    LabelRadio("Small", id="size_s", name="size", value="s"),
    LabelRadio("Medium", id="size_m", name="size", value="m", checked=True),
    LabelRadio("Large", id="size_l", name="size", value="l")
)
```

### Radio (standalone)

```python
# Styled radio button
Radio(name="option", value="1")
```

### LabelRange

```python
# Range slider with label and value display
LabelRange(
    "Volume",
    id="volume",
    min=0,
    max=100,
    value=50,
    step=5,
    label_range=True  # Show current value
)
```

### Range (standalone)

```python
# Styled range slider
Range(
    name="opacity",
    min=0,
    max=1,
    step=0.1,
    value=0.5
)
```

### TextArea

```python
# Styled textarea
TextArea(
    "Default text",
    name="message",
    rows=5,
    placeholder="Enter your message..."
)
```

### Switch

```python
# Toggle switch
Switch(
    name="notifications",
    checked=True
)
```

### Upload

```python
# File upload
Upload(
    name="avatar",
    accept="image/*"
)
```

### UploadZone

```python
# Drag-and-drop file upload zone
UploadZone(
    P("Drag files here or click to upload"),
    name="files",
    multiple=True
)
```

## Form Helpers

### FormLabel

```python
# Styled label
FormLabel("Email Address", _for="email")
```

### Legend

```python
# Fieldset legend
Legend("Personal Information")
```

### Fieldset

```python
# Styled fieldset with legend
Fieldset(
    Legend("Account Details"),
    LabelInput("Username", id="username"),
    LabelInput("Email", id="email", type="email")
)
```

### UkFormSection

```python
# Form section with title and description
UkFormSection(
    "Personal Info",
    "Update your personal information",
    LabelInput("Name", id="name"),
    LabelInput("Email", id="email")
)
```

## Button Styles

```python
# Button style types
Button("Default", cls=ButtonT.default)
Button("Primary", cls=ButtonT.primary)
Button("Secondary", cls=ButtonT.secondary)
Button("Destructive", cls=ButtonT.destructive)
Button("Ghost", cls=ButtonT.ghost)
Button("Link", cls=ButtonT.link)

# Button sizes
Button("Small", cls=ButtonT.sm)
Button("Large", cls=ButtonT.lg)
Button("Extra Large", cls=ButtonT.xl)
Button("Icon", cls=ButtonT.icon)  # Square button
```

## Label Pills

```python
# Styled label badges/pills
Label("New", cls=LabelT.primary)
Label("Sale", cls=LabelT.secondary)
Label("Danger", cls=LabelT.destructive)
```

## Complete Form Example

```python
Form(
    Fieldset(
        Legend("Sign Up"),
        Grid(
            LabelInput("First Name", id="fname"),
            LabelInput("Last Name", id="lname"),
            cols=2
        ),
        LabelInput("Email", id="email", type="email", required=True),
        LabelInput("Password", id="pwd", type="password", required=True),
        LabelCheckboxX("Accept terms and conditions", id="terms", required=True)
    ),
    DivRAligned(
        Button("Cancel", cls=ButtonT.ghost, type="button"),
        Button("Sign Up", cls=ButtonT.primary, type="submit")
    ),
    method="post",
    action="/signup"
)
```

## Form with Sections

```python
Form(
    UkFormSection(
        "Account",
        "Basic account information",
        LabelInput("Username", id="user"),
        LabelInput("Email", id="email")
    ),
    UkFormSection(
        "Preferences",
        "Customize your experience",
        LabelSelect(
            Options("Dark", "Light", "Auto"),
            label="Theme",
            id="theme"
        ),
        LabelCheckboxX("Email notifications", id="notify")
    ),
    Button("Save Settings", cls=ButtonT.primary),
    method="post"
)
```
