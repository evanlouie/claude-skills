# Tool Integration and Function Calling

This guide covers how to integrate tools and functions with Microsoft Agent Framework agents.

## Overview

Tools allow agents to perform actions beyond text generation, such as:
- Calling APIs and web services
- Executing code and computations
- Querying databases
- Reading/writing files
- Integrating with external systems

## Basic Function as Tool

Any Python function can be a tool:

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

def calculate_area(length: float, width: float) -> float:
    """Calculate the area of a rectangle.
    
    Args:
        length: The length of the rectangle
        width: The width of the rectangle
        
    Returns:
        The area of the rectangle
    """
    return length * width

async def main():
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="MathBot",
        instructions="You help with calculations.",
        tools=[calculate_area]
    )
    
    result = await agent.run("What's the area of a 5x3 rectangle?")
    print(result.text)

asyncio.run(main())
```

**Key points:**
- Function must have type hints
- Docstring is crucial - it tells the LLM what the function does
- Use descriptive parameter names
- Return type should be JSON-serializable

## Tool Decorator

Use the `@tool` decorator for more control:

```python
from agent_framework.tools import tool

@tool(
    name="get_weather",
    description="Get current weather for a location"
)
def get_weather(location: str, units: str = "fahrenheit") -> dict:
    """Retrieve weather information.
    
    Args:
        location: City name or zip code
        units: Temperature units (fahrenheit or celsius)
    """
    return {
        "location": location,
        "temperature": 72,
        "conditions": "sunny",
        "units": units
    }
