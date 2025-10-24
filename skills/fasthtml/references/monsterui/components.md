# MonsterUI Components

## Alert

```python
# Alert with different types
Alert(
    Strong("Info:"), " This is an information alert.",
    cls=AlertT.info  # info, success, warning, error
)

Alert(
    Strong("Success!"), " Operation completed.",
    cls=AlertT.success
)

Alert(
    Strong("Warning:"), " Please review.",
    cls=AlertT.warning
)

Alert(
    Strong("Error:"), " Something went wrong.",
    cls=AlertT.error
)
```

## Toast (via DaisyUI)

```python
# Loading indicator
Loading(cls=LoadingT.spinner)  # spinner, dots, ring, ball, bars, infinity
Loading(cls=LoadingT.lg)       # xs, sm, md, lg

# As HTMX indicator
Loading(cls=LoadingT.dots, htmx_indicator=True)
```

## Steps

```python
# Horizontal steps
Steps(
    LiStep("Step 1", cls=StepT.primary),
    LiStep("Step 2", cls=StepT.primary),
    LiStep("Step 3"),
    cls=StepsT.horizontal
)

# Vertical steps
Steps(
    LiStep("Register"),
    LiStep("Verify Email"),
    LiStep("Complete Profile"),
    cls=StepsT.vertical
)

# Step styles: primary, secondary, accent, info, success, warning, error, neutral
```

## Table

```python
# Basic table
Table(
    Thead(
        Tr(Th("Name"), Th("Email"), Th("Role"))
    ),
    Tbody(
        Tr(Td("Alice"), Td("alice@example.com"), Td("Admin")),
        Tr(Td("Bob"), Td("bob@example.com"), Td("User"))
    ),
    cls=TableT.striped  # divider, striped, hover, sm, lg, justify, middle, responsive
)
```

### TableFromLists

```python
# Create table from lists
headers = ["Name", "Age", "City"]
data = [
    ["Alice", 30, "NYC"],
    ["Bob", 25, "LA"],
    ["Charlie", 35, "Chicago"]
]

TableFromLists(
    header_data=headers,
    body_data=data,
    cls=TableT.hover
)
```

### TableFromDicts

```python
# Create table from list of dicts
headers = ["name", "age", "city"]
data = [
    {"name": "Alice", "age": 30, "city": "NYC"},
    {"name": "Bob", "age": 25, "city": "LA"}
]

TableFromDicts(
    header_data=headers,
    body_data=data,
    sortable=True,  # Enable sorting
    cls=TableT.striped
)
```

## Dropdown Navigation

```python
# Dropdown menu
DropDownNavContainer(
    Li(A("Profile", href="/profile")),
    Li(A("Settings", href="/settings")),
    NavDividerLi(),
    Li(A("Logout", href="/logout"))
)
```

## Theme Picker

```python
# Interactive theme selector
ThemePicker(
    color=True,     # Show color picker
    radii=True,     # Show border radius options
    shadows=True,   # Show shadow options
    font=True,      # Show font options
    mode=True       # Show light/dark mode toggle
)
```

## ApexChart

```python
# Interactive charts
ApexChart(
    series=[{
        'name': 'Sales',
        'data': [30, 40, 35, 50, 49, 60, 70]
    }],
    chart={'type': 'line', 'height': 350},
    xaxis={
        'categories': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
)
```

## Images

### PicSumImg

```python
# Placeholder images
PicSumImg(h=400, w=600, id=42)  # Specific image
PicSumImg(h=200, w=300, grayscale=True)
PicSumImg(h=300, w=400, blur=5)
```

## Component Examples

### Team Card Example

```python
def TeamCard(name, role, location="Remote"):
    return Card(
        DivLAligned(
            DiceBearAvatar(name, h=48, w=48),
            Div(
                H3(name),
                P(role, cls=TextT.muted)
            )
        ),
        footer=DivFullySpaced(
            DivHStacked(
                UkIcon("map-pin", height=16),
                P(location, cls=TextT.sm)
            ),
            DivHStacked(
                UkIconLink("mail", height=16),
                UkIconLink("linkedin", height=16),
                UkIconLink("github", height=16)
            )
        )
    )

# Usage
TeamCard("Alice Johnson", "Senior Developer", "San Francisco")
```

