# Migration Guide

This guide helps developers migrate from AutoGen or Semantic Kernel to Microsoft Agent Framework.

## Why Migrate?

Microsoft Agent Framework combines the best of both worlds:
- **From AutoGen**: Simple abstractions for single and multi-agent patterns
- **From Semantic Kernel**: Enterprise features, state management, type safety, telemetry

Benefits of migration:
- Unified framework (no need to choose between innovation and production stability)
- Better state management with threads
- Improved type safety
- Built-in observability and telemetry
- Graph-based workflows with checkpointing
- Active development and support
- Seamless Azure integration

## From AutoGen to Agent Framework

### Basic Agent Creation

**AutoGen (0.2):**
```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(
    name="assistant",
    llm_config={"model": "gpt-4"}
)

user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER"
)
```

**Agent Framework:**
```python
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

agent = AzureOpenAIChatClient(
    credential=AzureCliCredential()
).create_agent(
    name="assistant",
    instructions="You are a helpful assistant."
)

result = await agent.run("Hello!")
```

### Function Calling

**AutoGen (0.2):**
```python
def calculate(a: int, b: int) -> int:
    return a + b

assistant = AssistantAgent(
    name="assistant",
    llm_config={
        "functions": [
            {
                "name": "calculate",
                "description": "Add two numbers",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "a": {"type": "integer"},
                        "b": {"type": "integer"}
                    }
                }
            }
        ]
    }
)
```

**Agent Framework:**
```python
def calculate(a: int, b: int) -> int:
    """Add two numbers.
    
    Args:
        a: First number
        b: Second number
    """
    return a + b

agent = client.create_agent(
    name="assistant",
    instructions="You are a calculator.",
    tools=[calculate]  # Automatic function schema generation
)
```

### Group Chat

**AutoGen (0.2):**
```python
from autogen import GroupChat, GroupChatManager

agents = [agent1, agent2, agent3]

group_chat = GroupChat(
    agents=agents,
    messages=[],
    max_round=10
)

manager = GroupChatManager(
    groupchat=group_chat,
    llm_config={"model": "gpt-4"}
)

user_proxy.initiate_chat(
    manager,
    message="Let's discuss this topic"
)
```

**Agent Framework:**
```python
from agent_framework import GroupChat

agents = [agent1, agent2, agent3]

group = GroupChat(
    agents=agents,
    messages=[],
    max_round=10
)

result = await group.run("Let's discuss this topic")
```

### Multi-Agent Conversation

**AutoGen (0.2):**
```python
# Sequential handoffs
user_proxy.initiate_chat(
    research_agent,
    message="Research Python"
)

research_result = research_agent.last_message()

user_proxy.initiate_chat(
    writer_agent,
    message=f"Write about: {research_result}"
)
```

**Agent Framework:**
```python
# Sequential execution
research_result = await research_agent.run("Research Python")
article = await writer_agent.run(
    f"Write about: {research_result.text}"
)
```

### Key Differences from AutoGen

1. **Async-First**: Agent Framework is built on async/await
2. **Type Safety**: Strong typing throughout
3. **State Management**: Built-in thread-based state
4. **Simplified API**: Fewer concepts to learn
5. **Direct Results**: No need for message history parsing
6. **Better Errors**: More informative error messages

### Migration Checklist

- [ ] Update imports from `autogen` to `agent_framework`
- [ ] Convert to async/await patterns
- [ ] Replace `initiate_chat` with `agent.run()`
- [ ] Update function definitions with type hints and docstrings
- [ ] Replace `GroupChatManager` with `GroupChat`
- [ ] Update authentication to use Azure credentials
- [ ] Test all agent interactions
- [ ] Update configuration management

## From Semantic Kernel to Agent Framework

### Basic Agent/Kernel

