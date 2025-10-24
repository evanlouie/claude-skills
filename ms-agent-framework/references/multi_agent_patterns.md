# Multi-Agent Patterns and Workflows

This guide covers advanced multi-agent orchestration patterns in Microsoft Agent Framework.

## Overview

Multi-agent systems involve multiple AI agents working together to solve complex tasks. The framework supports:
- Sequential workflows (one agent after another)
- Concurrent execution (multiple agents in parallel)
- Group chat (agents discussing and collaborating)
- Handoff patterns (transferring between specialists)
- Graph-based workflows (complex orchestration)

## Sequential Agent Pattern

Agents run one after another, with outputs passed between them:

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    
    # Create specialized agents
    researcher = client.create_agent(
        name="Researcher",
        instructions="Research topics thoroughly and provide detailed facts."
    )
    
    writer = client.create_agent(
        name="Writer",
        instructions="Take research facts and write engaging, clear content."
    )
    
    # Sequential execution
    research = await researcher.run("Research the history of Python programming")
    article = await writer.run(f"Write a blog post using this research: {research.text}")
    
    print(article.text)

asyncio.run(main())
```

## Group Chat Pattern

Multiple agents discuss a topic and collaborate:

```python
import asyncio
from agent_framework import GroupChat, AssistantAgent
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    
    # Create specialized agents
    agents = [
        client.create_agent(
            name="Architect",
            instructions="You design software architecture."
        ),
        client.create_agent(
            name="Developer", 
            instructions="You write code and implement features."
        ),
        client.create_agent(
            name="Tester",
            instructions="You find bugs and ensure quality."
        )
    ]
    
    # Create group chat
    group = GroupChat(
        agents=agents,
        messages=[],
        max_round=10
    )
    
    # Run group discussion
    result = await group.run("Design and plan a todo list application")
    print(result)

asyncio.run(main())
```

## Handoff Pattern

Transfer conversation from one specialized agent to another:

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    
    # Triage agent decides which specialist to use
    triage = client.create_agent(
        name="Triage",
        instructions="Determine if question is about sales or technical support."
    )
    
    sales = client.create_agent(
        name="SalesAgent",
        instructions="Help with pricing, plans, and purchasing."
    )
    
    technical = client.create_agent(
        name="TechnicalAgent",
        instructions="Help with technical issues and troubleshooting."
    )
    
    # User query
    query = "How do I reset my password?"
    
    # Triage determines routing
    triage_result = await triage.run(
        f"Is this sales or technical? Query: {query}"
    )
    
    # Route to appropriate agent
    if "technical" in triage_result.text.lower():
        result = await technical.run(query)
    else:
        result = await sales.run(query)
    
    print(result.text)

asyncio.run(main())
```

## Workflow Pattern (Graph-Based)

Create complex orchestration with explicit control flow:

```python
import asyncio
from agent_framework import Workflow, WorkflowNode, WorkflowEdge
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    
    # Create workflow
    workflow = Workflow()
    
    # Add nodes (agents or functions)
    researcher_node = WorkflowNode(
        id="research",
        agent=client.create_agent(
            name="Researcher",
            instructions="Research the given topic."
        )
    )
    
    writer_node = WorkflowNode(
        id="write",
        agent=client.create_agent(
            name="Writer",
            instructions="Write content based on research."
        )
    )
    
    reviewer_node = WorkflowNode(
        id="review",
        agent=client.create_agent(
            name="Reviewer",
            instructions="Review content for quality and accuracy."
        )
    )
    
    # Add nodes to workflow
    workflow.add_node(researcher_node)
    workflow.add_node(writer_node)
    workflow.add_node(reviewer_node)
    
    # Connect nodes with edges
    workflow.add_edge(WorkflowEdge(from_node="research", to_node="write"))
    workflow.add_edge(WorkflowEdge(from_node="write", to_node="review"))
    
    # Execute workflow
    result = await workflow.run(start_node="research", input="Python programming history")
    print(result)

asyncio.run(main())
```

## Conditional Routing in Workflows

Route based on conditions:

```python
import asyncio
from agent_framework import Workflow, WorkflowNode, WorkflowEdge
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

def route_function(state):
    """Determine next node based on state."""
    if state.get("needs_review", False):
        return "review"
    else:
        return "publish"

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    workflow = Workflow()
    
    # Writer node
    writer = WorkflowNode(
        id="write",
        agent=client.create_agent(
            name="Writer",
            instructions="Write content."
        )
    )
    
    # Conditional node
    router = WorkflowNode(
        id="router",
        function=route_function
    )
    
    # Review node
    reviewer = WorkflowNode(
        id="review",
        agent=client.create_agent(
            name="Reviewer",
            instructions="Review and improve content."
        )
    )
    
    # Publish node
    publisher = WorkflowNode(
        id="publish",
        function=lambda state: f"Published: {state['content']}"
    )
    
    # Build workflow
    workflow.add_node(writer)
    workflow.add_node(router)
    workflow.add_node(reviewer)
    workflow.add_node(publisher)
    
    workflow.add_edge(WorkflowEdge(from_node="write", to_node="router"))
    workflow.add_edge(WorkflowEdge(from_node="router", to_node="review", condition="needs_review"))
    workflow.add_edge(WorkflowEdge(from_node="router", to_node="publish", condition="ready"))
    workflow.add_edge(WorkflowEdge(from_node="review", to_node="publish"))
    
    result = await workflow.run(start_node="write", input="Blog post topic")
    print(result)

asyncio.run(main())
```