### Emergency Contact Form Example

```python
def EmergencyContactForm():
    relationships = ["Parent", "Sibling", "Friend", "Spouse", "Other"]
    
    return Div(
        DivCentered(
            H3("Emergency Contact"),
            Subtitle("Please provide contact information")
        ),
        Form(
            Grid(
                LabelInput("Name", id="name"),
                LabelInput("Email", id="email"),
                cols=2
            ),
            H3("Relationship to patient"),
            Grid(
                *[LabelCheckboxX(rel) for rel in relationships],
                cols=3
            ),
            DivCentered(
                Button("Submit Form", cls=ButtonT.primary)
            ),
            method="post",
            action="/emergency-contact"
        ),
        cls='space-y-4'
    )
```

### Product Card Example

```python
def ProductCard(name, price, image_id, in_stock=True):
    return Card(
        PicSumImg(h=200, w=300, id=image_id),
        H3(name),
        DivFullySpaced(
            P(f"${price}", cls=TextT.bold),
            Label("In Stock" if in_stock else "Out of Stock",
                  cls=LabelT.success if in_stock else LabelT.destructive)
        ),
        footer=Button("Add to Cart", cls=ButtonT.primary, disabled=not in_stock)
    )
```

### Stats Dashboard Example

```python
def StatCard(title, value, change, icon):
    return Card(
        DivFullySpaced(
            Div(
                P(title, cls=TextT.muted_sm),
                H2(value)
            ),
            UkIcon(icon, height=32, cls=TextT.muted)
        ),
        footer=P(
            change if change >= 0 else f"{change}%",
            cls=TextT.success if change >= 0 else TextT.error
        ),
        cls=CardT.default
    )

# Dashboard
Grid(
    StatCard("Revenue", "$45,231", "+20.1%", "dollar-sign"),
    StatCard("Users", "2,350", "+15.3%", "users"),
    StatCard("Orders", "1,234", "-5.2%", "shopping-cart"),
    StatCard("Conversion", "3.2%", "+0.5%", "trending-up"),
    cols=4
)
```

### Notification List Example

```python
def NotificationItem(title, message, time, read=False):
    return Li(
        DivHStacked(
            DivVStacked(
                P(title, cls=TextT.bold if not read else TextT.normal),
                P(message, cls=TextT.muted_sm),
                Small(time, cls=TextT.muted)
            ),
            cls="flex-1"
        ),
        cls="hover:bg-base-200 p-3"
    )

Ul(
    NotificationItem("New message", "You have a new message from Alice", "2m ago", read=False),
    NotificationItem("Update available", "Version 2.0 is ready", "1h ago", read=True),
    NotificationItem("Task completed", "Your export finished", "3h ago", read=True),
    cls=ListT.divider
)
```

### Settings Page Example

```python
def SettingsPage():
    return Titled("Settings",
        Section(
            Card(
                H3("Profile"),
                Form(
                    Grid(
                        LabelInput("First Name", id="fname"),
                        LabelInput("Last Name", id="lname"),
                        cols=2
                    ),
                    LabelInput("Email", id="email", type="email"),
                    LabelSelect(
                        Options("English", "Spanish", "French"),
                        label="Language",
                        id="lang"
                    ),
                    footer=DivRAligned(
                        Button("Cancel", cls=ButtonT.ghost),
                        Button("Save", cls=ButtonT.primary)
                    )
                )
            ),
            Card(
                H3("Preferences"),
                Form(
                    LabelCheckboxX("Email notifications", id="email_notif"),
                    LabelCheckboxX("Push notifications", id="push_notif"),
                    LabelRange("Volume", id="vol", min=0, max=100, value=70),
                    footer=Button("Update", cls=ButtonT.primary)
                )
            ),
            cls=SectionT.default
        )
    )
```
