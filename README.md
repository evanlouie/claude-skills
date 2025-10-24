# evlouie-skills

A Claude Code plugin containing custom skills for Python web development with FastHTML and AI agent development with Microsoft Agent Framework.

## Overview

This plugin provides two comprehensive skills:

### 1. FastHTML Web Development
Build server-rendered hypermedia applications using FastHTML, HTMX, Starlette, and Python. Perfect for creating modern web applications with minimal JavaScript.

**Use when:**
- Building server-rendered web applications
- Creating CRUD applications
- Implementing real-time features (websockets, SSE)
- Working with forms and data validation
- Building authentication systems

**Includes:**
- Complete FastHTML reference documentation
- HTMX attributes, events, and configuration
- MonsterUI component library (shadcn-like components for FastHTML)
- Starlette integration guides
- Working examples (websockets, CRUD applications)

### 2. Microsoft Agent Framework
Build production-ready AI agents and multi-agent systems using Microsoft's unified framework that combines Semantic Kernel and AutoGen capabilities.

**Use when:**
- Building chat agents with Azure OpenAI or Azure AI
- Creating multi-agent workflows
- Implementing agentic applications with tool calling
- Migrating from AutoGen or Semantic Kernel
- Building graph-based orchestration systems

**Includes:**
- Multi-agent pattern documentation (sequential, concurrent, group chat)
- Tool integration guides (MCP, Azure Functions)
- Migration guides from AutoGen and Semantic Kernel
- Template scripts for common agent patterns

## Installation

### Local Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/evlouie/claude-skills.git
   cd claude-skills
   ```

2. Install the plugin in Claude Code:
   ```bash
   # Add to your Claude config or use the plugin manager
   # Point to the local directory
   ```

3. The skills will be automatically available to Claude when relevant to your tasks.

### From Marketplace (if published)

```bash
# Install from custom marketplace
claude plugin install evlouie-skills
```

## Skills Included

### fasthtml
**Description:** Create Python web applications with FastHTML, a library for building server-rendered hypermedia applications using HTMX, Starlette, and Python FastTags.

**Key Features:**
- FastHTML core concepts and patterns
- Complete HTMX reference
- MonsterUI component library
- Database integration with fastlite
- Authentication and session management
- WebSocket and SSE support
- Comprehensive examples

### ms-agent-framework
**Description:** Build AI agents and multi-agent systems in Python using Microsoft Agent Framework.

**Key Features:**
- Azure OpenAI and Azure AI integration
- Chat agents with tool calling
- Multi-agent orchestration patterns
- Workflow graphs with checkpointing
- Memory and state management
- MCP (Model Context Protocol) integration
- Migration guides from AutoGen/Semantic Kernel

## Usage

Claude will automatically activate these skills when your request matches their capabilities. For example:

- Ask about building a web app → FastHTML skill activates
- Ask about creating AI agents → Microsoft Agent Framework skill activates

You can also explicitly reference the skills:
```
Using the FastHTML skill, help me create a CRUD application with authentication.
```

## Structure

```
evlouie-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── skills/
│   ├── fasthtml/
│   │   ├── SKILL.md         # Skill definition
│   │   └── references/      # Reference documentation
│   └── ms-agent-framework/
│       ├── SKILL.md         # Skill definition
│       ├── references/      # Reference documentation
│       └── scripts/         # Template scripts
├── README.md
└── LICENSE
```

## Contributing

To add new skills to this plugin:

1. Create a new directory under `skills/`
2. Add a `SKILL.md` file with YAML frontmatter:
   ```yaml
   ---
   name: your-skill-name
   description: Brief description of what the skill does and when to use it
   ---
   ```
3. Add any reference documentation or supporting files
4. Update this README

## License

MIT License - see LICENSE file for details

## Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Skills Guide](https://docs.claude.com/en/docs/claude-code/skills)
- [Plugin Development](https://docs.claude.com/en/docs/claude-code/plugins)

## Author

evlouie
