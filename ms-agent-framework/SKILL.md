---
name: ms-agent-framework
description: Build AI agents and multi-agent systems in Python using Microsoft Agent Framework. Use when creating agentic applications, orchestrating multi-agent workflows, building chat agents with tool calling, or migrating from AutoGen/Semantic Kernel to production-ready agent systems.
---

# Microsoft Agent Framework

Microsoft Agent Framework is an open-source SDK for building, orchestrating, and deploying AI agents and multi-agent workflows in Python. It unifies capabilities from Semantic Kernel (enterprise features) and AutoGen (multi-agent patterns) into a single production-ready framework.

## When to Use This Skill

Use Microsoft Agent Framework for:
- Building chat agents with Azure OpenAI, Azure AI, or other LLM providers
- Creating multi-agent systems with sequential, concurrent, or group chat patterns
- Implementing agentic workflows with tool calling and function execution
- Graph-based orchestration with checkpointing and human-in-the-loop
- Migrating from AutoGen or Semantic Kernel to production-grade systems
- Integrating agents with MCP (Model Context Protocol) servers

## Installation

Install the framework via pip:

```bash
pip install agent-framework
```

For specific Azure integrations:
```bash
# Azure OpenAI
pip install agent-framework azure-identity

# Azure AI Foundry
pip install agent-framework azure-identity
```

## Core Concepts

### 1. Agents
Agents are AI-powered entities that can reason, use tools, and interact with users. The framework supports multiple agent types:

- **ChatAgent**: General-purpose conversational agent
- **CodeAgent**: Specialized for code execution
- **AssistantAgent**: AutoGen-style assistant with tools
- **ReActAgent**: Reasoning and acting pattern
- **Custom Agents**: Extend base classes for specialized behavior

### 2. Chat Clients
Chat clients provide the LLM backend for agents:

- **AzureOpenAIChatClient**: Azure OpenAI service
- **AzureAIAgentClient**: Azure AI Foundry
- **OpenAIChatClient**: OpenAI API
- **Custom clients**: Implement IChatClient interface

### 3. Tools and Functions
Agents can call Python functions as tools. Define tools using decorators or function registration.

### 4. Workflows
Graph-based orchestration for complex multi-agent systems with nodes (agents/functions) and edges (data flows).

### 5. Memory and State
Thread-based state management with support for Redis, Pinecone, Qdrant, Weaviate, Elasticsearch, Postgres, or custom stores.

## Quick Start Patterns

### Basic Chat Agent with Azure OpenAI

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    # Create agent with Azure OpenAI
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="Assistant",
        instructions="You are a helpful assistant."
    )
    
    # Run the agent
    result = await agent.run("What is the capital of France?")
    print(result.text)

asyncio.run(main())
```

Environment variables needed:
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `AZURE_OPENAI_DEPLOYMENT_NAME`: Model deployment name (e.g., "gpt-4o-mini")

### Basic Chat Agent with Azure AI

```python
import asyncio
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from azure.identity.aio import AzureCliCredential

async def main():
    async with (
        AzureCliCredential() as credential,
        ChatAgent(
            chat_client=AzureAIAgentClient(async_credential=credential),
            instructions="You are good at telling jokes."
        ) as agent,
    ):
        result = await agent.run("Tell me a joke about a pirate.")
        print(result.text)

asyncio.run(main())
```

Environment variables needed:
- `AZURE_AI_PROJECT_ENDPOINT`: Your Azure AI project endpoint
- `AZURE_AI_MODEL_DEPLOYMENT_NAME`: Model deployment name

### Agent with Tools (Function Calling)

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

# Define a tool as a Python function
def get_weather(location: str) -> str:
    """Get the current weather for a location."""
    return f"Weather in {location}: 72°F and sunny"

async def main():
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="WeatherBot",
        instructions="You help users check the weather.",
        tools=[get_weather]  # Register the tool
    )
    
    result = await agent.run("What's the weather in Seattle?")
    print(result.text)

asyncio.run(main())
```

### Streaming Responses

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="StreamBot",
        instructions="You are a helpful assistant."
    )
    
    # Stream responses
    async for chunk in agent.run_stream("Write a haiku about coding"):
        print(chunk.text, end="", flush=True)

