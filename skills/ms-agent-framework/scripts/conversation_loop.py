#!/usr/bin/env python3
"""
Interactive Conversation Loop for Microsoft Agent Framework

This script provides an interactive command-line interface for chatting
with an agent. It demonstrates multi-turn conversations with context retention.

Usage:
    python conversation_loop.py

Environment Variables Required:
    AZURE_OPENAI_ENDPOINT - Your Azure OpenAI endpoint
    AZURE_OPENAI_DEPLOYMENT_NAME - Your model deployment name

Authentication:
    Uses Azure CLI credentials (run 'az login' first)

Commands:
    /help - Show available commands
    /clear - Clear conversation history
    /tools - Show available tools
    /quit or /exit - Exit the conversation
"""

import asyncio
import os
import sys
from datetime import datetime
from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential


# Optional: Define some useful tools for the agent
def get_current_datetime() -> str:
    """Get the current date and time.
    
    Returns:
        Current date and time in a readable format
    """
    return datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")


def calculate(expression: str) -> str:
    """Safely evaluate a mathematical expression.
    
    Args:
        expression: A mathematical expression (e.g., "2 + 2", "10 * 5")
        
    Returns:
        The result of the calculation or an error message
    """
    try:
        # Only allow safe mathematical operations
        allowed_chars = set("0123456789+-*/(). ")
        if not all(c in allowed_chars for c in expression):
            return "Error: Expression contains invalid characters"
        
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error calculating: {str(e)}"


class ConversationLoop:
    """Interactive conversation loop with an agent."""
    
    def __init__(self, agent):
        self.agent = agent
        self.conversation_count = 0
    
    def print_welcome(self):
        """Print welcome message and instructions."""
        print("\n" + "="*60)
        print("Microsoft Agent Framework - Interactive Conversation")
        print("="*60)
        print("\nCommands:")
        print("  /help  - Show this help message")
        print("  /clear - Clear conversation history and start fresh")
        print("  /tools - Show available tools")
        print("  /quit  - Exit the conversation")
        print("\nType your message and press Enter to chat with the agent.")
        print("="*60 + "\n")
    
    def print_help(self):
        """Print help message."""
        print("\nAvailable commands:")
        print("  /help  - Show this help message")
        print("  /clear - Clear conversation history")
        print("  /tools - Show available tools")
        print("  /quit  - Exit the conversation\n")
    
    def show_tools(self):
        """Display available tools."""
        if not self.agent.tools:
            print("\nNo tools available for this agent.\n")
            return
        
        print(f"\nAvailable tools ({len(self.agent.tools)}):")
        for tool in self.agent.tools:
            print(f"  • {tool.name}: {tool.description}")
        print()
    
    async def clear_history(self):
        """Clear conversation history."""
        # Create a new agent instance to reset the conversation
        # Note: In production, you might want to explicitly clear the thread
        print("\n[Conversation history cleared]\n")
        self.conversation_count = 0
    
    async def run(self):
        """Run the interactive conversation loop."""
        self.print_welcome()
        
        while True:
            try:
                # Get user input
                user_input = input("You: ").strip()
                
                # Handle empty input
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.startswith('/'):
                    command = user_input.lower()
                    
                    if command in ['/quit', '/exit']:
                        print("\nGoodbye! Thanks for chatting.\n")
                        break
                    
                    elif command == '/help':
                        self.print_help()
                        continue
                    
                    elif command == '/clear':
                        await self.clear_history()
                        continue
                    
                    elif command == '/tools':
                        self.show_tools()
                        continue
                    
                    else:
                        print(f"Unknown command: {command}")
                        print("Type /help for available commands.\n")
                        continue
                
                # Send message to agent
                print("Agent: ", end="", flush=True)
                
                # Use streaming for better UX
                full_response = ""
                try:
                    async for chunk in self.agent.run_stream(user_input):
                        print(chunk.text, end="", flush=True)
                        full_response += chunk.text
                    print()  # New line after streaming
                    
                except Exception as e:
                    print(f"\n[Error: {e}]")
                    continue
                
                # Increment conversation counter
                self.conversation_count += 1
                print()  # Extra line for readability
                
            except KeyboardInterrupt:
                print("\n\nUse /quit to exit properly.\n")
                continue
            
            except EOFError:
                print("\n\nGoodbye! Thanks for chatting.\n")
                break


async def main():
    """Main function to set up and run the conversation loop."""
    
    # Verify environment variables
    if not os.environ.get("AZURE_OPENAI_ENDPOINT"):
        print("Error: AZURE_OPENAI_ENDPOINT environment variable not set")
        print("Set it with: export AZURE_OPENAI_ENDPOINT='https://your-resource.openai.azure.com/'")
        return 1
    
    if not os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME"):
        print("Error: AZURE_OPENAI_DEPLOYMENT_NAME environment variable not set")
        print("Set it with: export AZURE_OPENAI_DEPLOYMENT_NAME='gpt-4o-mini'")
        return 1
    
    # Create chat client
    try:
        client = AzureOpenAIChatClient(
            credential=AzureCliCredential()
        )
    except Exception as e:
        print(f"Error connecting to Azure OpenAI: {e}")
        print("Make sure you've run 'az login' first")
        return 1
    
    # Create agent with tools
    agent = client.create_agent(
        name="ChatBot",
        instructions="""You are a helpful, friendly assistant.

Be conversational and engaging. Keep your responses concise but informative.
Use your available tools when appropriate to help the user.
Remember context from the conversation to provide relevant responses.""",
        tools=[
            get_current_datetime,
            calculate
        ]
    )
    
    # Run conversation loop
    conversation = ConversationLoop(agent)
    await conversation.run()
    
    return 0


if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except Exception as e:
        print(f"\nFatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
