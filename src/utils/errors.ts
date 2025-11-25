/**
 * Base error class for git-commit-ai
 */
export class GitCommitAiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitCommitAiError";
  }
}

/**
 * Git operation errors
 */
export class GitError extends GitCommitAiError {
  constructor(message: string) {
    super(message);
    this.name = "GitError";
  }
}

export class NoStagedChangesError extends GitError {
  constructor() {
    super("No staged changes found. Stage your changes with 'git add' first.");
    this.name = "NoStagedChangesError";
  }
}

export class NotAGitRepoError extends GitError {
  constructor() {
    super("Not a git repository. Run this command from within a git repository.");
    this.name = "NotAGitRepoError";
  }
}

/**
 * AI/API errors
 */
export class AiError extends GitCommitAiError {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "AiError";
  }
}

export class ApiKeyError extends AiError {
  constructor() {
    super(
      "ANTHROPIC_API_KEY environment variable is not set.\n" +
      "Get your API key at: https://console.anthropic.com/\n" +
      "Then set it: export ANTHROPIC_API_KEY=your-key"
    );
    this.name = "ApiKeyError";
  }
}

export class RateLimitError extends AiError {
  constructor(public readonly retryAfter?: number) {
    super(
      `Rate limited by API.${retryAfter ? ` Retry after ${retryAfter} seconds.` : ""}`
    );
    this.name = "RateLimitError";
  }
}

/**
 * Configuration errors
 */
export class ConfigError extends GitCommitAiError {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}