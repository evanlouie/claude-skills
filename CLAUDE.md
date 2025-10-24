# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a Claude Code plugin repository that hosts custom skills. Skills are autonomously invoked by Claude when relevant to the user's task.

## Plugin Architecture

### Directory Structure
```
marketplace.json              # Marketplace configuration for plugin distribution
.claude-plugin/plugin.json   # Plugin metadata (name, version, description, author, license)
skills/                       # All skills for this plugin
  <skill-name>/
    SKILL.md                  # Required: Skill definition with YAML frontmatter
    references/               # Optional: Reference documentation
    scripts/                  # Optional: Template scripts or utilities
```

### Skill Definition Format

Every skill MUST have a `SKILL.md` file with this structure:

```markdown
---
name: skill-name-in-kebab-case
description: Brief description (max 1024 chars) of what the skill does AND when to use it
---

# Skill Title

[Main skill content...]
```

**Critical requirements:**
- `name`: lowercase letters, numbers, hyphens only (max 64 chars)
- `description`: Must include both WHAT the skill does and WHEN Claude should use it
- The description drives Claude's decision to activate the skill autonomously

### Reference Organization Patterns

Skills can organize supporting documentation using different strategies:

**Topic-based** (good for comprehensive frameworks):
```
references/
  core/           # Core concepts and APIs
  extensions/     # Extension systems
  examples/       # Working examples
  integration.md  # Integration guides
```

**Feature-based** (good for focused toolkits):
```
references/
  feature-a.md
  feature-b.md
  patterns.md
scripts/          # Optional: runnable templates
  template-a.py
  template-b.py
```

Choose based on skill complexity:
- Simple skills: Single reference file or flat structure
- Complex skills: Subdirectories organized by topic or feature area
- Include examples when patterns are non-obvious
- Add scripts for runnable templates that demonstrate usage

### Marketplace Configuration

The `marketplace.json` file at the repository root enables plugin distribution. It lists this plugin in a marketplace that users can add to Claude Code.

**Required fields:**
- `name`: Marketplace identifier (typically your GitHub username or org)
- `owner.name`: Marketplace maintainer
- `plugins`: Array of plugin entries

**Each plugin entry requires:**
- `name`: Plugin identifier (must match `.claude-plugin/plugin.json`)
- `source`: Path to plugin directory (typically `"."` for root)

**Optional plugin metadata** (duplicates from plugin.json for marketplace display):
- `description`, `version`, `author`, `license`, `keywords`

Users install via:
```bash
/plugin marketplace add <your-github-username>/<repo-name>
/plugin install <plugin-name>@<marketplace-name>
```

## Common Tasks

### Adding a New Skill

1. Create skill directory: `skills/new-skill-name/`
2. Create `SKILL.md` with proper frontmatter
3. Add reference documentation under `references/`
4. Update `README.md` to list the new skill
5. Bump version in both `.claude-plugin/plugin.json` and `marketplace.json`
6. Test locally by loading the plugin

### Updating Plugin Version

Update version in **both** files to keep them synchronized:

1. `.claude-plugin/plugin.json`:
```json
{
  "version": "x.y.z"  // Follow semantic versioning
}
```

2. `marketplace.json`:
```json
{
  "metadata": {
    "version": "x.y.z"
  },
  "plugins": [
    {
      "version": "x.y.z"  // Must match plugin.json
    }
  ]
}
```

Version guidelines:
- Major (x): Breaking changes to skill interface
- Minor (y): New skills or substantial additions
- Patch (z): Documentation fixes, reference updates

### Modifying Existing Skills