asyncio.run(main())
```

### Multi-Turn Conversations

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    agent = AzureOpenAIChatClient(
        credential=AzureCliCredential()
    ).create_agent(
        name="ChatBot",
        instructions="You are a helpful assistant."
    )
    
    # First turn
    result1 = await agent.run("My name is Alice")
    print(result1.text)
    
    # Second turn - agent remembers context
    result2 = await agent.run("What's my name?")
    print(result2.text)  # Will respond with "Alice"

asyncio.run(main())
```

## Multi-Agent Patterns

For complex multi-agent orchestration patterns (sequential, concurrent, group chat, handoffs), workflows, and advanced features, see `references/multi_agent_patterns.md`.

## Authentication

The framework supports multiple authentication methods:

### Azure CLI (Recommended for Development)
```bash
az login
```

```python
from azure.identity import AzureCliCredential
credential = AzureCliCredential()
```

### API Key
```python
# Set environment variable
import os
os.environ["AZURE_OPENAI_API_KEY"] = "your-api-key"

# Use in client (no credential needed)
```

### Managed Identity (Production)
```python
from azure.identity import ManagedIdentityCredential
credential = ManagedIdentityCredential()
```

## Model Selection

Common Azure OpenAI models:
- `gpt-4o`: Most capable, multimodal
- `gpt-4o-mini`: Efficient for everyday tasks
- `gpt-4-turbo`: Previous generation flagship
- `gpt-35-turbo`: Cost-effective for simple tasks

Specify via deployment name in environment variables or client constructor.

## Best Practices

1. **Use async/await**: The framework is async-first for better performance
2. **Context managers**: Use `async with` for proper resource cleanup
3. **Environment variables**: Store endpoints and keys in environment, not code
4. **Error handling**: Wrap agent calls in try/except for robustness
5. **Instructions**: Be clear and specific in agent instructions
6. **Tool descriptions**: Write detailed docstrings for tool functions
7. **Streaming**: Use `run_stream()` for better UX on long responses
8. **State management**: Use threads for multi-turn conversations

## Common Patterns

### Retry Logic
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def run_agent_with_retry(agent, message):
    return await agent.run(message)
```

### Tool with Schema Validation
```python
from pydantic import BaseModel

class WeatherRequest(BaseModel):
    location: str
    units: str = "fahrenheit"

def get_weather(request: WeatherRequest) -> str:
    """Get weather for a location with specified units."""
    return f"Weather in {request.location}: 72°{request.units[0].upper()}"
```

### Agent with Custom Instructions from File
```python
with open("instructions.txt", "r") as f:
    instructions = f.read()

agent = client.create_agent(
    name="CustomBot",
    instructions=instructions
)
```

## Troubleshooting

**"Authentication failed"**
- Run `az login` if using AzureCliCredential
- Verify user has "Cognitive Services OpenAI User" or "Cognitive Services OpenAI Contributor" role
- Check environment variables are set correctly

**"Model deployment not found"**
- Verify deployment name matches what's in Azure Portal
- Ensure deployment is in the same region as your endpoint
- Check deployment is active and not paused

**"Tool not being called"**
- Ensure function has a clear docstring describing what it does
- Use type hints on function parameters
- Check function name is descriptive and relevant

**Memory/context issues**
- Use threads for multi-turn conversations
- Clear thread state when starting new conversations
- Consider context window limits of your model

## Resources

### references/
- `multi_agent_patterns.md`: Advanced multi-agent orchestration, workflows, group chat
- `tool_integration.md`: MCP integration, custom tools, Azure Functions
- `migration.md`: Migration guides from AutoGen and Semantic Kernel

### scripts/
- `basic_agent_template.py`: Quick-start template for new agents
- `tool_agent_template.py`: Template for agents with custom tools
- `conversation_loop.py`: Interactive conversation loop implementation

## Additional Documentation

Official documentation: https://learn.microsoft.com/agent-framework/
GitHub repository: https://github.com/microsoft/agent-framework
Samples: https://github.com/microsoft/agent-framework/tree/main/python/samples
