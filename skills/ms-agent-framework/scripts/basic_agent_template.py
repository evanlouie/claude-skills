#!/usr/bin/env python3
"""
Basic Agent Template for Microsoft Agent Framework

This template provides a starting point for creating a simple chat agent
with Azure OpenAI. Customize the instructions and add tools as needed.

Usage:
    python basic_agent_template.py

Environment Variables Required:
    AZURE_OPENAI_ENDPOINT - Your Azure OpenAI endpoint
    AZURE_OPENAI_DEPLOYMENT_NAME - Your model deployment name

Authentication:
    Uses Azure CLI credentials (run 'az login' first)
"""

import asyncio
import os
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential


async def main():
    """Create and run a basic chat agent."""
    
    # Verify environment variables
    if not os.environ.get("AZURE_OPENAI_ENDPOINT"):
        print("Error: AZURE_OPENAI_ENDPOINT environment variable not set")
        print("Set it with: export AZURE_OPENAI_ENDPOINT='https://your-resource.openai.azure.com/'")
        return
    
    if not os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME"):
        print("Error: AZURE_OPENAI_DEPLOYMENT_NAME environment variable not set")
        print("Set it with: export AZURE_OPENAI_DEPLOYMENT_NAME='gpt-4o-mini'")
        return
    
    # Create chat client with Azure CLI authentication
    try:
        client = AzureOpenAIChatClient(
            credential=AzureCliCredential()
        )
        print("✓ Connected to Azure OpenAI")
    except Exception as e:
        print(f"Error connecting to Azure OpenAI: {e}")
        print("Make sure you've run 'az login' first")
        return
    
    # Create agent with custom instructions
    agent = client.create_agent(
        name="Assistant",
        instructions="""You are a helpful, friendly assistant.
        
Be concise and clear in your responses.
If you're unsure about something, say so.
Always be respectful and professional."""
    )
    print("✓ Agent created")
    
    # Run a simple query
    print("\n" + "="*50)
    print("Testing agent with a simple query...")
    print("="*50 + "\n")
    
    result = await agent.run("Hello! What can you help me with?")
    print(f"Agent: {result.text}")
    
    # Example of multi-turn conversation
    print("\n" + "="*50)
    print("Testing multi-turn conversation...")
    print("="*50 + "\n")
    
    result1 = await agent.run("My name is Alice and I like programming.")
    print(f"Agent: {result1.text}")
    
    result2 = await agent.run("What's my name and what do I like?")
    print(f"Agent: {result2.text}")


if __name__ == "__main__":
    print("Microsoft Agent Framework - Basic Agent Template")
    print("="*50)
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nExecution cancelled by user")
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()