## Parallel Execution Pattern

Run multiple agents concurrently:

```python
import asyncio
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    
    # Create multiple specialized agents
    agents = {
        "news": client.create_agent(
            name="NewsAgent",
            instructions="Summarize tech news."
        ),
        "weather": client.create_agent(
            name="WeatherAgent",
            instructions="Provide weather updates."
        ),
        "stocks": client.create_agent(
            name="StocksAgent",
            instructions="Report on stock market."
        )
    }
    
    # Run all agents in parallel
    tasks = {
        name: agent.run(f"Provide latest {name} information")
        for name, agent in agents.items()
    }
    
    results = await asyncio.gather(*tasks.values())
    
    # Combine results
    for (name, _), result in zip(tasks.items(), results):
        print(f"\n{name.upper()}:")
        print(result.text)

asyncio.run(main())
```

## Human-in-the-Loop Pattern

Pause workflow for human input:

```python
import asyncio
from agent_framework import Workflow, WorkflowNode
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

async def get_human_approval(state):
    """Request human approval."""
    print(f"Content to approve: {state['content']}")
    approval = input("Approve? (yes/no): ")
    return approval.lower() == "yes"

async def main():
    client = AzureOpenAIChatClient(credential=AzureCliCredential())
    workflow = Workflow()
    
    writer = WorkflowNode(
        id="write",
        agent=client.create_agent(
            name="Writer",
            instructions="Write content."
        )
    )
    
    # Human approval node
    approval = WorkflowNode(
        id="approval",
        function=get_human_approval,
        human_in_loop=True  # Marks this as requiring human interaction
    )
    
    # Build workflow
    workflow.add_node(writer)
    workflow.add_node(approval)
    workflow.add_edge(from_node="write", to_node="approval")
    
    result = await workflow.run(start_node="write", input="Write a press release")
    print(f"Final result: {result}")

asyncio.run(main())
```

## Checkpointing and Recovery

Save workflow state for long-running processes:

```python
import asyncio
from agent_framework import Workflow
from agent_framework.state import StateManager, FileSystemCheckpointer

async def main():
    # Create workflow with checkpointing
    checkpointer = FileSystemCheckpointer(checkpoint_dir="./checkpoints")
    workflow = Workflow(checkpointer=checkpointer)
    
    # ... add nodes and edges ...
    
    # Run with checkpointing
    result = await workflow.run(
        start_node="start",
        checkpoint_every=5  # Save state every 5 steps
    )
    
    # Resume from checkpoint if needed
    if workflow.has_checkpoint():
        result = await workflow.resume_from_checkpoint()

asyncio.run(main())
```

## Best Practices for Multi-Agent Systems

1. **Clear Role Definition**: Give each agent a specific, well-defined role
2. **Avoid Overlap**: Minimize overlapping responsibilities between agents
3. **Communication Protocol**: Establish clear input/output formats
4. **Error Handling**: Handle failures gracefully with fallbacks
5. **Logging**: Add comprehensive logging for debugging
6. **State Management**: Use checkpoints for long-running workflows
7. **Testing**: Test each agent individually before integration
8. **Performance**: Use parallel execution when agents are independent
9. **Human Oversight**: Add human-in-the-loop for critical decisions
10. **Token Management**: Monitor token usage across multiple agents

## Performance Considerations

- **Parallel vs Sequential**: Use parallel when agents don't depend on each other
- **Caching**: Cache expensive operations or frequent queries
- **Model Selection**: Use smaller models for simpler agents
- **Batch Processing**: Group similar requests when possible
- **Streaming**: Use streaming for better user experience
- **Timeouts**: Set appropriate timeouts for agent operations

## Debugging Multi-Agent Systems

Enable detailed logging:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("agent_framework")
logger.setLevel(logging.DEBUG)
```

Add telemetry:

```python
from agent_framework.telemetry import OpenTelemetryMiddleware

# Add to agent
agent = client.create_agent(
    name="Agent",
    instructions="...",
    middleware=[OpenTelemetryMiddleware()]
)
```

## Common Patterns

### Research → Synthesize → Review
1. Multiple researchers gather information
2. Synthesizer combines findings
3. Reviewer ensures quality

### Triage → Execute → Report
1. Triage agent classifies request
2. Specialist agent handles task
3. Reporter formats results

### Draft → Critique → Revise
1. Writer creates initial draft
2. Critic identifies issues
3. Writer revises based on feedback

### Plan → Execute → Verify
1. Planner creates task breakdown
2. Executor implements tasks
3. Verifier checks completion