When updating SKILL.md:
- Keep YAML frontmatter name unchanged (it's the skill identifier)
- Update description if "when to use" criteria change
- Maintain reference structure (don't break existing paths)
- Preserve examples that demonstrate core patterns

### Removing a Skill

1. Delete the skill directory: `skills/skill-name/`
2. Update `README.md` to remove the skill from listings
3. Bump version in both `.claude-plugin/plugin.json` and `marketplace.json`
4. Commit changes with clear message about skill removal
5. Consider adding deprecation notice if skill was widely used

### Publishing the Plugin

To make the plugin available to others:

1. **Ensure marketplace.json is configured** with correct GitHub repo reference
2. **Commit and push** all changes to GitHub
3. **Tag releases** (optional but recommended):
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

Users then install via:
```bash
/plugin marketplace add evlouie/claude-skills
/plugin install evlouie-skills@evlouie
```

**Note:** GitHub repository must be public, or users need appropriate access credentials.

### Testing Skills Locally

No build/test commands needed - this is a documentation-based plugin.

**Via marketplace (recommended):**
1. Add local marketplace: `/plugin marketplace add /path/to/claude-skills`
2. Install plugin: `/plugin install evlouie-skills@evlouie`
3. Restart Claude Code
4. Create test query that should trigger the skill
5. Verify skill activates and provides correct guidance
6. Check that references load properly when mentioned

**Direct testing:**
- Point Claude Code to this directory as a local plugin path
- Follow steps 4-6 above

## Key Conventions

### Skill Descriptions

The description field is crucial - Claude uses it to decide when to activate skills. Good descriptions:
- State clearly what the skill covers
- Include trigger phrases (e.g., "Use when building web apps", "Use when creating AI agents")
- Are concise but complete (focus on decision criteria, not implementation details)

### Reference Documentation

References should be:
- **Comprehensive**: Cover all aspects of the topic
- **Scannable**: Use headers, code blocks, and lists
- **Practical**: Include examples and common patterns
- **Current**: Keep documentation synchronized with upstream projects

### Template Scripts

Template scripts in `scripts/` directories:
- Must be runnable examples (not pseudocode)
- Include docstrings explaining usage and requirements
- Show environment variable requirements
- Demonstrate one clear pattern each

## Plugin Metadata

### Plugin Manifest (`.claude-plugin/plugin.json`)

Required fields:
- `name`: Plugin identifier (kebab-case, matches repo name)
- `version`: Semantic version string
- `description`: What the plugin provides (not how to use it)
- `author.name`: Plugin maintainer
- `license`: License identifier (MIT, Apache-2.0, etc.)
- `keywords`: Search/discovery terms

### Marketplace Configuration (`marketplace.json`)

Required fields:
- `name`: Marketplace identifier (typically GitHub username/org)
- `owner.name`: Marketplace maintainer
- `plugins`: Array with at least one plugin entry

Optional metadata:
- `metadata.description`: Marketplace overview
- `metadata.version`: Marketplace version (should match plugin version)

Plugin entry fields:
- `name`: Must match plugin.json name
- `source`: Plugin directory path (use `"."` for root)
- `version`: Should match plugin.json version
- All other fields from plugin.json can be duplicated for marketplace display

## Skills vs Commands vs Agents

This plugin contains **skills only**:
- Skills are autonomously invoked by Claude when relevant
- Commands would go in `commands/` (not used in this plugin)
- Agents would go in `agents/` (not used in this plugin)

Skills are documentation/guidance, not executable code.

## Version Control

This repository tracks:
- Marketplace configuration (marketplace.json)
- Plugin metadata (.claude-plugin/plugin.json)
- Skill definitions (SKILL.md files)
- Reference documentation (markdown files)
- Template scripts (Python files)

Do NOT track:
- `.DS_Store` files (already in .gitignore)
- Python cache files (`__pycache__/`, `*.pyc`)
- Virtual environments (`venv/`, `env/`)
- IDE configurations (`.vscode/`, `.idea/`)

## Documentation Philosophy

Skills in this plugin follow "reference-on-demand" patterns:

1. **SKILL.md provides context** - Overview, when to use, core concepts
2. **References provide depth** - Detailed APIs, configurations, examples
3. **Skills guide reference loading** - Explicitly tell Claude which references to load when

Example pattern in SKILL.md:
```markdown
## Reference Navigation

### Core Concepts
Load when getting started:
- references/core/basics.md - Fundamental concepts
- references/core/setup.md - Installation and configuration

### Advanced Features
Load when implementing specific features:
- references/advanced/feature-x.md - Feature X documentation
- references/examples/feature-x-example.md - Working example
```

This pattern keeps the initial skill load small while making comprehensive documentation available on demand.
