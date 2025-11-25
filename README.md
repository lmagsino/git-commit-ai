# git-commit-ai

Generate meaningful git commit messages using AI (Claude by Anthropic).

## Features

- 🤖 AI-powered commit message generation from staged changes
- 📝 Multiple commit styles (conventional, simple, detailed)
- 🔍 Dry-run mode to preview without committing
- ✅ Interactive confirmation before committing
- ✏️ Edit or regenerate messages
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

### 1. Get Your API Key

Get your API key from https://console.anthropic.com/

### 2. Set Global Environment Variables

Add to your shell profile:

**For Zsh (~/.zshrc):**
```bash
echo 'export ANTHROPIC_API_KEY=your-api-key-here' >> ~/.zshrc
echo 'export COMMIT_STYLE=simple' >> ~/.zshrc
source ~/.zshrc
```

**For Bash (~/.bashrc):**
```bash
echo 'export ANTHROPIC_API_KEY=your-api-key-here' >> ~/.bashrc
echo 'export COMMIT_STYLE=simple' >> ~/.bashrc
source ~/.bashrc
```

Replace `your-api-key-here` with your actual API key.

### 3. Verify Setup
```bash
echo $ANTHROPIC_API_KEY
echo $COMMIT_STYLE
```

## Usage

### Basic Usage
```bash
# Stage your changes
git add .

# Generate and commit
gcai
```

Select `1` to commit when prompted.

### With Context
```bash
gcai -c "fixed login bug"
```

### Skip Confirmation
```bash
gcai -y
```

### Dry Run (Preview)
```bash
gcai --dry-run
```

### All Options
```bash
gcai --help

Options:
  -V, --version          output the version number
  -s, --style <style>    Commit message style (conventional, simple, detailed)
  -d, --dry-run          Preview the commit message without committing
  -c, --context <text>   Additional context about the changes
  -y, --yes              Skip confirmation prompt and commit directly
  -h, --help             display help for command
```

## Example Session
```bash
$ git add src/auth.ts
$ gcai

→ Checking git repository...
→ Reading staged changes...
ℹ Found 1 staged file(s):
   src/auth.ts
→ Generating commit message (simple style)...

Generated commit message:
──────────────────────────────────────────────────
Add JWT token validation for protected routes
──────────────────────────────────────────────────

Options:
  1) Commit with this message
  2) Regenerate message
  3) Edit message manually
  4) Cancel

? Enter choice (1-4): 1
→ Creating commit...
✔ Commit created successfully!
```

## Commit Styles

### Simple (recommended)
```
Add user authentication
Fix navigation bug on mobile
Update README with setup instructions
```

### Conventional
```
feat(auth): add password reset functionality
fix(api): handle null response from user endpoint
docs: update README with setup instructions
```

### Detailed
```
Add rate limiting to API endpoints

Implement rate limiting using a token bucket algorithm to prevent
abuse and ensure fair usage across all API consumers. The limit is
set to 100 requests per minute per API key.
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) | - |
| `ANTHROPIC_MODEL` | Claude model to use | `claude-3-5-haiku-20241022` |
| `COMMIT_STYLE` | Default commit style | `conventional` |

### Supported Models

| Model | Cost (per 1M tokens) | Notes |
|-------|----------------------|-------|
| `claude-3-5-haiku-20241022` | $0.80 / $4.00 | Fast, cheap (recommended) |
| `claude-sonnet-4-20250514` | $3.00 / $15.00 | Better quality |
| `claude-opus-4-20250514` | $15.00 / $75.00 | Best quality |

## Local Development Installation

If you want to use this tool from source before publishing to npm:
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/git-commit-ai.git
cd git-commit-ai

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link
```

Now you can use `gcai` or `git-commit-ai` in any git repository:
```bash
cd /path/to/any/project
gcai --dry-run
```

To unlink:
```bash
npm unlink -g git-commit-ai
```

## Programmatic Usage

You can also use the package in your own scripts:
```typescript
import {
  generateCommitMessage,
  getStagedDiff,
  createCommit,
} from "git-commit-ai";

async function autoCommit() {
  const diff = await getStagedDiff();
  
  const result = await generateCommitMessage({
    diff,
    style: "simple",
    context: "Automated commit",
  });
  
  console.log("Generated:", result.message);
  await createCommit(result.message);
}

autoCommit();
```

## License

MIT