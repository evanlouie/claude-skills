#!/usr/bin/env python3
"""
Tool Agent Template for Microsoft Agent Framework

This template shows how to create an agent with custom tools (function calling).
The agent can call Python functions to perform actions beyond text generation.

Usage:
    python tool_agent_template.py

Environment Variables Required:
    AZURE_OPENAI_ENDPOINT - Your Azure OpenAI endpoint
    AZURE_OPENAI_DEPLOYMENT_NAME - Your model deployment name

Authentication:
    Uses Azure CLI credentials (run 'az login' first)
"""

import asyncio
import os
from datetime import datetime
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential


# Define custom tools as Python functions
# The function signature (type hints) and docstring are used to generate
# the tool schema automatically

def get_current_time() -> str:
    """Get the current time.
    
    Returns:
        The current time in a readable format
    """
    return datetime.now().strftime("%I:%M %p")


def calculate_area(length: float, width: float) -> float:
    """Calculate the area of a rectangle.
    
    Args:
        length: The length of the rectangle in meters
        width: The width of the rectangle in meters
        
    Returns:
        The area in square meters
    """
    return length * width


def convert_temperature(celsius: float, to_fahrenheit: bool = True) -> float:
    """Convert temperature between Celsius and Fahrenheit.
    
    Args:
        celsius: Temperature in Celsius
        to_fahrenheit: If True, convert to Fahrenheit; if False, convert from Fahrenheit to Celsius
        
    Returns:
        Converted temperature
    """
    if to_fahrenheit:
        return (celsius * 9/5) + 32
    else:
        return (celsius - 32) * 5/9


def search_mock(query: str, max_results: int = 5) -> list[dict]:
    """Search for information (mock implementation).
    
    Args:
        query: The search query
        max_results: Maximum number of results to return
        
    Returns:
        List of search results with title and snippet
    """
    # This is a mock implementation - replace with actual search API
    return [
        {
            "title": f"Result {i+1} for '{query}'",
            "snippet": f"This is a sample result for your search query."
        }
        for i in range(min(max_results, 3))
    ]


async def async_fetch_data(url: str) -> str:
    """Fetch data from a URL (async mock implementation).
    
    Args:
        url: The URL to fetch
        
    Returns:
        The fetched data as a string
    """
    # This is a mock - replace with actual HTTP request using aiohttp
    await asyncio.sleep(0.1)  # Simulate network delay
    return f"Mock data from {url}"


async def main():
    """Create and run an agent with custom tools."""
    
    # Verify environment variables
    if not os.environ.get("AZURE_OPENAI_ENDPOINT"):
        print("Error: AZURE_OPENAI_ENDPOINT environment variable not set")
        return
    
    if not os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME"):
        print("Error: AZURE_OPENAI_DEPLOYMENT_NAME environment variable not set")
        return
    
    # Create chat client
    try:
        client = AzureOpenAIChatClient(
            credential=AzureCliCredential()
        )
        print("✓ Connected to Azure OpenAI")
    except Exception as e:
        print(f"Error connecting to Azure OpenAI: {e}")
        print("Make sure you've run 'az login' first")
        return
    
    # Create agent with tools
    # The tools list can include any Python function
    agent = client.create_agent(
        name="ToolBot",
        instructions="""You are a helpful assistant with access to various tools.
        
Use your tools to help users with:
- Getting the current time
- Calculating areas
- Converting temperatures
- Searching for information
- Fetching data from URLs

Always use the appropriate tool when the user's request requires it.""",
        tools=[
            get_current_time,
            calculate_area,
            convert_temperature,
            search_mock,
            async_fetch_data
        ]
    )
    print("✓ Agent created with tools")
    print(f"  Available tools: {len(agent.tools)}")
    
    # Test cases demonstrating different tools
    test_queries = [
        "What time is it right now?",
        "What's the area of a rectangle that's 5 meters by 3 meters?",
        "Convert 25 degrees Celsius to Fahrenheit",
        "Search for information about Python programming",
        "Fetch data from https://example.com/api/data"
    ]
    
    print("\n" + "="*50)
    print("Testing agent with various queries...")
    print("="*50)
    
    for query in test_queries:
        print(f"\n\nUser: {query}")
        result = await agent.run(query)
        print(f"Agent: {result.text}")
        
        # Show which tools were called
        if result.tool_calls:
            print(f"\n  Tools called:")
            for tool_call in result.tool_calls:
                print(f"    - {tool_call.name}({tool_call.arguments})")


if __name__ == "__main__":
    print("Microsoft Agent Framework - Tool Agent Template")
    print("="*50)
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nExecution cancelled by user")
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()
