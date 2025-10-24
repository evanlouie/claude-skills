# WebSocket Example

Simple websocket application with HTMX.

```python
from asyncio import sleep
from fasthtml.common import *

# Enable websockets extension
app = FastHTML(exts='ws')
rt = app.route

def mk_inp():
    return Input(id='msg', autofocus=True)

notifications_id = 'notifications'

@rt('/')
async def get():
    # Container with websocket connection
    cts = Div(
        Div(id=notifications_id),
        Form(mk_inp(), id='form', ws_send=True),
        hx_ext='ws',
        ws_connect='/ws'
    )
    return Titled('Websocket Test', cts)

# Connection callback
async def on_connect(send):
    await send(Div('Hello, you have connected', id=notifications_id))

# Disconnection callback
async def on_disconnect():
    print('Disconnected!')

# Websocket handler
@app.ws('/ws', conn=on_connect, disconn=on_disconnect)
async def ws(msg: str, send):
    # Send immediate response
    await send(Div('Hello ' + msg, id=notifications_id))
    
    # Wait and send another response
    await sleep(2)
    
    # Return final message and reset input
    return Div('Goodbye ' + msg, id=notifications_id), mk_inp()

serve()
```

## Key Concepts

### Setup
- Use `FastHTML(exts='ws')` to enable websocket extension
- Add `hx_ext='ws'` to container element
- Use `ws_connect='/ws'` to specify websocket endpoint

### Handler
- Use `@app.ws()` decorator with connection/disconnection callbacks
- Handler receives messages and `send` function
- Can `await send()` multiple times
- Can `return` FT elements (treated as final response)

### Form Submission
- `ws_send=True` on Form sends form data through websocket
- Input values are sent as the `msg` parameter

## Advanced Chatbot Example

```python
app = FastHTML(exts='ws')
rt = app.route
msgs = []

@rt('/')
def home():
    return Div(hx_ext='ws', ws_connect='/ws')(
        Div(Ul(*[Li(m) for m in msgs], id='msg-list')),
        Form(Input(id='msg'), id='form', ws_send=True)
    )

async def ws(msg: str):
    msgs.append(msg)
    await send(Ul(*[Li(m) for m in msgs], id='msg-list'))

send = setup_ws(app, ws)
serve()
```
