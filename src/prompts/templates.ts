import type { CommitStyle } from "../types/index.js";

/**
 * System prompts define Claude's behavior and output format.
 * 
 * Prompt Engineering Principles Used:
 * 1. Clear role definition - Tell Claude what it is
 * 2. Explicit constraints - Be specific about format
 * 3. Examples - Show don't just tell
 * 4. Output format - Define exactly what to return
 */

const BASE_INSTRUCTIONS = `You are an expert developer writing git commit messages.
Your task is to analyze the git diff and generate a clear, accurate commit message.

Rules:
- Focus on WHAT changed and WHY (if apparent from context)
- Be specific but concise
- Output ONLY the commit message, no explanations or markdown`;

const CONVENTIONAL_PROMPT = `${BASE_INSTRUCTIONS}

Use the Conventional Commits format strictly:
<type>(<scope>): <description>

[optional body]

Types (choose the most appropriate):
- feat: New feature or functionality
- fix: Bug fix
- docs: Documentation only changes
- style: Code style changes (formatting, semicolons, etc.)
- refactor: Code changes that neither fix bugs nor add features
- test: Adding or updating tests
- chore: Maintenance tasks (deps, build, config)

Rules for Conventional Commits:
- Scope is optional but helpful (e.g., auth, api, ui)
- Description must be lowercase, no period at end
- Keep subject line under 72 characters
- Use imperative mood ("add" not "added" or "adds")

Examples:
- feat(auth): add password reset functionality
- fix(api): handle null response from user endpoint
- docs: update README with installation steps
- refactor(utils): simplify date formatting logic`;

const SIMPLE_PROMPT = `${BASE_INSTRUCTIONS}

Write a simple, single-line commit message.

Rules:
- Start with capital letter
- No period at the end
- Keep under 50 characters if possible, max 72
- Use imperative mood ("Add" not "Added")

Examples:
- Add user authentication
- Fix navigation bug on mobile
- Update dependencies`;

const DETAILED_PROMPT = `${BASE_INSTRUCTIONS}

Write a detailed commit message with subject and body.

Format:
<subject line>

<body explaining what and why>

Rules:
- Subject: max 72 characters, imperative mood, no period
- Blank line between subject and body
- Body: wrap at 72 characters, explain what changed and why
- Focus on the motivation and context

Example:
Add rate limiting to API endpoints

Implement rate limiting using a token bucket algorithm to prevent
abuse and ensure fair usage across all API consumers. The limit is
set to 100 requests per minute per API key.

This change addresses the recent spike in API usage that caused
service degradation for some users.`;

/**
 * Get the system prompt for a given commit style
 */
export function getSystemPrompt(style: CommitStyle): string {
  switch (style) {
    case "conventional":
      return CONVENTIONAL_PROMPT;
    case "simple":
      return SIMPLE_PROMPT;
    case "detailed":
      return DETAILED_PROMPT;
    default:
      return CONVENTIONAL_PROMPT;
  }
}

/**
 * Build the user prompt with diff and optional context
 * 
 * We keep the diff in the user message because:
 * 1. It's the "task" (system = role, user = task)
 * 2. Easier to vary per request
 * 3. Keeps system prompt cacheable
 */
export function buildUserPrompt(diff: string, context?: string): string {
  let prompt = "Generate a commit message for these changes:\n\n";
  prompt += "```diff\n" + diff + "\n```";

  if (context) {
    prompt += `\n\nContext from the developer: ${context}`;
  }

  return prompt;
}

/**
 * Truncate diff if too long to avoid token limits
 * Claude Sonnet has 200k context, but we want to be economical
 */
export function truncateDiff(diff: string, maxLines: number = 500): string {
  const lines = diff.split("\n");
  
  if (lines.length <= maxLines) {
    return diff;
  }

  const truncated = lines.slice(0, maxLines).join("\n");
  const omittedCount = lines.length - maxLines;
  
  return `${truncated}\n\n... (${omittedCount} lines omitted for brevity)`;
}