```

## Async Tools

Use async functions for I/O operations:

```python
import asyncio
import aiohttp
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def fetch_url(url: str) -> str:
    """Fetch content from a URL.
    
    Args:
        url: The URL to fetch
        
    Returns:
        The text content of the URL
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="WebBot",
        instructions="You can fetch and analyze web pages.",
        tools=[fetch_url]
    )
    
    result = await agent.run("What's on the homepage of example.com?")
    print(result.text)

asyncio.run(main())
```

## Structured Tool Parameters with Pydantic

Use Pydantic models for complex parameters:

```python
from pydantic import BaseModel, Field
from typing import Literal

class SearchQuery(BaseModel):
    query: str = Field(description="The search query")
    max_results: int = Field(default=10, description="Maximum number of results")
    category: Literal["news", "web", "images"] = Field(
        default="web",
        description="Category to search in"
    )

def search(params: SearchQuery) -> list[dict]:
    """Search the web using structured parameters.
    
    Args:
        params: Search parameters including query, max results, and category
    """
    return [
        {"title": f"Result for {params.query}", "url": "http://example.com"}
        for _ in range(params.max_results)
    ]
```

## Error Handling in Tools

Tools should handle errors gracefully:

```python
def safe_divide(a: float, b: float) -> str:
    """Divide two numbers safely.
    
    Args:
        a: The numerator
        b: The denominator
        
    Returns:
        The result of division or an error message
    """
    try:
        if b == 0:
            return "Error: Cannot divide by zero"
        result = a / b
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"
```

## Multiple Tools

Register multiple tools with an agent:

```python
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

def subtract(a: float, b: float) -> float:
    """Subtract two numbers."""
    return a - b

def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

agent = client.create_agent(
    name="Calculator",
    instructions="You are a calculator assistant.",
    tools=[add, subtract, multiply]
)
```

## Tool Results in Conversation

Access tool call results in the conversation:

```python
result = await agent.run("What's 15 multiplied by 7?")

# Access tool calls made during execution
if result.tool_calls:
    for tool_call in result.tool_calls:
        print(f"Tool: {tool_call.name}")
        print(f"Args: {tool_call.arguments}")
        print(f"Result: {tool_call.result}")
```

## MCP (Model Context Protocol) Integration

Connect to MCP servers for external tools:

```python
from agent_framework.mcp import MCPClient

async def main():
    # Connect to MCP server
    mcp_client = MCPClient(server_url="http://localhost:3000")
    await mcp_client.connect()
    
    # Get available tools from MCP server
    mcp_tools = await mcp_client.get_tools()
    
    # Create agent with MCP tools
    agent = client.create_agent(
        name="MCPBot",
        instructions="You can use external tools via MCP.",
        tools=mcp_tools
    )
    
    result = await agent.run("Use the MCP tools to help me")
    print(result.text)
    
    await mcp_client.disconnect()
```

## Database Integration Example

```python
import sqlite3
from typing import List, Dict

def query_database(sql: str) -> List[Dict]:
    """Execute SQL query on the database.
    
    Args:
        sql: SQL SELECT query to execute
        
    Returns:
        List of rows as dictionaries
    """
    conn = sqlite3.connect("mydb.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        cursor.execute(sql)
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return results
    except Exception as e:
        conn.close()
        return [{"error": str(e)}]

agent = client.create_agent(
    name="DBAgent",
    instructions="You can query the database. Only generate SELECT queries.",
    tools=[query_database]
)
```

## File System Tools

```python
import os
from pathlib import Path

def list_files(directory: str) -> List[str]:
    """List files in a directory.
    
    Args:
        directory: Path to directory
        
    Returns:
        List of file names
    """
    try:
        path = Path(directory)
        if not path.exists():
            return [f"Error: Directory {directory} does not exist"]
        return [f.name for f in path.iterdir()]
    except Exception as e:
        return [f"Error: {str(e)}"]

def read_file(filepath: str) -> str:
    """Read contents of a file.
    
    Args:
        filepath: Path to file
        
    Returns:
        File contents
    """
    try:
        with open(filepath, 'r') as f:
            return f.read()
    except Exception as e:
        return f"Error: {str(e)}"

agent = client.create_agent(
    name="FileBot",
    instructions="You can list and read files. Never modify or delete files.",
    tools=[list_files, read_file]
)
```

## API Integration with Authentication

```python
import os
import aiohttp
from typing import Optional

async def call_api(
    endpoint: str,
    method: str = "GET",
    data: Optional[dict] = None
) -> dict:
    """Call external API with authentication.
    
    Args:
        endpoint: API endpoint path
        method: HTTP method (GET, POST, etc.)
        data: Optional request body data
        
    Returns:
        API response data
    """
    api_key = os.environ.get("API_KEY")
    base_url = os.environ.get("API_BASE_URL")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.request(
            method,
            f"{base_url}/{endpoint}",
            headers=headers,
            json=data
        ) as response:
            return await response.json()
```

## Tool Rate Limiting

```python
import asyncio
from datetime import datetime, timedelta

class RateLimitedTool:
    def __init__(self, calls_per_minute: int):
        self.calls_per_minute = calls_per_minute
        self.calls = []
    
    async def call(self, func, *args, **kwargs):
        """Execute function with rate limiting."""
        now = datetime.now()
        
        # Remove old calls
        self.calls = [t for t in self.calls if now - t < timedelta(minutes=1)]
        
        # Check rate limit
        if len(self.calls) >= self.calls_per_minute:
            wait_time = 60 - (now - self.calls[0]).total_seconds()
            await asyncio.sleep(wait_time)
        
        # Execute and record
        self.calls.append(datetime.now())
        return await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)

rate_limiter = RateLimitedTool(calls_per_minute=60)

async def expensive_api_call(query: str) -> str:
    """Call an API with rate limiting."""
    return await rate_limiter.call(actual_api_call, query)
```

## Caching Tool Results

```python
from functools import lru_cache
from typing import Dict

@lru_cache(maxsize=100)
def cached_lookup(key: str) -> Dict:
    """Lookup data with caching.
    
    Args:
        key: Lookup key
        
    Returns:
        Cached or fresh data
    """
    # Expensive operation
    return {"key": key, "data": "some expensive data"}
```

## Tool Validation

```python
from pydantic import BaseModel, validator

class EmailRequest(BaseModel):
    recipient: str
    subject: str
    body: str
    
    @validator('recipient')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email address')
        return v
    
    @validator('subject')
    def validate_subject(cls, v):
        if len(v) > 100:
            raise ValueError('Subject too long')
        return v

def send_email(request: EmailRequest) -> str:
    """Send an email with validated parameters."""
    # Send email logic
    return f"Email sent to {request.recipient}"
```

## Best Practices

1. **Clear Documentation**: Write detailed docstrings
2. **Type Hints**: Always use type hints for parameters and returns
3. **Error Handling**: Return error messages, don't raise exceptions
4. **Descriptive Names**: Use clear, descriptive function and parameter names
5. **Validation**: Validate inputs before processing
6. **Async for I/O**: Use async functions for network/file operations
7. **Rate Limiting**: Implement rate limiting for external APIs
8. **Caching**: Cache expensive operations when appropriate
9. **Security**: Validate and sanitize all inputs
10. **Logging**: Add logging for debugging tool calls

## Security Considerations

- Never expose dangerous operations (file deletion, system commands)
- Validate and sanitize all inputs
- Use environment variables for secrets
- Implement proper authentication
- Limit tool scope (read-only when possible)
- Add rate limiting and quotas
- Log all tool executions
- Use principle of least privilege

## Debugging Tools

Enable tool call logging:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("agent_framework.tools")
logger.setLevel(logging.DEBUG)
```

Inspect tool calls:

```python
result = await agent.run("Query the database")

for tool_call in result.tool_calls:
    print(f"Tool: {tool_call.name}")
    print(f"Input: {tool_call.arguments}")
    print(f"Output: {tool_call.result}")
    print(f"Duration: {tool_call.duration_ms}ms")
```

## Azure Functions Integration

Use Azure Functions as tools:

```python
from agent_framework.azure import AzureFunctionTool, AzureFunctionStorageQueue

azure_function_tool = AzureFunctionTool(
    name="process_data",
    description="Process data using Azure Function",
    parameters={
        "type": "object",
        "properties": {
            "data": {"type": "string", "description": "Data to process"}
        }
    },
    input_queue=AzureFunctionStorageQueue(
        queue_name="input-queue",
        storage_service_endpoint="https://mystorage.queue.core.windows.net"
    ),
    output_queue=AzureFunctionStorageQueue(
        queue_name="output-queue",
        storage_service_endpoint="https://mystorage.queue.core.windows.net"
    )
)

agent = client.create_agent(
    name="AzureBot",
    instructions="Process data using Azure Functions",
    tools=[azure_function_tool]
)
```

## Common Tool Patterns

### Web Search Tool
```python
async def web_search(query: str, max_results: int = 5) -> List[Dict]:
    """Search the web and return results."""
    # Implementation using search API
    pass
```

### Calculation Tool
```python
def calculate(expression: str) -> float:
    """Safely evaluate mathematical expressions."""
    # Safe eval implementation
    pass
```

### Translation Tool
```python
async def translate(text: str, target_language: str) -> str:
    """Translate text to target language."""
    # Implementation using translation API
    pass
```

### Data Visualization Tool
```python
def create_chart(data: List[float], chart_type: str) -> str:
    """Create a chart and return path to image."""
    # Implementation using matplotlib/plotly
    pass
```
