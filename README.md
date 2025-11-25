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

Get your API key from https://console.anthropic.com/ and set it:
```bash
export ANTHROPIC_API_KEY=your-api-key
```

Or create a `.env` file in your project:
```
ANTHROPIC_API_KEY=your-api-key
```

## Usage

### Basic Usage

Stage your changes and run:
```bash
# Generate commit message with default style (conventional)
git-commit-ai

# Or use the shorter alias
gcai
```

### Example Session
```bash
$ git add src/auth.ts
$ gcai

→ Checking git repository...
→ Reading staged changes...
ℹ Found 1 staged file(s):
   src/auth.ts
→ Generating commit message (conventional style)...

Generated commit message:
──────────────────────────────────────────────────
feat(auth): add JWT token validation middleware

Implement token validation for protected routes with
expiration checking and role-based access control.
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

### CLI Options
```bash
# Preview without committing
gcai --dry-run

# Use a different style
gcai --style simple
gcai --style detailed

# Add context for better messages
gcai --context "Refactoring for performance"

# Skip confirmation and commit directly
gcai --yes

# Combine options
gcai --style detailed --context "Bug fix for issue #123"
```

### Commit Styles

#### Conventional (default)
```
feat(auth): add password reset functionality
```
```
fix(api): handle null response from user endpoint
```

#### Simple
```
Add user authentication
```
```
Fix navigation bug on mobile
```

#### Detailed
```
Add rate limiting to API endpoints

Implement rate limiting using a token bucket algorithm to prevent
abuse and ensure fair usage across all API consumers. The limit is
set to 100 requests per minute per API key.
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
    style: "conventional",
    context: "Automated commit",
  });
  
  console.log("Generated:", result.message);
  await createCommit(result.message);
}

autoCommit();
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

## License

MIT