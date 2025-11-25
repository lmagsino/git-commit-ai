# git-commit-ai

Generate meaningful git commit messages using AI (Claude by Anthropic).

## Features

- 🤖 AI-powered commit message generation from staged changes
- 📝 Multiple commit styles (conventional, simple, detailed)
- 🔍 Dry-run mode to preview without committing
- ✅ Interactive confirmation before committing
- ⚡ Simple CLI interface

## Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         git-commit-ai                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   CLI       │───▶│   Core      │───▶│   AI Service        │ │
│  │   Layer     │    │   Logic     │    │   (Claude API)      │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│        │                  │                      │              │
│        ▼                  ▼                      ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │  Commander  │    │ Git Service │    │  Prompt Templates   │ │
│  │  (args)     │    │ (diff,      │    │  (styles, context)  │ │
│  │             │    │  commit)    │    │                     │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Runtime:** Node.js (>=18.0.0)
- **Language:** TypeScript
- **AI:** Claude API (Anthropic)
- **CLI Framework:** Commander.js
- **Interactive Prompts:** Inquirer.js

## Installation
```bash
npm install -g git-commit-ai
```

## Setup

Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your-api-key
```

Get your API key at: https://console.anthropic.com/

## Usage

Stage your changes and run:
```bash
# Generate commit message with default style (conventional)
git-commit-ai

# Or use the shorter alias
gcai

# Preview without committing
gcai --dry-run

# Use a different style
gcai --style simple
gcai --style detailed

# Add context for better messages
gcai --context "Refactoring for performance"

# Skip confirmation prompt
gcai --yes
```

## Commit Styles

| Style | Description | Example |
|-------|-------------|---------|
| `conventional` | Conventional Commits format | `feat(auth): add login validation` |
| `simple` | Brief one-line message | `Add login validation` |
| `detailed` | Multi-line with explanation | Subject + body with context |