**Semantic Kernel:**
```python
import semantic_kernel as sk

kernel = sk.Kernel()

kernel.add_chat_service(
    "chat",
    sk.connectors.ai.open_ai.AzureChatCompletion(
        deployment_name="gpt-4",
        endpoint="...",
        api_key="..."
    )
)

result = await kernel.invoke_prompt("Hello, world!")
```

**Agent Framework:**
```python
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

agent = AzureOpenAIChatClient(
    credential=AzureCliCredential()
).create_agent(
    name="assistant",
    instructions="You are a helpful assistant."
)

result = await agent.run("Hello, world!")
```

### Plugins/Functions

**Semantic Kernel:**
```python
from semantic_kernel.skill_definition import sk_function

class MathPlugin:
    @sk_function(
        description="Add two numbers",
        name="add"
    )
    def add(self, a: int, b: int) -> int:
        return a + b

kernel.import_skill(MathPlugin(), "math")
result = await kernel.invoke("math", "add", a=5, b=3)
```

**Agent Framework:**
```python
def add(a: int, b: int) -> int:
    """Add two numbers.
    
    Args:
        a: First number
        b: Second number
    """
    return a + b

agent = client.create_agent(
    name="math_assistant",
    instructions="You help with math.",
    tools=[add]
)

result = await agent.run("What is 5 + 3?")
```

### Memory/Context

**Semantic Kernel:**
```python
from semantic_kernel.memory import SemanticTextMemory

memory = SemanticTextMemory()
kernel.register_memory(memory)

await kernel.memory.save_information_async(
    collection="facts",
    text="The capital of France is Paris",
    id="fact1"
)

memories = await kernel.memory.search_async(
    collection="facts",
    query="capital of France"
)
```

**Agent Framework:**
```python
from agent_framework.memory import MemoryProvider

# Use thread-based conversation memory (automatic)
result1 = await agent.run("Remember: The capital of France is Paris")
result2 = await agent.run("What is the capital of France?")

# Or use external memory store
from agent_framework.memory import RedisMemoryProvider

memory = RedisMemoryProvider(
    connection_string="redis://localhost:6379"
)

agent = client.create_agent(
    name="assistant",
    instructions="You are helpful.",
    memory_provider=memory
)
```

### Planners

**Semantic Kernel:**
```python
from semantic_kernel.planning import SequentialPlanner

planner = SequentialPlanner(kernel)
plan = await planner.create_plan_async("Research and write about Python")
result = await plan.invoke_async()
```

**Agent Framework:**
```python
from agent_framework import Workflow, WorkflowNode

workflow = Workflow()

researcher = WorkflowNode(
    id="research",
    agent=research_agent
)

writer = WorkflowNode(
    id="write",
    agent=writer_agent
)

workflow.add_node(researcher)
workflow.add_node(writer)
workflow.add_edge(from_node="research", to_node="write")

result = await workflow.run(
    start_node="research",
    input="Research and write about Python"
)
```

### Key Differences from Semantic Kernel

1. **Agent-Centric**: Focuses on agents rather than kernel
2. **Simplified API**: Fewer abstractions and concepts
3. **Better Multi-Agent**: Built-in multi-agent orchestration
4. **Workflows**: Graph-based workflows vs. planners
5. **State Management**: Thread-based state by default
6. **Async Throughout**: Fully async from ground up

### Migration Checklist

- [ ] Replace `Kernel` with `ChatClient` and `Agent`
- [ ] Convert plugins to simple Python functions with docstrings
- [ ] Update memory usage to thread-based or external memory providers
- [ ] Replace planners with workflows
- [ ] Update authentication to Azure credentials
- [ ] Convert all synchronous code to async
- [ ] Test all function calls
- [ ] Update configuration management

## Common Migration Patterns

### Pattern 1: Simple Chat

**Before (either framework):**
```python
# Complex setup with multiple objects
kernel/chat_manager = setup_framework()
result = execute_chat(kernel/chat_manager, "message")
```

**After (Agent Framework):**
```python
agent = client.create_agent(name="bot", instructions="...")
result = await agent.run("message")
```

### Pattern 2: Multi-Step Workflow

**Before:**
```python
# Multiple manual steps with state management
step1 = await agent1.run(...)
step2 = await agent2.run(step1.result)
step3 = await agent3.run(step2.result)
```

**After:**
```python
workflow = Workflow()
workflow.add_node(agent1)
workflow.add_node(agent2)
workflow.add_node(agent3)
workflow.add_edge(from_node=agent1, to_node=agent2)
workflow.add_edge(from_node=agent2, to_node=agent3)

result = await workflow.run(start_node=agent1, input="...")
```

### Pattern 3: Function Calling

**Before:**
```python
# Manual schema definition
function_schema = {
    "name": "get_weather",
    "description": "Get weather",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        }
    }
}
```

**After:**
```python
def get_weather(location: str) -> dict:
    """Get weather for a location.
    
    Args:
        location: City name
    """
    return {"temp": 72}

# Schema generated automatically from function signature
```

## Azure Integration Differences

### Authentication

**Old (both frameworks):**
```python
# API key in code or config
api_key = "sk-..."
```

**New (Agent Framework):**
```python
# Azure CLI or Managed Identity
from azure.identity import AzureCliCredential, ManagedIdentityCredential

credential = AzureCliCredential()  # Development
# or
credential = ManagedIdentityCredential()  # Production
```

### Configuration

**Old:**
```python
# Manual configuration
config = {
    "endpoint": "...",
    "deployment": "...",
    "api_key": "..."
}
```

**New:**
```python
# Environment variables (recommended)
# AZURE_OPENAI_ENDPOINT=...
# AZURE_OPENAI_DEPLOYMENT_NAME=...

# Or explicit
client = AzureOpenAIChatClient(
    endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    credential=AzureCliCredential()
)
```

## Performance Considerations

Agent Framework improvements:
- **Async I/O**: Better concurrency and throughput
- **Connection Pooling**: Efficient resource usage
- **Caching**: Built-in response caching
- **Streaming**: Better UX with streaming responses
- **Parallel Execution**: Easy parallel agent execution

## Testing After Migration

```python
import pytest
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

@pytest.fixture
async def agent():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    return client.create_agent(
        name="test_agent",
        instructions="You are helpful."
    )

@pytest.mark.asyncio
async def test_basic_response(agent):
    result = await agent.run("Say hello")
    assert "hello" in result.text.lower()

@pytest.mark.asyncio
async def test_tool_calling(agent):
    def add(a: int, b: int) -> int:
        """Add two numbers."""
        return a + b
    
    agent_with_tools = agent.with_tools([add])
    result = await agent_with_tools.run("What is 2 + 2?")
    assert "4" in result.text
```

## Troubleshooting Migration Issues

**Issue: Import errors**
```bash
# Solution: Ensure agent-framework is installed
pip install agent-framework
```

**Issue: Async/await errors**
```python
# Solution: Wrap in async function
import asyncio

async def main():
    result = await agent.run("message")
    
asyncio.run(main())
```

**Issue: Authentication failures**
```bash
# Solution: Login with Azure CLI
az login
```

**Issue: Missing model deployment**
```python
# Solution: Verify deployment name
# Check Azure Portal for exact deployment name
```

## Getting Help

- Official documentation: https://learn.microsoft.com/agent-framework/
- GitHub issues: https://github.com/microsoft/agent-framework/issues
- Samples: https://github.com/microsoft/agent-framework/tree/main/python/samples
- Migration guides: https://learn.microsoft.com/agent-framework/migration-guide/

## Migration Timeline Recommendations

1. **Week 1**: Set up development environment, test basic agents
2. **Week 2**: Migrate core functionality and simple agents
3. **Week 3**: Migrate multi-agent patterns and workflows
4. **Week 4**: Testing, optimization, and deployment

Start with non-critical features to gain confidence before migrating production systems.
